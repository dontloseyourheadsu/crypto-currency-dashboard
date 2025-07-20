import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <h1>Cryptocurrency Dashboard</h1>
      
      <div class="cards-grid">
        <mat-card class="crypto-card">
          <mat-card-header>
            <mat-card-title>Bitcoin</mat-card-title>
            <mat-card-subtitle>BTC</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="price">$45,230.00</div>
            <div class="change positive">+2.5%</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="crypto-card">
          <mat-card-header>
            <mat-card-title>Ethereum</mat-card-title>
            <mat-card-subtitle>ETH</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="price">$3,120.00</div>
            <div class="change negative">-1.2%</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="crypto-card">
          <mat-card-header>
            <mat-card-title>Cardano</mat-card-title>
            <mat-card-subtitle>ADA</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="price">$0.85</div>
            <div class="change positive">+4.1%</div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Market Overview</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-placeholder">
            <mat-icon>show_chart</mat-icon>
            <p>Chart component will be implemented here</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: var(--text-primary, #333);
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .crypto-card {
      min-height: 120px;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .change {
      font-weight: 500;
    }

    .change.positive {
      color: #4caf50;
    }

    .change.negative {
      color: #f44336;
    }

    .chart-card {
      width: 100%;
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 8px;
    }

    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
      
      .chart-placeholder {
        height: 200px;
      }
    }
  `]
})
export class DashboardComponent {
}
