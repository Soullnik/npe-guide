import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-black/20 transition-all duration-300">
      <div class="mx-auto max-w-7xl px-3 py-3 lg:px-6">
        <div class="flex items-center justify-between gap-4">
          <!-- Left Section: Logo & Navigation -->
          <div class="flex flex-1 items-center gap-4">
            @if (showBackButton()) {
              <a
                [routerLink]="['/']"
                class="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-blue-400 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-400/10"
                title="{{ 'ui.backToHome' | translate }}"
              >
                <svg class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span class="hidden sm:inline">{{ 'ui.backToHome' | translate }}</span>
              </a>
            }
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{{ 'ui.product' | translate }}</p>
                <h1 class="text-xl font-bold text-white transition-all duration-300 lg:text-2xl">{{ 'ui.heroTitle' | translate }}</h1>
              </div>
            </div>
          </div>

          <!-- Right Section: Actions -->
          <div class="flex items-center gap-3">
            <!-- Documentation Link -->
            <a
              href="https://doc.babylonjs.com/features/featuresDeepDive/particles"
              target="_blank"
              rel="noopener noreferrer"
              class="group hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-blue-400 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-400/10 lg:flex"
              title="{{ 'ui.particlesDocumentation' | translate }}"
            >
              <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              <span class="hidden xl:inline">{{ 'ui.particlesDocumentation' | translate }}</span>
            </a>

            <!-- Language Switcher -->
            <div class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 shadow-lg backdrop-blur-sm">
              <button
                type="button"
                class="relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                [class.bg-white]="currentLang() === 'en'"
                [class.text-slate-900]="currentLang() === 'en'"
                [class.text-white/70]="currentLang() !== 'en'"
                [class.hover:text-white]="currentLang() !== 'en'"
                (click)="setLanguage('en')"
                title="English"
              >
                EN
              </button>
              <div class="h-4 w-px bg-white/10"></div>
              <button
                type="button"
                class="relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                [class.bg-white]="currentLang() === 'ru'"
                [class.text-slate-900]="currentLang() === 'ru'"
                [class.text-white/70]="currentLang() !== 'ru'"
                [class.hover:text-white]="currentLang() !== 'ru'"
                (click)="setLanguage('ru')"
                title="Русский"
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.currentLang;
  
  private readonly currentUrl = signal<string>(this.router.url);

  protected readonly showBackButton = computed(() => {
    const url = this.currentUrl();
    return url !== '/' && url !== '' && url.startsWith('/lessons');
  });

  constructor() {
    // Subscribe to router events to update URL signal
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentUrl.set(this.router.url);
      });
  }

  protected setLanguage(lang: 'en' | 'ru'): void {
    this.languageService.setLanguage(lang);
  }
}

