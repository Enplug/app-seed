import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EnplugService } from '@enplug/components/enplug';
import { Asset } from '@enplug/sdk-dashboard/types';
import { AssetValue } from '../../../../shared/asset-value';

@Injectable()
export class AssetResolver implements Resolve<Asset<AssetValue>> {
  constructor(private enplug: EnplugService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise<Asset<AssetValue>>((resolve, reject) => {
      const assetId = route.params.id;

      if (assetId) {
        this.enplug.account.getAssets<AssetValue>().then(assets => {
          const foundAsset = assets.find( ({Id}) => Id === assetId);

          if (foundAsset) {
            resolve(foundAsset);
          } else {
            reject(null);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }
}
