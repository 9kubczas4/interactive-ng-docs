import { Component, ChangeDetectionStrategy, input, inject, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';

export interface ExampleItem {
  title: string;
  description?: string;
  component: Type<unknown>;
  code?: string;
}

@Component({
  selector: 'app-example-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example-sidebar.component.html',
  styleUrls: ['./example-sidebar.component.scss'],
  imports: [CommonModule, AccordionModule, CardModule, ButtonModule, TooltipModule],
})
export class ExampleSidebarComponent {
  private readonly clipboard = inject(Clipboard);

  readonly examples = input<ExampleItem[]>([]);
  readonly copySuccess = signal(false);

  copyCode(code: string): void {
    const success = this.clipboard.copy(code);
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    }
  }
}
