import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-getting-started',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class GettingStartedComponent {
  markdownContent = signal(`
# Getting Started

Welcome to the Interactive Angular Documentation! This documentation system is built with Angular 19 and PrimeNG 19, providing a comprehensive guide to building modern web applications.

## Features

- **Interactive Examples**: Live examples in the sidebar show real components in action
- **Markdown Support**: All content is written in Markdown and rendered as HTML
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Static Site Generation**: Pre-rendered for optimal performance
- **TypeScript**: Full TypeScript support with strict type checking

## Installation

To get started with this documentation system:

\`\`\`bash
npm install
ng serve
\`\`\`

## Project Structure

The project follows a clean architecture with three main folders:

- **core**: Layout components, services, error handlers, and interceptors
- **features**: Lazy-loaded pages with documented use cases
- **shared**: Reusable components, directives, and utilities

## Navigation

Use the sidebar to navigate between different sections:

1. **Getting Started**: This page with basic information
2. **Components**: Documentation for UI components
3. **Use Cases**: Real-world examples and patterns

## Contributing

Feel free to contribute to this documentation by adding new examples or improving existing content.
  `);

  examples = signal<ExampleItem[]>([
    {
      title: 'Welcome Button',
      description: 'A simple button example',
      component: WelcomeButtonComponent,
      code: `
<p-button 
  label="Welcome!" 
  icon="pi pi-check" 
  severity="success"
  (click)="showWelcome()"
/>
      `
    }
  ]);
}

@Component({
  selector: 'app-welcome-button',
  template: `
    <p-button 
      label="Welcome!" 
      icon="pi pi-check" 
      severity="success"
      (click)="showWelcome()"
    />
    @if (showMessage()) {
      <p class="mt-2 text-green-600">Welcome to Angular Documentation!</p>
    }
  `,
  imports: [ButtonModule]
})
export class WelcomeButtonComponent {
  showMessage = signal(false);
  
  showWelcome(): void {
    this.showMessage.set(true);
    setTimeout(() => this.showMessage.set(false), 3000);
  }
} 