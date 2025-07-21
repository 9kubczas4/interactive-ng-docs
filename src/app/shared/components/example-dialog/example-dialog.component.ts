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
  }

  ngOnInit(): void {
    // Listen for query params to control dialog visibility and example selection
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(queryParams => {
      const showDialog = queryParams['dialog'] === 'true';
      const exampleId = queryParams['example'];

      if (showDialog && exampleId) {
        this.openExample(exampleId);
      } else if (showDialog && this.availableExamples().length > 0) {
        // If no specific example, show first one
        this.openExample(this.getExampleId(this.availableExamples()[0].title));
      } else {
        this.isVisible.set(false);
      }
    });
  }

  openExample(exampleId: string): void {
    const examples = this.availableExamples();
    const exampleIndex = examples.findIndex(ex => this.getExampleId(ex.title) === exampleId);
    const example = examples[exampleIndex];

    if (example && exampleIndex !== -1) {
      this.currentExample.set(example);
      this.currentExampleIndex.set(exampleIndex);
      this.dialogTitle.set(`Interactive Example: ${example.title}`);
      this.isVisible.set(true);
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
}
