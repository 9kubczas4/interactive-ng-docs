import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private http = inject(HttpClient);
  
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
  
  loadMarkdownFile(filename: string): Observable<string> {
    return this.http.get(`assets/${filename}`, { responseType: 'text' });
  }
  
  loadMarkdownFileAsHtml(filename: string): Observable<string> {
    return this.loadMarkdownFile(filename).pipe(
      map(markdown => this.convertToHtml(markdown))
    );
  }
} 