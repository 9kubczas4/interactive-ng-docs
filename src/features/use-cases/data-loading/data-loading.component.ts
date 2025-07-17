import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';
import { MarkdownService } from '@core/services/markdown.service';

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
export class DataLoadingComponent implements OnInit {
  private markdownService = inject(MarkdownService);
  
  markdownContent = signal('');
  
  ngOnInit(): void {
    this.markdownService.loadMarkdownFile('docs/use-cases/data-loading.md').subscribe(content => {
      this.markdownContent.set(content);
    });
  }

  examples = signal<ExampleItem[]>([]);
} 