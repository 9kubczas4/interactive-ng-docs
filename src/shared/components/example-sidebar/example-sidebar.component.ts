import { Component, ChangeDetectionStrategy, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';

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
                  <div class="code-header">
                    <span class="code-title">Code</span>
                    <p-button 
                      [icon]="copySuccess() ? 'pi pi-check' : 'pi pi-copy'"
                      severity="secondary"
                      size="small"
                      [text]="true"
                      [disabled]="copySuccess()"
                      (onClick)="copyCode(example.code)"
                      [pTooltip]="copySuccess() ? 'Copied!' : 'Copy code'"
                      tooltipPosition="left"
                      class="copy-button"
                    />
                  </div>
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
  imports: [CommonModule, AccordionModule, CardModule, ButtonModule, TooltipModule]
})
export class ExampleSidebarComponent {
  private clipboard = inject(Clipboard);
  
  examples = input<ExampleItem[]>([]);
  copySuccess = signal(false);
  
  copyCode(code: string) {
    const success = this.clipboard.copy(code);
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    }
  }
} 