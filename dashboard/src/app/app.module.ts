import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AssetItemListModule } from '@enplug/components/asset-item-list';
import { getEnvironmentByHostName, provideDashboardLanguagePreload, provideTranslationConfig, TranslocoRootModule } from '@enplug/components/transloco';

import { environment } from 'environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetComponent } from './asset/asset.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';

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
    AssetItemListModule,
    TranslocoRootModule
  ],
  providers: [
    AssetResolver,
    AssetsResolver,
    provideTranslationConfig({
      // TODO: fill the APP_ID
      translationPath: 'apps/APP_ID/dashboard',
      pathOverride: environment.local ? '/assets/i18n' : undefined,
      environment: getEnvironmentByHostName(location?.hostname)
    }),
    provideDashboardLanguagePreload()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
