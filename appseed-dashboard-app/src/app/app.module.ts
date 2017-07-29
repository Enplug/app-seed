import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';
import { AppComponent } from './app.component';
import { AssetComponent } from './asset/asset.component';
import { AssetListComponent } from './asset-list/asset-list.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AssetComponent,
    AssetListComponent,
  ],
  providers: [
    AssetResolver,
    AssetsResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
