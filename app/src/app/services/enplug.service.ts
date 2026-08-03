import { Injectable } from '@angular/core';

declare const enplug: any;

@Injectable({ providedIn: 'root' })
export class EnplugService {
  appStatus = enplug.appStatus;
  assets = enplug.assets;
  notifications = enplug.notifications;
  playRecorder = enplug.playRecorder;
  settings = enplug.settings;
  signageOs = enplug.signageOs;
  on = enplug.on;
  off = enplug.off;
  once = enplug.once;
}
