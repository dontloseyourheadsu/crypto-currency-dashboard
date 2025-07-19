import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

export type LinkVariant = 'primary' | 'secondary' | 'accent' | 'muted';
export type LinkSize = 'sm' | 'base' | 'lg';

/**
 * Normal Link Component (for inline content links)
 * 
 * @example
 * <app-link variant="primary" routerLink="/details">View Details</app-link>
 * <app-link variant="accent" href="mailto:contact@example.com">Contact Us</app-link>
 */
@Component({
  selector: 'app-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './link.html',
  styleUrl: './link.css',
  encapsulation: ViewEncapsulation.None,
})
export class Link {
  // Visual properties
  @Input() variant: LinkVariant = 'primary';
  @Input() size: LinkSize = 'base';
  
  // Navigation properties
  @Input() routerLink?: string | any[];
  @Input() href?: string;
  @Input() target?: '_blank' | '_self' | '_parent' | '_top';
  
  // Accessibility and state properties
  @Input() disabled: boolean = false;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() role?: string;

  get linkClasses(): string {
    const classes = [
      'link',
      `link--${this.variant}`,
      `link--${this.size}`
    ];

    if (this.disabled) {
      classes.push('link--disabled');
    }

    return classes.join(' ');
  }
}