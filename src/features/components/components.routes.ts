import { Routes } from '@angular/router';

export const componentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'buttons',
    pathMatch: 'full'
  },
  {
    path: 'buttons',
    loadComponent: () => import('./buttons/buttons.component').then(c => c.ButtonsComponent)
  },
  {
    path: 'forms',
    loadComponent: () => import('./forms/forms.component').then(c => c.FormsComponent)
  },
  {
    path: 'tables',
    loadComponent: () => import('./tables/tables.component').then(c => c.TablesComponent)
  }
]; 