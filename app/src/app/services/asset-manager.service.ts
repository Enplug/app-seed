import { Injectable, inject } from '@angular/core';
import { EnplugService } from './enplug.service';
import { Asset, AssetType, AssetDisplayConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class AssetManagerService {
  private readonly enplug = inject(EnplugService);

  async getNextAsset(): Promise<Asset | null> {
    try {
      const asset = await this.enplug.assets.getNext();

      if (!asset || !asset.Mimetype) {
        console.warn('[AssetManager] Invalid asset received:', asset);
        return null;
      }

      return asset;
    } catch (err) {
      console.error('[AssetManager] Error fetching asset:', err);
      return null;
    }
  }

  getAssetType(asset: Asset): AssetType {
    if (!asset?.Mimetype) {
      return 'custom';
    }

    if (asset.Mimetype.startsWith('image')) {
      return 'image';
    }

    if (asset.Mimetype.startsWith('video')) {
      return 'video';
    }

    return 'custom';
  }

  async getDisplayConfig(): Promise<AssetDisplayConfig> {
    try {
      const [is4K, settings] = await Promise.all([
        this.enplug.settings.is4K,
        this.enplug.settings.all,
      ]);

      return {
        is4K: is4K || false,
        isSignageOs: settings?.isSignageOs || false,
        autoPlay: true,
      };
    } catch (err) {
      console.error('[AssetManager] Error getting display config:', err);
      return {
        is4K: false,
        isSignageOs: false,
        autoPlay: true,
      };
    }
  }

  getAssetUrl(asset: Asset, is4K: boolean): string {
    if (!asset) {
      console.error('[AssetManager] No asset provided');
      return '';
    }

    let assetUrl = asset.ContentUrl;

    if (is4K && asset.Content4KUrl) {
      assetUrl = asset.Content4KUrl;
      console.log('[AssetManager] Using 4K content URL');
    }

    return assetUrl;
  }

  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve());
      img.addEventListener('error', (err) => reject(err));
      img.src = url;
    });
  }
}
