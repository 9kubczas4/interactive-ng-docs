import { Routes } from '@angular/router';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { documentationResolver } from '@core/resolvers/documentation.resolver';

export const useCasesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'discard-changes',
    pathMatch: 'full',
  },
  {
    path: 'discard-changes',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Discard Changes Pattern',
      markdownPath: 'docs/use-cases/discard-changes.md',
      breadcrumbs: ['Documentation', 'Use Cases', 'Discard Changes'],
      examples: [
        {
          title: 'Basic Discard Pattern',
          description: 'Simple form with discard functionality',
          component: () =>
            import('@features/use-cases/discard-changes/basic-discard-example.component').then(
              m => m.BasicDiscardExampleComponent
            ),
          code: `<form [formGroup]="form">
  <input pInputText formControlName="name" />
  <button pButton (click)="discardChanges()" [disabled]="!form.dirty">
    Discard Changes
  </button>
</form>`,
        },
        {
          title: 'Confirmation Dialog',
          description: 'Discard with confirmation dialog',
          component: () =>
            import(
              '@features/use-cases/discard-changes/confirmation-discard-example.component'
            ).then(m => m.ConfirmationDiscardExampleComponent),
          code: `discardChanges(): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to discard your changes?',
    accept: () => this.resetForm()
  });
}`,
        },
      ],
    },
  },
  {
    path: 'form-validation',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Form Validation',
      markdownPath: 'docs/use-cases/form-validation.md',
      breadcrumbs: ['Documentation', 'Use Cases', 'Form Validation'],
      examples: [],
    },
  },
  {
    path: 'data-loading',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Data Loading Patterns',
      markdownPath: 'docs/use-cases/data-loading.md',
      breadcrumbs: ['Documentation', 'Use Cases', 'Data Loading'],
      examples: [],
    },
  },
];
