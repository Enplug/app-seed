import {
  Account,
  Asset,
  Button,
  DeployDialogOptions,
  DisplayGroup,
  FilepickerOptions,
  FilepickerUploadedFile,
  OpenConfirmOptions,
  Theme,
  ThemeAsset,
  User
  } from '@enplug/dashboard-sdk';
import { Injectable } from '@angular/core';

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
      return new Promise<Account>((resolve, reject) => {
        enplug.account.getAccount(account => { resolve(account); }, error => { reject(error); });
      });
    },

    getUser: () => {
      return new Promise<User>((resolve, reject) => {
      enplug.account.getUser(user => { resolve(user); }, error => { reject(error); });
      });
    },

    getDisplayGroups: () => {
      return new Promise<DisplayGroup[]>((resolve, reject) => {
        enplug.account.getDisplayGroups(groups => { resolve(groups); }, error => { reject(error); });
      });
    },

    getSelectedDisplayId: () => {
      return new Promise<string|null>((resolve, reject) => {
        enplug.account.getSelectedDisplayId(selectedDisplay => { resolve(selectedDisplay); },
          error => { reject(error); });
      });
    },

    getAssets: <T>() => {
      return new Promise<Asset<T>[]>((resolve, reject) => {
        enplug.account.getAssets(assets => { resolve(assets); }, error => { reject(error); });
      });
    },

    saveAsset: <T>(asset: Asset<T>, dialogOptions?: DeployDialogOptions) => {
      return new Promise<Asset<T>>((resolve, reject) => {
        enplug.account.saveAsset(asset, dialogOptions, response => { resolve(response); }, error => { reject(error); });
      });

    },

    deleteAsset: (id: string | string[]) => {
      return new Promise<void>((resolve, reject) => {
        enplug.account.deleteAsset(id, response => { resolve(response); }, error => { reject(error); });
      });
    },

    getThemes: (appId: string) => {
      return new Promise<Theme[]>((resolve, reject) => {
        enplug.account.getThemes(appId, themes => { resolve(themes); }, error => { reject(error); });
      });
    },

    getTheme: (themeId: string) => {
      return new Promise<Theme>((resolve, reject) => {
        enplug.account.getTheme(themeId, theme => { resolve(theme); }, error => { reject(error); });
      });
    },

    editTheme: <T>(themeDef: {},
                    theme: Theme,
                    previewUrl: string,
                    previewAsset?: Asset<T>[],
                    layout?: any,
                    fonts?: any) => {
      return new Promise<any>((resolve, reject) => {
        enplug.account.editTheme(themeDef, theme, previewUrl, layout, fonts,
          response => { resolve(response); }, error => { reject(error); });
      });
    },

    saveTheme: (theme: Theme) => {
      return new Promise<void>((resolve, reject) => {
        enplug.account.saveTheme(theme, response => { resolve(response); }, error => { reject(error) });
      });

    },

    deleteTheme: (themeId: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.account.deleteTheme(themeId, response => { resolve(response); }, error => { reject(error) });
      });
    }
  };

  dashboard = {
    confirmUnsavedChanges: () => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.confirmUnsavedChanges(response => { resolve(response); }, error => { reject(error); } );
      });
    },


    errorIndicator: (message: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.errorIndicator(message, response => { resolve(response); }, error => { reject(error); });
      });
    },

    isLoading: enplug.dashboard.isLoading,

    loadingIndicator: (message: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.loadingIndicator(message, response => { resolve(response); }, error => { reject(error); });
      });
    },

    navigate: (url: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.navigate(url, response => { resolve(response); }, error => { reject(error); });
      });
    },

    openConfirm: (options: OpenConfirmOptions) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.openConfirm(options, response => { resolve(response); }, error => { reject(error); });
      });
    },

    pageError: () => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.pageError(response => { resolve(response); }, error => { reject(error); } );
      });
    },

    pageLoading: (bool: boolean) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.pageLoading(bool, response => { resolve(response); }, error => { reject(error); });
      });
    },

    pageNotFound: () => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.pageNotFound(response => { resolve(response); }, error => { reject(error); } );
      });
    },

    preview: (url: string, asset: Asset<any>, theme: ThemeAsset<any>) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.preview(url, asset, theme, /*layout, fonts,*/
          response => { resolve(response); }, error => { reject(error); });
      });
    },

    setDisplaySelectorCallback: enplug.dashboard.setDisplaySelectorCallback,

    setDisplaySelectorVisibility: (show: boolean) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.setDisplaySelectorVisibility(show, response => { resolve(response); },
          error => { reject(error); });
      });
    },

    setHeaderButtons: (buttons: any) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.setHeaderButtons(buttons, response => { resolve(response); }, error => { reject(error); });
      });
    },

    setHeaderTitle: (title: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.setHeaderTitle(title, response => { resolve(response); }, error => { reject(error); });
      });
    },

    successIndicator: (message: string) => {
      return new Promise<void>((resolve, reject) => {
        enplug.dashboard.successIndicator(message, response => { resolve(response); }, error => { reject(error); });
      });
    },

    upload: (options: FilepickerOptions) => {
      return new Promise<FilepickerUploadedFile[]>((resolve, reject) => {
        enplug.dashboard.upload(options, (files: FilepickerUploadedFile[]) => {
          resolve(files);
        }, error => {
          reject(error);
        });
     });
    }
  }
}
