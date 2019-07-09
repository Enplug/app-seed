import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EnplugService } from './services/enplug.service';

const GET_USER_TIMEOUT = 2000;

export function translationInitializer(enplug: EnplugService, translate: TranslateService) {
  return () => new Promise<void>((resolve, reject) => {
    let complete = false;

    // Timeout to listen to getUser. If called from outside Enplug, will time out.
    // Remove this for production code - it's here only for the tests
    setTimeout(() => {
      if (!complete) {
        return resolve();
      }
    }, GET_USER_TIMEOUT);

    return enplug.account.getUser().then(
      ({ data: { locale } }) => {
        if (locale && typeof locale === 'string' && locale.substr(0, 2) !== 'en') {
          translate.getTranslation(locale).pipe(catchError(() => EMPTY)).subscribe(
            translations => {
              translate.setTranslation('locale', translations);
              translate.use(locale);
            },
            reject,
            () => {
              complete = true;
              resolve();
            }
          );
        } else {
          complete = true;
          resolve();
        }
      }).catch(
      (err) => {
        complete = true;
        return reject(err);
      });
  });
}
