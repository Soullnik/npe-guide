import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { LessonTranslationService } from '../services/lesson-translation.service';

interface BlockInfo {
  name: string;
  description: string;
  properties?: Array<{ name: string; value: string; description: string }>;
  documentationUrl?: string;
}

@Component({
  selector: 'app-lesson-content',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (lessonKey()) {
      <div class="space-y-6 text-sm leading-relaxed">
        <!-- Introduction -->
        <section class="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 class="mb-3 text-lg font-semibold text-white">
            {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.introTitle' : 'lessons.' + category() + '.' + lessonKey() + '.introTitle') | translate }}
          </h2>
          <p class="text-white/80">{{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.intro' : 'lessons.' + category() + '.' + lessonKey() + '.intro') | translate }}</p>
        </section>

        <!-- Learning Objectives -->
        @if (objectives().length > 0) {
          <section class="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <h2 class="mb-4 text-lg font-semibold text-blue-300">
              {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.objectivesTitle' : 'lessons.' + category() + '.' + lessonKey() + '.objectivesTitle') | translate }}
            </h2>
            <ul class="space-y-2">
              @for (objective of objectives(); track $index) {
                <li class="flex gap-2">
                  <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                  <span class="flex-1 text-white/90">{{ objective }}</span>
                </li>
              }
            </ul>
          </section>
        }

        <!-- Steps -->
        <section class="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 class="mb-4 text-lg font-semibold text-white">
            {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.stepsTitle' : 'lessons.' + category() + '.' + lessonKey() + '.stepsTitle') | translate }}
          </h2>
          <ol class="space-y-3">
            @for (step of steps(); track $index) {
              <li class="flex gap-3">
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-semibold text-blue-300"
                >
                  {{ $index + 1 }}
                </span>
                <span class="flex-1 text-white/80">{{ step }}</span>
              </li>
            }
          </ol>
        </section>

        <!-- Blocks Information -->
        @if (blocks().length > 0) {
          <section class="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 class="mb-4 text-lg font-semibold text-white">
              {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.blocksTitle' : 'lessons.' + category() + '.' + lessonKey() + '.blocksTitle') | translate }}
            </h2>
            <div class="space-y-2">
              @for (block of blocks(); track block.name) {
                <div class="rounded-lg border border-white/10 bg-white/5">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between p-3 text-left transition hover:bg-white/5"
                    (click)="toggleBlock(block.name)"
                  >
                    <span class="font-semibold text-white">{{ block.name }}</span>
                    <span class="text-white/60">
                      {{ isBlockOpen(block.name) ? '▼' : '▶' }}
                    </span>
                  </button>
                  @if (isBlockOpen(block.name)) {
                    <div class="border-t border-white/10 p-3 space-y-3">
                      <p class="text-white/70">{{ block.description }}</p>
                      @if (getDocumentationUrl(block.name)) {
                        <a
                          [href]="getDocumentationUrl(block.name)"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          {{ 'ui.viewDocumentation' | translate }}
                        </a>
                      }
                      @if (block.properties && block.properties.length > 0) {
                        <div class="space-y-2">
                          <h4 class="text-xs font-semibold uppercase tracking-wider text-white/60">
                            {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.properties' : 'lessons.' + category() + '.' + lessonKey() + '.properties') | translate }}
                          </h4>
                          @for (prop of block.properties; track prop.name) {
                            <div class="rounded border border-white/10 bg-white/5 p-2">
                              <div class="flex flex-wrap items-center gap-2 break-words">
                                <code class="text-xs font-mono text-blue-300 break-all">{{ prop.name }}</code>
                                <span class="text-xs text-white/50 shrink-0">=</span>
                                <code class="text-xs font-mono text-green-300 break-all min-w-0 flex-1">{{ prop.value }}</code>
                              </div>
                              <p class="mt-1 text-xs text-white/60 break-words">{{ prop.description }}</p>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- Common Mistakes -->
        @if (commonMistakes().length > 0) {
          <section class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
            <h2 class="mb-4 text-lg font-semibold text-rose-300">
              {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.commonMistakesTitle' : 'lessons.' + category() + '.' + lessonKey() + '.commonMistakesTitle') | translate }}
            </h2>
            <div class="space-y-4">
              @for (mistake of commonMistakes(); track $index) {
                <div class="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                  <div class="flex items-start gap-2">
                    <span class="mt-1 text-rose-400">⚠️</span>
                    <div class="flex-1">
                      <h3 class="font-semibold text-rose-200">{{ mistake.mistake }}</h3>
                      <p class="mt-1 text-sm text-white/70">{{ mistake.explanation }}</p>
                      <p class="mt-2 text-sm text-green-300">
                        <span class="font-semibold">💡 Solution:</span> {{ mistake.solution }}
                      </p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Homework -->
        @if (homework().length > 0) {
          <section class="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 class="mb-4 text-lg font-semibold text-white">
              {{ (category() === 'npe' ? 'lessons.' + lessonKey() + '.homeworkTitle' : 'lessons.' + category() + '.' + lessonKey() + '.homeworkTitle') | translate }}
            </h2>
            <ul class="space-y-2">
              @for (task of homework(); track $index) {
                <li class="flex gap-2">
                  <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400/60"></span>
                  <span class="text-white/80">{{ task }}</span>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    } @else {
      <div class="flex items-center justify-center py-12">
        <p class="text-sm text-white/60">{{ 'ui.noLesson' | translate }}</p>
      </div>
    }
  `,
})
export class LessonContentComponent {
  private readonly translate = inject(TranslateService);
  private readonly lessonTranslationService = inject(LessonTranslationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly openBlocks = signal<Set<string>>(new Set());

  readonly lessonKey = input<string | null>(null);
  readonly category = input<string>('npe');
  protected readonly steps = signal<string[]>([]);
  protected readonly homework = signal<string[]>([]);
  protected readonly blocks = signal<BlockInfo[]>([]);
  protected readonly objectives = signal<string[]>([]);
  protected readonly commonMistakes = signal<Array<{ mistake: string; explanation: string; solution: string }>>([]);

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadLessonTranslation().then(() => this.refreshData());
      });
    effect(() => {
      const key = this.lessonKey();
      const category = this.category();
      if (key) {
        this.loadLessonTranslation().then(() => this.refreshData());
      }
    });
  }

  private async loadLessonTranslation(): Promise<void> {
    const key = this.lessonKey();
    const category = this.category();
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    
    if (key) {
      await firstValueFrom(this.lessonTranslationService.loadLessonTranslation(category, key, lang));
    }
  }

  protected toggleBlock(name: string): void {
    const current = this.openBlocks();
    const updated = new Set(current);
    if (updated.has(name)) {
      updated.delete(name);
    } else {
      updated.add(name);
    }
    this.openBlocks.set(updated);
  }

  protected isBlockOpen(name: string): boolean {
    return this.openBlocks().has(name);
  }

  protected getDocumentationUrl(blockName: string): string | null {
    // Generate documentation URL based on block name
    // Babylon.js documentation structure: https://doc.babylonjs.com/typedoc/classes/BABYLON.[ClassName]
    const baseUrl = 'https://doc.babylonjs.com/typedoc/classes/BABYLON.';
    
    // Map block names to their class names in the documentation
    // Most blocks use the same name, but some might need special handling
    const blockNameMap: Record<string, string> = {
      'SystemBlock': 'SystemBlock',
      'UpdatePositionBlock': 'UpdatePositionBlock',
      'CreateParticleBlock': 'CreateParticleBlock',
      'BoxShapeBlock': 'BoxShapeBlock',
      'SphereShapeBlock': 'SphereShapeBlock',
      'ConeShapeBlock': 'ConeShapeBlock',
      'CylinderShapeBlock': 'CylinderShapeBlock',
      'PointShapeBlock': 'PointShapeBlock',
      'MeshShapeBlock': 'MeshShapeBlock',
      'UpdateColorBlock': 'UpdateColorBlock',
      'UpdateSizeBlock': 'UpdateSizeBlock',
      'UpdateScaleBlock': 'UpdateScaleBlock',
      'UpdateDirectionBlock': 'UpdateDirectionBlock',
      'UpdateAngleBlock': 'UpdateAngleBlock',
      'AlignAngleBlock': 'AlignAngleBlock',
      'UpdateAttractorBlock': 'UpdateAttractorBlock',
      'ParticleInputBlock': 'ParticleInputBlock',
      'ParticleMathBlock': 'ParticleMathBlock',
      'ParticleConverterBlock': 'ParticleConverterBlock',
      'ParticleLerpBlock': 'ParticleLerpBlock',
      'ParticleRandomBlock': 'ParticleRandomBlock',
      'ParticleTrigonometryBlock': 'ParticleTrigonometryBlock',
      'ParticleConditionBlock': 'ParticleConditionBlock',
      'ParticleTextureSourceBlock': 'ParticleTextureSourceBlock',
      'SetupSpriteSheetBlock': 'SetupSpriteSheetBlock',
      'UpdateSpriteCellIndexBlock': 'UpdateSpriteCellIndexBlock',
      'ParticleFloatToIntBlock': 'ParticleFloatToIntBlock',
      'ParticleVectorLengthBlock': 'ParticleVectorLengthBlock',
    };

    const className = blockNameMap[blockName];
    if (!className) {
      // Use the block name directly if not in map (most blocks use the same name)
      return baseUrl + blockName;
    }

    return baseUrl + className;
  }

  private refreshData(): void {
    const key = this.lessonKey();
    const category = this.category();
    if (!key) {
      this.steps.set([]);
      this.homework.set([]);
      this.blocks.set([]);
      this.objectives.set([]);
      this.commonMistakes.set([]);
      return;
    }

    // Build translation keys with category support
    // Support both old format (lesson1) and new format (topic1.lesson1)
    let baseKey: string;
    if (key.includes('.')) {
      // New format: topic1.lesson1 -> lessons.topic1.lesson1
      baseKey = `lessons.${key}`;
    } else if (category === 'npe') {
      // Old format: lesson1 -> lessons.lesson1
      baseKey = `lessons.${key}`;
    } else {
      // Old format with category: lessons.category.lesson1
      baseKey = `lessons.${category}.${key}`;
    }
    const stepsKey = `${baseKey}.steps`;
    const homeworkKey = `${baseKey}.homework`;
    const blocksKey = `${baseKey}.blocks`;
    const objectivesKey = `${baseKey}.objectives`;
    const commonMistakesKey = `${baseKey}.commonMistakes`;

    this.translate.get([stepsKey, homeworkKey, blocksKey, objectivesKey, commonMistakesKey]).subscribe((values) => {
      const stepsValue = values[stepsKey];
      const homeworkValue = values[homeworkKey];
      const blocksValue = values[blocksKey];
      const objectivesValue = values[objectivesKey];
      const commonMistakesValue = values[commonMistakesKey];

      this.steps.set(Array.isArray(stepsValue) ? stepsValue : []);
      this.homework.set(Array.isArray(homeworkValue) ? homeworkValue : []);
      this.blocks.set(Array.isArray(blocksValue) ? blocksValue : []);
      this.objectives.set(Array.isArray(objectivesValue) ? objectivesValue : []);
      this.commonMistakes.set(Array.isArray(commonMistakesValue) ? commonMistakesValue : []);
    });
  }
}
