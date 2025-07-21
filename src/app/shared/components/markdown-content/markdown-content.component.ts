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
import { Router, ActivatedRoute } from '@angular/router';
import { MarkdownService } from '@shared/services/markdown.service';
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  markdown = input<string>('');
  headingPrefix = input<string>(''); // For examples: 'example-1-', 'example-2-', etc.

  private htmlContent = computed(() => {
    const markdownText = this.markdown();
    return markdownText ? this.markdownService.convertToHtml(markdownText) : '';
  });

  sanitizedHtml = computed(() => {
    const html = this.htmlContent();
    let processedHtml = this.addCopyButtonsToCodeBlocks(html);
    processedHtml = this.makeHeadingsRoutable(processedHtml);
    return this.sanitizer.bypassSecurityTrustHtml(processedHtml);
  });

  constructor() {
    // Watch for markdown changes and re-add copy listeners + heading listeners
    effect(() => {
      const content = this.markdown();
      if (content) {
        // Use setTimeout to ensure DOM is updated after content changes
        setTimeout(() => {
          this.addCopyListeners();
          this.addHeadingListeners();
        }, 100);
      }
    });
  }

  ngAfterViewInit() {
    // Add click listeners to copy buttons and headings after view is initialized
    this.addCopyListeners();
    this.addHeadingListeners();

    // Handle initial fragment from URL after page reload
    setTimeout(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        this.scrollToHeading(fragment);
      }
    }, 200);
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

  private makeHeadingsRoutable(html: string): string {
    const prefix = this.headingPrefix();

    // Add IDs and click handlers to headings
    return html.replace(
      /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
      (match, level, attributes, content) => {
        // Generate ID from heading text
        const headingText = content.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
        const baseId = this.generateHeadingId(headingText);
        const id = prefix ? `${prefix}${baseId}` : baseId;

        return `<h${level}${attributes} id="${id}" class="routable-heading" data-heading-id="${id}">${content}</h${level}>`;
      }
    );
  }

  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  private addHeadingListeners() {
    setTimeout(() => {
      const headings = this.elementRef.nativeElement.querySelectorAll('.routable-heading');
      headings.forEach((heading: HTMLElement) => {
        heading.style.cursor = 'pointer';
        heading.addEventListener('click', event => {
          event.preventDefault();
          const headingId = heading.getAttribute('data-heading-id');
          if (headingId) {
            this.navigateToHeading(headingId);
          }
        });
      });
    });
  }

  private navigateToHeading(headingId: string) {
    // Update URL with fragment
    this.router.navigate([], {
      fragment: headingId,
      queryParamsHandling: 'preserve',
    });

    // Scroll to element (CSS scroll-padding-top handles header offset)
    this.scrollToHeading(headingId);
  }

  private scrollToHeading(headingId: string) {
    setTimeout(() => {
      const element = this.document.getElementById(headingId);

      if (element) {
        // CSS scroll-padding-top handles the header offset automatically
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 200);
  }
}
