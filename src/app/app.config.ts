import { importProvidersFrom } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { provideNavigationInitializer } from './core/services/navigation-init';
import { EXAMPLE_COMPONENT_LOADER } from '@shared/interfaces/example-item';
import { EXAMPLE_COMPONENT_MAP } from '@core/consts/example-components-map';

const docsPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
});

// Shared provider factory for both CSR and SSG
export function getAppProviders(routes: Route[]) {
  return [
    importProvidersFrom(BrowserModule),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: docsPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    ...provideNavigationInitializer,
    {
      provide: EXAMPLE_COMPONENT_LOADER,
      useValue: EXAMPLE_COMPONENT_MAP,
    },
  ];
}
