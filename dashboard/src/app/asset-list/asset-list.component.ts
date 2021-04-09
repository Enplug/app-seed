import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetTagClickEvent, NameEditEvent, SaveReorderEvent } from '@enplug/components/asset-item-list';
import { Asset, DeployDialogOptions, OpenConfirmOptions } from '@enplug/sdk-dashboard/types';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EnplugService } from 'app/services/enplug.service';
import { produce } from 'immer';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AssetValue } from '../../../../shared/asset-value';

@UntilDestroy()
@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets = new BehaviorSubject<Asset<AssetValue>[]>(undefined);

  hasUnsavedAssetListChanges$: Observable<boolean>;
  isLimitedUser$: Observable<boolean>;
  selectedVenueId$: Observable<string>;

  private selectedVenueId = new BehaviorSubject<string>(undefined);
  private hasUnsavedAssetListChanges = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService,
              private transloco: TranslocoService) { }

  ngOnInit() {
    // Navigate to adding new asset if no assets in the list
    this.assets.pipe(
      untilDestroyed(this),
      filter(assets => assets !== undefined && assets.length === 0) // Assets list loaded and no items in the list
    ).subscribe(() => this.addNewAsset());

    this.assets.next(this.route.snapshot.data.assets || undefined);
    
    this.hasUnsavedAssetListChanges$ = this.hasUnsavedAssetListChanges.asObservable();
    this.isLimitedUser$ = from(this.enplug.account.getUser()).pipe(map(user => user.has.limitedAccess));
    this.selectedVenueId$ = this.selectedVenueId.asObservable();

    // Keep informing the dashboard about the state of unsaved changes made to the asset list
    this.hasUnsavedAssetListChanges$.pipe(
      untilDestroyed(this) // Unsubscribe after the component gets destroyed
    ).subscribe(hasUnsavedChanges => this.enplug.dashboard.setAppHasUnsavedChanges(hasUnsavedChanges));

    this.setHeader();
    this.enplug.dashboard.pageLoading(false);
  }
  
  async onAssetNameEdit({asset, newName}: NameEditEvent) {
    if (newName !== asset.Value.name) {
      asset.Value.name = newName.trim();
      const savedAsset = await this.enplug.account.saveAsset(asset);

      this.replaceAsset(asset, savedAsset);
      await this.reloadAssets();
    }
  }
  
  onDeployAsset(asset: Asset<AssetValue>) {
    this.openDeployDialog(asset, 'displays');
  }

  async onEditAsset(asset: Asset<AssetValue>) {
    await this.enplug.dashboard.pageLoading(true);
    this.router.navigate([`/assets/${asset.Id}`]);
  }

  onHasUnsavedAssetListChanges(hasUnsavedChanges: boolean) {
    this.hasUnsavedAssetListChanges.next(hasUnsavedChanges);
  }

  onPreviewAsset(asset: Asset<AssetValue>) {
    this.enplug.dashboard.previewAsset({ asset });
  }

  async onRemoveAsset(asset: Asset<AssetValue>) {
    if (!asset) { return; }

    const assetName = asset.Value.name;

    try {
      await this.enplug.dashboard.openConfirm({
        title: this.transloco.translate('assetList.remove.confirm.title'),
        text: this.transloco.translate('assetList.remove.confirm.text', { assetName: `<strong>${assetName}</strong>` }),
        cancelText: this.transloco.translate('assetList.remove.confirm.cancel'),
        confirmText: this.transloco.translate('assetList.remove.confirm.delete'),
        confirmClass: 'btn-danger'
      });

      this.enplug.dashboard.loadingIndicator(this.transloco.translate('assetList.remove.inProgress', { assetName }));

      try {
        await this.enplug.account.deleteAsset(asset.Id);
        this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.remove.success', { assetName }));
        this.reloadAssets();
      } catch {
        this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.remove.error'));
      }
    } catch {}
  }

  onRemoveSelectedAssets(selectedAssets: Asset<AssetValue>[]) {
    const assetCount = selectedAssets.length;

    const title = this.transloco.translate('assetList.removeSelected.confirm.title');
    const text = this.transloco.translate('assetList.removeSelected.confirm.text', { assetCount });

    this.enplug.dashboard.openConfirm({
      title,
      text,
      cancelText: this.transloco.translate('assetList.removeSelected.confirm.cancel'),
      confirmText: this.transloco.translate('assetList.removeSelected.confirm.delete'),
      confirmClass: 'btn-danger'
    }).then(async () => {
      this.enplug.dashboard.loadingIndicator(this.transloco.translate('assetList.removeSelected.inProgress', { assetCount }));

      try {
        await this.enplug.account.deleteAsset(selectedAssets.map(asset => asset.Id));
        this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.removeSelected.success', { assetCount }));
        this.reloadAssets();
      } catch {
        this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.removeSelected.fail'));
      }
    }, () => {});
  }

  onSaveReorder({ reorderedAssets, isAccountView, hasFilter }: SaveReorderEvent) {
    if (!isAccountView && !hasFilter) { // no confirmation needed
      this.reorderAssets(reorderedAssets);
      return;
    }

    const options: OpenConfirmOptions = {
      title: this.transloco.translate('assetList.saveReorder.confirm.title'),
      text: isAccountView
        ? this.transloco.translate('assetList.saveReorder.confirm.text.accountView')
        : this.transloco.translate('assetList.saveReorder.confirm.text.withFilters'),
      confirmText: this.transloco.translate('assetList.saveReorder.confirm.confirmReorderButton')
    };

    enplug.dashboard.openConfirm(options).then(
      () => { this.reorderAssets(reorderedAssets); },
      () => { /* canceled */ }
    );
  }

  onTagClick(event: AssetTagClickEvent) {
    this.openDeployDialog(event.asset, 'tags');
  }

  setHeader() {
    this.enplug.dashboard.setHeaderTitle('');
    this.enplug.dashboard.setHeaderButtons([
      {
        text: this.transloco.translate('assetList.header.addButton'),
        action: () => this.zone.run(() => this.addNewAsset()),
        class: 'btn-primary'
      },
    ]);
  }

  private addNewAsset() {
    this.router.navigateByUrl('assets/add');
  }
  
  private async openDeployDialog(asset: Asset<AssetValue>, initialTab?: string) {
    const options: DeployDialogOptions = {
      initialTab,
      showDeployDialog: true,
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      },
      showTagsEditor: true
    };

    try {
      const savedAsset = await this.enplug.account.saveAsset(asset, options);
      this.replaceAsset(asset, savedAsset); // Instantly update the saved asset
      this.reloadAssets(); // For consistency reload the whole list
    } catch {}
  }

  private async reorderAssets(reorderedAssets: Asset<AssetValue>[]) {
    this.enplug.dashboard.loadingIndicator(this.transloco.translate('assetList.saveReorder.inProgress'));

    try {
      await this.enplug.account.updateAssetOrder(reorderedAssets);
      this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.saveReorder.success'));
      this.reloadAssets();
    } catch (error) {
      this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.saveReorder.fail'));
      console.error('Could not save reordered assets', error);
    }
  }

  private replaceAsset(asset: Asset<AssetValue>, newAsset: Asset<AssetValue>) {
    this.assets.next(produce(this.assets.value, draft => {
      const assetIndex = draft.findIndex(({Id}) => Id === asset.Id);
      if (assetIndex >= 0) {
        draft[assetIndex] = newAsset; 
      }
    }));
  }
  
  private async reloadAssets() {
    try {
      const assets = await this.enplug.account.getAssets<AssetValue>();
      this.assets.next(assets);
    } catch {}
  }
}
