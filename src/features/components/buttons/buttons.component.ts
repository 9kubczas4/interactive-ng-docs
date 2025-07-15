import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class ButtonsComponent {
  markdownContent = signal(`
# Buttons

Buttons are essential UI elements that trigger actions when clicked. PrimeNG provides a comprehensive button component with various styles and configurations.

## Basic Usage

The basic button component is simple to use:

\`\`\`typescript
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule]
})
export class MyComponent {}
\`\`\`

\`\`\`html
<p-button label="Click me" />
\`\`\`

## Button Variants

PrimeNG buttons support different severities:

- **Primary**: The main action button
- **Secondary**: Alternative actions
- **Success**: Positive actions
- **Info**: Informational actions
- **Warning**: Cautionary actions
- **Danger**: Destructive actions

## Icons

Buttons can include icons from PrimeIcons:

\`\`\`html
<p-button icon="pi pi-check" label="Save" />
<p-button icon="pi pi-times" label="Cancel" severity="secondary" />
\`\`\`

## Sizes

Buttons come in different sizes:

- **Small**: Compact buttons for tight spaces
- **Normal**: Default size
- **Large**: Prominent buttons for key actions

## Best Practices

1. Use descriptive labels that clearly indicate the action
2. Choose appropriate severity levels
3. Include icons for better visual recognition
4. Ensure proper spacing between buttons
5. Use consistent button sizing within the same context
  `);

  examples = signal<ExampleItem[]>([
    {
      title: 'Basic Button',
      description: 'A simple primary button',
      component: BasicButtonExampleComponent,
      code: `<p-button label="Click me" />`
    },
    {
      title: 'Button Severities',
      description: 'Different button types',
      component: ButtonSeveritiesExampleComponent,
      code: `
<p-button label="Primary" />
<p-button label="Secondary" severity="secondary" />
<p-button label="Success" severity="success" />
<p-button label="Danger" severity="danger" />
      `
    },
    {
      title: 'Icon Buttons',
      description: 'Buttons with icons',
      component: IconButtonsExampleComponent,
      code: `
<p-button icon="pi pi-check" label="Save" />
<p-button icon="pi pi-times" label="Cancel" severity="secondary" />
<p-button icon="pi pi-search" />
      `
    }
  ]);
}

@Component({
  selector: 'app-basic-button-example',
  template: `
    <p-button label="Click me" (click)="handleClick()" />
    @if (clicked()) {
      <p class="mt-2 text-blue-600">Button clicked!</p>
    }
  `,
  imports: [ButtonModule]
})
export class BasicButtonExampleComponent {
  clicked = signal(false);
  
  handleClick(): void {
    this.clicked.set(true);
    setTimeout(() => this.clicked.set(false), 2000);
  }
}

@Component({
  selector: 'app-button-severities-example',
  template: `
    <div class="flex gap-2 flex-wrap">
      <p-button label="Primary" />
      <p-button label="Secondary" severity="secondary" />
      <p-button label="Success" severity="success" />
      <p-button label="Info" severity="info" />
      <p-button label="Warning" severity="warn" />
      <p-button label="Danger" severity="danger" />
    </div>
  `,
  imports: [ButtonModule]
})
export class ButtonSeveritiesExampleComponent {}

@Component({
  selector: 'app-icon-buttons-example',
  template: `
    <div class="flex gap-2 flex-wrap">
      <p-button icon="pi pi-check" label="Save" />
      <p-button icon="pi pi-times" label="Cancel" severity="secondary" />
      <p-button icon="pi pi-search" />
      <p-button icon="pi pi-download" label="Download" severity="success" />
    </div>
  `,
  imports: [ButtonModule]
})
export class IconButtonsExampleComponent {} 