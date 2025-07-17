import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { DocumentationPageComponent } from 'src/app/shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from 'src/app/shared/components/example-sidebar/example-sidebar.component';
import { MarkdownService } from 'src/app/core/services/markdown.service';

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
export class FormValidationComponent implements OnInit {
  private markdownService = inject(MarkdownService);
  
  markdownContent = signal('');
  
  ngOnInit(): void {
    this.markdownService.loadMarkdownFile('docs/use-cases/form-validation.md').subscribe(content => {
      this.markdownContent.set(content);
    });
  }

  examples = signal<ExampleItem[]>([]);
} 