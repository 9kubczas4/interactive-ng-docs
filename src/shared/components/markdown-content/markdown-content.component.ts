import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from '@core/services/markdown.service';

@Component({
  selector: 'app-markdown-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="markdown-content" [innerHTML]="sanitizedHtml()"></div>
  `
})
export class MarkdownContentComponent {
  private markdownService = inject(MarkdownService);
  private sanitizer = inject(DomSanitizer);
  
  markdown = input<string>('');
  
  private htmlContent = computed(() => {
    const markdownText = this.markdown();
    return markdownText ? this.markdownService.convertToHtml(markdownText) : '';
  });
  
  sanitizedHtml = computed(() => {
    const html = this.htmlContent();
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });
} 