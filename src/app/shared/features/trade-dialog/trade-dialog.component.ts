import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PortfolioService } from '../../../core/services/portfolio.service';

export interface TradeDialogData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  currentPrice: number;
  availableQuantity?: number;
}

@Component({
  selector: 'app-trade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <h2 mat-dialog-title>
      <img [src]="data.coinImage" [alt]="data.coinName" class="coin-logo">
      Trade {{ data.coinName }} ({{ data.coinSymbol.toUpperCase() }})
    </h2>

    <mat-dialog-content>
      <div class="current-price">
        <span class="price-label">Current Price:</span>
        <span class="price-value">{{ data.currentPrice | currency:'USD':'symbol':'1.2-6' }}</span>
      </div>

      <div class="available-balance" *ngIf="data.availableQuantity !== undefined && data.availableQuantity > 0">
        <span class="balance-label">Available to Sell:</span>
        <span class="balance-value">{{ data.availableQuantity | number:'1.0-8' }} {{ data.coinSymbol.toUpperCase() }}</span>
      </div>

      <mat-tab-group [(selectedIndex)]="selectedTab">
        <!-- Buy Tab -->
        <mat-tab label="Buy">
          <div class="tab-content">
            <form [formGroup]="buyForm" (ngSubmit)="onBuy()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Quantity</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="quantity" 
                       placeholder="0.00000000"
                       step="0.00000001"
                       min="0.00000001">
                <mat-error *ngIf="buyForm.get('quantity')?.hasError('required')">
                  Quantity is required
                </mat-error>
                <mat-error *ngIf="buyForm.get('quantity')?.hasError('min')">
                  Quantity must be greater than 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Price per coin (USD)</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="price" 
                       step="0.01"
                       min="0.01">
                <mat-error *ngIf="buyForm.get('price')?.hasError('required')">
                  Price is required
                </mat-error>
                <mat-error *ngIf="buyForm.get('price')?.hasError('min')">
                  Price must be greater than 0
                </mat-error>
              </mat-form-field>

              <div class="total-cost" *ngIf="buyTotal > 0">
                <span class="total-label">Total Cost:</span>
                <span class="total-value">{{ buyTotal | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>

              <div class="form-actions">
                <button mat-raised-button 
                        type="submit" 
                        color="primary" 
                        [disabled]="!buyForm.valid">
                  <mat-icon>add</mat-icon>
                  Buy {{ data.coinSymbol.toUpperCase() }}
                </button>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Sell Tab -->
        <mat-tab label="Sell" [disabled]="!canSell">
          <div class="tab-content">
            <form [formGroup]="sellForm" (ngSubmit)="onSell()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Quantity</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="quantity" 
                       placeholder="0.00000000"
                       step="0.00000001"
                       min="0.00000001"
                       [max]="data.availableQuantity || 0">
                <mat-error *ngIf="sellForm.get('quantity')?.hasError('required')">
                  Quantity is required
                </mat-error>
                <mat-error *ngIf="sellForm.get('quantity')?.hasError('min')">
                  Quantity must be greater than 0
                </mat-error>
                <mat-error *ngIf="sellForm.get('quantity')?.hasError('max')">
                  Quantity cannot exceed available balance
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Price per coin (USD)</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="price" 
                       step="0.01"
                       min="0.01">
                <mat-error *ngIf="sellForm.get('price')?.hasError('required')">
                  Price is required
                </mat-error>
                <mat-error *ngIf="sellForm.get('price')?.hasError('min')">
                  Price must be greater than 0
                </mat-error>
              </mat-form-field>

              <div class="total-proceeds" *ngIf="sellTotal > 0">
                <span class="total-label">Total Proceeds:</span>
                <span class="total-value">{{ sellTotal | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>

              <div class="form-actions">
                <button mat-raised-button 
                        type="submit" 
                        color="warn" 
                        [disabled]="!sellForm.valid">
                  <mat-icon>remove</mat-icon>
                  Sell {{ data.coinSymbol.toUpperCase() }}
                </button>
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .coin-logo {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      vertical-align: middle;
    }

    .current-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .price-label {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    .price-value {
      font-weight: bold;
      font-size: 1.2rem;
      color: var(--primary-purple, #8b5cf6);
    }

    .available-balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--bg-card, #fff);
      border: 1px solid var(--border-primary, #e0e0e0);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .balance-label {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    .balance-value {
      font-weight: bold;
      color: var(--text-primary, #333);
    }

    .tab-content {
      padding: 24px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .total-cost,
    .total-proceeds {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .total-label {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    .total-value {
      font-weight: bold;
      font-size: 1.1rem;
      color: var(--text-primary, #333);
    }

    .form-actions {
      display: flex;
      justify-content: center;
    }

    .form-actions button {
      min-width: 140px;
    }

    mat-dialog-content {
      min-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
    }

    @media (max-width: 480px) {
      mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class TradeDialogComponent {
  buyForm: FormGroup;
  sellForm: FormGroup;
  selectedTab = 0;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    public dialogRef: MatDialogRef<TradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeDialogData
  ) {
    this.buyForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(0.00000001)]],
      price: [data.currentPrice, [Validators.required, Validators.min(0.01)]]
    });

    this.sellForm = this.fb.group({
      quantity: ['', [
        Validators.required, 
        Validators.min(0.00000001), 
        Validators.max(data.availableQuantity || 0)
      ]],
      price: [data.currentPrice, [Validators.required, Validators.min(0.01)]]
    });
  }

  get canSell(): boolean {
    return (this.data.availableQuantity || 0) > 0;
  }

  get buyTotal(): number {
    const quantity = this.buyForm.get('quantity')?.value || 0;
    const price = this.buyForm.get('price')?.value || 0;
    return quantity * price;
  }

  get sellTotal(): number {
    const quantity = this.sellForm.get('quantity')?.value || 0;
    const price = this.sellForm.get('price')?.value || 0;
    return quantity * price;
  }

  onBuy(): void {
    if (this.buyForm.valid) {
      const { quantity, price } = this.buyForm.value;
      
      this.portfolioService.buyCoin(
        this.data.coinId,
        this.data.coinName,
        this.data.coinSymbol,
        this.data.coinImage,
        parseFloat(quantity),
        parseFloat(price)
      );

      this.dialogRef.close({ success: true, type: 'buy', quantity, price });
    }
  }

  onSell(): void {
    if (this.sellForm.valid) {
      const { quantity, price } = this.sellForm.value;
      
      const success = this.portfolioService.sellCoin(
        this.data.coinId,
        this.data.coinName,
        this.data.coinSymbol,
        this.data.coinImage,
        parseFloat(quantity),
        parseFloat(price)
      );

      if (success) {
        this.dialogRef.close({ success: true, type: 'sell', quantity, price });
      } else {
        this.dialogRef.close({ success: false, error: 'Insufficient balance' });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
