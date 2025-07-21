import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  DestroyRef,
  computed,
  effect,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

import { ExampleDialogService } from '@shared/services/example-dialog.service';
import { MarkdownService } from '@shared/services/markdown.service';
import { MarkdownContentComponent } from '@shared/components/markdown-content/markdown-content.component';

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
  selector: 'app-example-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example-dialog.component.html',
  styleUrls: ['./example-dialog.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    AccordionModule,
    TooltipModule,
    CardModule,
    ChipModule,
    CommonModule,
    MarkdownContentComponent,
  ],
})
export class ExampleDialogComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(ExampleDialogService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly markdownService = inject(MarkdownService);

  readonly isVisible = signal(false);
  readonly currentExample = signal<LoadedExampleItem | null>(null);
  readonly currentExampleIndex = signal(0);
  readonly dialogTitle = signal('Interactive Example');

  private readonly loadedExamples = signal<LoadedExampleItem[]>([]);
  private readonly queryParams = signal<{ dialog?: string; example?: string }>({});

  readonly availableExamples = computed(() => this.loadedExamples());

  constructor() {
    // Effect to load components when examples change
    effect(async () => {
      const rawExamples = this.dialogService.examples();

      // Initialize loaded examples with loading state
      const loadedItems: LoadedExampleItem[] = rawExamples.map(example => ({
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
      for (let i = 0; i < rawExamples.length; i++) {
        try {
          // Load component
          const componentClass = await rawExamples[i].component();

          // Load markdown if path is provided
          let markdownContent = '';
          if (rawExamples[i].markdownPath) {
            try {
              markdownContent =
                (await this.markdownService
                  .loadMarkdownFile(rawExamples[i].markdownPath!)
                  .toPromise()) || '';
            } catch (markdownError) {
              console.error(
                `Failed to load markdown for example: ${rawExamples[i].title}`,
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
          console.error(`Failed to load component for example: ${rawExamples[i].title}`, error);

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

    // Effect to handle dialog opening when both examples are loaded and query params indicate dialog should be shown
    effect(() => {
      const examples = this.availableExamples();
      const params = this.queryParams();
      const showDialog = params.dialog === 'true';
      const exampleId = params.example;

      // Only proceed if examples are loaded (not empty array with all loading: true)
      const hasLoadedExamples = examples.length > 0 && examples.some(ex => !ex.loading);
      // Also check if we have examples from the service (not just an empty array)
      const hasExamplesFromService = this.dialogService.examples().length > 0;

      if (showDialog && hasLoadedExamples && hasExamplesFromService) {
        // Add small delay to ensure UI is ready
        setTimeout(() => {
          if (exampleId) {
            this.openExample(exampleId);
          } else {
            // If no specific example, show first non-loading one
            const firstLoadedExample = examples.find(ex => !ex.loading);
            if (firstLoadedExample) {
              this.openExample(this.getExampleId(firstLoadedExample.title));
            }
          }
        }, 50);
      } else if (!showDialog) {
        this.isVisible.set(false);
      }
    });
  }

  ngOnInit(): void {
    // Initialize with current query params (handles page refresh case)
    const currentQueryParams = this.route.snapshot.queryParams;
    this.queryParams.set({
      dialog: currentQueryParams['dialog'],
      example: currentQueryParams['example'],
    });

    // Listen for query params changes and store them in signal for the effect to react to
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(queryParams => {
      this.queryParams.set({
        dialog: queryParams['dialog'],
        example: queryParams['example'],
      });
    });
  }

  openExample(exampleId: string): void {
    const examples = this.availableExamples();
    const exampleIndex = examples.findIndex(ex => this.getExampleId(ex.title) === exampleId);
    const example = examples[exampleIndex];

    if (example && exampleIndex !== -1 && !example.loading) {
      this.currentExample.set(example);
      this.currentExampleIndex.set(exampleIndex);
      this.dialogTitle.set(`Interactive Example: ${example.title}`);
      this.isVisible.set(true);
    } else if (example && example.loading) {
      // If example is still loading, retry after a short delay
      setTimeout(() => {
        this.openExample(exampleId);
      }, 100);
    }
  }

  navigateToPrevious(): void {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }

  navigateToNext(): void {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();

    if (currentIndex < examples.length - 1) {
      const newIndex = currentIndex + 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }

  closeDialog(): void {
    this.isVisible.set(false);
    this.currentExample.set(null);
    this.currentExampleIndex.set(0);
    this.dialogService.closeExample();
  }

  private getExampleId(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private setCurrentExample(example: LoadedExampleItem, index: number): void {
    this.currentExample.set(example);
    this.currentExampleIndex.set(index);
    this.dialogTitle.set(`Interactive Example: ${example.title}`);

    // Update URL to reflect current example
    const exampleId = this.getExampleId(example.title);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { dialog: 'true', example: exampleId },
      queryParamsHandling: 'merge',
    });
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
