import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EnplugService } from '../services/enplug.service';

export const hasAssetsResolver: ResolveFn<boolean> = async () => {
  const enplug = inject(EnplugService);
  try {
    const assets = await enplug.account.getAssets();
    return assets?.length > 0;
  } catch {
    return false;
  }
};
