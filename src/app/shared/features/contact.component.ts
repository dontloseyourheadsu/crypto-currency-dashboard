import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="page-container">
      <h1>Contact Us</h1>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Get in Touch</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Message</mat-label>
              <textarea matInput rows="5" formControlName="message" required></textarea>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.valid">
              Send Message
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: var(--text-primary, #333);
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    button {
      align-self: flex-start;
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you would typically send the form data to a backend service
      alert('Thank you for your message! We will get back to you soon.');
      this.contactForm.reset();
    }
  }
}
