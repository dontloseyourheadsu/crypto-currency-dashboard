import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section class="contact-section" style="max-width: 500px; margin: 2rem auto; padding: 2rem; background: var(--bg-card, #23234a); border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.15); color: var(--text-primary, #fff);">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem; font-weight: 600;">Contact</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 1rem;">
          <strong>GitHub:</strong>
          <a href="https://github.com/dontloseyourheadsu" target="_blank" rel="noopener" style="color: var(--secondary-blue, #3b82f6); text-decoration: underline;">dontloseyourheadsu</a>
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>LinkedIn:</strong>
          <a href="https://www.linkedin.com/in/jesus-as" target="_blank" rel="noopener" style="color: var(--secondary-blue, #3b82f6); text-decoration: underline;">jesus-as</a>
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Email:</strong>
          <a href="mailto:jesusalvarez.code4@gmail.com" style="color: var(--secondary-blue, #3b82f6); text-decoration: underline;">jesusalvarez.code4@gmail.com</a>
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Location:</strong> Mexico, Puebla
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Name:</strong> Jesus Alvarez Sombrerero
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Phone:</strong> <a href="tel:2223237441" style="color: var(--secondary-blue, #3b82f6); text-decoration: underline;">2223237441</a>
        </li>
      </ul>
    </section>
  `
})
export class ContactComponent {}
