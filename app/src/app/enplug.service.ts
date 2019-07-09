import { Injectable } from '@angular/core';

/**
 * This service proxies Enplug Player API for using in components as it is
 */

@Injectable()
export class EnplugService {
  appStatus = enplug.appStatus;
  assets = enplug.assets;
  notifications = enplug.notifications;
  playRecorder = enplug.playRecorder;
  settings = enplug.settings;
  on = enplug.on;
  off = enplug.off;
  once = enplug.once;
}
