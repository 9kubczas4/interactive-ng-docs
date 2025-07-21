import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/getting-started',
    pathMatch: 'full',
  },
  {
    path: 'getting-started',
    loadChildren: () =>
      import('./features/getting-started/getting-started.routes').then(r => r.gettingStartedRoutes),
  },
  {
    path: 'patterns',
    loadChildren: () => import('./features/patterns/patterns.routes').then(r => r.patternsRoutes),
  },
  {
    path: 'best-practices',
    loadChildren: () =>
      import('./features/best-practices/best-practices.routes').then(r => r.bestPracticesRoutes),
  },
  {
    path: 'a11y',
    loadChildren: () => import('./features/a11y/a11y.routes').then(r => r.a11yRoutes),
  },
  {
    path: '**',
    redirectTo: '/getting-started',
  },
];
