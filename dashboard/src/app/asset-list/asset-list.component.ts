import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetTagClickEvent, NameEditEvent, SaveReorderEvent } from '@enplug/components/asset-item-list';
import { EnplugService } from '@enplug/components/enplug';
import { Asset, DeployDialogOptions, OpenConfirmOptions } from '@enplug/sdk-dashboard/types';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { produce } from 'immer';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { AssetValue } from '../../../../shared/asset-value';

@UntilDestroy()
@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets$ = new BehaviorSubject<Asset<AssetValue>[]>(undefined);
  isLimitedUser$: Observable<boolean>;
  selectedDisplayId$ = new BehaviorSubject<string>(undefined);
  hasUnsavedAssetListChanges$ = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService,
              private transloco: TranslocoService) { }

  ngOnInit() {
    // Navigate to adding new asset if no assets in the list
    combineLatest([this.assets$, this.selectedDisplayId$]).pipe(
      untilDestroyed(this),
      debounceTime(500), // Wait for dashboard refresh after display group filtering change
      filter(([assets, displayId]) => !displayId && assets !== undefined && assets.length === 0) // No display group filtering, assets list loaded and no items in the list
    ).subscribe(() => this.addNewAsset());

    this.assets$.next(this.route.snapshot.data.assets || undefined);
    this.isLimitedUser$ = from(this.enplug.account.getUser()).pipe(map(user => user.has.limitedAccess));

    // Keep informing the dashboard about the state of unsaved changes made to the asset list
    this.hasUnsavedAssetListChanges$.pipe(
      untilDestroyed(this) // Unsubscribe after the component gets destroyed
    ).subscribe(hasUnsavedChanges => this.enplug.dashboard.setAppHasUnsavedChanges(hasUnsavedChanges));

    this.setHeader();
    this.enplug.dashboard.pageLoading(false);
  }
  
  async onAssetNameEdit({asset, newName}: NameEditEvent) {
    if (newName !== asset.Value.name) {
      // Immutably update the name of the asset
      const newAsset = produce(asset, draft => { draft.Value.name = newName.trim(); });

      // Optimisticly update the asset in the list
      this.replaceAsset(asset, newAsset);

      try {
        const savedAsset = await this.enplug.account.saveAsset(newAsset);
        this.replaceAsset(newAsset, savedAsset);
      } catch {
        this.replaceAsset(newAsset, asset); // If error while saving, revert asset in the list
      }

      await this.reloadAssets(); // For consistency reload the whole list
    }
  }
  
  async onDeployAsset(asset: Asset<AssetValue>) {
    await this.openDeployDialog(asset, 'displays');
  }

  async onDuplicateAsset(asset: Asset<AssetValue>) {
    const newAsset = produce(asset, draft => {
      draft.Id = null;
      draft.Value.name = this.transloco.translate('assetList.duplicateAsset.defaultCopyName', { assetName: asset.Value.name });
    });

    const deployOptions: DeployDialogOptions = {
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      }
    };

    try {
      await this.enplug.account.saveAsset(newAsset, deployOptions);
      this.reloadAssets();
    } catch {}
  }

  async onEditAsset(asset: Asset<AssetValue>) {
    await this.enplug.dashboard.pageLoading(true);
    await this.router.navigate([`/assets/${asset.Id}`]);
  }

  onHasUnsavedAssetListChanges(hasUnsavedChanges: boolean) {
    this.hasUnsavedAssetListChanges$.next(hasUnsavedChanges);
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
        await this.reloadAssets();
        this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.remove.success', { assetName }));
      } catch {
        this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.remove.error'));
      }
    } catch {}
  }

  async onRemoveSelectedAssets(selectedAssets: Asset<AssetValue>[]) {
    const assetCount = selectedAssets.length;

    const title = this.transloco.translate('assetList.removeSelected.confirm.title');
    const text = this.transloco.translate('assetList.removeSelected.confirm.text', { assetCount });

    try  {
      await this.enplug.dashboard.openConfirm({
        title,
        text,
        cancelText: this.transloco.translate('assetList.removeSelected.confirm.cancel'),
        confirmText: this.transloco.translate('assetList.removeSelected.confirm.delete'),
        confirmClass: 'btn-danger'
      });

      this.enplug.dashboard.loadingIndicator(this.transloco.translate('assetList.removeSelected.inProgress', { assetCount }));

      try {
        await this.enplug.account.deleteAsset(selectedAssets.map(asset => asset.Id));
        await this.reloadAssets();
        this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.removeSelected.success', { assetCount }));
      } catch {
        this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.removeSelected.fail'));
      }
    } catch {}
  }

  async onSaveReorder({ reorderedAssets, isAccountView, hasFilter }: SaveReorderEvent) {
    if (!isAccountView && !hasFilter) { // no confirmation needed
      return await this.reorderAssets(reorderedAssets);
    }

    const options: OpenConfirmOptions = {
      title: this.transloco.translate('assetList.saveReorder.confirm.title'),
      text: isAccountView
        ? this.transloco.translate('assetList.saveReorder.confirm.text.accountView')
        : this.transloco.translate('assetList.saveReorder.confirm.text.withFilters'),
      confirmText: this.transloco.translate('assetList.saveReorder.confirm.confirmReorderButton')
    };

    try {
      await this.enplug.dashboard.openConfirm(options);
      await this.reorderAssets(reorderedAssets);
    } catch {}
  }

  async onTagClick(event: AssetTagClickEvent) {
    await this.openDeployDialog(event.asset, 'tags');
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
      await this.reloadAssets(); // For consistency reload the whole list
    } catch {}
  }

  private async reorderAssets(reorderedAssets: Asset<AssetValue>[]) {
    this.enplug.dashboard.loadingIndicator(this.transloco.translate('assetList.saveReorder.inProgress'));

    try {
      await this.enplug.account.updateAssetOrder(reorderedAssets);
      await this.reloadAssets();
      this.enplug.dashboard.successIndicator(this.transloco.translate('assetList.saveReorder.success'));
    } catch (error) {
      this.enplug.dashboard.errorIndicator(this.transloco.translate('assetList.saveReorder.fail'));
      console.error('Could not save reordered assets', error);
    }
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
  
  private setHeader() {
    this.enplug.dashboard.setHeaderTitle('');
    this.enplug.dashboard.setHeaderButtons([
      {
        text: this.transloco.translate('assetList.header.addButton'),
        action: () => this.zone.run(() => this.addNewAsset()),
        class: 'btn-primary'
      },
    ]);

    this.enplug.dashboard.setDisplaySelectorCallback(displayId => {
      this.zone.run(() => {
        this.hasUnsavedAssetListChanges$.next(false);
        this.selectedDisplayId$.next(displayId);
        this.reloadAssets();
      });
    });
  }
}
