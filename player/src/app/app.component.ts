/**
 *  @author Your Name (login@enplug.com)
 */

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'ep-appseed',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
  }


  ngOnInit() {
    enplug.appStatus.start();
  }
}
