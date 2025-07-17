import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/getting-started',
    pathMatch: 'full'
  },
  {
    path: 'getting-started',
    loadComponent: () => import('src/app/features/getting-started/getting-started.component').then(c => c.GettingStartedComponent)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('src/app/features/use-cases/use-cases.routes').then(r => r.useCasesRoutes)
  },
  {
    path: '**',
    redirectTo: '/getting-started'
  }
]; 