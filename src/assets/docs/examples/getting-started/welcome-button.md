# Welcome Button Example

This example demonstrates a simple interactive button using PrimeNG's button component.

## Features

- **Interactive Feedback**: Shows a success message when clicked
- **Auto-hide**: Message automatically disappears after 3 seconds
- **PrimeNG Integration**: Uses PrimeNG button with icons and styling
- **Signal-based State**: Uses Angular signals for reactive state management

## Template

```html
<p-button label="Welcome!" icon="pi pi-check" severity="success" (click)="showWelcome()" />
@if (showMessage()) {
<p class="mt-2 text-green-600">Welcome to Angular Documentation!</p>
}
```

## Component Logic

```typescript
export class WelcomeButtonExampleComponent {
  showMessage = signal(false);

  showWelcome(): void {
    this.showMessage.set(true);
    setTimeout(() => this.showMessage.set(false), 3000);
  }
}
```

## Key Concepts

- **Signals**: The `showMessage` signal provides reactive state management
- **Event Handling**: Click events trigger the welcome message
- **Conditional Rendering**: Uses `@if` directive to show/hide the message
- **Auto-cleanup**: Timeout ensures the message doesn't stay visible indefinitely

## Use Cases

This pattern is useful for:

- User feedback and confirmations
- Welcome messages and onboarding
- Simple interactive demonstrations
- Success state indicators
