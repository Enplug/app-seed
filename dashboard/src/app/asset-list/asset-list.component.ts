import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { EnplugService } from 'app/services/enplug.service';
import { AssetValue } from '../../../../shared/asset-value';

@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets: Asset<AssetValue>[];

  constructor(private enplug: EnplugService,
              private router: Router,
              private route: ActivatedRoute,
              private zone: NgZone) { }

  ngOnInit() {
    this.assets = this.route.snapshot.data.assets;

    if (this.assets?.length === 0) {
      this.addNewAsset();
    } else {
      this.enplug.dashboard.pageLoading(false);
      this.setHeader();
    }
  }

  hasPriorityPlay(asset: Asset<AssetValue>): boolean {
    return asset.Schedule?.IsPriority && asset.VenueIds.length > 0;
  }

  async onEditAsset(asset: Asset<AssetValue>) {
    await this.enplug.dashboard.pageLoading(true);
    this.router.navigate([`/assets/${asset.Id}`]);
  }
    
  async onDeployAsset(asset: Asset<AssetValue>) {
    const options: DeployDialogOptions = {
      showDeployDialog: true,
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      }
    };

    try {
      await this.enplug.account.saveAsset(asset, options);
      this.reloadAssets();
    } catch {}
  }

  onPreviewAsset(asset: Asset<AssetValue>) {
    this.enplug.dashboard.previewAsset({ asset });
  }

  async onRemoveAsset(asset: Asset<AssetValue>) {
    if (!asset) { return; }

    const assetName = asset.Value.name;

    try {
      await this.enplug.dashboard.openConfirm({
        title: 'Delete asset?',
        text: `Are you sure you want to delete ${assetName} from your assets? This action cannot be undone.`,
        cancelText: 'Cancel',
        confirmText: 'Delete',
        confirmClass: 'btn-danger'
      });

      this.enplug.dashboard.loadingIndicator(`Deleting ${assetName}`);

      try {
        await this.enplug.account.deleteAsset(asset.Id);
        this.enplug.dashboard.successIndicator(`Deleted ${assetName}`);
        this.reloadAssets();
      } catch {
        this.enplug.dashboard.errorIndicator(`Could not delete configuration`);
      }
    } catch {}
  }

  setHeader() {
    enplug.dashboard.setHeaderTitle('');
    enplug.dashboard.setHeaderButtons([
      {
        text: 'Add',
        action: () => this.zone.run(() => this.addNewAsset()),
        class: 'btn-primary'
      },
    ]);

    this.enplug.dashboard.setDisplaySelectorCallback(() => {
      this.zone.run(() => this.reloadAssets());
    });
  }

  private async addNewAsset() {
    await this.enplug.dashboard.pageLoading(true);
    this.router.navigateByUrl('assets/add');
  }

  private async reloadAssets() {
    try {
      this.assets = await this.enplug.account.getAssets<AssetValue>();
      if (this.assets.length) {
        this.addNewAsset();
      }
    } catch {}
  }
}
