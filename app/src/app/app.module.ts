import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { getEnvironmentByHostName, providePlayerLanguagePreload, provideTranslationConfig, TranslocoRootModule } from '@enplug/components/transloco';

import { environment } from 'environments/environment';
import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';

import enTranslation from '../assets/i18n/en.json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslocoRootModule
  ],
  providers: [
    EnplugService,
    // TODO: remove if translations not needed in this project
    provideTranslationConfig({
      translationPath: 'apps/APP_ID/app', // TODO: fill the APP_ID
      pathOverride: environment.local ? '/assets/i18n' : undefined,
      defaultTranslation: enTranslation,
      environment: getEnvironmentByHostName(location?.hostname)
    }),
    providePlayerLanguagePreload()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
