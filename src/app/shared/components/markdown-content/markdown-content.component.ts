import { Component, ChangeDetectionStrategy, input, computed, inject, AfterViewInit, ElementRef, signal, effect } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownService } from 'src/app/core/services/markdown.service';
import { Clipboard } from '@angular/cdk/clipboard';
import hljs from 'highlight.js';

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
    
         // Highlight.js Light Theme
     ::ng-deep .markdown-content .hljs {
       background: #f8f9fa !important;
       color: #383a42 !important;
     }
     
     ::ng-deep .markdown-content .hljs-comment,
     ::ng-deep .markdown-content .hljs-quote {
       color: #a0a1a7 !important;
       font-style: italic;
     }
     
     ::ng-deep .markdown-content .hljs-keyword,
     ::ng-deep .markdown-content .hljs-selector-tag,
     ::ng-deep .markdown-content .hljs-addition {
       color: #a626a4 !important;
     }
     
     ::ng-deep .markdown-content .hljs-number,
     ::ng-deep .markdown-content .hljs-string,
     ::ng-deep .markdown-content .hljs-meta .hljs-meta-string,
     ::ng-deep .markdown-content .hljs-literal,
     ::ng-deep .markdown-content .hljs-doctag,
     ::ng-deep .markdown-content .hljs-regexp {
       color: #50a14f !important;
     }
     
     ::ng-deep .markdown-content .hljs-title,
     ::ng-deep .markdown-content .hljs-section,
     ::ng-deep .markdown-content .hljs-name,
     ::ng-deep .markdown-content .hljs-selector-id,
     ::ng-deep .markdown-content .hljs-selector-class {
       color: #c18401 !important;
     }
     
     ::ng-deep .markdown-content .hljs-attribute,
     ::ng-deep .markdown-content .hljs-attr,
     ::ng-deep .markdown-content .hljs-variable,
     ::ng-deep .markdown-content .hljs-template-variable,
     ::ng-deep .markdown-content .hljs-class .hljs-title,
     ::ng-deep .markdown-content .hljs-type {
       color: #986801 !important;
     }
     
     ::ng-deep .markdown-content .hljs-symbol,
     ::ng-deep .markdown-content .hljs-bullet,
     ::ng-deep .markdown-content .hljs-subst,
     ::ng-deep .markdown-content .hljs-meta,
     ::ng-deep .markdown-content .hljs-meta .hljs-keyword,
     ::ng-deep .markdown-content .hljs-selector-attr,
     ::ng-deep .markdown-content .hljs-selector-pseudo,
     ::ng-deep .markdown-content .hljs-link {
       color: #4078f2 !important;
     }
     
     ::ng-deep .markdown-content .hljs-built_in,
     ::ng-deep .markdown-content .hljs-deletion {
       color: #e45649 !important;
     }
     
     ::ng-deep .markdown-content .hljs-formula {
       background: #eee8d5 !important;
     }
     
     ::ng-deep .markdown-content .hljs-emphasis {
       font-style: italic;
     }
     
     ::ng-deep .markdown-content .hljs-strong {
       font-weight: bold;
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
       
       // Highlight.js Dark Theme
       ::ng-deep .markdown-content .hljs {
         background: #282c34 !important;
         color: #abb2bf !important;
       }
       
       ::ng-deep .markdown-content .hljs-comment,
       ::ng-deep .markdown-content .hljs-quote {
         color: #5c6370 !important;
         font-style: italic;
       }
       
       ::ng-deep .markdown-content .hljs-keyword,
       ::ng-deep .markdown-content .hljs-selector-tag,
       ::ng-deep .markdown-content .hljs-addition {
         color: #c678dd !important;
       }
       
       ::ng-deep .markdown-content .hljs-number,
       ::ng-deep .markdown-content .hljs-string,
       ::ng-deep .markdown-content .hljs-meta .hljs-meta-string,
       ::ng-deep .markdown-content .hljs-literal,
       ::ng-deep .markdown-content .hljs-doctag,
       ::ng-deep .markdown-content .hljs-regexp {
         color: #98c379 !important;
       }
       
       ::ng-deep .markdown-content .hljs-title,
       ::ng-deep .markdown-content .hljs-section,
       ::ng-deep .markdown-content .hljs-name,
       ::ng-deep .markdown-content .hljs-selector-id,
       ::ng-deep .markdown-content .hljs-selector-class {
         color: #e06c75 !important;
       }
       
       ::ng-deep .markdown-content .hljs-attribute,
       ::ng-deep .markdown-content .hljs-attr,
       ::ng-deep .markdown-content .hljs-variable,
       ::ng-deep .markdown-content .hljs-template-variable,
       ::ng-deep .markdown-content .hljs-class .hljs-title,
       ::ng-deep .markdown-content .hljs-type {
         color: #d19a66 !important;
       }
       
       ::ng-deep .markdown-content .hljs-symbol,
       ::ng-deep .markdown-content .hljs-bullet,
       ::ng-deep .markdown-content .hljs-subst,
       ::ng-deep .markdown-content .hljs-meta,
       ::ng-deep .markdown-content .hljs-meta .hljs-keyword,
       ::ng-deep .markdown-content .hljs-selector-attr,
       ::ng-deep .markdown-content .hljs-selector-pseudo,
       ::ng-deep .markdown-content .hljs-link {
         color: #61afef !important;
       }
       
       ::ng-deep .markdown-content .hljs-built_in,
       ::ng-deep .markdown-content .hljs-deletion {
         color: #e06c75 !important;
       }
       
       ::ng-deep .markdown-content .hljs-formula {
         background: #3e4451 !important;
       }
       
       ::ng-deep .markdown-content .hljs-emphasis {
         font-style: italic;
       }
       
       ::ng-deep .markdown-content .hljs-strong {
         font-weight: bold;
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
    // Helper function to escape HTML for data attributes
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };
    
    // Helper function to decode HTML entities
    const decodeHtmlEntities = (html: string): string => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };
    
    // Replace <pre><code> blocks with wrapped containers that include copy buttons
    return html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attributes, content) => {
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
        } catch (error) {
          // If language is not supported, try auto-detection
          try {
            highlightedContent = hljs.highlightAuto(decodedContent).value;
          } catch (autoError) {
            // If all fails, use original content
            highlightedContent = decodedContent;
          }
        }
      } else {
        // Try auto-detection for code blocks without language specification
        try {
          highlightedContent = hljs.highlightAuto(decodedContent).value;
        } catch (autoError) {
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
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
} 