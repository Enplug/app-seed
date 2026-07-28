import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  Injectable,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {
  provideTransloco,
  TranslocoLoader,
  Translation,
  TranslocoService,
} from '@jsverse/transloco';
import { Observable, forkJoin, of, catchError, map, firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    const sources = [
      this.http
        .get<Translation>(`assets/i18n/${lang}.json`)
        .pipe(catchError(() => of({} as Translation))),
      this.http
        .get<Translation>(`assets/components2/i18n/${lang}.json`)
        .pipe(catchError(() => of({} as Translation))),
    ];

    return forkJoin(sources).pipe(
      map((translations: Translation[]) => {
        return translations.reduce(
          (acc: Translation, curr: Translation) => ({ ...acc, ...curr }),
          {} as Translation
        );
      })
    );
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: 'en',
        missingHandler: {
          useFallbackTranslation: true,
          logMissingKey: !isDevMode(),
        },
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (transloco: TranslocoService) => {
        return () => firstValueFrom(transloco.load('en'));
      },
      deps: [TranslocoService],
      multi: true,
    },
  ],
};
