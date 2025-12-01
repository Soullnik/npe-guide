import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { LessonContentComponent } from '../../lesson-content/lesson-content.component';
import { NpePreviewComponent } from '../../npe-preview/npe-preview.component';
import { LanguageService } from '../../services/language.service';
import { LessonTranslationService } from '../../services/lesson-translation.service';
import type { LessonDefinition } from '../lesson-definition';
import { getLessonByTopicAndNumber, getTopicById, TOPICS } from '../topics';

interface BlockInfo {
  name: string;
  description: string;
  properties?: Array<{ name: string; value: string; description: string }>;
  documentationUrl?: string;
}

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LessonContentComponent, NpePreviewComponent],
  template: `
    <div class="h-screen min-h-0 w-full bg-gradient-to-b from-[#050816] via-[#0b1120] to-[#11192f] px-6 py-8 text-slate-50 lg:px-12">
      <div class="flex h-full min-h-0 flex-col gap-6">
        <header class="flex flex-wrap items-start justify-between gap-6">
          <div class="flex items-start gap-4">
            <div>
              <a [routerLink]="['/']" class="mb-2 inline-block text-xs text-blue-400 hover:text-blue-300 transition-colors">
                ← {{ 'ui.backToHome' | translate }}
              </a>
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
        <main class="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-[30%_70%]">
          <section class="relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-white">
                @if (currentLesson()) {
                  @if (translationLoaded()) {
                    {{ ('lessons.' + currentLesson()!.translationKey + '.title') | translate }}
                  } @else {
                    <span class="inline-block h-5 w-32 animate-pulse rounded bg-white/20"></span>
                  }
                } @else {
                  {{ 'ui.noLesson' | translate }}
                }
              </h2>
              <button
                type="button"
                class="rounded-full border border-white/15 px-4 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                (click)="drawerOpen.set(true)"
              >
                {{ 'ui.menu' | translate }}
              </button>
            </div>

            <div class="mt-4 flex-1 overflow-y-auto pr-2">
              @if (currentLesson()) {
                @if (translationLoaded()) {
                  <app-lesson-content [lessonKey]="currentLesson()!.translationKey" [category]="currentLesson()!.category"></app-lesson-content>
                } @else {
                  <div class="flex items-center justify-center py-12">
                    <div class="flex flex-col items-center gap-3">
                      <div class="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-blue-400"></div>
                      <p class="text-sm text-white/60">{{ 'ui.loading' | translate }}</p>
                    </div>
                  </div>
                }
              } @else {
                <div class="flex items-center justify-center py-12">
                  <p class="text-sm text-white/60">{{ 'ui.noLesson' | translate }}</p>
                </div>
              }
            </div>

            <div class="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/40 disabled:hover:bg-white/5"
                  (click)="navigateToPreviousLesson()"
                  [disabled]="!hasPreviousLesson()"
                >
                  ← @if (hasPreviousLesson()) {
                    @if (currentLessonIndex() > 0) {
                      {{ 'ui.previousLesson' | translate }}
                    } @else {
                      {{ 'ui.previousTopic' | translate }}
                    }
                  } @else {
                    {{ 'ui.previousLesson' | translate }}
                  }
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/40 disabled:hover:bg-white/5"
                  (click)="navigateToNextLesson()"
                  [disabled]="!hasNextLesson()"
                >
                  @if (hasNextLesson()) {
                    @if (currentLessonIndex() < currentTopicLessons().length - 1) {
                      {{ 'ui.nextLesson' | translate }}
                    } @else {
                      {{ 'ui.nextTopic' | translate }}
                    }
                  } →
                </button>
              </div>
            </div>

            @if (drawerOpen()) {
              <div
                class="lesson-menu-overlay absolute inset-0 z-50 flex flex-col rounded-3xl border border-white/20 bg-slate-900/98 p-6 shadow-2xl backdrop-blur-xl"
              >
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">{{ 'ui.lessonList' | translate }}</h3>
                  <button
                    type="button"
                    class="text-white/70 transition hover:text-white"
                    (click)="drawerOpen.set(false)"
                  >
                    ✕
                  </button>
                </div>
                <div class="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
                  @if (currentTopic()) {
                    <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                      {{ currentTopic()!.title }}
                    </div>
                    @for (lesson of currentTopicLessons(); track lesson.id) {
                      <button
                        type="button"
                        class="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/30"
                        [class.bg-white/20]="lesson.id === currentLesson()?.id"
                        [class.border-white/30]="lesson.id === currentLesson()?.id"
                        (click)="navigateToLesson(lesson.topicId, lesson.lessonNumber)"
                      >
                        <span class="block text-base font-semibold text-white">
                          {{ ('lessons.' + lesson.translationKey + '.title') | translate }}
                        </span>
                        <span class="mt-1 block text-sm text-white/70">
                          {{ ('lessons.' + lesson.translationKey + '.summary') | translate }}
                        </span>
                      </button>
                    }
                  }
                </div>
              </div>
            }
          </section>

          <section class="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">{{ 'ui.editorLabel' | translate }}</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40"
                (click)="toggleSolution()"
                [disabled]="!currentLesson()"
              >
                {{ (showingSolution() ? 'ui.hideSolution' : 'ui.showSolution') | translate }}
              </button>
            </div>
            <div class="mt-4 flex-1 overflow-hidden">
              @if (currentLesson()) {
                <app-npe-preview
                  class="block h-full"
                  [lesson]="currentLesson()!"
                  [loadToken]="lessonLoadToken()"
                  (showingSolutionChange)="showingSolution.set($event)"
                ></app-npe-preview>
              }
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
})
export class LessonComponent implements OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lessonTranslationService = inject(LessonTranslationService);
  protected readonly languageService = inject(LanguageService);
  private readonly langSub: Subscription;

  protected readonly drawerOpen = signal(false);
  protected readonly currentLang = this.languageService.currentLang;
  protected readonly lessonLoadToken = signal(0);
  protected readonly topicId = signal<number | null>(null);
  protected readonly lessonNumber = signal<number | null>(null);
  protected readonly translationLoaded = signal(false);
  protected readonly showingSolution = signal(false);

  protected readonly currentLesson = computed<LessonDefinition | null>(() => {
    const topicId = this.topicId();
    const lessonNumber = this.lessonNumber();
    if (topicId === null || lessonNumber === null) {
      return null;
    }
    return getLessonByTopicAndNumber(topicId, lessonNumber) ?? null;
  });

  protected readonly currentTopic = computed(() => {
    const topicId = this.topicId();
    if (topicId === null) {
      return null;
    }
    return getTopicById(topicId) ?? null;
  });

  // Lessons from current topic only
  protected readonly currentTopicLessons = computed(() => {
    const topic = this.currentTopic();
    return topic ? topic.lessons : [];
  });

  protected readonly currentLessonIndex = computed(() => {
    const lesson = this.currentLesson();
    const topicLessons = this.currentTopicLessons();
    if (!lesson || topicLessons.length === 0) {
      return -1;
    }
    return topicLessons.findIndex((l) => l.id === lesson.id);
  });

  protected readonly hasPreviousLesson = computed(() => {
    const currentIndex = this.currentLessonIndex();
    const topicLessons = this.currentTopicLessons();
    
    // If not first lesson in topic, has previous lesson
    if (currentIndex > 0 && currentIndex < topicLessons.length) {
      return true;
    }
    
    // If first lesson in topic, check if there's previous topic
    const currentTopic = this.currentTopic();
    if (!currentTopic) {
      return false;
    }
    const currentTopicIndex = TOPICS.findIndex((t) => t.id === currentTopic.id);
    return currentTopicIndex > 0; // Has previous topic if not first topic
  });

  protected readonly hasNextLesson = computed(() => {
    const lesson = this.currentLesson();
    const topicLessons = this.currentTopicLessons();
    if (!lesson || topicLessons.length === 0) {
      return false;
    }
    const currentIndex = this.currentLessonIndex();
    // If not last lesson in topic, has next lesson
    if (currentIndex >= 0 && currentIndex < topicLessons.length - 1) {
      return true;
    }
    // If last lesson in topic, check if there's next topic
    const currentTopic = this.currentTopic();
    if (!currentTopic) {
      return false;
    }
    const currentTopicIndex = TOPICS.findIndex((t) => t.id === currentTopic.id);
    return currentTopicIndex >= 0 && currentTopicIndex < TOPICS.length - 1;
  });

  constructor() {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.translationLoaded.set(false);
      this.loadAllLessonTranslations();
    });

    this.route.paramMap.subscribe((params) => {
      const topicIdParam = params.get('topicId');
      const lessonNumberParam = params.get('lessonNumber');
      
      if (topicIdParam && lessonNumberParam) {
        const topicId = parseInt(topicIdParam, 10);
        const lessonNumber = parseInt(lessonNumberParam, 10);
        
        if (!isNaN(topicId) && !isNaN(lessonNumber)) {
          this.topicId.set(topicId);
          this.lessonNumber.set(lessonNumber);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        // Redirect to home if params are missing
        this.router.navigate(['/']);
      }
    });

    effect(() => {
      const lesson = this.currentLesson();
      if (lesson) {
        this.translationLoaded.set(false);
        this.loadAllLessonTranslations();
      }
    });
  }

  private async loadAllLessonTranslations(): Promise<void> {
    const topicLessons = this.currentTopicLessons();
    if (topicLessons.length === 0) {
      this.translationLoaded.set(true);
      return;
    }

    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    const loadPromises = topicLessons.map((l) =>
      this.lessonTranslationService.loadLessonTranslation(l.category, l.translationKey, lang)
    );

    try {
      await Promise.all(loadPromises.map((p) => firstValueFrom(p)));
      this.translationLoaded.set(true);
    } catch (error) {
      console.warn('Failed to load some lesson translations:', error);
      this.translationLoaded.set(true); // Show content anyway
    }
  }

  protected navigateToLesson(topicId: number, lessonNumber: number): void {
    this.router.navigate(['/lessons/topic', topicId, 'lesson', lessonNumber]);
    this.drawerOpen.set(false);
    this.showingSolution.set(false); // Reset solution state on navigation
    // Note: lessonLoadToken is NOT updated here - the preview component will reset
    // automatically when the lesson input changes via ngOnChanges
  }

  protected navigateToPreviousLesson(): void {
    const currentIndex = this.currentLessonIndex();
    const topicLessons = this.currentTopicLessons();
    const currentTopic = this.currentTopic();
    
    if (!currentTopic) {
      return;
    }
    
    // If not first lesson in topic, go to previous lesson
    if (currentIndex > 0 && currentIndex < topicLessons.length) {
      const previousLesson = topicLessons[currentIndex - 1];
      this.navigateToLesson(previousLesson.topicId, previousLesson.lessonNumber);
    } else {
      // If first lesson in topic, go to last lesson of previous topic
      const currentTopicIndex = TOPICS.findIndex((t) => t.id === currentTopic.id);
      if (currentTopicIndex > 0) {
        const previousTopic = TOPICS[currentTopicIndex - 1];
        if (previousTopic.lessons.length > 0) {
          const lastLesson = previousTopic.lessons[previousTopic.lessons.length - 1];
          this.navigateToLesson(lastLesson.topicId, lastLesson.lessonNumber);
        }
      }
    }
  }

  protected navigateToNextLesson(): void {
    const currentIndex = this.currentLessonIndex();
    const topicLessons = this.currentTopicLessons();
    const currentTopic = this.currentTopic();
    
    if (!currentTopic) {
      return;
    }
    
    // If not last lesson in topic, go to next lesson
    if (currentIndex >= 0 && currentIndex < topicLessons.length - 1) {
      const nextLesson = topicLessons[currentIndex + 1];
      this.navigateToLesson(nextLesson.topicId, nextLesson.lessonNumber);
    } else {
      // If last lesson in topic, go to first lesson of next topic
      const currentTopicIndex = TOPICS.findIndex((t) => t.id === currentTopic.id);
      if (currentTopicIndex >= 0 && currentTopicIndex < TOPICS.length - 1) {
        const nextTopic = TOPICS[currentTopicIndex + 1];
        if (nextTopic.lessons.length > 0) {
          const firstLesson = nextTopic.lessons[0];
          this.navigateToLesson(firstLesson.topicId, firstLesson.lessonNumber);
        }
      }
    }
  }

  protected setLanguage(lang: 'en' | 'ru'): void {
    this.languageService.setLanguage(lang);
    this.translationLoaded.set(false);
    this.loadAllLessonTranslations();
  }

  protected toggleSolution(): void {
    const lesson = this.currentLesson();
    if (!lesson) {
      return;
    }
    this.showingSolution.update((value) => !value);
    this.lessonLoadToken.update((value) => value + 1);
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}

