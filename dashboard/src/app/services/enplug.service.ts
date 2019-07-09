import { Injectable } from '@angular/core';
import {
  Account,
  Asset,
  DeployDialogOptions,
  DisplayGroup,
  FilepickerOptions,
  FilepickerUploadedFile,
  OpenConfirmOptions,
  Theme,
  ThemeAsset,
  User
} from '@enplug/dashboard-sdk';
import { promisify } from '../utils/promisify';

/*tslint:disable:no-string-literal*/
const enplug = window.enplug;

/**
 * An angular service wrapper on Enplug Dashboard SDK.
 * Is typed and converts callbacks to promises :).
 */

@Injectable({
  providedIn: 'root'
})
export class EnplugService {
  account = {
    getAccount: () => {
      return promisify<Account>(enplug.account.getAccount, enplug.account)();
    },

    getUser: () => {
      return promisify<User>(enplug.account.getUser, enplug.account)();
    },

    getDisplayGroups: () => {
      return promisify<DisplayGroup[]>(enplug.account.getDisplayGroups, enplug.account)();
    },

    getSelectedDisplayId: () => {
      return promisify<string|null>(enplug.account.getSelectedDisplayId, enplug.account)();
    },

    getAssets: <T>() => {
      return promisify<Asset<T>[]>(enplug.account.getAssets, enplug.account)();
    },

    saveAsset: <T>(asset: Asset<T>, dialogOptions?: DeployDialogOptions) => {
      return promisify<Asset<T>>(enplug.account.saveAsset, enplug.account)(asset, dialogOptions);
    },

    deleteAsset: (id: string | string[]) => {
      return promisify<void>(enplug.account.deleteAsset, enplug.account)(id);
    },

    getThemes: (appId: string) => {
      return promisify<Theme[]>(enplug.account.getThemes, enplug.account)(appId);
    },

    getTheme: (themeId: string) => {
      return promisify<Theme>(enplug.account.getTheme, enplug.account)(themeId);
    },

    editTheme: <T>(themeDef: {},
                   theme: Theme,
                   previewUrl: string,
                   previewAsset?: Asset<T>[],
                   layout?: any,
                   fonts?: any) => {
      return promisify<any>(enplug.account.editTheme, enplug.account)(themeDef, theme, previewUrl, layout, fonts);
    },

    saveTheme: (theme: Theme) => {
      return promisify<void>(enplug.account.saveTheme, enplug.account)(theme);
    },

    deleteTheme: (themeId: string) => {
      return promisify<void>(enplug.account.deleteTheme, enplug.account)(themeId);
    }
  };

  dashboard = {
    confirmUnsavedChanges: () => {
      return promisify<void>(enplug.dashboard.confirmUnsavedChanges, enplug.dashboard)();
    },


    errorIndicator: (message: string) => {
      return promisify<void>(enplug.dashboard.errorIndicator, enplug.dashboard)(message);
    },

    isLoading: enplug.dashboard.isLoading,

    loadingIndicator: (message: string) => {
      return promisify<void>(enplug.dashboard.loadingIndicator, enplug.dashboard)(message);
    },

    navigate: (url: string) => {
      return promisify<void>(enplug.dashboard.navigate, enplug.dashboard)(url);
    },

    openConfirm: (options: OpenConfirmOptions) => {
      return promisify<void>(enplug.dashboard.openConfirm, enplug.dashboard)(options);
    },

    pageError: () => {
      return promisify<void>(enplug.dashboard.pageError, enplug.dashboard)();
    },

    pageLoading: (bool: boolean) => {
      return promisify<void>(enplug.dashboard.pageLoading, enplug.dashboard)(bool);
    },

    pageNotFound: () => {
      return promisify<void>(enplug.dashboard.pageNotFound, enplug.dashboard)();
    },

    preview: (url: string, asset: Asset<any>, theme: ThemeAsset<any>, layout) => {
      return promisify<Theme>(enplug.dashboard.preview, enplug.dashboard)(url, asset, theme, layout);
    },

    setDisplaySelectorCallback: enplug.dashboard.setDisplaySelectorCallback.bind(enplug.dashboard),

    setDisplaySelectorVisibility: (show: boolean) => {
      return promisify<void>(enplug.dashboard.setDisplaySelectorVisibility, enplug.dashboard)(show);
    },

    setHeaderButtons: (buttons: any) => {
      return promisify<Theme>(enplug.dashboard.setHeaderButtons, enplug.dashboard)(buttons);
    },

    setHeaderTitle: (title: string) => {
      return promisify<void>(enplug.dashboard.setHeaderTitle, enplug.dashboard)(title);
    },

    successIndicator: (message: string) => {
      return promisify<Theme>(enplug.dashboard.successIndicator, enplug.dashboard)(message);
    },

    upload: (options: FilepickerOptions) => {
      return promisify<FilepickerUploadedFile[]>(enplug.dashboard.upload, enplug.dashboard)(options);
    }
  };
}
