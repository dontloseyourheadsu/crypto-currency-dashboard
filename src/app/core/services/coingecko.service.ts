import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  CoinMarketData,
  SimplePriceData,
  TrendingResponse,
  CoinDetails,
  CoinGeckoErrorResponse,
  CoinHistoryResponse,
  PriceDataPoint
} from '../models/coingecko.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  
  // ⚠️ SECURITY WARNING: In production, this should come from environment variables
  // For this demo, we're keeping it here for simplicity, but API keys should be:
  // 1. Stored in environment variables
  // 2. Never committed to version control
  // 3. Injected at build/runtime
  private readonly apiKey = 'CG-FpBJaHq89cjVhsGkTNz1TYnS';
  
  // Cache management
  private readonly CACHE_DURATION = 60 * 1000; // 60 seconds as per API docs
  private readonly UPDATE_LIMIT = 3 * 60 * 1000; // 3 minutes before showing refresh button
  
  private marketDataCache = new Map<string, { data: CoinMarketData[], timestamp: number }>();
  private priceCache = new Map<string, { data: SimplePriceData, timestamp: number }>();
  private trendingCache: { data: TrendingResponse, timestamp: number } | null = null;
  
  // Historical price data cache
  private historicalPriceCache = new Map<string, { data: PriceDataPoint[], timestamp: number }>();
  private readonly PRICE_CACHE_DURATION = 300000; // 5 minutes cache for price data
  
  // Subjects for real-time updates
  private selectedCoinSubject = new BehaviorSubject<string | null>(null);
  private refreshNeededSubject = new BehaviorSubject<boolean>(false);
  
  public selectedCoin$ = this.selectedCoinSubject.asObservable();
  public refreshNeeded$ = this.refreshNeededSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-cg-demo-api-key': this.apiKey
    });
  }
  
  private handleError(error: any): Observable<never> {
    console.error('CoinGecko API Error:', error);
    const errorResponse: CoinGeckoErrorResponse = {
      error: error.error?.error || error.message || 'Unknown error occurred',
      error_code: error.status
    };
    return throwError(() => errorResponse);
  }
  
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }
  
  private shouldShowRefreshButton(timestamp: number): boolean {
    return Date.now() - timestamp >= this.UPDATE_LIMIT;
  }
  
  /**
   * Get top 10 coins by market cap with market data
   */
  getTopCoins(forceRefresh = false): Observable<CoinMarketData[]> {
    const cacheKey = 'top-10';
    const cachedData = this.marketDataCache.get(cacheKey);
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Check if refresh button should be shown
      if (this.shouldShowRefreshButton(cachedData.timestamp)) {
        this.refreshNeededSubject.next(true);
      }
      return new Observable(observer => {
        observer.next(cachedData.data);
        observer.complete();
      });
    }
    
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('order', 'market_cap_desc')
      .set('per_page', '10')
      .set('page', '1')
      .set('sparkline', 'false')
      .set('price_change_percentage', '24h');
    
    return this.http.get<CoinMarketData[]>(
      `${this.baseUrl}/coins/markets`,
      { 
        headers: this.getHeaders(),
        params 
      }
    ).pipe(
      tap(data => {
        // Cache the response
        this.marketDataCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        this.refreshNeededSubject.next(false);
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Get trending coins
   */
  getTrendingCoins(forceRefresh = false): Observable<TrendingResponse> {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.trendingCache && this.isCacheValid(this.trendingCache.timestamp)) {
      return new Observable(observer => {
        observer.next(this.trendingCache!.data);
        observer.complete();
      });
    }
    
    return this.http.get<TrendingResponse>(
      `${this.baseUrl}/search/trending`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(data => {
        // Cache the response
        this.trendingCache = {
          data,
          timestamp: Date.now()
        };
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Get current price for specific coins
   */
  getCoinPrices(coinIds: string[], forceRefresh = false): Observable<SimplePriceData> {
    const cacheKey = coinIds.sort().join(',');
    const cachedData = this.priceCache.get(cacheKey);
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Check if refresh button should be shown
      if (this.shouldShowRefreshButton(cachedData.timestamp)) {
        this.refreshNeededSubject.next(true);
      }
      return new Observable(observer => {
        observer.next(cachedData.data);
        observer.complete();
      });
    }
    
    const params = new HttpParams()
      .set('ids', coinIds.join(','))
      .set('vs_currencies', 'usd')
      .set('include_24hr_change', 'true')
      .set('include_market_cap', 'true')
      .set('include_24hr_vol', 'true')
      .set('include_last_updated_at', 'true');
    
    return this.http.get<SimplePriceData>(
      `${this.baseUrl}/simple/price`,
      { 
        headers: this.getHeaders(),
        params 
      }
    ).pipe(
      tap(data => {
        // Cache the response
        this.priceCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        this.refreshNeededSubject.next(false);
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Convert market data to coin details format
   */
  marketDataToCoinDetails(marketData: CoinMarketData[]): CoinDetails[] {
    return marketData.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      last_updated: coin.last_updated
    }));
  }
  
  /**
   * Set selected coin for detailed view
   */
  setSelectedCoin(coinId: string | null): void {
    this.selectedCoinSubject.next(coinId);
  }
  
  /**
   * Get historical price data for a coin (last 24 hours)
   * @param coinId - The ID of the coin to get price history for
   * @param days - Number of days of history to fetch (default: 1)
   * @returns Observable of price data points
   */
  getCoinPriceHistory(coinId: string, days: number = 1): Observable<PriceDataPoint[]> {
    const cacheKey = `${coinId}_${days}`;
    const now = Date.now();
    
    // Check cache first
    const cached = this.historicalPriceCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < this.PRICE_CACHE_DURATION) {
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'x-cg-demo-api-key': this.apiKey
    });

    const url = `${this.baseUrl}/coins/${coinId}/market_chart`;
    
    // According to CoinGecko API free tier restrictions:
    // - For days=1: returns 5-minute interval data (no need to specify interval)
    // - For days=2-90: returns hourly data automatically
    // - interval parameter is Enterprise-only feature
    let adjustedDays = days;
    if (days === 1) {
      // For 24 hours, we'll use 2 days to get hourly data instead of 5-minute data
      // This gives us better performance and fewer data points to process
      adjustedDays = 2;
    }
    
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('days', adjustedDays.toString());
      // Removed interval parameter as it's Enterprise-only

    return this.http.get<CoinHistoryResponse>(url, { headers, params }).pipe(
      map(response => {
        let prices = response.prices;
        
        // If we requested 2 days for 24h data, filter to last 24 hours
        if (days === 1 && adjustedDays === 2) {
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          prices = prices.filter(([timestamp]) => timestamp >= oneDayAgo);
        }
        
        // Transform the response to our PriceDataPoint format
        const priceData: PriceDataPoint[] = prices.map(([timestamp, price]) => ({
          timestamp,
          price,
          date: new Date(timestamp)
        }));

        // Cache the result
        this.historicalPriceCache.set(cacheKey, {
          data: priceData,
          timestamp: now
        });

        return priceData;
      }),
      catchError(error => {
        console.error(`Error fetching price history for ${coinId}:`, error);
        if (error.error?.error) {
          return throwError(() => new Error(error.error.error));
        }
        return throwError(() => new Error('Failed to fetch price history'));
      })
    );
  }
  
  /**
   * Force refresh all cached data
   */
  forceRefreshAll(): void {
    this.marketDataCache.clear();
    this.priceCache.clear();
    this.trendingCache = null;
    this.historicalPriceCache.clear();
    this.refreshNeededSubject.next(false);
  }
  
  /**
   * Clear all caches
   */
  clearCache(): void {
    this.marketDataCache.clear();
    this.priceCache.clear();
    this.trendingCache = null;
    this.historicalPriceCache.clear();
  }
}
