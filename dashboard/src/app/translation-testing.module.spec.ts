import { NgModule } from '@angular/core';
import { provideTestingLanguagePreload } from '@enplug/components/transloco';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';

import en from '../assets/i18n/en.json';

@NgModule({
  imports: [
    TranslocoTestingModule.withLangs(
      { en },
      { availableLangs: ['en'], defaultLang: 'en' }
    ),
    TranslocoMessageFormatModule.init()
  ],
  exports: [
    TranslocoTestingModule
  ],
  providers: [
    provideTestingLanguagePreload()
  ]
})
export class TranslationTestingModule { }
