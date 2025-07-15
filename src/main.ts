import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { definePreset } from '@primeng/themes';

const MyPreset = definePreset(Aura, {
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
          950: '{indigo.950}'
      }
  }
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(appRoutes),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark-mode',
        }
      }
    })
  ]
}).catch(err => console.error(err)); 