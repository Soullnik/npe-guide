import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LessonContentComponent } from './lesson-content/lesson-content.component';
import { NpePreviewComponent } from './npe-preview/npe-preview.component';
import { LESSONS } from './lessons/lesson-data';
import type { LessonDefinition } from './lessons/lesson-definition';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LessonContentComponent, NpePreviewComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly translate = inject(TranslateService);
  protected readonly lessons = LESSONS;

  protected readonly drawerOpen = signal(false);
  protected readonly activeLessonId = signal(this.lessons[0]?.id ?? '');
  protected readonly currentLang = signal<'en' | 'ru'>('en');
  protected readonly lessonLoadToken = signal(0);

  protected readonly activeLesson = computed<LessonDefinition | null>(() => {
    return this.lessons.find((lesson) => lesson.id === this.activeLessonId()) ?? null;
  });

  protected readonly currentLessonIndex = computed(() => {
    return this.lessons.findIndex((lesson) => lesson.id === this.activeLessonId());
  });

  protected readonly hasPreviousLesson = computed(() => {
    return this.currentLessonIndex() > 0;
  });

  protected readonly hasNextLesson = computed(() => {
    return this.currentLessonIndex() >= 0 && this.currentLessonIndex() < this.lessons.length - 1;
  });

  constructor() {
    this.translate.addLangs(['en', 'ru']);
    this.translate.use(this.currentLang());
  }

  protected selectLesson(id: string): void {
    this.activeLessonId.set(id);
    this.drawerOpen.set(false);
  }

  protected setLanguage(lang: 'en' | 'ru'): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
  }

  protected loadLessonExample(): void {
    const lesson = this.activeLesson();
    if (!lesson) {
      return;
    }
    this.lessonLoadToken.update((value) => value + 1);
  }

  protected previousLesson(): void {
    const currentIndex = this.currentLessonIndex();
    if (currentIndex > 0) {
      this.selectLesson(this.lessons[currentIndex - 1].id);
    }
  }

  protected nextLesson(): void {
    const currentIndex = this.currentLessonIndex();
    if (currentIndex >= 0 && currentIndex < this.lessons.length - 1) {
      this.selectLesson(this.lessons[currentIndex + 1].id);
    }
  }
}
