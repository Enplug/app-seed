import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AssetComponent } from './asset/asset.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { translationInitializer } from './translation.initializer';
import { EnplugService } from './services/enplug.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({})
  ],
  declarations: [
    AppComponent,
    AssetComponent,
    AssetListComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
