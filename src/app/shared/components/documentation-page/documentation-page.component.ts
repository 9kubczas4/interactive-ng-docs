import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentationPageData } from '@shared/interfaces/documentation-page-data';
import { MarkdownContentComponent } from '@shared/components/markdown-content/markdown-content.component';
import { ExampleSidebarComponent } from '@shared/components/example-sidebar/example-sidebar.component';
import { ExampleDialogComponent } from '@shared/components/example-dialog/example-dialog.component';
import { ExampleDialogService } from '@shared/services/example-dialog.service';
import { TableOfContentsComponent } from '@shared/components/table-of-contents/table-of-contents.component';
import { ButtonModule } from 'primeng/button';
import { NavigationExampleItem } from '@shared/interfaces/example-item';
import { ExampleItemMapper } from '@shared/services/example-item.mapper';

@Component({
  selector: 'app-documentation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './documentation-page.component.html',
  styleUrls: ['./documentation-page.component.scss'],
  imports: [
    MarkdownContentComponent,
    ExampleSidebarComponent,
    ExampleDialogComponent,
    TableOfContentsComponent,
    ButtonModule,
  ],
})
export class DocumentationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(ExampleDialogService);
  private readonly exampleItemMapper = inject(ExampleItemMapper);

  pageData = signal<DocumentationPageData>({
    title: '',
    markdownContent: '',
    examples: [],
  });

  async ngOnInit(): Promise<void> {
    // Get resolved data from route
    const resolvedData = this.route.snapshot.data['documentationData'] as DocumentationPageData;
    const navExamples = this.route.snapshot.data['examples'] as NavigationExampleItem[] | undefined;

    if (resolvedData) {
      if (navExamples && navExamples.length > 0) {
        // Convert NavigationExampleItem[] to ExampleItem[] using the service
        const exampleItems = await Promise.all(
          navExamples.map(item => this.exampleItemMapper.toExampleItem(item))
        );

        const newPageData = { ...resolvedData, examples: exampleItems };
        this.pageData.set(newPageData);
        this.dialogService.setExamples(exampleItems);
      } else {
        // Use examples from resolved data (static)
        this.pageData.set(resolvedData);
        this.dialogService.setExamples(resolvedData.examples);
      }

      // Set current route for dialog service
      const currentPath = this.route.snapshot.url.join('/');
      this.dialogService.setCurrentRoute(currentPath || '');
    }
  }

  openExamplesDialog(): void {
    const examples = this.pageData().examples;
    if (examples.length > 0) {
      this.dialogService.openExample(examples[0].title);
    }
  }
}
