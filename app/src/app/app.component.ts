import { Component, OnInit } from '@angular/core';

import { EnplugService } from './enplug.service';

@Component({
  selector: 'ep-appseed',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private enplug: EnplugService
  ) {}

  ngOnInit() {
    this.enplug.appStatus.start();

    this.enplug.on('destroy', (done) => {
      done();
    });
  }
}
