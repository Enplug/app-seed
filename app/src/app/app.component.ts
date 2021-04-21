import { Component, OnInit } from '@angular/core';
import { AssetValue } from '../../../shared/asset-value';

import { EnplugService } from './enplug.service';

@Component({
  selector: 'ep-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  asset: AssetValue;

  constructor(private enplug: EnplugService) {}

  async ngOnInit() {
    try {
      await this.enplug.appStatus.registerServiceWorker('App Seed');
    } catch (err) {
      console.error(err);
    } finally {
      await this.initApp();
    }
  }

  private async initApp() {
    this.asset = await this.enplug.assets.getNext();
    this.enplug.appStatus.start();

    this.enplug.on('destroy', (done) => {
      done();
    });
  }
}
