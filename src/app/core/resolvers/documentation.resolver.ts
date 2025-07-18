import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { MarkdownService } from '../services/markdown.service';

export interface DocumentationPageData {
  title: string;
  markdownContent: string;
  examples: ExampleItem[];
  breadcrumbs?: string[];
}

export interface ExampleItem {
  title: string;
  description: string;
  component: any;
  code: string;
}

export interface DocumentationRouteData {
  title: string;
  markdownPath: string;
  examples?: ExampleItem[];
  breadcrumbs?: string[];
}

export const documentationResolver: ResolveFn<DocumentationPageData> = (route) => {
  const markdownService = inject(MarkdownService);
  
  // Get route data configuration
  const routeData = route.data as DocumentationRouteData;
  
  if (!routeData || !routeData.markdownPath) {
    return of({
      title: 'Documentation',
      markdownContent: '# Page Not Found\n\nThe requested documentation page could not be found.',
      examples: [],
      breadcrumbs: []
    });
  }
  
  // Load markdown content
  return markdownService.loadMarkdownFile(routeData.markdownPath).pipe(
    map(content => ({
      title: routeData.title,
      markdownContent: content,
      examples: routeData.examples || [],
      breadcrumbs: routeData.breadcrumbs || []
    })),
    catchError(error => {
      console.error('Error loading documentation:', error);
      return of({
        title: routeData.title,
        markdownContent: `# Error Loading Content\n\nFailed to load documentation content for "${routeData.title}".`,
        examples: routeData.examples || [],
        breadcrumbs: routeData.breadcrumbs || []
      });
    })
  );
}; 