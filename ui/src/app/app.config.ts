import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PushNotificationService } from './shared/services/push-notification.service';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { QueryClient } from '@ngneat/query';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';

function getStoredLanguage(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('selectedLanguage') || 'en';
  }
  return 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideTanStackQuery(new QueryClient()),
    provideTranslateService({
      defaultLanguage: getStoredLanguage(),
      useDefaultLang: true,
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (pushService: PushNotificationService) => async () => {
        await pushService.initialize();
      },
      deps: [PushNotificationService],
      multi: true,
    },
  ],
};
