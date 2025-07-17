import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { DocumentationPageComponent } from 'src/app/shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from 'src/app/shared/components/example-sidebar/example-sidebar.component';
import { WelcomeButtonExampleComponent } from 'src/app/shared/components/examples/welcome-button-example.component';
import { MarkdownService } from 'src/app/core/services/markdown.service';

@Component({
  selector: 'app-getting-started',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent]
})
export class GettingStartedComponent implements OnInit {
  private markdownService = inject(MarkdownService);
  
  markdownContent = signal('');
  
  ngOnInit(): void {
    this.markdownService.loadMarkdownFile('docs/getting-started.md').subscribe(content => {
      this.markdownContent.set(content);
    });
  };

  examples = computed<ExampleItem[]>(() => [
    {
      title: 'Welcome Button',
      description: 'A simple button example',
      component: WelcomeButtonExampleComponent,
      code: `
        <p-button 
          label="Welcome!" 
          icon="pi pi-check" 
          severity="success"
          (click)="showWelcome()"
        />
      `
    }
  ]);
} 