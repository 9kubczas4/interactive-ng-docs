import { Routes } from '@angular/router';

export const useCasesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'discard-changes',
    pathMatch: 'full'
  },
  {
    path: 'discard-changes',
    loadComponent: () => import('./discard-changes/discard-changes.component').then(c => c.DiscardChangesComponent)
  },
  {
    path: 'form-validation',
    loadComponent: () => import('./form-validation/form-validation.component').then(c => c.FormValidationComponent)
  },
  {
    path: 'data-loading',
    loadComponent: () => import('./data-loading/data-loading.component').then(c => c.DataLoadingComponent)
  }
]; 