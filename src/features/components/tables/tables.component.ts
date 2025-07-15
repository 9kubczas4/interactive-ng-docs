import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

@Component({
  selector: 'app-tables',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class TablesComponent {
  markdownContent = signal(`
# Tables

Tables are used to display structured data in rows and columns. PrimeNG provides powerful table components with sorting, filtering, and pagination.

## Coming Soon

This section will cover:
- Basic table usage
- Sorting and filtering
- Pagination
- Row selection
- Virtual scrolling
- Accessibility features
  `);

  examples = signal<ExampleItem[]>([]);
} 