import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Engine, NodeParticleSystemSet, Scene } from 'babylonjs';
import { NodeParticleEditor } from 'babylonjs-node-particle-editor';
import type { LessonDefinition } from '../lessons/lesson-definition';
import { TranslatePipe } from '@ngx-translate/core';
import 'babylonjs';

(globalThis as any).BABYLON = BABYLON;

@Component({
  selector: 'app-npe-preview',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative h-full w-full rounded-3xl border border-white/10 bg-slate-900/60">
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
export class NpePreviewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() lesson: LessonDefinition | null = null;
  @Input() loadToken = 0;

  @ViewChild('host', { static: true }) private hostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine: Engine | null = null;
  private scene: Scene | null = null;
  private resizeHandler = () => {};
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

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
    if (changes['lesson'] && !changes['lesson'].firstChange) {
      // Clear and reinitialize editor when lesson changes
      if (this.hostRef && this.scene) {
        this.hostRef.nativeElement.innerHTML = '';
        this.initializeEditor();
      }
    }

    if (changes['loadToken'] && !changes['loadToken'].firstChange) {
      this.loadLessonExample();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.scene?.dispose();
    this.engine?.dispose();
  }

  private initializeEditor(): void {
    if (!this.scene || !this.hostRef || !this.isBrowser()) {
      return;
    }

    this.showEditor(this.createEmptySet());
  }

  private loadLessonExample(): void {
    if (!this.lesson || !this.scene || !this.hostRef || !this.isBrowser()) {
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      const nodeSet = this.lesson.createSet();
      this.showEditor(nodeSet);
      requestAnimationFrame(() => this.loading.set(false));
    } catch (error) {
      console.error('Failed to load lesson graph', error);
      this.errorMessage.set('Failed to load the Node Particle Editor preview.');
      this.loading.set(false);
    }
  }

  private showEditor(nodeParticleSet: NodeParticleSystemSet): void {
    if (!this.scene || !this.hostRef || !this.isBrowser()) {
      return;
    }

    this.hostRef.nativeElement.innerHTML = '';

    try {
      NodeParticleEditor.Show({
        nodeParticleSet: nodeParticleSet,
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

  private createEmptySet(): NodeParticleSystemSet {
    const set = new NodeParticleSystemSet('Sandbox');
    set.clear();
    set.editorData = { locations: [] };
    return set;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
