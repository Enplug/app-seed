import '@enplug/dashboard-sdk';

import {
  Component,
  OnInit,
} from '@angular/core';


const enplug = window.enplug;

@Component({
  selector: 'ep-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    enplug.dashboard.pageLoading(false);
  }
}
