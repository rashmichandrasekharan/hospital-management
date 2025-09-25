import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { type BootstrapContext } from '@angular/platform-browser';

export default function bootstrap(context: unknown) {
  return bootstrapApplication(App, {
    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      provideClientHydration(),
    ],
  }, context as BootstrapContext);
}


