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
    <div class="w-full px-4 py-6 lg:px-6">
      <section class="mx-auto max-w-7xl space-y-8">
        <!-- Hero Section -->
        <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl lg:p-12">
          <div class="mx-auto max-w-4xl text-center">
            <h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">
              {{ 'ui.heroTitle' | translate }}
            </h1>
            <p class="mx-auto mb-8 text-lg leading-relaxed text-white/70 lg:text-xl lg:max-w-3xl">
              {{ 'ui.homeDescription' | translate }}
            </p>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div class="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10">
                  <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-white">{{ 'ui.homeFeatures' | translate }}</h3>
                <p class="text-center text-sm text-white/60">{{ 'ui.homeFeaturesDesc' | translate }}</p>
              </div>
              <div class="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div class="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10">
                  <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-white">{{ 'ui.homeStructured' | translate }}</h3>
                <p class="text-center text-sm text-white/60">{{ 'ui.homeStructuredDesc' | translate }}</p>
              </div>
              <div class="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div class="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10">
                  <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-white">{{ 'ui.homeSelfPaced' | translate }}</h3>
                <p class="text-center text-sm text-white/60">{{ 'ui.homeSelfPacedDesc' | translate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Topics Section -->
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
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly lessonTranslationService = inject(LessonTranslationService);
  private readonly languageService = inject(LanguageService);
  protected readonly topics = computed(() => TOPICS);
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

