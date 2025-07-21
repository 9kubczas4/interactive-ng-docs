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
import { ChipModule } from 'primeng/chip';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MarkdownService } from '@shared/services/markdown.service';
import { MarkdownContentComponent } from '@shared/components/markdown-content/markdown-content.component';
import { ExampleDialogService } from '@shared/services/example-dialog.service';

export interface ExampleItem {
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
  markdownPath?: string;
  category?: 'best-practice' | 'bad-example';
}

interface LoadedExampleItem {
  title: string;
  description?: string;
  component: Type<unknown> | null;
  loading: boolean;
  markdownPath?: string;
  markdownContent?: string;
  category?: 'best-practice' | 'bad-example';
}

@Component({
  selector: 'app-example-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example-sidebar.component.html',
  styleUrls: ['./example-sidebar.component.scss'],
  imports: [
    CommonModule,
    AccordionModule,
    CardModule,
    ChipModule,
    ButtonModule,
    TooltipModule,
    MarkdownContentComponent,
  ],
})
export class ExampleSidebarComponent {
  private readonly markdownService = inject(MarkdownService);
  private readonly dialogService = inject(ExampleDialogService);

  readonly examples = input<ExampleItem[]>([]);
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
        markdownPath: example.markdownPath,
        markdownContent: '',
        category: example.category,
      }));

      this.loadedExamples.set(loadedItems);

      // Load each component and markdown
      for (let i = 0; i < currentExamples.length; i++) {
        try {
          // Load component
          const componentClass = await currentExamples[i].component();

          // Load markdown if path is provided
          let markdownContent = '';
          if (currentExamples[i].markdownPath) {
            try {
              markdownContent =
                (await this.markdownService
                  .loadMarkdownFile(currentExamples[i].markdownPath!)
                  .toPromise()) || '';
            } catch (markdownError) {
              console.error(
                `Failed to load markdown for example: ${currentExamples[i].title}`,
                markdownError
              );
              markdownContent = 'Failed to load example documentation.';
            }
          }

          // Update the specific item
          const currentLoaded = this.loadedExamples();
          const updatedLoaded = [...currentLoaded];
          updatedLoaded[i] = {
            ...updatedLoaded[i],
            component: componentClass,
            markdownContent,
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

  openExampleInDialog(exampleTitle: string, event: Event): void {
    event.stopPropagation(); // Prevent accordion toggle
    this.dialogService.openExample(exampleTitle);
  }

  getCategoryLabel(category?: 'best-practice' | 'bad-example'): string {
    switch (category) {
      case 'best-practice':
        return 'Best Practice';
      case 'bad-example':
        return 'Bad Example';
      default:
        return '';
    }
  }

  getCategoryClass(category?: 'best-practice' | 'bad-example'): string {
    switch (category) {
      case 'best-practice':
        return 'best-practice-chip';
      case 'bad-example':
        return 'bad-example-chip';
      default:
        return '';
    }
  }
}
