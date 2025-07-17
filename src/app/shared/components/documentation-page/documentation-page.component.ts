import { Component, ChangeDetectionStrategy, input, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownContentComponent } from '../markdown-content/markdown-content.component';
import { ExampleSidebarComponent, ExampleItem } from '../example-sidebar/example-sidebar.component';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';
import { ExampleDialogService } from '../../services/example-dialog.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-documentation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './documentation-page.component.html',
  styleUrls: ['./documentation-page.component.scss'],
  imports: [MarkdownContentComponent, ExampleSidebarComponent, ExampleDialogComponent, ButtonModule]
})
export class DocumentationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(ExampleDialogService);
  
  readonly markdownContent = input<string>('');
  readonly examples = input<ExampleItem[]>([]);
  
  constructor() {
    // Watch for changes in examples and update dialog service
    effect(() => {
      const examples = this.examples();
      this.dialogService.setExamples(examples);
    });
  }
  
  ngOnInit(): void {
    // Set current route for dialog service
    const currentPath = this.route.snapshot.url.join('/');
    this.dialogService.setCurrentRoute(currentPath || '');
  }
  
  openExamplesDialog(): void {
    if (this.examples().length > 0) {
      this.dialogService.openExample(this.examples()[0].title);
    }
  }
} 