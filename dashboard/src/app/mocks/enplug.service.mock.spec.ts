import { Provider } from '@angular/core';
import { EnplugService } from 'app/services/enplug.service';
import { Asset, Button, DeployDialogOptions, DisplaySelectorCallback, EnplugDashboardSDK, EnplugUser, OpenConfirmOptions } from '@enplug/sdk-dashboard/types';

export type Partialize<T> = {
  [P in keyof T]: Partial<T[P]>;
};

class MockEnplugService implements Partialize<EnplugDashboardSDK> {
  account = {
    deleteAsset: (id: string | string[]) => Promise.resolve(),
    getUser: () => Promise.resolve({ has: { limitedAccess: false } } as EnplugUser),
    getAssets: <T>() => Promise.resolve([] as T[]),
    saveAsset: <T>(asset: Asset<T>, dialogOptions?: DeployDialogOptions) => Promise.resolve(asset),
    updateAssetOrder: <T>(assets: string[] | Array<Asset<T>>) => Promise.resolve(),
  };
  dashboard = {
    errorIndicator: (message: string) => Promise.resolve(),
    loadingIndicator: (message: string) => Promise.resolve(),
    openConfirm: (options: OpenConfirmOptions) => Promise.resolve(),
    pageLoading: (value: boolean) => Promise.resolve(value),
    setAppHasUnsavedChanges: (hasUnsavedChanges: boolean) => Promise.resolve(),
    setDisplaySelectorCallback: (callback: DisplaySelectorCallback) => {},
    setDisplaySelectorVisibility: (show: boolean) => Promise.resolve(),
    setHeaderTitle: (title: string) => Promise.resolve(title),
    setHeaderButtons: (buttons: Button[] | Button) => {},
    successIndicator: (message: string) => Promise.resolve(),
  };
  social = {};
};

export function getEnplugServiceMock(): Provider {
  return {
    provide: EnplugService,
    useClass: MockEnplugService,
  }
}
