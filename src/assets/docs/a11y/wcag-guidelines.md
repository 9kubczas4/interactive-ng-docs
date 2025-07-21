# WCAG Guidelines

## Web Content Accessibility Guidelines (WCAG) 2.1

WCAG provides comprehensive guidelines for making web content accessible to people with disabilities. The guidelines are organized around four main principles:

## The Four Principles

### 1. Perceivable

Information and UI components must be presentable to users in ways they can perceive.

#### 1.1 Text Alternatives

Provide text alternatives for non-text content.

```html
<!-- Good -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2" />

<!-- Bad -->
<img src="chart.png" alt="chart" />
```

#### 1.3 Adaptable

Create content that can be presented in different ways without losing meaning.

```html
<!-- Good: Proper heading structure -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Bad: Skipping heading levels -->
<h1>Main Title</h1>
<h4>Section Title</h4>
```

#### 1.4 Distinguishable

Make it easier for users to see and hear content.

```scss
// Good: Sufficient color contrast (4.5:1 for normal text)
.text {
  color: #333333; // Dark gray
  background: #ffffff; // White
}

// Bad: Insufficient contrast
.text {
  color: #999999; // Light gray
  background: #ffffff; // White - only 2.85:1 ratio
}
```

### 2. Operable

UI components and navigation must be operable by all users.

#### 2.1 Keyboard Accessible

Make all functionality available via keyboard.

```typescript
@Component({
  template: `
    <button (click)="toggle()" (keydown.enter)="toggle()" (keydown.space)="toggle()">
      Toggle Menu
    </button>
  `,
})
export class MenuToggleComponent {
  toggle() {
    // Toggle functionality
  }
}
```

#### 2.4 Navigable

Provide ways to help users navigate and find content.

```html
<!-- Good: Skip link for keyboard users -->
<a class="skip-link" href="#main-content">Skip to main content</a>

<nav>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main id="main-content">
  <!-- Main content -->
</main>
```

### 3. Understandable

Information and operation of the UI must be understandable.

#### 3.1 Readable

Make text content readable and understandable.

```html
<!-- Good: Language specified -->
<html lang="en">
  <body>
    <p>English content</p>
    <p lang="es">Contenido en español</p>
  </body>
</html>
```

#### 3.2 Predictable

Make web pages appear and operate in predictable ways.

```typescript
// Good: Consistent navigation order
@Component({
  template: `
    <nav>
      <a routerLink="/home" tabindex="1">Home</a>
      <a routerLink="/about" tabindex="2">About</a>
      <a routerLink="/contact" tabindex="3">Contact</a>
    </nav>
  `
})
```

#### 3.3 Input Assistance

Help users avoid and correct mistakes.

```html
<form>
  <label for="email">Email Address (required)</label>
  <input
    type="email"
    id="email"
    required
    aria-describedby="email-error"
    [attr.aria-invalid]="emailInvalid"
  />
  <div id="email-error" *ngIf="emailInvalid" role="alert">Please enter a valid email address</div>
</form>
```

### 4. Robust

Content must be robust enough to be interpreted by a wide variety of user agents.

#### 4.1 Compatible

Maximize compatibility with assistive technologies.

```html
<!-- Good: Proper ARIA usage -->
<div role="button" tabindex="0" aria-pressed="false" (click)="toggle()">Custom Button</div>

<!-- Better: Use native HTML -->
<button [attr.aria-pressed]="isPressed" (click)="toggle()">Native Button</button>
```

## Conformance Levels

### Level A (Minimum)

- Basic accessibility features
- Essential for any public website

### Level AA (Standard)

- Target level for most websites
- Required for government sites
- Includes enhanced color contrast (4.5:1)

### Level AAA (Enhanced)

- Highest level of accessibility
- Not required for entire sites
- Enhanced color contrast (7:1)

## Angular-Specific Implementation

### CDK A11y Module

```typescript
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  imports: [A11yModule],
  template: `
    <div cdkTrapFocus>
      <!-- Focus trapped content -->
    </div>
  `
})
```

### Form Accessibility

```typescript
@Component({
  template: `
    <form>
      <mat-form-field>
        <mat-label>Username</mat-label>
        <input matInput required aria-describedby="username-hint">
        <mat-hint id="username-hint">Enter your username</mat-hint>
        <mat-error>Username is required</mat-error>
      </mat-form-field>
    </form>
  `
})
```

## Testing Tools

- **axe-core** - Automated accessibility testing
- **Lighthouse** - Built-in browser audits
- **WAVE** - Web accessibility evaluation
- **Screen readers** - Manual testing with NVDA, JAWS, VoiceOver

## Quick Checklist

- [ ] All images have alt text
- [ ] Proper heading structure (h1-h6)
- [ ] Sufficient color contrast
- [ ] Keyboard navigation works
- [ ] Form labels are present
- [ ] Error messages are clear
- [ ] Focus indicators are visible
- [ ] ARIA labels where needed
