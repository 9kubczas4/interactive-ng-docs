import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService, Theme } from '@core/services/theme.service';
import { ExampleDialogService } from '@shared/services/example-dialog.service';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-floating-action-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="floating-actions">
      <p-button
        [icon]="themeIcon()"
        [text]="true"
        [rounded]="true"
        size="large"
        severity="secondary"
        (click)="toggleTheme()"
        class="floating-button theme-button"
        [ariaLabel]="'Switch to ' + nextTheme() + ' theme'"
        [pTooltip]="'Theme: ' + currentThemeLabel()"
        tooltipPosition="left"
      />
      @if (hasExamples()) {
        <p-button
          icon="pi pi-external-link"
          [text]="true"
          [rounded]="true"
          size="large"
          severity="secondary"
          (click)="openExamplesDialog()"
          class="floating-button examples-button"
          ariaLabel="Open interactive examples"
          pTooltip="Open Examples"
          tooltipPosition="left"
        />
      }
    </div>
  `,
  styles: [
    `
      .floating-actions {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 1000;
      }

      :host ::ng-deep .floating-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--p-surface-border);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .p-button-icon {
          font-size: 1.25rem;
          color: var(--p-text-color);
          margin: 0;
          position: relative;
          top: 0;
          left: 0;
        }

        .p-button-label {
          display: none;
        }
      }

      .theme-button {
        :host ::ng-deep .p-button-icon {
          color: #667eea;
        }
      }

      .examples-button {
        :host ::ng-deep .p-button-icon {
          color: #764ba2;
        }
      }

      @media (max-width: 768px) {
        .floating-actions {
          bottom: 16px;
          right: 16px;
          gap: 8px;
        }

        :host ::ng-deep .floating-button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;

          .p-button-icon {
            font-size: 1.1rem;
            margin: 0;
            position: relative;
            top: 0;
            left: 0;
          }
        }
      }

      // Dark mode styles
      :host-context(.dark-mode) ::ng-deep .floating-button {
        background: rgba(45, 55, 72, 0.9);
        border-color: rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(45, 55, 72, 0.95);
        }
      }
    `,
  ],
  imports: [ButtonModule, MenuModule, TooltipModule],
})
export class FloatingActionButtonsComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly exampleDialogService = inject(ExampleDialogService);

  readonly currentTheme = this.themeService.theme;
  readonly effectiveTheme = this.themeService.effectiveTheme;
  readonly hasExamplesSignal = signal<boolean>(false);

  readonly hasExamples = computed(() => this.hasExamplesSignal());

  private routerSubscription?: any;

  readonly themeIcon = computed(() => {
    const theme = this.currentTheme();
    switch (theme) {
      case 'light':
        return 'pi pi-sun';
      case 'dark':
        return 'pi pi-moon';
      case 'system':
        return 'pi pi-desktop';
      default:
        return 'pi pi-sun';
    }
  });

  readonly currentThemeLabel = computed(() => {
    const theme = this.currentTheme();
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  });

  readonly nextTheme = computed(() => {
    const theme = this.currentTheme();
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'dark';
    }
  });

  ngOnInit(): void {
    // Check for examples on initial load
    setTimeout(() => this.checkForExamples(), 100);

    // Listen for route changes to re-check for examples
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Delay to ensure DOM is updated
        setTimeout(() => this.checkForExamples(), 200);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkForExamples(): void {
    const examplesSection = this.document.querySelector('.examples-section');
    const accordion = this.document.querySelector('.p-accordion');
    const hasExamplesOnPage = !!(examplesSection || accordion);
    this.hasExamplesSignal.set(hasExamplesOnPage);
  }

  toggleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.themeService.setTheme(themes[nextIndex]);
  }

  openExamplesDialog(): void {
    // Get the first available example from the dialog service
    const examples = this.exampleDialogService.examples();
    if (examples.length > 0) {
      this.exampleDialogService.openExample(examples[0].title);
    }
  }
}
