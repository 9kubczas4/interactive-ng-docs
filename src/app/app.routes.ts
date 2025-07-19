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
    path: 'use-cases',
    loadChildren: () => import('./features/use-cases/use-cases.routes').then(r => r.useCasesRoutes),
  },
  {
    path: '**',
    redirectTo: '/getting-started',
  },
];
