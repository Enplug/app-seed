import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { EnplugService } from '../services/enplug.service';

@Injectable()
export class AssetsResolver implements Resolve<any[]> {
  constructor(private enplug: EnplugService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.enplug.account.getAssets();
  }
}
