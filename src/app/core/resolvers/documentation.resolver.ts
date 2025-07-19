import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { MarkdownService } from '@core/services/markdown.service';
import { DocumentationPageData } from '@shared/interfaces/documentation-page-data';
import { DocumentationRouteData } from '@shared/interfaces/documentation-route-data';

export const documentationResolver: ResolveFn<DocumentationPageData> = route => {
  const markdownService = inject(MarkdownService);

  // Get route data configuration
  const routeData = route.data as DocumentationRouteData;

  if (!routeData || !routeData.markdownPath) {
    return of({
      title: 'Documentation',
      markdownContent: '# Page Not Found\n\nThe requested documentation page could not be found.',
      examples: [],
      breadcrumbs: [],
    });
  }

  // Load markdown content
  return markdownService.loadMarkdownFile(routeData.markdownPath).pipe(
    map(content => ({
      title: routeData.title,
      markdownContent: content,
      examples: routeData.examples || [],
      breadcrumbs: routeData.breadcrumbs || [],
    })),
    catchError(error => {
      console.error('Error loading documentation:', error);
      return of({
        title: routeData.title,
        markdownContent: `# Error Loading Content\n\nFailed to load documentation content for "${routeData.title}".`,
        examples: routeData.examples || [],
        breadcrumbs: routeData.breadcrumbs || [],
      });
    })
  );
};
