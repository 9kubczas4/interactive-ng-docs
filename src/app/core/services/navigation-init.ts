import { inject } from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import { NavigationItem, NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export function navigationInitializer() {
  const navigationService = inject(NavigationService);
  const router = inject(Router);
  return navigationService.getNavigation().pipe(
    tap((items: NavigationItem[]) => {
      const routes = NavigationService.generateRoutes(items ?? []);
      router.resetConfig(routes);
    })
  );
}

export const provideNavigationInitializer = [provideAppInitializer(navigationInitializer)];
