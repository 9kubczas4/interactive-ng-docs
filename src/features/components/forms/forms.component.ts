import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

@Component({
  selector: 'app-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class FormsComponent {
  markdownContent = signal(`
# Forms

Forms are essential for user input and data collection. Angular provides powerful reactive forms with validation support.

## Coming Soon

This section will cover:
- Reactive forms
- Template-driven forms
- Custom validators
- Form arrays
- Accessibility considerations
  `);

  examples = signal<ExampleItem[]>([]);
} 