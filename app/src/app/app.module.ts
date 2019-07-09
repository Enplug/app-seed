import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';
import { translationInitializer } from './translation.initializer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({})
  ],
  providers: [
    EnplugService,
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitializer,
      deps: [
        EnplugService,
        TranslateService,
        HttpClient
      ],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
