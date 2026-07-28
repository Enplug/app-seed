import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { EnplugService } from '../services/enplug.service';
import { AssetValue } from '../../../../shared/asset-value';

export interface Asset<T> {
  Id?: string;
  Value: T;
  JsonValue?: T;
  VenueIds?: string[];
  Order?: number;
  Schedule?: {
    IsPriority?: boolean;
  };
}

export const assetResolver: ResolveFn<Asset<AssetValue> | null> = async (
  route: ActivatedRouteSnapshot
) => {
  const enplug = inject(EnplugService);
  const assetId = route.params['id'];

  if (assetId) {
    try {
      const assets = await enplug.account.getAssets();
      const foundAsset = assets.find(({ Id }: Asset<AssetValue>) => Id === assetId);
      return foundAsset || null;
    } catch {
      return null;
    }
  }
  return null;
};
