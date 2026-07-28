import { Injectable } from '@angular/core';

declare const enplug: any;

@Injectable({ providedIn: 'root' })
export class EnplugService {
  dashboard = enplug.dashboard;
  account = enplug.account;
  social = enplug.social;
}
