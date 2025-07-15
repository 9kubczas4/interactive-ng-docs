import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MarkdownContentComponent } from '../markdown-content/markdown-content.component';
import { ExampleSidebarComponent, ExampleItem } from '../example-sidebar/example-sidebar.component';

@Component({
  selector: 'app-documentation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documentation-page">
      <div class="content-area">
        <app-markdown-content [markdown]="markdownContent()" />
      </div>
      
      @if (examples().length > 0) {
        <div class="example-sidebar">
          <app-example-sidebar [examples]="examples()" />
        </div>
      }
    </div>
  `,
  styles: [`
    .documentation-page {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
      height: 100%;
    }
    
    .content-area {
      overflow-y: auto;
    }
    
    .example-sidebar {
      border-left: 1px solid #dee2e6;
      padding-left: 1rem;
      overflow-y: auto;
    }
    
    @media (max-width: 1024px) {
      .documentation-page {
        grid-template-columns: 1fr;
      }
      
      .example-sidebar {
        display: none;
      }
    }
  `],
  imports: [MarkdownContentComponent, ExampleSidebarComponent]
})
export class DocumentationPageComponent {
  markdownContent = input<string>('');
  examples = input<ExampleItem[]>([]);
} 