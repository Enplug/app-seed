import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EnplugService } from '@enplug/components/enplug';
import { Asset } from '@enplug/sdk-dashboard/types';
import { AssetValue } from '../../../../shared/asset-value';

@Injectable()
export class AssetsResolver implements Resolve<Asset<AssetValue>[]> {
  constructor(private enplug: EnplugService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.enplug.account.getAssets<AssetValue>();
  }
}
