import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetComponent } from './asset/asset.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';
import { HasAssetsResolver } from './resolvers/has-assets.resolver';

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
    FormsModule
  ],
  providers: [
    AssetResolver,
    AssetsResolver,
    HasAssetsResolver
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
