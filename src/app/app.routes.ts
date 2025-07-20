import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/features/crypto-market/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./shared/features/about.component').then(c => c.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./shared/features/contact.component').then(c => c.ContactComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
