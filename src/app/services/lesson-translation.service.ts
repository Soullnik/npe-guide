import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LessonTranslationService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly loadedLessons = new Set<string>();

  /**
   * Loads translation for a specific lesson from a separate file
   * Supports both old format (lesson1) and new format (topic1.lesson1)
   */
  loadLessonTranslation(category: string, lessonKey: string, lang: string): Observable<boolean> {
    const cacheKey = `${category}-${lessonKey}-${lang}`;
    
    // If already loaded, return immediately
    if (this.loadedLessons.has(cacheKey)) {
      return of(true);
    }

    // Determine file path based on lessonKey format
    // New format: topic1.lesson1 -> topic1/lesson1
    // Old format: lesson1 -> lesson1
    const isNewFormat = lessonKey.includes('.');
    const filePath = isNewFormat ? lessonKey.replace('.', '/') : lessonKey;

    // Try to load language-specific file first, then fallback to default
    const url = `i18n/lessons/${category}/${filePath}.${lang}.json`;
    const fallbackUrl = `i18n/lessons/${category}/${filePath}.json`;
    
    return this.http.get<Record<string, any>>(url).pipe(
      catchError(() => this.http.get<Record<string, any>>(fallbackUrl)),
      tap((translation) => {
        // Build the translation object to merge
        let translationToMerge: Record<string, any>;
        
        if (isNewFormat) {
          // New format: topic1.lesson1 -> lessons.topic1.lesson1
          const [topicKey, lessonNum] = lessonKey.split('.');
          translationToMerge = {
            lessons: {
              [topicKey]: {
                [lessonNum]: translation,
              },
            },
          };
        } else if (category === 'npe') {
          // Old format: lesson1 -> lessons.lesson1
          translationToMerge = {
            lessons: {
              [lessonKey]: translation,
            },
          };
        } else {
          // Old format with category: lessons.category.lesson1
          translationToMerge = {
            lessons: {
              [category]: {
                [lessonKey]: translation,
              },
            },
          };
        }
        
        // Merge translation into the current language (merge: true preserves existing translations)
        this.translate.setTranslation(lang, translationToMerge, true);
        this.loadedLessons.add(cacheKey);
      }),
      map(() => true),
      catchError((error) => {
        console.warn(`Failed to load lesson translation from ${url} or ${fallbackUrl}:`, error);
        // Return true to not block the UI, fallback to main translation file
        return of(false);
      })
    );
  }
}

