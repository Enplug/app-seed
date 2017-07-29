import '@enplug/dashboard-sdk';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';


const enplug = window['enplug'];

@Injectable()
export class AssetResolver implements Resolve<any[]> {
  resolve(route: ActivatedRouteSnapshot) {
    return enplug.account.getAssets();
  }
}
