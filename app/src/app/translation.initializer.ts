import { TranslateService } from '@ngx-translate/core';
import { empty, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnplugService } from './enplug.service';

const TAG = 'AppSeed';

export function translationInitializer(enplug: EnplugService, translate: TranslateService) {
  return () => new Promise<void>(async (resolve, reject) => {
    const settings = await enplug.settings.all as any;
    const locale = settings.locale;
    if (locale && typeof locale === 'string' && locale.substr(0, 2) !== 'en') {
      console.log(`[${TAG}] Setting locale: ${locale}, awaiting translations...`);
      translate.getTranslation(locale).pipe(catchError((e, x) => {
        return EMPTY;
      })).subscribe(translations => {
        translate.setTranslation(locale, translations);
        translate.use(locale);
        resolve();
      }, null, () => {
        resolve();
      });
    }
  });
}
