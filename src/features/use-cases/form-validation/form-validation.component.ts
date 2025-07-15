import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

@Component({
  selector: 'app-form-validation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class FormValidationComponent {
  markdownContent = signal(`
# Form Validation

Form validation ensures data integrity and provides user feedback. Angular offers comprehensive validation features for both reactive and template-driven forms.

## Coming Soon

This section will cover:
- Built-in validators
- Custom validators
- Async validators
- Error handling
- User experience best practices
  `);

  examples = signal<ExampleItem[]>([]);
} 