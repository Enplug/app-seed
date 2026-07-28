import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EnplugService } from '../services/enplug.service';
import { AssetValue } from '../../../../shared/asset-value';
import { Asset } from './asset.resolver';

export const assetsResolver: ResolveFn<Asset<AssetValue>[]> = async () => {
  const enplug = inject(EnplugService);
  try {
    return await enplug.account.getAssets();
  } catch {
    return [];
  }
};
