import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withFetch } from '@angular/common/http';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(appRoutes),
      provideAnimations(),
      provideHttpClient(withFetch()),
      provideServerRendering(),
      providePrimeNG({
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: '.dark-mode',
          },
        },
      }),
    ],
  });

export default bootstrap;
