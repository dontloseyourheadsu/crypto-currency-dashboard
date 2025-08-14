import { Component, Input, OnChanges, SimpleChanges, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { CoinGeckoService } from '../../../core/services/coingecko.service';
import { PriceDataPoint } from '../../../core/models/coingecko.interfaces';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="price-chart-card">
      <mat-card-header>
        <mat-card-title>
          {{ coinName }} - 24 Hour Price Chart
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        @if (loading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading price data...</p>
          </div>
        } @else if (error()) {
          <div class="error-container">
            <p class="error-message">{{ error() }}</p>
            <button mat-raised-button color="primary" (click)="loadPriceData()">
              Retry
            </button>
          </div>
        } @else {
          <div class="chart-container">
            <canvas #chartCanvas></canvas>
          </div>
          
          @if (priceData().length > 0) {
            <div class="price-stats">
              <div class="stat">
                <span class="label">24h High:</span>
                <span class="value high">\${{ highPrice().toFixed(2) }}</span>
              </div>
              <div class="stat">
                <span class="label">24h Low:</span>
                <span class="value low">\${{ lowPrice().toFixed(2) }}</span>
              </div>
              <div class="stat">
                <span class="label">24h Change:</span>
                <span class="value" [class]="priceChange() >= 0 ? 'positive' : 'negative'">
                  {{ priceChange() >= 0 ? '+' : '' }}{{ priceChangePercent().toFixed(2) }}%
                </span>
              </div>
            </div>
          }
        }
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnChanges, AfterViewInit {
  @Input() coinId: string = '';
  @Input() coinName: string = '';
  @Input() currentPrice: number = 0;
  
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private coinGeckoService = inject(CoinGeckoService);
  private chart: Chart | null = null;
  
  // Signals for reactive state
  loading = signal(false);
  error = signal<string | null>(null);
  priceData = signal<PriceDataPoint[]>([]);
  
  // Computed values
  highPrice = signal(0);
  lowPrice = signal(0);
  priceChange = signal(0);
  priceChangePercent = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinId'] && this.coinId) {
      this.loadPriceData();
    }
  }

  ngAfterViewInit(): void {
    // Chart will be created when data is loaded
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadPriceData(): void {
    if (!this.coinId) {
      console.error('No coinId provided');
      return;
    }

    console.log(`Loading price data for ${this.coinId}`);
    this.loading.set(true);
    this.error.set(null);

    this.coinGeckoService.getCoinPriceHistory(this.coinId).subscribe({
      next: (data) => {
        console.log(`Received ${data.length} price data points for ${this.coinId}`, data);
        this.priceData.set(data);
        this.calculateStats(data);
        
        // Add a small delay to ensure the view has been updated
        setTimeout(() => {
          this.createChart(data);
        }, 100);
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Price data error:', err);
        this.error.set(err.message || 'Failed to load price data');
        this.loading.set(false);
      }
    });
  }

  private calculateStats(data: PriceDataPoint[]): void {
    if (data.length === 0) return;

    const prices = data.map(d => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    this.highPrice.set(high);
    this.lowPrice.set(low);
    this.priceChange.set(change);
    this.priceChangePercent.set(changePercent);
  }

  private createChart(data: PriceDataPoint[]): void {
    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas?.nativeElement) {
      console.error('Chart canvas not found');
      return;
    }

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    // Determine line color based on price trend
    const firstPrice = data[0]?.price || 0;
    const lastPrice = data[data.length - 1]?.price || 0;
    const isPositive = lastPrice >= firstPrice;
    const lineColor = isPositive ? '#4caf50' : '#f44336';
    const fillColor = isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: data.map(d => d.date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })),
        datasets: [{
          label: `${this.coinName} Price (USD)`,
          data: data.map(d => d.price),
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: lineColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: lineColor,
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                return `Price: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              maxTicksLimit: 8,
              color: '#666666'
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#666666',
              callback: function(value) {
                return '$' + Number(value).toFixed(2);
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        elements: {
          line: {
            borderWidth: 2
          },
          point: {
            hoverRadius: 8
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}
