import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  providers: [
    AssetResolver,
    AssetsResolver,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
