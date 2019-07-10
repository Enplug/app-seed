import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EnplugService } from './services/enplug.service';

export function translationInitializer(enplug: EnplugService, translate: TranslateService) {
  return () => new Promise<void>((resolve, reject) => {
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
