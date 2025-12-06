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
import type { LessonDefinition } from '../lessons/lesson-definition';
import { TranslatePipe } from '@ngx-translate/core';
import '@babylonjs/materials';

@Component({
  selector: 'app-npe-preview',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative h-full w-full border border-white/10 bg-slate-900/60">
      <div class="absolute inset-0 npe-no-preflight" #host></div>

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
  @Output() clearRequested = new EventEmitter<void>();

  @ViewChild('host', { static: true }) private hostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine: Engine | null = null;
  private scene: Scene | null = null;
  private resizeHandler = () => {};
  private nodeParticleSet: NodeParticleSystemSet | null = null;
  private savedUserState: string | null = null; // Serialized JSON string (in-memory for solution toggle)
  private previousLessonId: string | null = null;
  private autoSaveInterval: number | null = null;
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
      if (this.autoSaveInterval !== null) {
        clearInterval(this.autoSaveInterval);
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

    // Load saved state from localStorage if available
    this.loadUserStateFromStorage();

    try {
      // Clear the particle set completely
      this.nodeParticleSet.clear();
      
      // If we have saved state, restore it; otherwise start with empty editor
      if (this.savedUserState) {
        try {
          const serializedData = JSON.parse(this.savedUserState);
          this.nodeParticleSet.parseSerializedObject(serializedData);
        } catch (error) {
          console.error('Failed to restore from localStorage', error);
          this.nodeParticleSet.editorData = { locations: [] };
        }
      } else {
        this.nodeParticleSet.editorData = { locations: [] };
      }
      
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
    if (!this.nodeParticleSet || !this.lesson) {
      return;
    }

    try {
      // Serialize the entire particle set including all blocks, connections, and editorData
      // The serialize() method captures the complete state of the particle system
      // including block positions, connections, and all editor metadata
      const serialized = this.nodeParticleSet.serialize();
      const serializedString = JSON.stringify(serialized);
      
      // Save to in-memory state (for solution toggle)
      this.savedUserState = serializedString;
      
      // Save to localStorage with lesson ID as key
      if (this.isBrowser()) {
        const storageKey = this.getStorageKey();
        localStorage.setItem(storageKey, serializedString);
      }
    } catch (error) {
      console.error('Failed to save user state', error);
      this.savedUserState = null;
    }
  }

  private loadUserStateFromStorage(): void {
    if (!this.lesson || !this.isBrowser()) {
      return;
    }

    try {
      const storageKey = this.getStorageKey();
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        this.savedUserState = savedData;
      }
    } catch (error) {
      console.error('Failed to load user state from storage', error);
    }
  }

  private getStorageKey(): string {
    if (!this.lesson) {
      return 'npe-user-state-default';
    }
    return `npe-user-state-${this.lesson.id}`;
  }

  clearUserWork(): void {
    if (!this.nodeParticleSet || !this.isBrowser()) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      // Clear the particle set
      this.nodeParticleSet.clear();
      this.nodeParticleSet.editorData = { locations: [] };
      
      // Clear in-memory state
      this.savedUserState = null;
      
      // Clear localStorage for this lesson
      if (this.lesson) {
        const storageKey = this.getStorageKey();
        localStorage.removeItem(storageKey);
      }
      
      // Reset solution state
      this.showingSolution.set(false);
      this.showingSolutionChange.emit(false);
      
      // Update editor
      this.updateEditor();
      requestAnimationFrame(() => this.loading.set(false));
    } catch (error) {
      console.error('Failed to clear user work', error);
      this.errorMessage.set('Failed to clear the editor.');
      this.loading.set(false);
    }
  }

  private restoreUserState(): void {
    if (!this.nodeParticleSet) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      // Try to load from localStorage first (in case in-memory state was lost)
      if (!this.savedUserState && this.lesson) {
        this.loadUserStateFromStorage();
      }

      if (!this.savedUserState) {
        // If no saved state, create empty set
        this.nodeParticleSet.clear();
        this.nodeParticleSet.editorData = { locations: [] };
      } else {
        // Parse the serialized state and restore it
        const serializedData = JSON.parse(this.savedUserState);
        // Restore the entire particle set from serialized data
        // This will restore all blocks, connections, and editorData
        this.nodeParticleSet.parseSerializedObject(serializedData);
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
      
      // Start auto-save interval (save every 2 seconds when not showing solution)
      this.startAutoSave();
    } catch (error) {
      console.error('Failed to show Node Particle Editor', error);
      this.errorMessage.set('Failed to load the Node Particle Editor preview.');
      this.loading.set(false);
    }
  }

  private startAutoSave(): void {
    if (!this.isBrowser()) {
      return;
    }

    // Clear existing interval if any
    if (this.autoSaveInterval !== null) {
      clearInterval(this.autoSaveInterval);
    }

    // Auto-save every 2 seconds (only when not showing solution)
    this.autoSaveInterval = window.setInterval(() => {
      if (!this.showingSolution() && this.nodeParticleSet && this.lesson) {
        try {
          const serialized = this.nodeParticleSet.serialize();
          const serializedString = JSON.stringify(serialized);
          const storageKey = this.getStorageKey();
          localStorage.setItem(storageKey, serializedString);
        } catch (error) {
          // Silently fail - don't interrupt user experience
          console.debug('Auto-save failed', error);
        }
      }
    }, 2000);
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
            // Restart auto-save after editor update
            this.startAutoSave();
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
