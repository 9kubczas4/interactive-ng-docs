import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
  AfterViewInit,
  ElementRef,
  effect,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownService } from '@core/services/markdown.service';
import { Clipboard } from '@angular/cdk/clipboard';
import hljs from 'highlight.js';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-markdown-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div class="markdown-content" [innerHTML]="sanitizedHtml()"></div> `,
  styleUrl: './markdown-content.component.scss',
})
export class MarkdownContentComponent implements AfterViewInit {
  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly clipboard = inject(Clipboard);
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);

  markdown = input<string>('');

  private htmlContent = computed(() => {
    const markdownText = this.markdown();
    return markdownText ? this.markdownService.convertToHtml(markdownText) : '';
  });

  sanitizedHtml = computed(() => {
    const html = this.htmlContent();
    const processedHtml = this.addCopyButtonsToCodeBlocks(html);
    return this.sanitizer.bypassSecurityTrustHtml(processedHtml);
  });

  constructor() {
    // Watch for markdown changes and re-add copy listeners
    effect(() => {
      const content = this.markdown();
      if (content) {
        // Use setTimeout to ensure DOM is updated after content changes
        setTimeout(() => this.addCopyListeners(), 100);
      }
    });
  }

  ngAfterViewInit() {
    // Add click listeners to copy buttons after view is initialized
    this.addCopyListeners();
  }

  private addCopyButtonsToCodeBlocks(html: string): string {
    // Helper function to escape HTML for data attributes
    const escapeHtml = (text: string): string => {
      const div = this.document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (html: string): string => {
      const div = this.document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };

    // Replace <pre><code> blocks with wrapped containers that include copy buttons
    return html.replace(
      /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
      (match, attributes, content) => {
        const codeId = 'code-' + Math.random().toString(36).substr(2, 9);

        // Extract language from class attribute if present
        const languageMatch = attributes.match(/class="language-(\w+)"/);
        const language = languageMatch ? languageMatch[1] : '';

        // Decode HTML entities before syntax highlighting
        const decodedContent = decodeHtmlEntities(content);

        // Apply syntax highlighting
        let highlightedContent = decodedContent;
        if (language) {
          try {
            highlightedContent = hljs.highlight(decodedContent, { language }).value;
          } catch {
            // If language is not supported, try auto-detection
            try {
              highlightedContent = hljs.highlightAuto(decodedContent).value;
            } catch {
              // If all fails, use original content
              highlightedContent = decodedContent;
            }
          }
        } else {
          // Try auto-detection for code blocks without language specification
          try {
            highlightedContent = hljs.highlightAuto(decodedContent).value;
          } catch {
            highlightedContent = decodedContent;
          }
        }

        // Escape the original decoded content for storing in data attribute
        const escapedContent = escapeHtml(decodedContent);

        return `
        <div class="code-block-container">
          <button class="code-copy-button" data-code-id="${codeId}" data-original-content="${escapedContent}" aria-label="Copy code">
            <i class="pi pi-copy code-copy-icon"></i>
            <span class="copy-text">Copy</span>
          </button>
          <pre><code${attributes} data-code-id="${codeId}" class="hljs ${language ? `language-${language}` : ''}">${highlightedContent}</code></pre>
        </div>
      `;
      }
    );
  }

  private addCopyListeners() {
    // Use setTimeout to ensure the DOM is fully rendered
    setTimeout(() => {
      const copyButtons = this.elementRef.nativeElement.querySelectorAll('.code-copy-button');
      copyButtons.forEach((button: HTMLElement) => {
        button.addEventListener('click', event => {
          event.preventDefault();
          this.handleCopyClick(button);
        });
      });
    });
  }

  private handleCopyClick(button: HTMLElement) {
    // Get the original content from the button's data attribute
    const originalContent = button.getAttribute('data-original-content');

    if (originalContent) {
      const decodedContent = this.unescapeHtml(originalContent);
      const success = this.clipboard.copy(decodedContent);

      if (success) {
        // Update button appearance
        button.classList.add('copied');
        const icon = button.querySelector('.code-copy-icon');
        const text = button.querySelector('.copy-text');

        if (icon) icon.className = 'pi pi-check code-copy-icon';
        if (text) text.textContent = 'Copied!';

        // Reset after 2 seconds
        setTimeout(() => {
          button.classList.remove('copied');
          if (icon) icon.className = 'pi pi-copy code-copy-icon';
          if (text) text.textContent = 'Copy';
        }, 2000);
      }
    }
  }

  private unescapeHtml(html: string): string {
    const div = this.document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
