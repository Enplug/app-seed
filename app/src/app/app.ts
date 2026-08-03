import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnplugService } from './services/enplug.service';
import { LifecycleService } from './services/lifecycle.service';
import { AssetManagerService } from './services/asset-manager.service';
import { Asset, AssetType, AssetDisplayConfig } from './models';

const TAG = '[App Seed]';

@Component({
  selector: 'ep-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly enplug = inject(EnplugService);
  private readonly lifecycle = inject(LifecycleService);
  private readonly assetManager = inject(AssetManagerService);
  private readonly cdr = inject(ChangeDetectorRef);

  asset: Asset | null = null;
  assetUrl: string = '';
  assetType: AssetType = 'custom';
  displayConfig: AssetDisplayConfig | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.enplug.appStatus
      .registerServiceWorker('App Seed')
      .then(() => {
        console.log(`${TAG} Service worker registered`);
        this.initApp();
      })
      .catch((err: string) => {
        console.error(`${TAG} Service worker registration failed:`, err);
        this.initApp();
      });

    this.lifecycle.setupDestroyHandler(() => {
      this.cleanup();
    });
  }

  private async initApp(): Promise<void> {
    try {
      this.displayConfig = await this.assetManager.getDisplayConfig();
      console.log(`${TAG} Display config:`, this.displayConfig);

      this.asset = await this.assetManager.getNextAsset();

      if (!this.asset) {
        console.warn(`${TAG} No valid asset found`);
        this.handleError('No asset available');
        return;
      }

      console.log(`${TAG} Asset loaded:`, this.asset.Name);
      this.assetType = this.assetManager.getAssetType(this.asset);
      this.assetUrl = this.assetManager.getAssetUrl(this.asset, this.displayConfig?.is4K || false);

      this.lifecycle.setCurrentAsset(this.asset, this.assetUrl);

      if (this.assetType === 'image') {
        await this.handleImageAsset();
      } else if (this.assetType === 'video') {
        await this.handleVideoAsset();
      } else {
        await this.handleCustomAsset();
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error(`${TAG} Error initializing app:`, err);
      this.handleError('Initialization failed');
    }
  }

  private async handleImageAsset(): Promise<void> {
    try {
      console.log(`${TAG} Loading image asset:`, this.assetUrl);
      await this.assetManager.preloadImage(this.assetUrl);
      await this.lifecycle.startApp();
      console.log(`${TAG} Image asset displayed successfully`);
    } catch (err) {
      console.error(`${TAG} Error loading image:`, err);
      this.handleError('Image load failed');
    }
  }

  private async handleVideoAsset(): Promise<void> {
    try {
      console.log(`${TAG} Preparing video asset:`, this.assetUrl);
      await this.lifecycle.startApp();
      console.log(`${TAG} Video asset ready`);
    } catch (err) {
      console.error(`${TAG} Error preparing video:`, err);
      this.handleError('Video preparation failed');
    }
  }

  private async handleCustomAsset(): Promise<void> {
    try {
      console.log(`${TAG} Loading custom asset`);
      await this.lifecycle.startApp();
      console.log(`${TAG} Custom asset displayed successfully`);
    } catch (err) {
      console.error(`${TAG} Error loading custom asset:`, err);
      this.handleError('Custom asset load failed');
    }
  }

  private handleError(message: string): void {
    console.error(`${TAG} ${message}`);
    this.hasError = true;
    this.isLoading = false;
    this.cdr.detectChanges();
    this.lifecycle.hideApp().catch((err) => {
      console.error(`${TAG} Error hiding app after error:`, err);
    });
  }

  private cleanup(): void {
    console.log(`${TAG} Cleaning up resources`);
    this.asset = null;
    this.assetUrl = '';
    this.cdr.detectChanges();
  }

  get imageAssetStyle(): any {
    if (this.assetType !== 'image' || !this.assetUrl) {
      return {};
    }

    return {
      'background-image': `url('${this.assetUrl}')`,
      'background-size': 'contain',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      width: '100%',
      height: '100%',
    };
  }
}
