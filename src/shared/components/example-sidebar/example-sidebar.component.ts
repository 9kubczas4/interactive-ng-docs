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
  styleUrls: ['./example-sidebar.component.scss'],
  imports: [CommonModule, AccordionModule, CardModule]
})
export class ExampleSidebarComponent {
  examples = input<ExampleItem[]>([]);
} 