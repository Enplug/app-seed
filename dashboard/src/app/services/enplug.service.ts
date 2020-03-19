import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnplugService {
  account = enplug.account;
  dashboard = enplug.dashboard;
  social = enplug.social;
}
