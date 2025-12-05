import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Map of tag names to their CSS class names (using classes instead of data attributes to avoid sanitizer issues)
const TAG_TYPE_MAP: Record<string, string> = {
  'filter-value': 'custom-link-filter-value',
  'textures': 'custom-link-texture',
};

@Pipe({
  name: 'customLink',
  standalone: true,
})
export class CustomLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): SafeHtml {
    if (!text) {
      return '';
    }

    let result = text;

    // Process each tag type - use classes instead of data attributes
    for (const [tagName, className] of Object.entries(TAG_TYPE_MAP)) {
      const pattern = new RegExp(`<${tagName}>([^<]+)<\/${tagName}>`, 'gi');
      result = result.replace(
        pattern,
        `<span class="custom-link ${className}">$1</span>`
      );
    }

    return this.sanitizer.sanitize(1, result) || '';
  }
}

