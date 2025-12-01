import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { TOPICS } from '../lessons/topics';
import { LanguageService } from '../services/language.service';
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
          <section class="space-y-8">
            @if (translationsLoaded()) {
              @for (topic of topics(); track topic.id) {
                <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div class="mb-4 flex items-center justify-between">
                      <div>
                        <h2 class="text-2xl font-semibold text-white">
                          {{ 'ui.topic' | translate }} {{ topic.id }}: {{ getTopicTitle(topic.id) }}
                        </h2>
                        <p class="mt-1 text-sm text-white/60">{{ getTopicDescription(topic.id) }}</p>
                      </div>
                      <span
                        class="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold capitalize text-white/80"
                        [class.bg-green-500/20]="topic.difficulty === 'beginner'"
                        [class.bg-yellow-500/20]="topic.difficulty === 'intermediate'"
                        [class.bg-red-500/20]="topic.difficulty === 'advanced'"
                      >
                        {{ getDifficultyLabel(topic.difficulty) }}
                      </span>
                    </div>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    @for (lesson of topic.lessons; track lesson.id) {
                      <a
                        [routerLink]="['/lessons/topic', lesson.topicId, 'lesson', lesson.lessonNumber]"
                        class="group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
                      >
                        <span class="mt-1 block text-base font-semibold text-white group-hover:text-blue-300">
                          {{ ('lessons.' + lesson.translationKey + '.title') | translate }}
                        </span>
                        <span class="mt-1 block text-sm text-white/70">
                          {{ ('lessons.' + lesson.translationKey + '.summary') | translate }}
                        </span>
                      </a>
                    }
                  </div>
                </div>
              }
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
  protected readonly languageService = inject(LanguageService);
  protected readonly topics = computed(() => TOPICS);
  protected readonly currentLang = this.languageService.currentLang;
  protected readonly translationsLoaded = signal(false);

  ngOnInit(): void {
    this.loadAllLessonTranslations();
  }

  private loadAllLessonTranslations(): void {
    const lang = this.languageService.getLanguage();
    // Load translations for all lessons from all topics
    const allLessons = TOPICS.flatMap((topic) => topic.lessons);
    const loadPromises = allLessons.map((lesson) =>
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
    this.languageService.setLanguage(lang);
    this.translationsLoaded.set(false);
    this.loadAllLessonTranslations();
  }

  protected getTopicTitle(topicId: number): string {
    return this.translate.instant(`topics.topic${topicId}.title`);
  }

  protected getTopicDescription(topicId: number): string {
    return this.translate.instant(`topics.topic${topicId}.description`);
  }

  protected getDifficultyLabel(difficulty: string): string {
    return this.translate.instant(`ui.difficulty.${difficulty}`);
  }
}

