import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

const CUSTOM_LINK_SELECTOR = 'span.custom-link:not(.processed):not(a)';
const LINK_CLASSES = 'custom-link text-blue-400 hover:text-blue-300 underline cursor-pointer';

// Map of CSS class names to their link types
const CLASS_TO_TYPE_MAP: Record<string, string> = {
  'custom-link-filter-value': 'filter-value',
  'custom-link-texture': 'texture',
};

@Directive({
  selector: '[appCustomLink]',
  standalone: true,
})
export class CustomLinkDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: MutationObserver;

  // Map of link types to their handlers
  private readonly linkHandlers: Record<string, (value: string) => void> = {
    'filter-value': (value: string) => this.handleFilterValue(value),
    'texture': (value: string) => this.handleTexture(value),
  };

  // Map of link types to their display text
  private readonly linkDisplayText: Record<string, string> = {
    'filter-value': '', // Use original value
    'texture': 'Texture Source',
  };

  ngAfterViewInit(): void {
    this.processCustomLinks();
    this.setupMutationObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      const hasAddedNodes = mutations.some((mutation) => mutation.addedNodes.length > 0);
      if (hasAddedNodes) {
        setTimeout(() => this.processCustomLinks(), 0);
      }
    });

    this.observer.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private processCustomLinks(): void {
    const container = this.elementRef.nativeElement;
    const customLinkElements = container.querySelectorAll(CUSTOM_LINK_SELECTOR);

    customLinkElements.forEach((element: Element) => {
      if (this.isAlreadyProcessed(element)) {
        return;
      }

      // Get link type from class name instead of data attribute
      const linkType = this.getLinkTypeFromClass(element);
      const value = element.textContent?.trim() || '';

      if (!linkType || !value || !this.linkHandlers[linkType]) {
        return;
      }

      element.classList.add('processed');
      const link = this.createCustomLink(linkType, value);
      element.parentNode?.replaceChild(link, element);
    });
  }

  private getLinkTypeFromClass(element: Element): string | null {
    for (const className of element.classList) {
      if (CLASS_TO_TYPE_MAP[className]) {
        return CLASS_TO_TYPE_MAP[className];
      }
    }
    return null;
  }

  private isAlreadyProcessed(element: Element): boolean {
    return element.classList.contains('processed') || element.tagName === 'A';
  }

  private createCustomLink(linkType: string, value: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.className = LINK_CLASSES;
    link.textContent = this.linkDisplayText[linkType] || value;
    link.setAttribute('data-link-type', linkType);
    link.setAttribute('data-value', value);

    const handler = this.linkHandlers[linkType];
    if (handler) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        handler(value);
      });
    }

    return link;
  }

  // Handler for filter-value links
  private handleFilterValue(filterText: string): void {
    const filterInput = this.findFilterInput();
    if (!filterInput) {
      return;
    }

    this.updateInputValue(filterInput, filterText);
    this.dispatchInputEvents(filterInput, filterText);
    filterInput.focus();
  }

  // Handler for texture links
  private async handleTexture(textureUrl: string): Promise<void> {
    const fullUrl = this.getFullTextureUrl(textureUrl);
    const fileName = this.getFileName(textureUrl);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch texture: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.warn('Failed to download texture via fetch, trying direct link:', error);
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Filter input helpers
  private findFilterInput(): HTMLInputElement | null {
    const npeNodeList = document.querySelector('#npeNodeList');
    if (!npeNodeList) {
      console.warn('Could not find #npeNodeList element');
      return null;
    }

    const filterDiv = npeNodeList.querySelector('.filter');
    if (!filterDiv) {
      console.warn('Could not find .filter div inside #npeNodeList');
      return null;
    }

    const filterInput = filterDiv.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder="Filter"]'
    );

    if (!filterInput) {
      console.warn('Could not find filter input in .filter div');
      return null;
    }

    return filterInput;
  }

  private updateInputValue(input: HTMLInputElement, value: string): void {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;

    if (nativeSetter) {
      nativeSetter.call(input, value);
    } else {
      input.value = value;
    }
  }

  private dispatchInputEvents(input: HTMLInputElement, value: string): void {
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: value,
    });

    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);
  }

  // Texture helpers
  private getFullTextureUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/')) {
      return url;
    }

    const commonPaths = [
      'https://assets.babylonjs.com/core/textures/',
      'https://assets.babylonjs.com/textures/',
      '/assets/textures/',
      '/textures/',
    ];

    if (!url.includes('/')) {
      return commonPaths[0] + url;
    }

    return url;
  }

  private getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'texture.png';
  }
}

