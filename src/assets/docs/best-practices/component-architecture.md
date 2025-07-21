# Component Architecture

## Overview

Good component architecture is the foundation of maintainable Angular applications. It involves organizing components in a logical, scalable way that promotes reusability and testability.

## Component Types

### 1. Smart Components (Containers)

- Manage state and business logic
- Communicate with services
- Pass data to presentational components
- Handle user interactions

### 2. Dumb Components (Presentational)

- Display data received via `@Input()`
- Emit events via `@Output()`
- No direct service dependencies
- Highly reusable

### 3. Layout Components

- Define page structure
- Handle responsive design
- Manage common UI elements (header, footer, sidebar)

## Best Practices

### Component Design

- **Single Responsibility** - One component, one purpose
- **Small and Focused** - Keep components under 400 lines
- **Immutable Data** - Use `OnPush` change detection
- **Composition over Inheritance** - Favor component composition

### Input/Output Design

```typescript
// Good: Clear, specific inputs
@Input() userName: string;
@Input() isLoggedIn: boolean;
@Output() userSelected = new EventEmitter<User>();

// Bad: Generic, unclear inputs
@Input() data: any;
@Input() config: object;
```

### Component Communication

1. **Parent to Child** - Use `@Input()`
2. **Child to Parent** - Use `@Output()` and EventEmitter
3. **Sibling Components** - Use shared service or state management
4. **Distant Components** - Use state management (NgRx, Akita)

## Angular 19+ Features

### Signals

```typescript
@Component({
  // ...
})
export class UserComponent {
  user = input.required<User>();
  isSelected = input<boolean>(false);

  userClicked = output<User>();
}
```

### Control Flow

```html
@if (user(); as u) {
<div class="user-card">{{ u.name }}</div>
} @for (user of users(); track user.id) {
<app-user-card [user]="user" />
}
```

## Component Organization

### File Structure

```
src/app/
├── core/          # Singleton services, guards
├── shared/        # Reusable components, pipes, directives
├── features/      # Feature modules
└── layout/        # Layout components
```

### Feature Structure

```
feature/
├── components/    # Feature-specific components
├── services/      # Feature services
├── models/        # TypeScript interfaces
└── feature.routes.ts
```

## Performance Considerations

- Use `OnPush` change detection strategy
- Implement `TrackByFunction` for `*ngFor`
- Lazy load feature modules
- Minimize component tree depth
- Use async pipe for observables

## Testing Strategy

- Unit test components in isolation
- Test component inputs and outputs
- Mock external dependencies
- Use Angular Testing Utilities
- Test accessibility features
