import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  CoinMarketData,
  SimplePriceData,
  TrendingResponse,
  CoinDetails,
  CoinGeckoErrorResponse
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
   * Force refresh all cached data
   */
  forceRefreshAll(): void {
    this.marketDataCache.clear();
    this.priceCache.clear();
    this.trendingCache = null;
    this.refreshNeededSubject.next(false);
  }
  
  /**
   * Clear all caches
   */
  clearCache(): void {
    this.marketDataCache.clear();
    this.priceCache.clear();
    this.trendingCache = null;
  }
}
