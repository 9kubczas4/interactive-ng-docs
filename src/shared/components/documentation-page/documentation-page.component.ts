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
        <div class="examples-section">
          <h2 class="examples-title">
            <i class="pi pi-code mr-2"></i>
            Interactive Examples
          </h2>
          <app-example-sidebar [examples]="examples()" />
        </div>
      }
    </div>
  `,
  styles: [`
    .documentation-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      min-height: 100%;
    }
    
    .content-area {
      flex: 1;
    }
    
    .examples-section {
      margin-top: 2rem;
    }
    
    .examples-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid;
      border-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1;
      display: flex;
      align-items: center;
      
      i {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    @media (max-width: 768px) {
      .documentation-page {
        gap: 1rem;
      }
      
      .examples-title {
        font-size: 1.25rem;
      }
    }
  `],
  imports: [MarkdownContentComponent, ExampleSidebarComponent]
})
export class DocumentationPageComponent {
  markdownContent = input<string>('');
  examples = input<ExampleItem[]>([]);
} 