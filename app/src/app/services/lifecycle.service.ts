import { Injectable, inject } from '@angular/core';
import { EnplugService } from './enplug.service';

@Injectable({ providedIn: 'root' })
export class LifecycleService {
  private readonly enplug = inject(EnplugService);
  private assetDisplayStartTime: number | null = null;
  private currentAsset: any = null;
  private currentAssetUrl: string | null = null;

  async startApp(): Promise<void> {
    try {
      await this.enplug.appStatus.start();
      this.assetDisplayStartTime = Date.now();
      console.log('[LifecycleService] App started successfully');
    } catch (err) {
      console.error('[LifecycleService] Error starting app:', err);
      throw err;
    }
  }

  async hideApp(): Promise<void> {
    try {
      await this.enplug.appStatus.hide();
      this.cleanup();
      console.log('[LifecycleService] App hidden successfully');
    } catch (err) {
      console.error('[LifecycleService] Error hiding app:', err);
      throw err;
    }
  }

  async reportPlaytime(asset: any, assetUrl: string): Promise<void> {
    if (!this.assetDisplayStartTime) {
      return;
    }

    try {
      const secondsPlayed = Math.round((Date.now() - this.assetDisplayStartTime) / 1000);
      await this.enplug.playRecorder.report(asset.id, assetUrl, secondsPlayed, asset.Name);
      console.log(`[LifecycleService] Reported ${secondsPlayed}s playtime for ${asset.Name}`);
      this.assetDisplayStartTime = null;
    } catch (err) {
      console.error('[LifecycleService] Error reporting playtime:', err);
      throw err;
    }
  }

  async reportAndHide(asset: any, assetUrl: string): Promise<void> {
    try {
      await this.reportPlaytime(asset, assetUrl);
      await this.hideApp();
    } catch (err) {
      console.error('[LifecycleService] Error in reportAndHide:', err);
      await this.hideApp();
    }
  }

  setCurrentAsset(asset: any, assetUrl: string): void {
    this.currentAsset = asset;
    this.currentAssetUrl = assetUrl;
  }

  cleanup(): void {
    if (this.currentAsset?.blob) {
      this.currentAsset.blob = null;
    }
    this.currentAsset = null;
    this.currentAssetUrl = null;
    this.assetDisplayStartTime = null;
  }

  setupDestroyHandler(callback?: () => void): void {
    this.enplug.on('destroy', async (done: () => void) => {
      console.log('[LifecycleService] Destroy event received');

      if (this.currentAsset && this.currentAssetUrl) {
        await this.reportPlaytime(this.currentAsset, this.currentAssetUrl);
      }

      this.cleanup();

      if (callback) {
        callback();
      }

      done();
    });
  }
}
