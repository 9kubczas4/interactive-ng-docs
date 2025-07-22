import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Routes } from '@angular/router';
import { documentationResolver } from '@core/resolvers/documentation.resolver';
import {
  ExampleItem,
  NavigationExampleItem,
  EXAMPLE_COMPONENT_LOADER,
} from '@shared/interfaces/example-item';

export interface NavigationItem {
  label: string;
  icon?: string;
  path?: string;
  markdownPath?: string;
  children?: NavigationItem[];
  examples?: NavigationExampleItem[];
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly componentMap = inject(EXAMPLE_COMPONENT_LOADER);

  private navigation$ = this.http
    .get<NavigationItem[]>('/assets/navigation.json')
    .pipe(shareReplay(1));

  getNavigation(): Observable<NavigationItem[]> {
    return this.navigation$;
  }

  /**
   * Maps a NavigationExampleItem (from navigation JSON) to an ExampleItem (runtime, with component reference).
   * Uses the component map service for reliable component imports.
   */
  async toExampleItem(navItem: NavigationExampleItem): Promise<ExampleItem> {
    const componentLoader = this.componentMap[navItem.componentPath];

    if (!componentLoader) {
      throw new Error(
        `Component for path '${navItem.componentPath}' not found in component map. ` +
          `Available paths: ${Object.keys(this.componentMap).join(', ')}`
      );
    }

    return {
      title: navItem.title,
      description: navItem.description,
      component: componentLoader,
      markdownPath: navItem.markdownPath,
      category: navItem.category as 'best-practice' | 'bad-example',
    };
  }

  // Recursively generate Angular Routes from navigation JSON
  static generateRoutes(items: NavigationItem[], isRoot = true): Routes {
    const routes: Routes = [];
    if (isRoot) {
      routes.push({ path: '', redirectTo: 'getting-started', pathMatch: 'full' });
    }
    for (const item of items) {
      if (item.path) {
        routes.push({
          path: item.path,
          loadComponent: () =>
            import('@shared/components/documentation-page/documentation-page.component').then(
              m => m.DocumentationPageComponent
            ),
          resolve: {
            documentationData: documentationResolver,
          },
          data: {
            title: item.label,
            markdownPath: item.markdownPath,
            icon: item.icon,
            examples: item.examples,
          },
        });
      }
      if (item.children) {
        routes.push(...NavigationService.generateRoutes(item.children, false));
      }
    }
    return routes;
  }
}
