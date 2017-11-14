import { Injectable } from '@angular/core';
import {} from '@enplug/sdk-player';

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
