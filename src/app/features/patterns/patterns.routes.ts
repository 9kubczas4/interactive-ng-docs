import { Routes } from '@angular/router';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { documentationResolver } from '@core/resolvers/documentation.resolver';

export const patternsRoutes: Routes = [
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
      markdownPath: 'docs/patterns/discard-changes.md',
      examples: [
        {
          title: 'Basic Discard Pattern',
          description: 'Simple form with discard functionality',
          component: () =>
            import('@features/patterns/discard-changes/basic-discard-example.component').then(
              m => m.BasicDiscardExampleComponent
            ),
          markdownPath: 'docs/examples/patterns/basic-discard-pattern.md',
          category: 'bad-example',
        },
        {
          title: 'Confirmation Dialog',
          description: 'Discard with confirmation dialog',
          component: () =>
            import(
              '@features/patterns/discard-changes/confirmation-discard-example.component'
            ).then(m => m.ConfirmationDiscardExampleComponent),
          markdownPath: 'docs/examples/patterns/confirmation-discard-pattern.md',
          category: 'best-practice',
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
      markdownPath: 'docs/patterns/form-validation.md',
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
      markdownPath: 'docs/patterns/data-loading.md',
      examples: [],
    },
  },
];
