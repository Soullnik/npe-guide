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
            <!-- GitHub Link -->
            <a
              href="https://github.com/Soullnik/npe-guide"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-blue-400 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-400/10"
              title="GitHub Repository"
            >
              <svg class="h-4 w-4 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span class="hidden xl:inline">GitHub</span>
            </a>

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

