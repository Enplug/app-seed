import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { AssetValue } from '../../../../shared/asset-value';
import { EnplugService } from 'app/services/enplug.service';
import { produce } from 'immer';

@UntilDestroy()
@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets$ = new BehaviorSubject<Asset<AssetValue>[]>(undefined);
  selectedDisplayId$ = new BehaviorSubject<string>(undefined);

  constructor(private enplug: EnplugService,
              private router: Router,
              private route: ActivatedRoute,
              private zone: NgZone) { }

  ngOnInit() {
    // Navigate to adding new asset if no assets in the list
    combineLatest([this.assets$, this.selectedDisplayId$]).pipe(
      untilDestroyed(this),
      debounceTime(500), // Wait for dashboard refresh after display group filtering change
      filter(([assets, displayId]) => !displayId && assets !== undefined && assets.length === 0) // No display group filtering, assets list loaded and no items in the list
    ).subscribe(() => this.addNewAsset());

    this.assets$.next(this.route.snapshot.data.assets || undefined);

    this.setHeader();
    this.enplug.dashboard.pageLoading(false);
  }

  hasPriorityPlay(asset: Asset<AssetValue>): boolean {
    return asset?.Schedule?.IsPriority && asset?.VenueIds?.length > 0;
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
      const savedAsset = await this.enplug.account.saveAsset(asset, options);
      if (savedAsset) {
        this.replaceAsset(asset, savedAsset);
        this.reloadAssets();
      }
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

    this.enplug.dashboard.setDisplaySelectorCallback(displayId => {
      this.zone.run(() => {
        this.selectedDisplayId$.next(displayId);
        this.reloadAssets();
      });
    });
  }

  private async addNewAsset() {
    await this.enplug.dashboard.pageLoading(true);
    this.router.navigateByUrl('assets/add');
  }

  private replaceAsset(asset: Asset<AssetValue>, newAsset: Asset<AssetValue>) {
    this.assets$.next(produce(this.assets$.value, draft => {
      const assetIndex = draft.findIndex(({Id}) => Id === asset.Id);
      if (assetIndex >= 0) {
        draft[assetIndex] = newAsset; 
      }
    }));
  }
  
  private async reloadAssets() {
    try {
      const assets = await this.enplug.account.getAssets<AssetValue>();
      this.assets$.next(assets);
    } catch {}
  }
}
