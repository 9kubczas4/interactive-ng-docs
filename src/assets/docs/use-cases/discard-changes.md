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

```typescript
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
```

### 2. Form State Management

Keep track of the original state to enable proper reset functionality:

```typescript
export class MyComponent {
  private originalFormValue: any;
  
  ngOnInit(): void {
    this.originalFormValue = this.form.value;
  }
  
  resetForm(): void {
    this.form.patchValue(this.originalFormValue);
  }
}
```

### 3. Dirty State Detection

Detect when the form has been modified to show/hide the discard button:

```typescript
get hasChanges(): boolean {
  return this.form.dirty;
}
```

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