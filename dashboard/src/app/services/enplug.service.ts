import { Injectable } from '@angular/core';

/**
 * An angular service wrapper on Enplug Dashboard SDK.
 */

@Injectable({
  providedIn: 'root'
})
export class EnplugService {
  dashboard = enplug.dashboard;
  account = enplug.account;
  social = enplug.social;
}
