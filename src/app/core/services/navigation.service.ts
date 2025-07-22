import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Routes } from '@angular/router';
import { documentationResolver } from '@core/resolvers/documentation.resolver';

export interface NavigationItem {
  label: string;
  icon?: string;
  path?: string;
  markdownPath?: string;
  children?: NavigationItem[];
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly http = inject(HttpClient);

  private navigation$ = this.http
    .get<NavigationItem[]>('/assets/navigation.json')
    .pipe(shareReplay(1));

  getNavigation(): Observable<NavigationItem[]> {
    return this.navigation$;
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
