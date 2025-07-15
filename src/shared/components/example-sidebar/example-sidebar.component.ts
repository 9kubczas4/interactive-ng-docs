import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';

export interface ExampleItem {
  title: string;
  description?: string;
  component: any;
  code?: string;
}

@Component({
  selector: 'app-example-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="example-sidebar">
      <h4 class="mb-3">Live Examples</h4>
      <p-accordion [multiple]="true">
        @for (example of examples(); track example.title) {
          <p-accordionTab [header]="example.title">
            <div class="example-container">
              <div class="example-header">
                {{ example.title }}
              </div>
              <div class="example-content">
                @if (example.description) {
                  <p class="text-600 mb-3">{{ example.description }}</p>
                }
                <ng-container [ngComponentOutlet]="example.component" />
              </div>
              @if (example.code) {
                <div class="example-code">
                  <pre><code>{{ example.code }}</code></pre>
                </div>
              }
            </div>
          </p-accordionTab>
        }
      </p-accordion>
    </div>
  `,
  styles: [`
    .example-sidebar {
      h4 {
        color: #1a202c;
        font-weight: 600;
        margin-bottom: 1rem;
      }
    }
    
    .example-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .example-header {
      font-weight: 600;
      color: #2d3748;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    
    .example-content {
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .example-code {
      background: #1a202c;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      
      pre {
        margin: 0;
        background: none;
        padding: 0;
        border: none;
        box-shadow: none;
        
        code {
          background: none;
          color: #f7fafc;
          border: none;
          padding: 0;
          font-size: 0.9rem;
        }
      }
    }
    
    // Dark mode styles
    :host-context(.dark-mode) {
      .example-sidebar {
        h4 {
          color: #f7fafc;
        }
      }
      
      .example-header {
        color: #f7fafc;
        border-bottom-color: #4a5568;
      }
      
      .example-content {
        background: #2d3748;
        border-color: #4a5568;
        color: #e2e8f0;
      }
      
      .example-code {
        background: #0d1117;
        border: 1px solid #4a5568;
      }
    }
  `],
  imports: [CommonModule, AccordionModule, CardModule]
})
export class ExampleSidebarComponent {
  examples = input<ExampleItem[]>([]);
} 