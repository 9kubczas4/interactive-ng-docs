# Confirmation Discard Pattern Example

This example demonstrates a secure form discard pattern with user confirmation dialog to prevent accidental data loss.

## Features

- **Confirmation Dialog**: Prevents accidental data loss with user confirmation
- **Form State Tracking**: Monitors form dirty state for enabling discard functionality
- **Success Feedback**: Shows confirmation message after successful discard
- **PrimeNG Integration**: Uses PrimeNG ConfirmationService and ConfirmDialog

## Template

```html
<form [formGroup]="form" class="flex flex-column gap-3">
  <div class="field">
    <label for="title">Title</label>
    <input id="title" pInputText formControlName="title" class="w-full" />
  </div>
  <div class="field">
    <label for="content">Content</label>
    <textarea
      id="content"
      pInputTextarea
      formControlName="content"
      class="w-full"
      rows="4"
    ></textarea>
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
```

## Component Logic

```typescript
export class ConfirmationDiscardExampleComponent {
  private fb = new FormBuilder();
  private confirmationService = inject(ConfirmationService);
  private originalValue = { title: 'Sample Article', content: 'This is sample content...' };

  discarded = signal(false);

  form = this.fb.group({
    title: [this.originalValue.title, Validators.required],
    content: [this.originalValue.content],
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
      },
    });
  }
}
```

## Key Concepts

- **User Confirmation**: Prevents accidental data loss with confirmation dialog
- **Service Integration**: Uses PrimeNG ConfirmationService for dialog management
- **Visual Feedback**: Success message with auto-hide functionality
- **Error Prevention**: Clear warning about irreversible action

## Configuration Options

The confirmation dialog supports various customization options:

```typescript
this.confirmationService.confirm({
  message: 'Custom warning message',
  header: 'Dialog Title',
  icon: 'pi pi-exclamation-triangle',
  acceptButtonStyleClass: 'p-button-danger',
  rejectButtonStyleClass: 'p-button-secondary',
  accept: () => {
    /* Discard logic */
  },
  reject: () => {
    /* Optional cancel logic */
  },
});
```

## Use Cases

This pattern is essential for:

- **Critical Forms**: Important data that shouldn't be lost accidentally
- **Long Forms**: Complex forms with significant user investment
- **Production Applications**: Where data integrity is crucial
- **User-Generated Content**: Blog posts, articles, reports

## Best Practices

- **Clear Messaging**: Explicitly state consequences of the action
- **Visual Hierarchy**: Use danger styling for destructive actions
- **Accessibility**: Provide clear focus management and screen reader support
- **Consistent UX**: Use the same pattern across the application

## Security Considerations

- **Data Protection**: Prevents accidental data loss
- **User Intent**: Confirms deliberate user action
- **Audit Trail**: Can be extended to log discard actions if needed
