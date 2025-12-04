import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { Engine, NodeParticleSystemSet, Scene } from '@babylonjs/core';
import { NodeParticleEditor } from '@babylonjs/node-particle-editor';
import { SerializationTools } from '@babylonjs/node-particle-editor/serializationTools';
import type { LessonDefinition } from '../lessons/lesson-definition';
import { TranslatePipe } from '@ngx-translate/core';
import '@babylonjs/materials';

@Component({
  selector: 'app-npe-preview',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative h-full w-full border border-white/10 bg-slate-900/60">
      <div class="absolute inset-0" #host></div>

      @if (!lesson) {
        <div class="absolute inset-0 flex items-center justify-center text-sm text-white/70">
          {{ 'ui.noLesson' | translate }}
        </div>
      }

      @if (errorMessage()) {
        <div
          class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-center text-sm text-rose-200"
        >
          <p>{{ errorMessage() }}</p>
        </div>
      } @else {
        @if (loading()) {
          <div class="absolute inset-0 flex items-center justify-center bg-slate-900/60">
            <span
              class="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-transparent"
            ></span>
          </div>
        }
      }

      <canvas #canvas class="npe-runtime-canvas" aria-hidden="true"></canvas>
    </div>
  `,
})
export class NpePreviewComponent implements AfterViewInit, OnChanges {
  @Input() lesson: LessonDefinition | null = null;
  @Input() loadToken = 0;
  @Output() showingSolutionChange = new EventEmitter<boolean>();

  @ViewChild('host', { static: true }) private hostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine: Engine | null = null;
  private scene: Scene | null = null;
  private resizeHandler = () => {};
  private nodeParticleSet: NodeParticleSystemSet | null = null;
  private savedUserState: { editorData: any; systemBlocks: any[] } | null = null;
  private previousLessonId: string | null = null;
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showingSolution = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    // Register cleanup function
    this.destroyRef.onDestroy(() => {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
      this.scene?.dispose();
      this.engine?.dispose();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    try {
      this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    } catch (error) {
      console.warn('Unable to initialize Babylon Engine', error);
      this.engine = null;
      this.errorMessage.set('Babylon.js engine is not available in this environment.');
      this.loading.set(false);
      return;
    }

    this.scene = new Scene(this.engine);
    this.scene.createDefaultCameraOrLight(true, true, true);

    this.engine.runRenderLoop(() => {
      if (this.scene && !this.scene.isDisposed) {
        this.scene.render();
      }
    });

    this.resizeHandler = () => this.engine?.resize();
    window.addEventListener('resize', this.resizeHandler);

    this.initializeEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lesson']) {
      const previousLesson = changes['lesson'].previousValue;
      const currentLesson = changes['lesson'].currentValue;
      
      // Reset when lesson changes (check by ID to handle object reference issues)
      if (!changes['lesson'].firstChange && previousLesson?.id !== currentLesson?.id) {
        this.previousLessonId = currentLesson?.id ?? null;
        this.resetEditor();
      } else if (changes['lesson'].firstChange) {
        // Initialize previousLessonId on first change
        this.previousLessonId = currentLesson?.id ?? null;
      }
    }

    // loadToken is only used for manual toggle via button, not for navigation
    // Only toggle if lesson hasn't changed (we track this via previousLessonId)
    if (changes['loadToken'] && !changes['loadToken'].firstChange) {
      const currentLessonId = this.lesson?.id ?? null;
      // Only toggle if we're still on the same lesson (lesson didn't change)
      if (currentLessonId && currentLessonId === this.previousLessonId) {
        this.toggleSolution();
      }
    }
  }

  private resetEditor(): void {
    if (!this.nodeParticleSet || !this.isBrowser()) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);
    this.savedUserState = null;
    this.showingSolution.set(false);
    this.showingSolutionChange.emit(false);
    this.previousLessonId = this.lesson?.id ?? null;

    try {
      // Clear the particle set completely
      this.nodeParticleSet.clear();
      this.nodeParticleSet.editorData = { locations: [] };
      
      // Completely reinitialize the editor to ensure clean state
      if (this.hostRef?.nativeElement) {
        this.hostRef.nativeElement.innerHTML = '';
        requestAnimationFrame(() => {
          if (this.scene && this.hostRef && this.nodeParticleSet) {
            try {
              NodeParticleEditor.Show({
                nodeParticleSet: this.nodeParticleSet,
                hostScene: this.scene,
                hostElement: this.hostRef.nativeElement,
              });
              this.loading.set(false);
            } catch (error) {
              console.error('Failed to reset editor', error);
              this.errorMessage.set('Failed to reset the editor.');
              this.loading.set(false);
            }
          }
        });
      } else {
        this.loading.set(false);
      }
    } catch (error) {
      console.error('Failed to reset editor', error);
      this.errorMessage.set('Failed to reset the editor.');
      this.loading.set(false);
    }
  }


  private initializeEditor(): void {
    if (!this.scene || !this.hostRef || !this.isBrowser()) {
      return;
    }

    // Create one NodeParticleSystemSet instance
    this.nodeParticleSet = new NodeParticleSystemSet('Sandbox');
    this.nodeParticleSet.clear();
    this.nodeParticleSet.editorData = { locations: [] };

    this.showEditor();
  }

  private toggleSolution(): void {
    if (!this.lesson || !this.nodeParticleSet || !this.isBrowser()) {
      return;
    }

    if (this.showingSolution()) {
      // Hide solution - restore user state
      this.restoreUserState();
    } else {
      // Show solution - save current state and load solution
      this.showSolution();
    }
  }

  private showSolution(): void {
    if (!this.lesson || !this.nodeParticleSet || !this.isBrowser()) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      // Save current user state
      this.saveUserState();

      // Clear and load solution
      this.nodeParticleSet.clear();
      this.nodeParticleSet.editorData = null;

      // Load solution blocks into the existing set
      this.lesson.createSet(this.nodeParticleSet);
      
      // Update editor to reflect changes
      this.updateEditor();
      
      this.showingSolution.set(true);
      this.showingSolutionChange.emit(true);
      requestAnimationFrame(() => this.loading.set(false));
    } catch (error) {
      console.error('Failed to load lesson solution', error);
      this.errorMessage.set('Failed to load the solution.');
      this.loading.set(false);
    }
  }

  private saveUserState(): void {
    if (!this.nodeParticleSet) {
      return;
    }

    // Save current editorData (contains block positions and connections)
    // Note: systemBlocks are already part of the set, we just need to save editorData
    this.savedUserState = {
      editorData: this.nodeParticleSet.editorData ? JSON.parse(JSON.stringify(this.nodeParticleSet.editorData)) : null,
      systemBlocks: [], // We'll restore from editorData
    };
  }

  private restoreUserState(): void {
    if (!this.nodeParticleSet) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      if (!this.savedUserState || !this.savedUserState.editorData) {
        // If no saved state, create empty set
        this.nodeParticleSet.clear();
        this.nodeParticleSet.editorData = { locations: [] };
      } else {
        // Restore saved editorData
        // The editor will restore blocks from editorData
        this.nodeParticleSet.editorData = JSON.parse(JSON.stringify(this.savedUserState.editorData));
        // Clear systemBlocks - they will be restored from editorData by the editor
        this.nodeParticleSet.clear();
        // Restore editorData after clear
        this.nodeParticleSet.editorData = JSON.parse(JSON.stringify(this.savedUserState.editorData));
      }

      this.updateEditor();
      this.showingSolution.set(false);
      this.showingSolutionChange.emit(false);
      requestAnimationFrame(() => this.loading.set(false));
    } catch (error) {
      console.error('Failed to restore user state', error);
      // Fallback to empty set
      this.nodeParticleSet.clear();
      this.nodeParticleSet.editorData = { locations: [] };
      this.updateEditor();
      this.showingSolution.set(false);
      this.showingSolutionChange.emit(false);
      requestAnimationFrame(() => this.loading.set(false));
    }
  }

  private showEditor(): void {
    if (!this.scene || !this.hostRef || !this.nodeParticleSet || !this.isBrowser()) {
      return;
    }

    this.hostRef.nativeElement.innerHTML = '';

    try {
      NodeParticleEditor.Show({
        nodeParticleSet: this.nodeParticleSet,
        hostScene: this.scene,
        hostElement: this.hostRef.nativeElement,
      });
      this.loading.set(false);
    } catch (error) {
      console.error('Failed to show Node Particle Editor', error);
      this.errorMessage.set('Failed to load the Node Particle Editor preview.');
      this.loading.set(false);
    }
  }

  private updateEditor(): void {
    // Force editor to refresh with updated set
    // The editor should automatically detect changes to the set
    if (this.nodeParticleSet && this.hostRef?.nativeElement) {
      // Trigger a refresh by re-showing the editor
      // Note: This might cause flickering, but it's necessary to update the editor
      const currentHtml = this.hostRef.nativeElement.innerHTML;
      this.hostRef.nativeElement.innerHTML = '';
      requestAnimationFrame(() => {
        if (this.scene && this.hostRef && this.nodeParticleSet) {
          try {
            NodeParticleEditor.Show({
              nodeParticleSet: this.nodeParticleSet,
              hostScene: this.scene,
              hostElement: this.hostRef.nativeElement,
            });
          } catch (error) {
            console.error('Failed to update editor', error);
          }
        }
      });
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
