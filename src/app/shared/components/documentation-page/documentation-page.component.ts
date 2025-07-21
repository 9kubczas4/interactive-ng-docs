import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentationPageData } from '@shared/interfaces/documentation-page-data';
import { MarkdownContentComponent } from '@shared/components/markdown-content/markdown-content.component';
import { ExampleSidebarComponent } from '@shared/components/example-sidebar/example-sidebar.component';
import { ExampleDialogComponent } from '@shared/components/example-dialog/example-dialog.component';
import { ExampleDialogService } from '@shared/services/example-dialog.service';
import { TableOfContentsComponent } from '@shared/components/table-of-contents/table-of-contents.component';
import { ButtonModule } from 'primeng/button';

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
  private route = inject(ActivatedRoute);
  private dialogService = inject(ExampleDialogService);

  pageData = signal<DocumentationPageData>({
    title: '',
    markdownContent: '',
    examples: [],
  });

  ngOnInit(): void {
    // Get resolved data from route
    const resolvedData = this.route.snapshot.data['documentationData'] as DocumentationPageData;
    if (resolvedData) {
      this.pageData.set(resolvedData);

      // Set examples in dialog service
      this.dialogService.setExamples(resolvedData.examples);

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
