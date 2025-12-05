import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="flex min-h-screen items-center justify-center px-4 py-12">
      <div class="mx-auto max-w-2xl text-center">
        <div class="mb-8">
          <h1 class="mb-4 text-6xl font-bold text-white">404</h1>
          <h2 class="mb-4 text-2xl font-semibold text-white">
            {{ 'ui.notFoundTitle' | translate }}
          </h2>
          <p class="mb-8 text-lg text-white/70">
            {{ 'ui.notFoundMessage' | translate }}
          </p>
        </div>
        <a
          routerLink="/"
          class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          {{ 'ui.backToHome' | translate }}
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}

