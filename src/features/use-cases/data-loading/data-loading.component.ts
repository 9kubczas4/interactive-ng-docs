import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

@Component({
  selector: 'app-data-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class DataLoadingComponent {
  markdownContent = signal(`
# Data Loading Patterns

Data loading is a crucial aspect of web applications. This section covers various patterns for loading, caching, and displaying data efficiently.

## Coming Soon

This section will cover:
- Loading states and spinners
- Error handling
- Retry mechanisms
- Caching strategies
- Optimistic updates
- Skeleton screens
  `);

  examples = signal<ExampleItem[]>([]);
} 