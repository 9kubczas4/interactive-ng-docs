import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideServerRendering } from '@angular/platform-server';
import { getAppProviders } from './app/app.config';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      ...getAppProviders([]), // <-- Provide routes here or inject dynamically
      provideServerRendering(),
    ],
  });

export default bootstrap;
