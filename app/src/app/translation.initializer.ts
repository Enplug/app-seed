import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { EnplugService } from './enplug.service';

const TAG = 'AppSeed';

export function translationInitializer(enplug: EnplugService, translate: TranslateService) {
  return () => new Promise<void>(async (resolve, reject) => {
    // Skip initialization in E2E scenarios
    if (environment.testing) {
      return resolve();
    }

    let settings;
    try {
      settings = await enplug.settings.all as any;
    } catch (err) {
      console.log('Cannot obtain settings, skipping translation initializer', err);
    }

    const locale = settings && settings.locale;
    if (locale && typeof locale === 'string') {
      console.log(`[${TAG}] Setting locale: ${locale}, awaiting translations...`);

      return translate.getTranslation(locale).pipe(catchError(() => {
        return EMPTY;
      })).subscribe(translations => {
          translate.setTranslation(locale, translations);
          translate.use(locale);
          resolve();
        },
        (err) => reject(err),
        () => resolve()
      );
    }

    return resolve();
  });
}
