import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { PortfolioService, PortfolioItem, Transaction } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="portfolio-container">
      <div class="portfolio-header">
        <h1>My Crypto Portfolio</h1>
        <button mat-raised-button color="warn" (click)="clearPortfolio()" *ngIf="portfolio.length > 0">
          <mat-icon>clear_all</mat-icon>
          Clear Portfolio
        </button>
      </div>

      <!-- Portfolio Summary -->
      <div class="summary-cards" *ngIf="portfolio.length > 0">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-item">
              <mat-icon>account_balance_wallet</mat-icon>
              <div class="summary-details">
                <div class="summary-label">Total Portfolio Value</div>
                <div class="summary-value">{{ portfolioValue | currency:'USD':'symbol':'1.2-2' }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-item">
              <mat-icon [class.positive]="profitLoss >= 0" [class.negative]="profitLoss < 0">
                {{ profitLoss >= 0 ? 'trending_up' : 'trending_down' }}
              </mat-icon>
              <div class="summary-details">
                <div class="summary-label">Total P&L</div>
                <div class="summary-value" [class.positive]="profitLoss >= 0" [class.negative]="profitLoss < 0">
                  {{ profitLoss | currency:'USD':'symbol':'1.2-2' }}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-item">
              <mat-icon>donut_large</mat-icon>
              <div class="summary-details">
                <div class="summary-label">Holdings</div>
                <div class="summary-value">{{ portfolio.length }} {{ portfolio.length === 1 ? 'Coin' : 'Coins' }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Portfolio Holdings -->
      <mat-card class="holdings-card" *ngIf="portfolio.length > 0">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>account_balance_wallet</mat-icon>
            Current Holdings
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="holdings-table">
            <div class="holdings-header">
              <div class="col-coin">Coin</div>
              <div class="col-quantity">Quantity</div>
              <div class="col-avg-price">Avg. Buy Price</div>
              <div class="col-current-price">Current Price</div>
              <div class="col-value">Value</div>
              <div class="col-pnl">P&L</div>
            </div>
            <div class="holdings-row" *ngFor="let holding of portfolio; trackBy: trackByHoldingId">
              <div class="col-coin">
                <img [src]="holding.coinImage" [alt]="holding.coinName" class="coin-logo">
                <div class="coin-info">
                  <div class="coin-name">{{ holding.coinName }}</div>
                  <div class="coin-symbol">{{ holding.coinSymbol.toUpperCase() }}</div>
                </div>
              </div>
              <div class="col-quantity">
                {{ holding.quantity | number:'1.0-8' }}
              </div>
              <div class="col-avg-price">
                {{ holding.purchasePrice | currency:'USD':'symbol':'1.2-6' }}
              </div>
              <div class="col-current-price">
                {{ holding.currentPrice | currency:'USD':'symbol':'1.2-6' }}
              </div>
              <div class="col-value">
                {{ (holding.quantity * holding.currentPrice) | currency:'USD':'symbol':'1.2-2' }}
              </div>
              <div class="col-pnl" 
                   [class.positive]="getHoldingPnL(holding) >= 0" 
                   [class.negative]="getHoldingPnL(holding) < 0">
                {{ getHoldingPnL(holding) | currency:'USD':'symbol':'1.2-2' }}
                <small>({{ getHoldingPnLPercentage(holding) | number:'1.2-2' }}%)</small>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Transactions -->
      <mat-card class="transactions-card" *ngIf="recentTransactions.length > 0">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt</mat-icon>
            Recent Transactions
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="transactions-list">
            <div class="transaction-item" *ngFor="let transaction of recentTransactions; trackBy: trackByTransactionId">
              <div class="transaction-coin">
                <img [src]="transaction.coinImage" [alt]="transaction.coinName" class="coin-logo">
                <div class="coin-info">
                  <div class="coin-name">{{ transaction.coinName }}</div>
                  <div class="coin-symbol">{{ transaction.coinSymbol.toUpperCase() }}</div>
                </div>
              </div>
              <div class="transaction-details">
                <div class="transaction-type" [class.buy]="transaction.type === 'buy'" [class.sell]="transaction.type === 'sell'">
                  <mat-icon>{{ transaction.type === 'buy' ? 'add_circle' : 'remove_circle' }}</mat-icon>
                  {{ transaction.type === 'buy' ? 'Bought' : 'Sold' }}
                </div>
                <div class="transaction-amount">
                  {{ transaction.quantity | number:'1.0-8' }} at {{ transaction.price | currency:'USD':'symbol':'1.2-6' }}
                </div>
                <div class="transaction-total">
                  Total: {{ transaction.total | currency:'USD':'symbol':'1.2-2' }}
                </div>
                <div class="transaction-date">
                  {{ transaction.date | date:'short' }}
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="portfolio.length === 0">
        <mat-card>
          <mat-card-content>
            <div class="empty-content">
              <mat-icon>account_balance_wallet</mat-icon>
              <h3>No Holdings Yet</h3>
              <p>Start building your crypto portfolio by buying coins from the dashboard.</p>
              <button mat-raised-button color="primary" routerLink="/">
                <mat-icon>dashboard</mat-icon>
                Go to Dashboard
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .portfolio-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portfolio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .portfolio-header h1 {
      margin: 0;
      color: var(--text-primary, #333);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: linear-gradient(135deg, var(--primary-purple, #8b5cf6), var(--primary-purple-dark, #7c3aed));
      color: white;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .summary-item mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      opacity: 0.9;
    }

    .summary-details {
      flex: 1;
    }

    .summary-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 4px;
    }

    .summary-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .holdings-card,
    .transactions-card {
      margin-bottom: 24px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .holdings-table {
      width: 100%;
    }

    .holdings-header,
    .holdings-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 16px;
      align-items: center;
      padding: 12px 0;
    }

    .holdings-header {
      font-weight: bold;
      border-bottom: 2px solid var(--border-primary, #e0e0e0);
      color: var(--text-secondary, #666);
    }

    .holdings-row {
      border-bottom: 1px solid var(--border-primary, #e0e0e0);
    }

    .holdings-row:hover {
      background-color: var(--bg-secondary, #f5f5f5);
    }

    .col-coin {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .coin-logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .coin-info {
      display: flex;
      flex-direction: column;
    }

    .coin-name {
      font-weight: 500;
      color: var(--text-primary, #333);
    }

    .coin-symbol {
      font-size: 0.875rem;
      color: var(--text-muted, #666);
    }

    .col-quantity,
    .col-avg-price,
    .col-current-price,
    .col-value,
    .col-pnl {
      text-align: right;
      font-weight: 500;
    }

    .col-pnl small {
      display: block;
      font-weight: normal;
      opacity: 0.8;
    }

    .positive {
      color: #4caf50;
    }

    .negative {
      color: #f44336;
    }

    .transactions-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-primary, #e0e0e0);
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-coin {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 150px;
    }

    .transaction-details {
      flex: 1;
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 16px;
      align-items: center;
    }

    .transaction-type {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      min-width: 80px;
    }

    .transaction-type.buy {
      color: #4caf50;
    }

    .transaction-type.sell {
      color: #f44336;
    }

    .transaction-amount {
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .transaction-total {
      font-weight: 500;
      color: var(--text-primary, #333);
    }

    .transaction-date {
      font-size: 0.875rem;
      color: var(--text-muted, #666);
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .empty-content mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--text-muted, #666);
    }

    .empty-content h3 {
      margin: 0;
      color: var(--text-primary, #333);
    }

    .empty-content p {
      margin: 0;
      color: var(--text-secondary, #666);
      max-width: 300px;
    }

    @media (max-width: 768px) {
      .portfolio-container {
        padding: 16px;
      }

      .portfolio-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .holdings-header,
      .holdings-row {
        grid-template-columns: 2fr 1fr 1fr;
        gap: 8px;
      }

      .col-avg-price,
      .col-current-price,
      .col-value {
        display: none;
      }

      .transaction-details {
        grid-template-columns: 1fr;
        gap: 4px;
      }

      .transaction-amount,
      .transaction-total {
        font-size: 0.75rem;
      }
    }
  `]
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  portfolio: PortfolioItem[] = [];
  recentTransactions: Transaction[] = [];
  portfolioValue = 0;
  profitLoss = 0;

  constructor(
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.portfolioService.portfolio$,
      this.portfolioService.transactions$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([portfolio, transactions]) => {
      this.portfolio = portfolio;
      this.recentTransactions = transactions.slice(0, 10); // Show last 10 transactions
      this.portfolioValue = this.portfolioService.getPortfolioValue();
      this.profitLoss = this.portfolioService.getPortfolioProfitLoss();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getHoldingPnL(holding: PortfolioItem): number {
    const purchaseValue = holding.quantity * holding.purchasePrice;
    const currentValue = holding.quantity * holding.currentPrice;
    return currentValue - purchaseValue;
  }

  getHoldingPnLPercentage(holding: PortfolioItem): number {
    const purchaseValue = holding.quantity * holding.purchasePrice;
    const currentValue = holding.quantity * holding.currentPrice;
    if (purchaseValue === 0) return 0;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  }

  clearPortfolio(): void {
    if (confirm('Are you sure you want to clear your entire portfolio? This action cannot be undone.')) {
      this.portfolioService.clearPortfolio();
      this.snackBar.open('Portfolio cleared successfully', 'Close', { duration: 3000 });
    }
  }

  trackByHoldingId(index: number, holding: PortfolioItem): string {
    return holding.id;
  }

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id;
  }
}
