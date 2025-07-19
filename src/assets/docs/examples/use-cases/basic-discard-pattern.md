# Basic Discard Pattern Example

This example demonstrates a simple form discard pattern with reactive forms and state management.

## Features

- **Form State Tracking**: Monitors form dirty state to enable/disable discard button
- **Instant Reset**: Restores original form values without confirmation
- **Visual Feedback**: Shows unsaved changes indicator
- **Reactive Forms**: Uses Angular reactive forms with FormBuilder

## Template

```html
<form [formGroup]="form" class="flex flex-column gap-3">
  <div class="field">
    <label for="name">Name</label>
    <input id="name" pInputText formControlName="name" class="w-full" />
  </div>
  <div class="field">
    <label for="description">Description</label>
    <textarea
      id="description"
      pInputTextarea
      formControlName="description"
      class="w-full"
    ></textarea>
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
```

## Component Logic

```typescript
export class BasicDiscardExampleComponent {
  private fb = new FormBuilder();
  private originalValue = { name: 'John Doe', description: 'Sample description' };

  form = this.fb.group({
    name: [this.originalValue.name, Validators.required],
    description: [this.originalValue.description],
  });

  discardChanges(): void {
    this.form.patchValue(this.originalValue);
    this.form.markAsPristine();
  }
}
```

## Key Concepts

- **Form State**: Uses `form.dirty` to track unsaved changes
- **Original Values**: Stores initial values for restoration
- **Immediate Reset**: No confirmation dialog for quick workflow
- **State Management**: `markAsPristine()` resets the dirty state

## Use Cases

This pattern is ideal for:

- Simple forms where quick discard is acceptable
- Development and testing environments
- Forms with auto-save functionality
- Non-critical data entry scenarios

## Considerations

- **No Confirmation**: Changes are lost immediately without warning
- **Simple Workflow**: Best for straightforward use cases
- **Performance**: Fast and responsive user experience
