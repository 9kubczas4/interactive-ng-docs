import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    this.configureMarked();
  }
  
  private configureMarked(): void {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }
  
  convertToHtml(markdown: string): string {
    const result = marked.parse(markdown);
    return typeof result === 'string' ? result : '';
  }
  
  async convertToHtmlAsync(markdown: string): Promise<string> {
    const result = await marked.parse(markdown);
    return typeof result === 'string' ? result : '';
  }
} 