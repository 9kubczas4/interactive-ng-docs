import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentationPageComponent } from '@shared/components/documentation-page/documentation-page.component';
import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

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
export class DiscardChangesComponent {
  markdownContent = signal(`
# Discard Changes Pattern

The discard changes pattern is a common UX pattern that allows users to abandon their current work and revert to a previous state. This is particularly important in forms and editors where users might want to cancel their changes.

## When to Use

- **Form editing**: When users are editing a form and want to cancel
- **Content creation**: When users are creating content and want to start over
- **Settings changes**: When users modify settings but want to revert
- **Data entry**: When users want to clear their current input

## Implementation Strategies

### 1. Confirmation Dialog

Always ask for confirmation before discarding changes to prevent accidental data loss:

\`\`\`typescript
discardChanges(): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to discard your changes?',
    header: 'Discard Changes',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.resetForm();
    }
  });
}
\`\`\`

### 2. Form State Management

Keep track of the original state to enable proper reset functionality:

\`\`\`typescript
export class MyComponent {
  private originalFormValue: any;
  
  ngOnInit(): void {
    this.originalFormValue = this.form.value;
  }
  
  resetForm(): void {
    this.form.patchValue(this.originalFormValue);
  }
}
\`\`\`

### 3. Dirty State Detection

Detect when the form has been modified to show/hide the discard button:

\`\`\`typescript
get hasChanges(): boolean {
  return this.form.dirty;
}
\`\`\`

## Best Practices

1. **Always confirm**: Never discard changes without user confirmation
2. **Visual feedback**: Show different states (pristine, dirty, saving)
3. **Keyboard shortcuts**: Support Ctrl+Z or Escape for quick discard
4. **Auto-save**: Consider implementing auto-save for critical data
5. **Clear messaging**: Make it clear what will be lost

## Accessibility Considerations

- Use proper ARIA labels for screen readers
- Ensure keyboard navigation works correctly
- Provide clear error messages and confirmations
- Use semantic HTML elements
  `);

  examples = signal<ExampleItem[]>([
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

@Component({
  selector: 'app-basic-discard-example',
  template: `
    <form [formGroup]="form" class="flex flex-column gap-3">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" pInputText formControlName="name" class="w-full" />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" pInputTextarea formControlName="description" class="w-full"></textarea>
      </div>
      <div class="flex gap-2">
        <p-button label="Save" severity="success" />
        <p-button 
          label="Discard Changes" 
          severity="secondary" 
          (click)="discardChanges()" 
          [disabled]="!form.dirty"
        />
      </div>
      @if (form.dirty) {
        <p class="text-orange-600">⚠️ You have unsaved changes</p>
      }
    </form>
  `,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea]
})
export class BasicDiscardExampleComponent {
  private fb = new FormBuilder();
  private originalValue = { name: 'John Doe', description: 'Sample description' };
  
  form = this.fb.group({
    name: [this.originalValue.name, Validators.required],
    description: [this.originalValue.description]
  });
  
  discardChanges(): void {
    this.form.patchValue(this.originalValue);
    this.form.markAsPristine();
  }
}

@Component({
  selector: 'app-confirmation-discard-example',
  template: `
    <form [formGroup]="form" class="flex flex-column gap-3">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" pInputText formControlName="title" class="w-full" />
      </div>
      <div class="field">
        <label for="content">Content</label>
        <textarea id="content" pInputTextarea formControlName="content" class="w-full" rows="4"></textarea>
      </div>
      <div class="flex gap-2">
        <p-button label="Save" severity="success" />
        <p-button 
          label="Discard Changes" 
          severity="danger" 
          (click)="discardChanges()" 
          [disabled]="!form.dirty"
        />
      </div>
      @if (discarded()) {
        <p class="text-green-600">✅ Changes discarded successfully</p>
      }
    </form>
    <p-confirmDialog />
  `,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, ConfirmDialogModule]
})
export class ConfirmationDiscardExampleComponent {
  private fb = new FormBuilder();
  private confirmationService = new ConfirmationService();
  private originalValue = { title: 'Sample Article', content: 'This is sample content...' };
  
  discarded = signal(false);
  
  form = this.fb.group({
    title: [this.originalValue.title, Validators.required],
    content: [this.originalValue.content]
  });
  
  discardChanges(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to discard your changes? This action cannot be undone.',
      header: 'Discard Changes',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.form.patchValue(this.originalValue);
        this.form.markAsPristine();
        this.discarded.set(true);
        setTimeout(() => this.discarded.set(false), 3000);
      }
    });
  }
} 