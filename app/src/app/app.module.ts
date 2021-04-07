import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { getEnvironmentByHostName, providePlayerLanguagePreload, provideTranslationConfig, TranslocoRootModule } from '@enplug/components/transloco';

import { environment } from 'environments/environment';
import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';

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
    provideTranslationConfig({
      // TODO: fill the APP_ID
      translationPath: 'apps/APP_ID/app',
      pathOverride: environment.local ? '/assets/i18n' : undefined,
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
