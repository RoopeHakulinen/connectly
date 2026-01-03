import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'selectedTheme';

  readonly userPreference = signal<Theme>(this.getStoredTheme());
  readonly systemPrefersDark = signal<boolean>(this.getSystemPreference());

  readonly effectiveTheme = computed(() => {
    const preference = this.userPreference();
    if (preference === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return preference;
  });

  readonly isDark = computed(() => this.effectiveTheme() === 'dark');

  constructor() {
    this.setupSystemPreferenceListener();

    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });
  }

  private getStoredTheme(): Theme {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return 'system';
  }

  private getSystemPreference(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  private setupSystemPreferenceListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this.systemPrefersDark.set(e.matches);
      });
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const body = this.document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
  }

  setTheme(theme: Theme): void {
    this.userPreference.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
