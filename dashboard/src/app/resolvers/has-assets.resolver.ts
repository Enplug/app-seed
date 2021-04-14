import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { EnplugService } from '../services/enplug.service';

@Injectable()
export class HasAssetsResolver implements Resolve<boolean> {
  constructor(private enplug: EnplugService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const assets = await this.enplug.account.getAssets();
    return assets?.length > 0;
  }
}
