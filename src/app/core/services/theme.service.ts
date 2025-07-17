import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  private _theme = signal<Theme>('system');
  private _systemTheme = signal<'light' | 'dark'>('light');
  
  readonly theme = this._theme.asReadonly();
  readonly systemTheme = this._systemTheme.asReadonly();
  
  readonly effectiveTheme = computed(() => {
    const theme = this._theme();
    return theme === 'system' ? this._systemTheme() : theme;
  });
  
  constructor() {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._theme.set(savedTheme);
    }
    
    // Set initial system theme
    this._systemTheme.set(this.getSystemTheme());
    
    // Listen for system theme changes
    this.watchSystemTheme();
    
    // Apply theme changes to DOM
    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });
  }
  
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);
  }
  
  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      this._systemTheme.set(e.matches ? 'dark' : 'light');
    });
  }
  
  private applyTheme(theme: 'light' | 'dark'): void {
    const body = this.document.body;
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
  }
} 