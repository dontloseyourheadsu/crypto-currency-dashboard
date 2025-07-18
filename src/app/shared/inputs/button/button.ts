import { Component, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  @Output() clicked = new EventEmitter<Event>();

  @HostBinding('class') get cssClasses(): string {
    const classes = ['btn'];
    
    // Add variant class
    classes.push(`btn-${this.variant}`);
    
    // Add size class (only if not medium)
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    
    return classes.join(' ');
  }

  @HostBinding('attr.disabled') get isDisabled(): boolean | null {
    return this.disabled ? true : null;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
