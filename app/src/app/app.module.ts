import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  providers: [
    EnplugService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
