import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { EnplugService } from './enplug.service';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslatePoHttpLoader } from '@biesbjerg/ngx-translate-po-http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { translationInitializer } from './translation.initializer';

export function HttpLoaderFactory(http: HttpClient) {
  console.error('[APP SEED] Please set player-side translation url here.');
  return new TranslatePoHttpLoader(http, '/i18n/apps/APPID/player');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    EnplugService,
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitializer,
      deps: [EnplugService, TranslateService, HttpClient],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
