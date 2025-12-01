import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LESSONS } from '../lessons/lesson-data';
import { LessonTranslationService } from '../services/lesson-translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="h-screen min-h-0 w-full bg-gradient-to-b from-[#050816] via-[#0b1120] to-[#11192f] px-6 py-8 text-slate-50 lg:px-12">
      <div class="flex h-full min-h-0 flex-col gap-6">
        <header class="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-white/60">{{ 'ui.product' | translate }}</p>
            <h1 class="text-3xl font-semibold text-white lg:text-4xl">{{ 'ui.heroTitle' | translate }}</h1>
            <p class="mt-3 max-w-2xl text-sm text-white/70 lg:text-base">{{ 'ui.heroSubtitle' | translate }}</p>
            <a
              href="https://doc.babylonjs.com/features/featuresDeepDive/particles"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              {{ 'ui.particlesDocumentation' | translate }}
            </a>
          </div>
          <div class="flex flex-col items-end gap-2">
            <label class="text-xs uppercase tracking-widest text-white/60">{{ 'ui.language' | translate }}</label>
            <div class="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-sm font-semibold shadow">
              <button
                type="button"
                class="rounded-full px-4 py-1 transition hover:bg-white/10"
                [class.bg-white]="currentLang() === 'en'"
                [class.text-slate-900]="currentLang() === 'en'"
                (click)="setLanguage('en')"
              >
                EN
              </button>
              <button
                type="button"
                class="rounded-full px-4 py-1 transition hover:bg-white/10"
                [class.bg-white]="currentLang() === 'ru'"
                [class.text-slate-900]="currentLang() === 'ru'"
                (click)="setLanguage('ru')"
              >
                RU
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto">
          <section class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 class="mb-6 text-2xl font-semibold text-white">{{ 'ui.lessonList' | translate }}</h2>
            @if (translationsLoaded()) {
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                @for (lesson of lessons; track lesson.id) {
                  <a
                    [routerLink]="['/lessons', lesson.id]"
                    class="group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
                  >
                    <span class="block text-base font-semibold text-white group-hover:text-blue-300">
                      {{ ('lessons.' + lesson.translationKey + '.title') | translate }}
                    </span>
                    <span class="mt-1 block text-sm text-white/70">
                      {{ ('lessons.' + lesson.translationKey + '.summary') | translate }}
                    </span>
                  </a>
                }
              </div>
            } @else {
              <div class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-blue-400"></div>
                  <p class="text-sm text-white/60">{{ 'ui.loading' | translate }}</p>
                </div>
              </div>
            }
          </section>
        </main>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly lessonTranslationService = inject(LessonTranslationService);
  protected readonly lessons = LESSONS;
  protected readonly currentLang = signal<'en' | 'ru'>('en');
  protected readonly translationsLoaded = signal(false);

  constructor() {
    this.translate.addLangs(['en', 'ru']);
    this.translate.use(this.currentLang());
  }

  ngOnInit(): void {
    this.loadAllLessonTranslations();
  }

  private loadAllLessonTranslations(): void {
    const lang = this.currentLang();
    const loadPromises = this.lessons.map((lesson) =>
      this.lessonTranslationService.loadLessonTranslation(lesson.category, lesson.translationKey, lang)
    );

    forkJoin(loadPromises).subscribe({
      next: () => {
        this.translationsLoaded.set(true);
      },
      error: (error) => {
        console.warn('Failed to load some lesson translations:', error);
        this.translationsLoaded.set(true); // Show content anyway
      },
    });
  }

  protected setLanguage(lang: 'en' | 'ru'): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    this.translationsLoaded.set(false);
    this.loadAllLessonTranslations();
  }
}

