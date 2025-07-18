import { Routes } from '@angular/router';
import { DocumentationPageComponent } from '../../shared/components/documentation-page/documentation-page.component';
import { documentationResolver } from '../../core/resolvers/documentation.resolver';

// Import example components
import { WelcomeButtonExampleComponent } from './welcome-button-example.component';

export const gettingStartedRoutes: Routes = [
  {
    path: '',
    component: DocumentationPageComponent,
    resolve: {
      documentationData: documentationResolver
    },
    data: {
      title: 'Getting Started',
      markdownPath: 'docs/getting-started.md',
      breadcrumbs: ['Documentation', 'Getting Started'],
      examples: [
        {
          title: 'Welcome Button',
          description: 'A simple button example',
          component: WelcomeButtonExampleComponent,
          code: `<p-button 
  label="Welcome!" 
  icon="pi pi-check" 
  severity="success"
  (click)="showWelcome()"
/>`
        }
      ]
    }
  }
]; 