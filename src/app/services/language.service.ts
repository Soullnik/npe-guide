import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LANGUAGE_STORAGE_KEY = 'npe-guide-language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly currentLang = signal<'en' | 'ru'>(this.getStoredLanguage());

  constructor() {
    // Initialize TranslateService with stored language
    const storedLang = this.getStoredLanguage();
    this.translate.addLangs(['en', 'ru']);
    this.translate.use(storedLang);
    this.currentLang.set(storedLang);
  }

  /**
   * Get stored language from localStorage or default to 'en'
   */
  private getStoredLanguage(): 'en' | 'ru' {
    if (typeof window === 'undefined') {
      return 'en';
    }
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'ru' ? 'ru' : 'en';
  }

  /**
   * Set language and save to localStorage
   */
  setLanguage(lang: 'en' | 'ru'): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }

  /**
   * Get current language
   */
  getLanguage(): 'en' | 'ru' {
    return this.currentLang();
  }
}

