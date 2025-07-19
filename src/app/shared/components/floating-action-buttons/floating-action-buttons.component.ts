import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService, Theme } from '@core/services/theme.service';
import { DOCUMENT } from '@angular/common';

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
      <p-button
        icon="pi pi-code"
        [text]="true"
        [rounded]="true"
        size="large"
        severity="secondary"
        (click)="scrollToExamples()"
        class="floating-button examples-button"
        ariaLabel="Scroll to interactive examples"
        pTooltip="Scroll to Examples"
        tooltipPosition="left"
      />
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
export class FloatingActionButtonsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  readonly currentTheme = this.themeService.theme;
  readonly effectiveTheme = this.themeService.effectiveTheme;

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

  toggleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.themeService.setTheme(themes[nextIndex]);
  }

  scrollToExamples(): void {
    const examplesSection = this.document.querySelector('.examples-section');
    if (examplesSection) {
      examplesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // If no examples section found, scroll to any .p-accordion (examples are in accordions)
      const accordion = this.document.querySelector('.p-accordion');
      if (accordion) {
        accordion.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }
}
