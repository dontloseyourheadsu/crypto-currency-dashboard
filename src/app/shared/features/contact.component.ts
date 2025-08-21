import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="contact-container">
      <div class="header-section">
        <h1 class="page-title">
          <mat-icon class="title-icon">contact_mail</mat-icon>
          Get In Touch
        </h1>
        <p class="page-subtitle">Let's connect and discuss opportunities in the crypto space</p>
      </div>

      <div class="contact-cards">
        <!-- Personal Information Card -->
        <mat-card class="contact-card personal-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar-icon">person</mat-icon>
            <mat-card-title>Personal Information</mat-card-title>
            <mat-card-subtitle>About me</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="contact-item">
              <mat-icon class="contact-icon">account_circle</mat-icon>
              <div class="contact-details">
                <span class="contact-label">Name</span>
                <span class="contact-value">Jesus Alvarez Sombrerero</span>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="contact-item">
              <mat-icon class="contact-icon">location_on</mat-icon>
              <div class="contact-details">
                <span class="contact-label">Location</span>
                <span class="contact-value">Mexico, Puebla</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Contact Methods Card -->
        <mat-card class="contact-card methods-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar-icon">contact_phone</mat-icon>
            <mat-card-title>Contact Methods</mat-card-title>
            <mat-card-subtitle>Ways to reach me</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="contact-item">
              <mat-icon class="contact-icon">email</mat-icon>
              <div class="contact-details">
                <span class="contact-label">Email</span>
                <a href="mailto:jesusalvarez.code4@gmail.com" class="contact-link">
                  jesusalvarez.code4&#64;gmail.com
                </a>
              </div>
              <button mat-icon-button class="action-button" 
                      (click)="copyToClipboard('jesusalvarez.code4@gmail.com')"
                      matTooltip="Copy email">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="contact-item">
              <mat-icon class="contact-icon">phone</mat-icon>
              <div class="contact-details">
                <span class="contact-label">Phone</span>
                <a href="tel:2223237441" class="contact-link">+52 222 323 7441</a>
              </div>
              <button mat-icon-button class="action-button" 
                      (click)="copyToClipboard('2223237441')"
                      matTooltip="Copy phone">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Social Links Card -->
        <mat-card class="contact-card social-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar-icon">public</mat-icon>
            <mat-card-title>Professional Links</mat-card-title>
            <mat-card-subtitle>Connect with me online</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="social-links">
              <a href="https://github.com/dontloseyourheadsu" 
                 target="_blank" 
                 rel="noopener" 
                 class="social-link github-link"
                 matTooltip="Visit my GitHub profile">
                <mat-icon class="social-icon">code</mat-icon>
                <span class="social-text">
                  <span class="social-platform">GitHub</span>
                  <span class="social-handle">&#64;dontloseyourheadsu</span>
                </span>
                <mat-icon class="external-icon">open_in_new</mat-icon>
              </a>
              
              <mat-divider></mat-divider>
              
              <a href="https://www.linkedin.com/in/jesus-as" 
                 target="_blank" 
                 rel="noopener" 
                 class="social-link linkedin-link"
                 matTooltip="Connect on LinkedIn">
                <mat-icon class="social-icon">business</mat-icon>
                <span class="social-text">
                  <span class="social-platform">LinkedIn</span>
                  <span class="social-handle">&#64;jesus-as</span>
                </span>
                <mat-icon class="external-icon">open_in_new</mat-icon>
              </a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <mat-card class="cta-card">
          <mat-card-content>
            <div class="cta-content">
              <mat-icon class="cta-icon">rocket_launch</mat-icon>
              <h3>Ready to Collaborate?</h3>
              <p>I'm always interested in discussing new opportunities, innovative projects, and the future of cryptocurrency technology.</p>
              <div class="cta-buttons">
                <button mat-raised-button 
                        color="primary" 
                        class="cta-button"
                        (click)="openEmailClient()">
                  <mat-icon>send</mat-icon>
                  Send Email
                </button>
                <button mat-stroked-button 
                        color="primary" 
                        class="cta-button"
                        (click)="openLinkedIn()">
                  <mat-icon>business</mat-icon>
                  LinkedIn Message
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary, #333);
    }

    .title-icon {
      font-size: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      color: var(--primary-purple, #8b5cf6);
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary, #666);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .contact-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .contact-card {
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .contact-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-purple-light, #a78bfa);
    }

    .personal-card .avatar-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .methods-card .avatar-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .social-card .avatar-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .avatar-icon {
      color: white !important;
      font-size: 1.5rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
    }

    .contact-icon {
      color: var(--primary-purple, #8b5cf6);
      flex-shrink: 0;
    }

    .contact-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .contact-label {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .contact-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #333);
    }

    .contact-link {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-purple, #8b5cf6);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .contact-link:hover {
      color: var(--primary-purple-dark, #7c3aed);
      text-decoration: underline;
    }

    .action-button {
      color: var(--text-secondary, #666);
      transition: all 0.2s ease;
    }

    .action-button:hover {
      color: var(--primary-purple, #8b5cf6);
      background-color: var(--primary-purple-lighter, #c4b5fd);
    }

    .social-links {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      border-radius: 8px;
    }

    .social-link:hover {
      background-color: var(--bg-secondary, #f5f5f5);
      color: var(--primary-purple, #8b5cf6);
    }

    .social-icon {
      flex-shrink: 0;
    }

    .github-link:hover .social-icon {
      color: #333;
    }

    .linkedin-link:hover .social-icon {
      color: #0077b5;
    }

    .social-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .social-platform {
      font-weight: 600;
      font-size: 1rem;
    }

    .social-handle {
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .external-icon {
      font-size: 1rem !important;
      opacity: 0.6;
    }

    .cta-section {
      margin-top: 3rem;
    }

    .cta-card {
      background: linear-gradient(135deg, var(--primary-purple, #8b5cf6) 0%, var(--primary-purple-dark, #7c3aed) 100%);
      color: white;
    }

    .cta-content {
      text-align: center;
      padding: 2rem 1rem;
    }

    .cta-icon {
      font-size: 3rem !important;
      width: 3rem !important;
      height: 3rem !important;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .cta-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .cta-content p {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-button {
      min-width: 160px;
    }

    mat-divider {
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .contact-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.5rem;
      }

      .contact-cards {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .contact-item {
        flex-wrap: wrap;
      }

      .action-button {
        margin-left: auto;
      }

      .cta-content {
        padding: 1.5rem 0.5rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 1.75rem;
      }

      .contact-item {
        padding: 0.75rem 0;
      }

      .social-link {
        padding: 0.75rem 0;
      }
    }
  `]
})
export class ContactComponent {
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a snackbar notification here
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  openEmailClient(): void {
    window.open('mailto:jesusalvarez.code4@gmail.com?subject=Let\'s Connect!&body=Hi Jesus,%0D%0A%0D%0AI found your contact information on your crypto dashboard and would like to connect.', '_self');
  }

  openLinkedIn(): void {
    window.open('https://www.linkedin.com/in/jesus-as', '_blank', 'noopener');
  }
}
