import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil, interval, switchMap, startWith } from 'rxjs';

import { CoinGeckoService } from '../../services/coingecko.service';
import { CoinDetails, CoinMarketData } from '../../models/coingecko.interfaces';
import { PriceChartComponent } from '../../../shared/features/price-chart/price-chart.component';
import { PortfolioService } from '../../services/portfolio.service';
import { TradeDialogComponent } from '../../../shared/features/trade-dialog/trade-dialog.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    PriceChartComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Cryptocurrency Dashboard</h1>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="refreshData()" 
          [disabled]="isLoading"
          *ngIf="showRefreshButton"
        >
          <mat-icon>refresh</mat-icon>
          Refresh Data
        </button>
      </div>

      <!-- Data source selection chips -->
      <div class="data-source-selector" *ngIf="!isLoading && !error">
        <mat-chip-set aria-label="Data source selection">
          <mat-chip-option 
            [selected]="currentDataSource === 'top'" 
            (click)="switchDataSource('top')"
          >
            <mat-icon matChipAvatar>trending_up</mat-icon>
            Top 10 by Market Cap
          </mat-chip-option>
          <mat-chip-option 
            [selected]="currentDataSource === 'trending'" 
            (click)="switchDataSource('trending')"
          >
            <mat-icon matChipAvatar>whatshot</mat-icon>
            Trending Coins
          </mat-chip-option>
        </mat-chip-set>
      </div>

      <!-- Loading spinner -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading cryptocurrency data...</p>
      </div>

      <!-- Error message -->
      <div class="error-container" *ngIf="error">
        <mat-card>
          <mat-card-content>
            <div class="error-content">
              <mat-icon color="warn">error</mat-icon>
              <h3>Error loading data</h3>
              <p>{{ error }}</p>
              <button mat-raised-button color="primary" (click)="refreshData()">
                Try Again
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Cryptocurrency cards grid -->
      <div class="cards-grid" *ngIf="!isLoading && !error && coinData.length > 0">
        <mat-card 
          *ngFor="let coin of coinData; trackBy: trackByCoinId" 
          class="crypto-card" 
          [class.selected]="selectedCoin === coin.id"
          (click)="selectCoin(coin.id)"
        >
          <mat-card-header>
            <img [src]="coin.image" [alt]="coin.name" mat-card-avatar class="coin-logo">
            <mat-card-title>{{ coin.name }}</mat-card-title>
            <mat-card-subtitle>{{ coin.symbol.toUpperCase() }}</mat-card-subtitle>
            <div class="rank-badge" *ngIf="coin.market_cap_rank">
              #{{ coin.market_cap_rank }}
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="price">{{ coin.current_price | currency:'USD':'symbol':'1.2-6' }}</div>
            <div class="change" [class.positive]="coin.price_change_percentage_24h >= 0" [class.negative]="coin.price_change_percentage_24h < 0">
              <mat-icon>{{ coin.price_change_percentage_24h >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ coin.price_change_percentage_24h | number:'1.2-2' }}%
            </div>
            <div class="market-cap" *ngIf="coin.market_cap">
              <small>Market Cap: {{ coin.market_cap | currency:'USD':'symbol':'1.0-0' }}</small>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Selected coin detailed view -->
      <mat-card class="selected-coin-detail" *ngIf="selectedCoinDetail && !isLoading">
        <mat-card-header>
          <img [src]="selectedCoinDetail.image" [alt]="selectedCoinDetail.name" mat-card-avatar>
          <mat-card-title>{{ selectedCoinDetail.name }} Details</mat-card-title>
          <mat-card-subtitle>{{ selectedCoinDetail.symbol.toUpperCase() }}</mat-card-subtitle>
          <button mat-icon-button (click)="clearSelectedCoin()" class="close-button">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Current Price:</span>
              <span class="value">{{ selectedCoinDetail.current_price | currency:'USD':'symbol':'1.2-6' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">24h Change:</span>
              <span class="value" [class.positive]="selectedCoinDetail.price_change_24h >= 0" [class.negative]="selectedCoinDetail.price_change_24h < 0">
                {{ selectedCoinDetail.price_change_24h | currency:'USD':'symbol':'1.2-6' }}
                ({{ selectedCoinDetail.price_change_percentage_24h | number:'1.2-2' }}%)
              </span>
            </div>
            <div class="detail-item" *ngIf="selectedCoinDetail.market_cap">
              <span class="label">Market Cap:</span>
              <span class="value">{{ selectedCoinDetail.market_cap | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedCoinDetail.total_volume">
              <span class="label">24h Volume:</span>
              <span class="value">{{ selectedCoinDetail.total_volume | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
          </div>
          <div class="last-updated" *ngIf="selectedCoinDetail.last_updated">
            <small>Last updated: {{ selectedCoinDetail.last_updated | date:'medium' }}</small>
          </div>
          
          <!-- Trading Actions -->
          <div class="trading-actions">
            <button mat-raised-button 
                    color="primary" 
                    (click)="openTradeDialog('buy')"
                    class="trade-button">
              <mat-icon>add</mat-icon>
              Buy {{ selectedCoinDetail.symbol.toUpperCase() }}
            </button>
            <button mat-raised-button 
                    color="warn" 
                    (click)="openTradeDialog('sell')"
                    class="trade-button"
                    [disabled]="!hasHolding(selectedCoinDetail.id)">
              <mat-icon>remove</mat-icon>
              Sell {{ selectedCoinDetail.symbol.toUpperCase() }}
            </button>
          </div>
          
          <!-- Current Holdings for Selected Coin -->
          <div class="current-holding" *ngIf="getCurrentHolding(selectedCoinDetail.id) as holding">
            <h4>Your {{ selectedCoinDetail.name }} Holdings</h4>
            <div class="holding-details">
              <div class="holding-item">
                <span class="label">Quantity:</span>
                <span class="value">{{ holding.quantity | number:'1.0-8' }} {{ selectedCoinDetail.symbol.toUpperCase() }}</span>
              </div>
              <div class="holding-item">
                <span class="label">Avg. Buy Price:</span>
                <span class="value">{{ holding.purchasePrice | currency:'USD':'symbol':'1.2-6' }}</span>
              </div>
              <div class="holding-item">
                <span class="label">Current Value:</span>
                <span class="value">{{ (holding.quantity * holding.currentPrice) | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
              <div class="holding-item">
                <span class="label">P&L:</span>
                <span class="value" [class.positive]="getHoldingPnL(holding) >= 0" [class.negative]="getHoldingPnL(holding) < 0">
                  {{ getHoldingPnL(holding) | currency:'USD':'symbol':'1.2-2' }}
                  ({{ getHoldingPnLPercentage(holding) | number:'1.2-2' }}%)
                </span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Price Chart -->
      <app-price-chart 
        *ngIf="selectedCoin && selectedCoinDetail"
        [coinId]="selectedCoin"
        [coinName]="selectedCoinDetail.name"
        [currentPrice]="selectedCoinDetail.current_price">
      </app-price-chart>

      <!-- Auto-update info -->
      <div class="update-info" *ngIf="!isLoading && coinData.length > 0">
        <small>
          <mat-icon>info</mat-icon>
          Data updates every minute. Auto-updates stop after 3 minutes to conserve API usage.
        </small>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: var(--text-primary, #333);
    }

    .data-source-selector {
      margin-bottom: 24px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .error-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .crypto-card {
      min-height: 160px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .crypto-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .crypto-card.selected {
      border: 2px solid var(--primary-purple, #8b5cf6);
    }

    .coin-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .rank-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: var(--primary-purple, #8b5cf6);
      color: white;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--text-primary, #333);
    }

    .change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .change.positive {
      color: #4caf50;
    }

    .change.negative {
      color: #f44336;
    }

    .change mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .market-cap {
      color: var(--text-muted, #666);
      font-size: 0.875rem;
    }

    .selected-coin-detail {
      margin-bottom: 24px;
      position: relative;
    }

    .close-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-primary, #e0e0e0);
    }

    .detail-item .label {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    .detail-item .value {
      font-weight: bold;
      color: var(--text-primary, #333);
    }

    .detail-item .value.positive {
      color: #4caf50;
    }

    .detail-item .value.negative {
      color: #f44336;
    }

    .last-updated {
      text-align: center;
      color: var(--text-muted, #666);
      font-style: italic;
    }

    .update-info {
      text-align: center;
      padding: 16px;
      background-color: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
      color: var(--text-secondary, #666);
    }

    .update-info mat-icon {
      vertical-align: middle;
      margin-right: 8px;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .trading-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin: 24px 0;
    }

    .trade-button {
      min-width: 140px;
    }

    .current-holding {
      margin-top: 24px;
      padding: 16px;
      background-color: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
    }

    .current-holding h4 {
      margin: 0 0 16px 0;
      color: var(--text-primary, #333);
    }

    .holding-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .holding-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .holding-item .label {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    .holding-item .value {
      font-weight: bold;
      color: var(--text-primary, #333);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Component state
  isLoading = false;
  error: string | null = null;
  coinData: CoinDetails[] = [];
  currentDataSource: 'top' | 'trending' = 'top';
  selectedCoin: string | null = null;
  selectedCoinDetail: CoinDetails | null = null;
  showRefreshButton = false;
  
  // Auto-update management
  private updateCount = 0;
  private readonly MAX_AUTO_UPDATES = 3;

  constructor(
    private coinGeckoService: CoinGeckoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    // Simplified initialization - just load initial data
    this.loadInitialData();
    // Comment out auto-updates and subscriptions for now to isolate the issue
    // this.setupAutoUpdates();
    // this.subscribeToRefreshNeeded();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.error = null;
    
    // For now, let's use static test data to see if the component renders
    setTimeout(() => {
      this.coinData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 45230.00,
          price_change_24h: 1200.50,
          price_change_percentage_24h: 2.5,
          market_cap: 850000000000,
          market_cap_rank: 1,
          total_volume: 25000000000,
          last_updated: new Date().toISOString()
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3120.00,
          price_change_24h: -40.30,
          price_change_percentage_24h: -1.2,
          market_cap: 375000000000,
          market_cap_rank: 2,
          total_volume: 15000000000,
          last_updated: new Date().toISOString()
        }
      ];
      this.isLoading = false;
    }, 1000);
    
    // TODO: Re-enable API calls once the component is stable
    /*
    this.coinGeckoService.getTopCoins()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.coinData = this.coinGeckoService.marketDataToCoinDetails(data);
          this.isLoading = false;
          this.updateCount = 0;
        },
        error: (error) => {
          this.error = error.error || 'Failed to load cryptocurrency data';
          this.isLoading = false;
          this.showErrorSnackBar(this.error!);
        }
      });
    */
  }

  private setupAutoUpdates(): void {
    // Auto-update every minute, but stop after 3 updates
    interval(60000) // 1 minute
      .pipe(
        startWith(0),
        switchMap(() => {
          if (this.updateCount >= this.MAX_AUTO_UPDATES) {
            this.showRefreshButton = true;
            return [];
          }
          
          return this.currentDataSource === 'top' 
            ? this.coinGeckoService.getTopCoins()
            : this.coinGeckoService.getTrendingCoins();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            // Top coins data (CoinMarketData[])
            this.coinData = this.coinGeckoService.marketDataToCoinDetails(data);
          } else {
            // Trending data - convert to CoinDetails format
            this.coinData = data.coins.slice(0, 10).map(trendingCoin => ({
              id: trendingCoin.item.id,
              symbol: trendingCoin.item.symbol,
              name: trendingCoin.item.name,
              image: trendingCoin.item.large,
              current_price: 0, // Will be updated with actual price data
              price_change_24h: 0,
              price_change_percentage_24h: 0,
              market_cap: 0,
              market_cap_rank: trendingCoin.item.market_cap_rank,
              total_volume: 0,
              last_updated: new Date().toISOString()
            }));
          }
          this.updateCount++;
          
          // Update selected coin detail if one is selected
          if (this.selectedCoin) {
            this.updateSelectedCoinDetail();
          }
        },
        error: (error) => {
          this.showErrorSnackBar('Failed to update data: ' + (error.error || error.message));
        }
      });
  }

  private subscribeToRefreshNeeded(): void {
    this.coinGeckoService.refreshNeeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(needsRefresh => {
        this.showRefreshButton = needsRefresh;
      });
  }

  switchDataSource(source: 'top' | 'trending'): void {
    if (this.currentDataSource === source) return;
    
    this.currentDataSource = source;
    this.isLoading = true;
    this.error = null;
    this.updateCount = 0;
    this.showRefreshButton = false;
    
    if (source === 'top') {
      this.coinGeckoService.getTopCoins(true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.coinData = this.coinGeckoService.marketDataToCoinDetails(data);
            this.isLoading = false;
          },
          error: (error) => {
            this.error = error.error || 'Failed to load top coins';
            this.isLoading = false;
          }
        });
    } else {
      this.coinGeckoService.getTrendingCoins(true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.coinData = data.coins.slice(0, 10).map(trendingCoin => ({
              id: trendingCoin.item.id,
              symbol: trendingCoin.item.symbol,
              name: trendingCoin.item.name,
              image: trendingCoin.item.large,
              current_price: 0,
              price_change_24h: 0,
              price_change_percentage_24h: 0,
              market_cap: 0,
              market_cap_rank: trendingCoin.item.market_cap_rank,
              total_volume: 0,
              last_updated: new Date().toISOString()
            }));
            this.isLoading = false;
            
            // Get actual price data for trending coins
            this.updateTrendingCoinsPrices();
          },
          error: (error) => {
            this.error = error.error || 'Failed to load trending coins';
            this.isLoading = false;
          }
        });
    }
  }

  private updateTrendingCoinsPrices(): void {
    const coinIds = this.coinData.map(coin => coin.id);
    
    this.coinGeckoService.getCoinPrices(coinIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (priceData) => {
          this.coinData = this.coinData.map(coin => {
            const prices = priceData[coin.id];
            if (prices) {
              return {
                ...coin,
                current_price: prices['usd'] || 0,
                price_change_percentage_24h: prices['usd_24h_change'] || 0,
                price_change_24h: (prices['usd'] || 0) * (prices['usd_24h_change'] || 0) / 100,
                market_cap: prices['usd_market_cap'] || 0,
                total_volume: prices['usd_24h_vol'] || 0
              };
            }
            return coin;
          });
        },
        error: (error) => {
          console.error('Failed to load price data:', error);
        }
      });
  }

  selectCoin(coinId: string): void {
    if (this.selectedCoin === coinId) {
      this.clearSelectedCoin();
      return;
    }
    
    this.selectedCoin = coinId;
    this.coinGeckoService.setSelectedCoin(coinId);
    this.updateSelectedCoinDetail();
  }

  clearSelectedCoin(): void {
    this.selectedCoin = null;
    this.selectedCoinDetail = null;
    this.coinGeckoService.setSelectedCoin(null);
  }

  private updateSelectedCoinDetail(): void {
    const coin = this.coinData.find(c => c.id === this.selectedCoin);
    if (coin) {
      this.selectedCoinDetail = coin;
    }
  }

  refreshData(): void {
    this.updateCount = 0;
    this.showRefreshButton = false;
    this.coinGeckoService.forceRefreshAll();
    this.switchDataSource(this.currentDataSource);
    this.snackBar.open('Data refreshed successfully!', 'Close', { duration: 3000 });
  }

  trackByCoinId(index: number, coin: CoinDetails): string {
    return coin.id;
  }

  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  openTradeDialog(type: 'buy' | 'sell'): void {
    if (!this.selectedCoinDetail) return;

    const availableQuantity = this.getCurrentHolding(this.selectedCoinDetail.id)?.quantity || 0;

    const dialogRef = this.dialog.open(TradeDialogComponent, {
      width: '500px',
      data: {
        coinId: this.selectedCoinDetail.id,
        coinName: this.selectedCoinDetail.name,
        coinSymbol: this.selectedCoinDetail.symbol,
        coinImage: this.selectedCoinDetail.image,
        currentPrice: this.selectedCoinDetail.current_price,
        availableQuantity: availableQuantity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        const message = result.type === 'buy' 
          ? `Successfully bought ${result.quantity} ${this.selectedCoinDetail?.symbol.toUpperCase()}`
          : `Successfully sold ${result.quantity} ${this.selectedCoinDetail?.symbol.toUpperCase()}`;
        
        this.snackBar.open(message, 'Close', { duration: 3000 });
      } else if (result && !result.success) {
        this.snackBar.open(result.error || 'Transaction failed', 'Close', { duration: 3000 });
      }
    });
  }

  hasHolding(coinId: string): boolean {
    const holding = this.portfolioService.getCoinHolding(coinId);
    return holding !== undefined && holding.quantity > 0;
  }

  getCurrentHolding(coinId: string) {
    return this.portfolioService.getCoinHolding(coinId);
  }

  getHoldingPnL(holding: any): number {
    const purchaseValue = holding.quantity * holding.purchasePrice;
    const currentValue = holding.quantity * holding.currentPrice;
    return currentValue - purchaseValue;
  }

  getHoldingPnLPercentage(holding: any): number {
    const purchaseValue = holding.quantity * holding.purchasePrice;
    const currentValue = holding.quantity * holding.currentPrice;
    if (purchaseValue === 0) return 0;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  }
}
