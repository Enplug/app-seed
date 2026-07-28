import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '@enplug/components2';
import { EnplugService } from '../services/enplug.service';
import { AssetValue } from '../../../../shared/asset-value';
import { Asset } from '../resolvers/asset.resolver';

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

@Component({
  selector: 'ep-asset',
  standalone: true,
  imports: [FormsModule, CommonModule, TextInputComponent],
  templateUrl: './asset.html',
  styleUrl: './asset.scss',
})
export class AssetComponent implements OnInit {
  private readonly enplug = inject(EnplugService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly zone = inject(NgZone);

  asset!: Asset<AssetValue>;
  originalAsset!: Asset<AssetValue>;

  get isNewAsset(): boolean {
    return !this.asset?.Id;
  }

  get hasChanges(): boolean {
    if (this.isNewAsset) return true;
    return JSON.stringify(this.asset) !== JSON.stringify(this.originalAsset);
  }

  get namePlaceholder(): string {
    return 'New Asset';
  }

  ngOnInit(): void {
    this.enplug.dashboard.pageLoading(false);

    this.asset = this.route.snapshot.data['asset'] || this.getInitialAsset();
    this.originalAsset = cloneDeep(this.asset);

    this.zone.run(() => {
      this.updateHeader();
    });

    if (this.asset?.Id) {
      this.enplug.account.touchAsset(this.asset.Id);
    }
  }

  onAssetChange(): void {
    this.updateHeader();
  }

  private updateHeader(): void {
    this.enplug.dashboard.setHeaderTitle(this.isNewAsset ? 'New Asset' : 'Edit Asset');

    const buttons: any[] = [];

    if (this.route.snapshot.data['hasAssets'] === true) {
      buttons.push({
        text: 'My Assets',
        action: () => this.zone.run(() => this.navigateToAssetList()),
        class: 'btn-default',
      });
    }

    buttons.push({
      text: 'Save',
      action: () => this.zone.run(() => this.saveAsset()),
      class: 'btn-primary',
      disabled: !this.hasChanges,
    });

    this.enplug.dashboard.setHeaderButtons(buttons);
    this.enplug.dashboard.setDisplaySelectorVisibility(false);
  }

  private async navigateToAssetList(): Promise<void> {
    this.router.navigateByUrl('/assets');
  }

  async saveAsset(): Promise<void> {
    const deployOptions = {
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      },
    };

    try {
      this.enplug.dashboard.loadingIndicator('Saving asset...');
      const savedAsset = await this.enplug.account.saveAsset(this.asset, deployOptions);

      if (savedAsset) {
        this.enplug.dashboard.successIndicator('Asset saved');

        if (this.isNewAsset) {
          this.router.navigateByUrl('/assets');
        } else {
          this.asset = savedAsset;
          this.originalAsset = cloneDeep(savedAsset);
          this.updateHeader();
        }
      }
    } catch {
      this.enplug.dashboard.errorIndicator('Could not save asset');
    }
  }

  private getInitialAsset(): Asset<AssetValue> {
    return {
      Id: undefined,
      Value: {
        name: 'New Asset',
        someSetting: 'Default Value',
      },
      VenueIds: [],
    };
  }
}
