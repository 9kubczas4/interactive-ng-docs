import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { DocumentationPageComponent } from 'src/app/shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from 'src/app/shared/components/example-sidebar/example-sidebar.component';
import { BasicDiscardExampleComponent } from 'src/app/shared/components/examples/basic-discard-example.component';
import { ConfirmationDiscardExampleComponent } from 'src/app/shared/components/examples/confirmation-discard-example.component';
import { ConfirmationService } from 'primeng/api';
import { MarkdownService } from 'src/app/core/services/markdown.service';

@Component({
  selector: 'app-discard-changes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-documentation-page
      [markdownContent]="markdownContent()"
      [examples]="examples()"
    />
  `,
  imports: [DocumentationPageComponent],
  providers: [ConfirmationService]
})
export class DiscardChangesComponent implements OnInit {
  private markdownService = inject(MarkdownService);
  
  markdownContent = signal('');
  
  ngOnInit(): void {
    this.markdownService.loadMarkdownFile('docs/use-cases/discard-changes.md').subscribe(content => {
      this.markdownContent.set(content);
    });
  };

  examples = computed<ExampleItem[]>(() => [
    {
      title: 'Basic Discard Pattern',
      description: 'Simple form with discard functionality',
      component: BasicDiscardExampleComponent,
      code: `
<form [formGroup]="form">
  <input pInputText formControlName="name" />
  <button pButton (click)="discardChanges()" [disabled]="!form.dirty">
    Discard Changes
  </button>
</form>
      `
    },
    {
      title: 'Confirmation Dialog',
      description: 'Discard with confirmation dialog',
      component: ConfirmationDiscardExampleComponent,
      code: `
discardChanges(): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to discard your changes?',
    accept: () => this.resetForm()
  });
}
      `
    }
  ]);
} 