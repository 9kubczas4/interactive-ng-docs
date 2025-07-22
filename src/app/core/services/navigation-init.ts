import { inject } from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';

export function navigationInitializer() {
  const navigationService = inject(NavigationService);
  const router = inject(Router);

  return navigationService
    .getNavigation()
    .toPromise()
    .then(items => {
      const routes = NavigationService.generateRoutes(items ?? []);
      router.resetConfig(routes);
    })
    .catch(error => {
      console.warn('Failed to load navigation JSON, using default routes:', error);
      // Don't throw error - let the app continue with default routes
      // The navigation will be loaded when the app is ready in the browser
    });
}

export const provideNavigationInitializer = [provideAppInitializer(navigationInitializer)];
