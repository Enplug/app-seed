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

import enTranslation from '../assets/i18n/en.json';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AssetComponent,
    AssetListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AssetItemListModule,
    MatInputModule,
    TranslocoRootModule
  ],
  providers: [
    AssetResolver,
    AssetsResolver,
    provideTranslationConfig({
      translationPath: 'apps/APP_ID/dashboard', // TODO: fill the APP_ID
      pathOverride: environment.local ? '/assets/i18n' : undefined,
      defaultTranslation: enTranslation,
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
