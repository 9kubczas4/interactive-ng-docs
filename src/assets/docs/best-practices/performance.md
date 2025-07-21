# Performance Optimization

## Overview

Performance optimization is crucial for delivering fast, responsive Angular applications. This guide covers key strategies and techniques to improve your app's performance.

## Change Detection Optimization

### OnPush Strategy

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class UserCardComponent {
  @Input() user = input.required<User>();
}
```

### Signals for Reactive Updates

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Users: {{ userCount() }}</h1>
    <app-user-card *ngFor="let user of users(); track user.id" [user]="user" />
  `,
})
export class DashboardComponent {
  private userService = inject(UserService);

  users = this.userService.users;
  userCount = computed(() => this.users().length);
}
```

## Lazy Loading

### Feature Modules

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(r => r.adminRoutes),
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then(r => r.shopRoutes),
  },
];
```

### Component Lazy Loading

```typescript
@Component({
  template: `
    @if (showChart) {
      <app-chart />
    }
  `,
})
export class DashboardComponent {
  showChart = signal(false);

  @ViewChild('chartContainer', { read: ViewContainerRef })
  chartContainer!: ViewContainerRef;

  async loadChart() {
    const { ChartComponent } = await import('./chart/chart.component');
    this.chartContainer.createComponent(ChartComponent);
  }
}
```

## Bundle Optimization

### Tree Shaking

- Import only what you need
- Use ES6 modules
- Avoid importing entire libraries

```typescript
// Good
import { map, filter } from 'rxjs/operators';

// Bad
import * as _ from 'lodash';
```

### Code Splitting

- Split code by routes
- Split by features
- Split vendor bundles

## Memory Management

### Subscription Cleanup

```typescript
@Component({
  // ...
})
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dataService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Using Async Pipe

```typescript
@Component({
  template: `
    @if (user$ | async; as user) {
      <div>{{ user.name }}</div>
    }
  `,
})
export class UserComponent {
  user$ = this.userService.getUser();
}
```

## Rendering Performance

### Virtual Scrolling

```html
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

### TrackBy Functions

```typescript
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `,
})
export class ListComponent {
  trackByFn(index: number, item: any): any {
    return item.id; // or index
  }
}
```

## Build Optimization

### Production Build

```bash
ng build --configuration=production
```

### Bundle Analysis

```bash
npm install --save-dev webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## Performance Monitoring

- Use Angular DevTools
- Monitor Core Web Vitals
- Use Lighthouse audits
- Implement performance budgets
- Track runtime performance

## Key Metrics

- **First Contentful Paint (FCP)** < 1.8s
- **Largest Contentful Paint (LCP)** < 2.5s
- **Cumulative Layout Shift (CLS)** < 0.1
- **First Input Delay (FID)** < 100ms
