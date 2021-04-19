import { Provider } from '@angular/core';
import { EnplugService } from 'app/services/enplug.service';
import { Asset, Button, DeployDialogOptions, DisplaySelectorCallback, EnplugDashboardSDK, EnplugUser } from '@enplug/sdk-dashboard/types';

export type Partialize<T> = {
  [P in keyof T]: Partial<T[P]>;
};

class MockEnplugService implements Partialize<EnplugDashboardSDK> {
  account = {
    getUser: () => Promise.resolve({ has: { limitedAccess: false } } as EnplugUser),
    getAssets: <T>() => Promise.resolve([] as T[]),
    saveAsset: <T>(asset: Asset<T>, dialogOptions?: DeployDialogOptions) => Promise.resolve(asset),
  };
  dashboard = {
    pageLoading: (value: boolean) => Promise.resolve(value),
    setAppHasUnsavedChanges: (hasUnsavedChanges: boolean) => Promise.resolve(),
    setDisplaySelectorCallback: (callback: DisplaySelectorCallback) => {},
    setDisplaySelectorVisibility: (show: boolean) => Promise.resolve(),
    setHeaderTitle: (title: string) => Promise.resolve(title),
    setHeaderButtons: (buttons: Button[] | Button) => {},
  };
  social = {};
};

export function getEnplugServiceMock(): Provider {
  return {
    provide: EnplugService,
    useClass: MockEnplugService,
  }
}
