# Accessibility Testing

## Overview

Accessibility testing ensures your Angular application works for all users, including those using assistive technologies. This guide covers automated tools, manual testing techniques, and integration strategies.

## Automated Testing Tools

### 1. axe-core

The most comprehensive automated accessibility testing library.

#### Installation

```bash
npm install --save-dev axe-core @axe-core/playwright
```

#### Basic Usage

```typescript
import { AxeResults, run as axe } from 'axe-core';

// Test a component
async function testComponentAccessibility(element: HTMLElement): Promise<AxeResults> {
  return await axe(element, {
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
    },
  });
}
```

#### Angular Testing Integration

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('UserCardComponent Accessibility', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(() => {
    expect.extend(toHaveNoViolations);
  });

  it('should be accessible', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Lighthouse

Built-in browser accessibility auditing.

#### Command Line

```bash
npm install -g lighthouse
lighthouse http://localhost:4200 --only-categories=accessibility
```

#### Programmatic Usage

```typescript
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

async function runAccessibilityAudit(url: string) {
  const chrome = await launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['accessibility'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  return runnerResult.lhr;
}
```

### 3. ESLint Accessibility Rules

Catch accessibility issues during development.

```json
// .eslintrc.json
{
  "extends": ["@angular-eslint/template/accessibility"],
  "rules": {
    "@angular-eslint/template/alt-text": "error",
    "@angular-eslint/template/elements-content": "error",
    "@angular-eslint/template/label-has-associated-control": "error",
    "@angular-eslint/template/click-events-have-key-events": "error"
  }
}
```

## Manual Testing Techniques

### 1. Keyboard Navigation Testing

Test all functionality using only the keyboard.

#### Key Combinations

- **Tab** - Navigate forward through interactive elements
- **Shift + Tab** - Navigate backward
- **Enter** - Activate buttons and links
- **Space** - Activate buttons, check checkboxes
- **Arrow keys** - Navigate within components (menus, tabs)
- **Escape** - Close dialogs and menus

#### Testing Checklist

```typescript
// Example: Testing a modal component
@Component({
  template: `
    <button (click)="openModal()">Open Modal</button>

    <div *ngIf="isModalOpen" class="modal" cdkTrapFocus role="dialog" aria-labelledby="modal-title">
      <h2 id="modal-title">Modal Title</h2>
      <button (click)="closeModal()" aria-label="Close">×</button>
      <button (click)="save()">Save</button>
    </div>
  `,
})
export class ModalComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
```

**Manual Test Steps:**

1. Tab to "Open Modal" button
2. Press Enter to open
3. Verify focus moves into modal
4. Tab through modal elements
5. Press Escape to close
6. Verify focus returns to trigger button

### 2. Screen Reader Testing

#### Popular Screen Readers

- **NVDA** (Windows) - Free
- **JAWS** (Windows) - Commercial
- **VoiceOver** (macOS) - Built-in
- **Orca** (Linux) - Free

#### VoiceOver Testing (macOS)

```bash
# Enable VoiceOver
Cmd + F5

# Basic navigation
Control + Option + Right Arrow  # Next element
Control + Option + Left Arrow   # Previous element
Control + Option + Space        # Activate element
```

#### Testing Focus Management

```typescript
@Component({
  selector: 'app-search',
  template: `
    <form (submit)="search()">
      <label for="search-input">Search</label>
      <input #searchInput id="search-input" type="text" />
      <button type="submit">Search</button>
    </form>

    <div #results role="region" aria-live="polite" aria-label="Search results">
      <div *ngFor="let result of searchResults">
        {{ result.title }}
      </div>
    </div>
  `,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('results') results!: ElementRef;

  searchResults: any[] = [];

  search() {
    // Perform search
    this.searchResults = this.performSearch();

    // Announce results to screen readers
    this.announceResults();
  }

  private announceResults() {
    const count = this.searchResults.length;
    const announcement = `${count} results found`;

    // Update aria-live region
    this.results.nativeElement.setAttribute('aria-label', announcement);
  }
}
```

### 3. Color and Contrast Testing

#### Browser DevTools

1. Open Chrome DevTools
2. Inspect element with text
3. Look for contrast ratio in Styles panel
4. Aim for 4.5:1 (AA) or 7:1 (AAA)

#### Color Blindness Testing

```css
/* Test with grayscale filter */
.grayscale-test {
  filter: grayscale(100%);
}

/* Simulate color blindness */
.protanopia {
  filter: url('#protanopia-filter');
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build
      - run: npm start &

      - name: Wait for server
        run: npx wait-on http://localhost:4200

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Run axe tests
        run: npm run test:a11y
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:a11y": "ng test --include='**/*.a11y.spec.ts'",
    "lighthouse:a11y": "lighthouse http://localhost:4200 --only-categories=accessibility --output=json --output-path=./accessibility-report.json",
    "axe:audit": "node scripts/axe-audit.js"
  }
}
```

## Common Issues and Solutions

### 1. Missing ARIA Labels

```html
<!-- Problem -->
<button (click)="delete()">🗑️</button>

<!-- Solution -->
<button (click)="delete()" aria-label="Delete item">🗑️</button>
```

### 2. Poor Focus Management

```typescript
// Problem: Modal doesn't trap focus
@Component({
  template: `<div class="modal">...</div>`
})

// Solution: Use CDK focus trap
@Component({
  imports: [A11yModule],
  template: `
    <div class="modal" cdkTrapFocus>
      ...
    </div>
  `
})
```

### 3. Inaccessible Form Errors

```html
<!-- Problem -->
<input [(ngModel)]="email" />
<div *ngIf="emailInvalid">Invalid email</div>

<!-- Solution -->
<input [(ngModel)]="email" aria-describedby="email-error" [attr.aria-invalid]="emailInvalid" />
<div id="email-error" *ngIf="emailInvalid" role="alert">Invalid email address</div>
```

## Testing Strategy

### 1. Unit Tests

- Test ARIA attributes
- Test keyboard interactions
- Test focus management

### 2. Integration Tests

- Test complete user flows
- Test with different assistive technologies
- Test responsive behavior

### 3. E2E Tests

```typescript
// Playwright + axe
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

## Performance Monitoring

Track accessibility metrics in production:

```typescript
// Monitor accessibility violations
function trackA11yViolations() {
  if (typeof window !== 'undefined' && window.axe) {
    window.axe.run().then(results => {
      if (results.violations.length > 0) {
        // Send to analytics
        gtag('event', 'accessibility_violation', {
          violations_count: results.violations.length,
          page_path: window.location.pathname,
        });
      }
    });
  }
}
```

## Best Practices Summary

1. **Automate what you can** - Use axe-core and Lighthouse
2. **Test with real users** - Include people with disabilities
3. **Test early and often** - Integrate into CI/CD
4. **Use multiple tools** - Each catches different issues
5. **Document findings** - Track and fix systematically
6. **Train the team** - Everyone should understand basics
