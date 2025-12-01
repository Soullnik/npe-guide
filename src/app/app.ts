import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isMobile = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileDevice();
      window.addEventListener('resize', () => this.checkMobileDevice());
    }
  }

  private checkMobileDevice(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isMobileWidth = window.innerWidth < 1024;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    this.isMobile.set(isMobileWidth || isMobileUserAgent);
  }
}
