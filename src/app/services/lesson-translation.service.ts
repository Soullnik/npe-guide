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
   */
  loadLessonTranslation(category: string, lessonKey: string, lang: string): Observable<boolean> {
    const cacheKey = `${category}-${lessonKey}-${lang}`;
    
    // If already loaded, return immediately
    if (this.loadedLessons.has(cacheKey)) {
      return of(true);
    }

    // Try to load language-specific file first, then fallback to default
    const url = `i18n/lessons/${category}/${lessonKey}.${lang}.json`;
    const fallbackUrl = `i18n/lessons/${category}/${lessonKey}.json`;
    
    return this.http.get<Record<string, any>>(url).pipe(
      catchError(() => this.http.get<Record<string, any>>(fallbackUrl)),
      tap((translation) => {
        // Build the translation object to merge
        let translationToMerge: Record<string, any>;
        
        // Support both old structure (lessons.lesson1) and new structure (lessons.npe.lesson1)
        if (category === 'npe') {
          translationToMerge = {
            lessons: {
              [lessonKey]: translation,
            },
          };
        } else {
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

