import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  signal,
  Type,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';

export interface ExampleItem {
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
  code?: string;
}

interface LoadedExampleItem {
  title: string;
  description?: string;
  component: Type<unknown> | null;
  loading: boolean;
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
  private readonly loadedExamples = signal<LoadedExampleItem[]>([]);

  readonly loadedExamplesComputed = computed(() => this.loadedExamples());

  constructor() {
    // Effect to load components when examples change
    effect(async () => {
      const currentExamples = this.examples();

      // Initialize loaded examples with loading state
      const loadedItems: LoadedExampleItem[] = currentExamples.map(example => ({
        title: example.title,
        description: example.description,
        component: null,
        loading: true,
        code: example.code,
      }));

      this.loadedExamples.set(loadedItems);

      // Load each component
      for (let i = 0; i < currentExamples.length; i++) {
        try {
          const componentClass = await currentExamples[i].component();

          // Update the specific item
          const currentLoaded = this.loadedExamples();
          const updatedLoaded = [...currentLoaded];
          updatedLoaded[i] = {
            ...updatedLoaded[i],
            component: componentClass,
            loading: false,
          };
          this.loadedExamples.set(updatedLoaded);
        } catch (error) {
          console.error(`Failed to load component for example: ${currentExamples[i].title}`, error);

          // Update with error state
          const currentLoaded = this.loadedExamples();
          const updatedLoaded = [...currentLoaded];
          updatedLoaded[i] = {
            ...updatedLoaded[i],
            component: null,
            loading: false,
          };
          this.loadedExamples.set(updatedLoaded);
        }
      }
    });
  }

  copyCode(code: string): void {
    const success = this.clipboard.copy(code);
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    }
  }
}
