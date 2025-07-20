import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  imports: [MatCardModule],
  template: `
    <div class="page-container">
      <h1>About TiempoDeCrypto</h1>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Our Mission</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            TiempoDeCrypto is a comprehensive cryptocurrency dashboard that provides 
            real-time market data, price tracking, and analysis tools for crypto enthusiasts 
            and traders.
          </p>
          <p>
            Built with Angular and Material Design, our platform offers a responsive 
            and user-friendly experience across all devices.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: var(--text-primary, #333);
    }

    mat-card {
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }
    }
  `]
})
export class AboutComponent {
}
