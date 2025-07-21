import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { LOCAL_STORAGE } from '@shared/providers/local-storage';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private localStorage = inject(LOCAL_STORAGE);
  private platformId = inject(PLATFORM_ID);

  private _theme = signal<Theme>('system');
  private _systemTheme = signal<'light' | 'dark'>('light');

  readonly theme = this._theme.asReadonly();
  readonly systemTheme = this._systemTheme.asReadonly();

  readonly effectiveTheme = computed(() => {
    const theme = this._theme();
    return theme === 'system' ? this._systemTheme() : theme;
  });

  constructor() {
    // Only access localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Load theme from localStorage
      const savedTheme = this.localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        this._theme.set(savedTheme);
      }

      // Set initial system theme
      this._systemTheme.set(this.getSystemTheme());

      // Listen for system theme changes
      this.watchSystemTheme();
    }

    // Apply theme changes to DOM (works on both server and browser)
    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);

    // Only save to localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage.setItem('theme', theme);
    }
  }

  private getSystemTheme(): 'light' | 'dark' {
    // Safe check for browser environment
    if (isPlatformBrowser(this.platformId) && this.document.defaultView?.matchMedia) {
      return this.document.defaultView.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light'; // Default for SSR
  }

  private watchSystemTheme(): void {
    // Only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery?.addEventListener('change', e => {
        this._systemTheme.set(e.matches ? 'dark' : 'light');
      });
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    // Safe DOM manipulation that works on both server and browser
    const body = this.document.body;
    if (body) {
      body.classList.remove('dark-mode', 'light-mode');
      body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    }
  }
}
