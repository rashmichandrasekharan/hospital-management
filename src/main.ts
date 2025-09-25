import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import 'zone.js';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(FormsModule),   // keep Forms
    provideRouter(routes),
    provideHttpClient(withFetch())      // ✅ modern way
  ]
}).catch(err => console.error(err));
