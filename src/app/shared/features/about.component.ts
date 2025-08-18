import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <h1>About Cryptocurrency Dashboard</h1>
        <p class="subtitle">Real-time crypto market data powered by CoinGecko API</p>
      </div>
      
      <mat-card class="features-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>dashboard</mat-icon>
          <mat-card-title>Key Features</mat-card-title>
          <mat-card-subtitle>What our dashboard offers</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="features-grid">
            <div class="feature-item">
              <mat-icon>trending_up</mat-icon>
              <h3>Real-time Market Data</h3>
              <p>Live cryptocurrency prices, market caps, and 24h changes for the top cryptocurrencies</p>
            </div>
            <div class="feature-item">
              <mat-icon>show_chart</mat-icon>
              <h3>Interactive Price Charts</h3>
              <p>24-hour price history visualization with Chart.js showing trends, highs, lows, and percentage changes</p>
            </div>
            <div class="feature-item">
              <mat-icon>whatshot</mat-icon>
              <h3>Trending Cryptocurrencies</h3>
              <p>Discover what's trending in the crypto market with real-time trending data</p>
            </div>
            <div class="feature-item">
              <mat-icon>refresh</mat-icon>
              <h3>Auto-refresh System</h3>
              <p>Smart caching with 60-second intervals and 3-minute refresh cycles to respect API rate limits</p>
            </div>
            <div class="feature-item">
              <mat-icon>devices</mat-icon>
              <h3>Responsive Design</h3>
              <p>Fully responsive Material Design interface that works perfectly on desktop and mobile devices</p>
            </div>
            <div class="feature-item">
              <mat-icon>security</mat-icon>
              <h3>Secure API Integration</h3>
              <p>Proper API key management and error handling with CoinGecko's free tier restrictions</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="tech-stack-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>code</mat-icon>
          <mat-card-title>Technology Stack</mat-card-title>
          <mat-card-subtitle>Built with modern web technologies</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="tech-section">
            <h4>Frontend Framework</h4>
            <mat-chip-set>
              <mat-chip>Angular 18+</mat-chip>
              <mat-chip>TypeScript</mat-chip>
              <mat-chip>RxJS</mat-chip>
              <mat-chip>Standalone Components</mat-chip>
            </mat-chip-set>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="tech-section">
            <h4>UI & Design</h4>
            <mat-chip-set>
              <mat-chip>Angular Material</mat-chip>
              <mat-chip>Material Design</mat-chip>
              <mat-chip>CSS3</mat-chip>
              <mat-chip>Responsive Layout</mat-chip>
            </mat-chip-set>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="tech-section">
            <h4>Data Visualization</h4>
            <mat-chip-set>
              <mat-chip>Chart.js</mat-chip>
              <mat-chip>ng2-charts</mat-chip>
              <mat-chip>Interactive Charts</mat-chip>
            </mat-chip-set>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="tech-section">
            <h4>API & Data</h4>
            <mat-chip-set>
              <mat-chip>CoinGecko API</mat-chip>
              <mat-chip>HTTP Client</mat-chip>
              <mat-chip>Smart Caching</mat-chip>
              <mat-chip>Error Handling</mat-chip>
            </mat-chip-set>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="api-info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>api</mat-icon>
          <mat-card-title>CoinGecko Integration</mat-card-title>
          <mat-card-subtitle>Reliable cryptocurrency data source</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="api-features">
            <div class="api-feature">
              <mat-icon>data_usage</mat-icon>
              <div>
                <h4>Free Tier Compliance</h4>
                <p>Optimized for CoinGecko's free API tier with proper rate limiting and caching strategies</p>
              </div>
            </div>
            <div class="api-feature">
              <mat-icon>schedule</mat-icon>
              <div>
                <h4>Smart Caching</h4>
                <p>5-minute cache for price data, 60-second cache for market data to minimize API calls</p>
              </div>
            </div>
            <div class="api-feature">
              <mat-icon>error_outline</mat-icon>
              <div>
                <h4>Error Handling</h4>
                <p>Comprehensive error handling with user-friendly messages and retry mechanisms</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="development-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>build</mat-icon>
          <mat-card-title>Development Features</mat-card-title>
          <mat-card-subtitle>Modern development practices</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <ul class="development-list">
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Standalone Angular components for better tree-shaking and performance</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Reactive programming with RxJS observables and signals</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>TypeScript interfaces for type safety and better developer experience</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Service-based architecture with dependency injection</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Responsive navigation with Material sidenav and toolbar</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Progressive Web App ready with service worker support</span>
            </li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .header-section h1 {
      margin-bottom: 8px;
      color: var(--text-primary, #333);
      font-size: 2.5em;
      font-weight: 300;
    }

    .subtitle {
      font-size: 1.2em;
      color: var(--text-secondary, #666);
      margin: 0;
    }

    mat-card {
      margin-bottom: 24px;
    }

    .features-card .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 16px;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 16px;
    }

    .feature-item mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #2196F3;
    }

    .feature-item h3 {
      margin: 0 0 12px 0;
      color: var(--text-primary, #333);
      font-size: 1.2em;
    }

    .feature-item p {
      margin: 0;
      color: var(--text-secondary, #666);
      line-height: 1.5;
    }

    .tech-stack-card mat-card-content {
      padding-top: 16px;
    }

    .tech-section {
      margin: 20px 0;
    }

    .tech-section h4 {
      margin: 0 0 12px 0;
      color: var(--text-primary, #333);
      font-weight: 500;
    }

    .tech-section mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    mat-divider {
      margin: 20px 0;
    }

    .api-info-card .api-features {
      margin-top: 16px;
    }

    .api-feature {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      gap: 16px;
    }

    .api-feature mat-icon {
      color: #4CAF50;
      margin-top: 4px;
    }

    .api-feature h4 {
      margin: 0 0 8px 0;
      color: var(--text-primary, #333);
      font-weight: 500;
    }

    .api-feature p {
      margin: 0;
      color: var(--text-secondary, #666);
      line-height: 1.5;
    }

    .development-list {
      list-style: none;
      padding: 0;
      margin: 16px 0 0 0;
    }

    .development-list li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 12px;
    }

    .development-list mat-icon {
      color: #4CAF50;
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: 2px;
    }

    .development-list span {
      color: var(--text-secondary, #666);
      line-height: 1.5;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .header-section h1 {
        font-size: 2em;
      }

      .subtitle {
        font-size: 1.1em;
      }

      .features-card .features-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .feature-item {
        padding: 12px;
      }

      .feature-item mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      .tech-section mat-chip-set {
        justify-content: center;
      }

      .api-feature {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .header-section h1 {
        color: var(--text-primary, #fff);
      }

      .subtitle {
        color: var(--text-secondary, #ccc);
      }

      .feature-item h3,
      .tech-section h4,
      .api-feature h4 {
        color: var(--text-primary, #fff);
      }

      .feature-item p,
      .api-feature p,
      .development-list span {
        color: var(--text-secondary, #ccc);
      }
    }
  `]
})
export class AboutComponent {
}
