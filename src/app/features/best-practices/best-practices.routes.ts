import { Routes } from '@angular/router';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { documentationResolver } from '@core/resolvers/documentation.resolver';

export const bestPracticesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'clean-code',
    pathMatch: 'full',
  },
  {
    path: 'clean-code',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Clean Code Practices',
      markdownPath: 'docs/best-practices/clean-code.md',
      examples: [],
    },
  },
  {
    path: 'component-architecture',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Component Architecture',
      markdownPath: 'docs/best-practices/component-architecture.md',
      examples: [],
    },
  },
  {
    path: 'performance',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver,
    },
    data: {
      title: 'Performance Optimization',
      markdownPath: 'docs/best-practices/performance.md',
      examples: [],
    },
  },
];
