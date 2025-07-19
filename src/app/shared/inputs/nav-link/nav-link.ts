import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

export type NavLinkVariant = 'primary' | 'secondary' | 'accent' | 'muted';
export type NavLinkSize = 'sm' | 'base' | 'lg';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav-link.html',
  styleUrl: './nav-link.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavLink {
  // Visual properties
  @Input() variant: NavLinkVariant = 'primary';
  @Input() size: NavLinkSize = 'base';
  
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
      'nav-link',
      `nav-link--${this.variant}`,
      `nav-link--${this.size}`
    ];

    if (this.disabled) {
      classes.push('nav-link--disabled');
    }

    return classes.join(' ');
  }
}
