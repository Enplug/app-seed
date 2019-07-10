import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { EnplugService } from './services/enplug.service';

export function translationInitializer(enplug: EnplugService, translate: TranslateService) {
  return () => new Promise<void>((resolve, reject) => {
    // Skip translation initialization in tests scenario. Check angular.json for details
    if (environment.testing) {
      return resolve();
    }

    return enplug.account.getUser().then(({ data: { locale } }) => {
      if (locale && typeof locale === 'string') {
        translate.getTranslation(locale).pipe(catchError(() => EMPTY)).subscribe(
          translations => {
            translate.setTranslation('locale', translations);
            translate.use(locale);
          },
          reject,
          () => {
            resolve();
          }
        );
      } else {
        resolve();
      }
    }).catch((err) => {
      return reject(err);
    });
  });
}
