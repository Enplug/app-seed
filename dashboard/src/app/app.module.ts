import { HttpClient, HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslatePoHttpLoader } from '@biesbjerg/ngx-translate-po-http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetComponent } from './asset/asset.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';
import { EnplugService } from './services/enplug.service';
import { translationInitializer } from './translation.initializer';

export function HttpLoaderFactory(http: HttpClient) {
  console.error('[APPSEED] PLEASE SET DASHBOARD TRANSLATION URL HERE');
  return new TranslatePoHttpLoader(http, '/i18n/apps/APPID/dashboard');
}

@NgModule({
  declarations: [
    AppComponent,
    AssetComponent,
    AssetListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    AssetResolver,
    AssetsResolver,
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitializer,
      deps: [
        EnplugService,
        TranslateService
      ],
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
