import { Routes } from '@angular/router';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { documentationResolver } from '@core/resolvers/documentation.resolver';

export const a11yRoutes: Routes = [
  {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full',
  },
  {
    path: 'introduction',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Accessibility Introduction',
      markdownPath: 'docs/a11y/introduction.md',
      examples: [],
    },
  },
  {
    path: 'wcag-guidelines',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'WCAG Guidelines',
      markdownPath: 'docs/a11y/wcag-guidelines.md',
      examples: [],
    },
  },
  {
    path: 'testing',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Accessibility Testing',
      markdownPath: 'docs/a11y/testing.md',
      examples: [],
    },
  },
];
