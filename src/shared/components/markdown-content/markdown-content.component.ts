import { Component, ChangeDetectionStrategy, input, computed, inject, AfterViewInit, ElementRef, signal, effect } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from '@core/services/markdown.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-markdown-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="markdown-content" [innerHTML]="sanitizedHtml()"></div>
  `,
  styles: [`
    .markdown-content {
      position: relative;
    }
    
    ::ng-deep .markdown-content .code-block-container {
      position: relative;
      margin: 1.5rem 0;
    }
    
    ::ng-deep .markdown-content .code-copy-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: #cbd5e0;
      border: 1px solid #4a5568;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 10;
      
      &:hover:not(.copied) {
        background: rgba(102, 126, 234, 0.8);
        border-color: #667eea;
        color: white;
      }
      
      &.copied {
        background: rgba(72, 187, 120, 0.8);
        border-color: #48bb78;
        color: white;
        cursor: default;
      }
    }
    
    .markdown-content :deep(.code-copy-icon) {
      font-size: 11px;
    }
    
    // Dark mode styles
    :host-context(.dark-mode) {
      .markdown-content :deep(.code-copy-button) {
        background: rgba(0, 0, 0, 0.9);
        color: #e2e8f0;
        border-color: #4a5568;
        
        &:hover:not(.copied) {
          background: rgba(102, 126, 234, 0.9);
          border-color: #667eea;
        }
        
        &.copied {
          background: rgba(104, 211, 145, 0.9);
          border-color: #68d391;
        }
      }
    }
  `]
})
export class MarkdownContentComponent implements AfterViewInit {
  private markdownService = inject(MarkdownService);
  private sanitizer = inject(DomSanitizer);
  private clipboard = inject(Clipboard);
  private elementRef = inject(ElementRef);
  
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
    // Replace <pre><code> blocks with wrapped containers that include copy buttons
    return html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attributes, content) => {
      const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
      return `
        <div class="code-block-container">
          <button class="code-copy-button" data-code-id="${codeId}" aria-label="Copy code">
            <i class="pi pi-copy code-copy-icon"></i>
            <span class="copy-text">Copy</span>
          </button>
          <pre><code${attributes} data-code-id="${codeId}">${content}</code></pre>
        </div>
      `;
    });
  }
  
  private addCopyListeners() {
    // Use setTimeout to ensure the DOM is fully rendered
    setTimeout(() => {
      const copyButtons = this.elementRef.nativeElement.querySelectorAll('.code-copy-button');
      copyButtons.forEach((button: HTMLElement) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          this.handleCopyClick(button);
        });
      });
    });
  }
  
  private handleCopyClick(button: HTMLElement) {
    const codeId = button.getAttribute('data-code-id');
    const codeElement = this.elementRef.nativeElement.querySelector(`code[data-code-id="${codeId}"]`);
    
    if (codeElement) {
      const codeText = codeElement.textContent || '';
      const success = this.clipboard.copy(codeText);
      
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
} 