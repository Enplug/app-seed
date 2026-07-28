import { Component, NgZone, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { EnplugService } from '../services/enplug.service';
import { AssetService } from '../services/asset.service';
import { AssetValue } from '../../../../shared/asset-value';
import { Asset } from '../resolvers/asset.resolver';
import {
  AssetItemListComponent,
  AssetType,
  NameEditEvent,
  SaveReorderEvent,
  MoveAssetsEvent,
} from '@enplug/components2';
import { PaginationResponse, ReorderAssets } from '../models/pagination';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ep-asset-list',
  standalone: true,
  imports: [CommonModule, AssetItemListComponent],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.scss',
})
export class AssetListComponent implements OnInit, OnDestroy {
  private readonly enplug = inject(EnplugService);
  private readonly assetService = inject(AssetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly zone = inject(NgZone);
  private readonly transloco = inject(TranslocoService);

  assets: Asset<AssetValue>[] = [];
  assetListItems: AssetType[] = [];
  columnsToDisplay = [
    'drag',
    'select',
    'order',
    'editable-name',
    'tags',
    'preview',
    'displays',
    'duplicate',
    'delete',
  ];

  loading$: Observable<boolean> = this.assetService.loading$;
  pagination$: Observable<PaginationResponse> = this.assetService.pagination$;
  tags$: Observable<string[]> = this.assetService.tags$;
  selectedSpecialTags$: Observable<string[]> = this.assetService.selectedSpecialTags$;
  enableNewPagination = environment.newPagination;

  async ngOnInit(): Promise<void> {
    this.setHeader();
    await this.loadAssets();
    this.enplug.dashboard.pageLoading(false);
  }

  ngOnDestroy(): void {
    this.assetService.destroy();
  }

  async loadAssets(): Promise<void> {
    const result = await this.assetService.loadAssetsPagination();
    this.assets = result.assets;

    if (this.assets.length === 0) {
      this.addNewAsset();
      return;
    }

    this.mapAssetsToListItems();
  }

  private mapAssetsToListItems(): void {
    this.assetListItems = this.assets.map(
      (asset, index) =>
        ({
          Id: asset.Id,
          Name: asset.Value.name || '(no name)',
          Order: index + 1,
          VenueIds: asset.VenueIds || [],
          Schedule: asset.Schedule,
          Value: asset.Value,
        }) as AssetType
    );
  }

  hasPriorityPlay(asset: Asset<AssetValue>): boolean {
    return !!(asset?.Schedule?.IsPriority && (asset?.VenueIds?.length ?? 0) > 0);
  }

  async onEditAsset(asset: AssetType): Promise<void> {
    await this.enplug.dashboard.pageLoading(true);
    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (originalAsset) {
      this.router.navigate([`/assets/${originalAsset.Id}`]);
    }
  }

  async onDeployAsset(asset: AssetType): Promise<void> {
    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (!originalAsset) return;

    const options = {
      showDeployDialog: true,
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      },
    };

    try {
      const savedAsset = await this.enplug.account.saveAsset(originalAsset, options);
      if (savedAsset) {
        this.replaceAsset(originalAsset, savedAsset);
        this.reloadAssets();
      }
    } catch {}
  }

  onPreviewAsset(asset: AssetType): void {
    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (originalAsset) {
      this.enplug.dashboard.previewAsset({ asset: originalAsset });
    }
  }

  async onDuplicateAsset(asset: AssetType): Promise<void> {
    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (!originalAsset) return;

    const assetName = originalAsset.Value?.name || '(no name)';

    try {
      this.enplug.dashboard.loadingIndicator(
        this.transloco.translate('assetList.mySigns.duplicateAsset.inProgress', { assetName })
      );

      const duplicatedAsset = {
        ...originalAsset,
        Id: undefined,
        VenueIds: [],
        Value: {
          ...originalAsset.Value,
          name: this.transloco.translate('assetList.mySigns.duplicateAsset.defaultCopyName', {
            assetName,
          }),
        },
      };

      const options = {
        showDeployDialog: false,
      };

      const savedAsset = await this.enplug.account.saveAsset(duplicatedAsset, options);
      if (savedAsset) {
        this.enplug.dashboard.successIndicator(
          this.transloco.translate('assetList.mySigns.duplicateAsset.success', { assetName })
        );
        await this.loadAssets();
      }
    } catch (error) {
      console.error('Error duplicating asset:', error);
      this.enplug.dashboard.errorIndicator(
        this.transloco.translate('assetList.mySigns.duplicateAsset.failed')
      );
    }
  }

  async onNameEdit(event: NameEditEvent): Promise<void> {
    const { asset, newName } = event;
    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (!originalAsset) return;

    try {
      const updatedValue = { ...originalAsset.Value, name: newName, Name: newName };
      const updatedAsset = { ...originalAsset, Value: updatedValue };
      await this.enplug.account.saveAsset(updatedAsset as any);
      this.reloadAssets();
    } catch {
      this.enplug.dashboard.errorIndicator(
        this.transloco.translate('assetList.mySigns.editName.failed')
      );
    }
  }

  async onSaveReorder(event: SaveReorderEvent): Promise<void> {
    const { reorderedAssets, isAccountView, hasFilter } = event;
    if (this.enableNewPagination) {
      try {
        const account = await this.enplug.account.getAccount();
        const reorderData: ReorderAssets = {
          ViewId: account.accountId,
          AppId: account.appInstanceId,
          Assets: reorderedAssets.map((a: any) => ({ Id: a.Id, Order: a.Order })),
        };
        await this.assetService.saveOrderPagination(reorderData);
        await this.loadAssets();
      } catch (err) {
        console.error('Error saving paginated reorder:', err);
      }
      return;
    }
    // Old way
    if (!isAccountView && !hasFilter) {
      this.reorderAssetsOldWay(reorderedAssets);
      return;
    }

    const options = {
      title: this.transloco.translate('assetList.mySigns.reorderSaveConfirmDialog.title'),
      text: isAccountView
        ? this.transloco.translate('assetList.mySigns.reorderSaveConfirmDialog.text.accountView')
        : this.transloco.translate('assetList.mySigns.reorderSaveConfirmDialog.text.filteredView'),
      confirmText: this.transloco.translate(
        'assetList.mySigns.reorderSaveConfirmDialog.confirmReorder'
      ),
    };

    this.enplug.dashboard.openConfirm(options).then(
      () => {
        this.reorderAssetsOldWay(reorderedAssets);
      },
      () => {
        /* canceled */
      }
    );
  }

  private async reorderAssetsOldWay(reorderedAssets: any[]): Promise<void> {
    try {
      await this.enplug.account.updateAssetOrder(reorderedAssets);
      await this.loadAssets();
    } catch (error) {
      console.error('Could not save reordered assets', error);
      this.enplug.dashboard.errorIndicator(
        this.transloco.translate('assetList.mySigns.reorderAssets.failed')
      );
    }
  }

  onPaginationChange(event: { page: number; limit: number }): void {
    this.assetService.paginationChange(event);
    this.loadAssets();
  }

  onSearchExternalTags(search: string): void {
    this.assetService.searchExternalTags(search);
  }

  onClearFilters(): void {
    this.assetService.clearFilters();
    this.loadAssets();
  }

  async onMoveAssets(event: MoveAssetsEvent): Promise<void> {
    const { assetIds, moveBy } = event;

    if (!assetIds || assetIds.length === 0 || moveBy === 0) {
      return;
    }

    // Get the selected assets with their current orders (filter out undefined Ids)
    const selectedAssets = this.assets.filter(
      (a): a is Asset<AssetValue> & { Id: string } => a.Id !== undefined && assetIds.includes(a.Id)
    );
    if (selectedAssets.length === 0) return;

    // Calculate new orders for the selected assets
    const updatedAssets = selectedAssets.map((asset) => ({
      Id: asset.Id,
      Order: (asset.Order || 0) + moveBy,
    }));

    // Prepare reorder data for the API
    const account = await this.enplug.account.getAccount();
    const reorderData: ReorderAssets = {
      ViewId: account.accountId,
      AppId: account.appInstanceId,
      Assets: updatedAssets,
    };

    try {
      await this.assetService.saveOrderPagination(reorderData);
      await this.loadAssets();
    } catch (error) {
      console.error('Could not move assets', error);
    }
  }

  async onRemoveSelectedAssets(assets: AssetType[]): Promise<void> {
    if (!assets || assets.length === 0) return;

    const count = assets.length;
    const translationKey =
      count === 1
        ? 'assetList.mySigns.removeSelectedAssets.confirmTextSingular'
        : 'assetList.mySigns.removeSelectedAssets.confirmText';

    try {
      await this.enplug.dashboard.openConfirm({
        title: this.transloco.translate('assetList.mySigns.removeSelectedAssets.title'),
        text: this.transloco.translate(translationKey, { count }),
        cancelText: this.transloco.translate('assetList.mySigns.removeSelectedAssets.cancel'),
        confirmText: this.transloco.translate('assetList.mySigns.removeSelectedAssets.confirm'),
        confirmClass: 'btn-danger',
      });

      this.enplug.dashboard.loadingIndicator(
        this.transloco.translate('assetList.mySigns.removeSelectedAssets.inProgress')
      );

      const deletePromises = assets.map((asset) => this.enplug.account.deleteAsset(asset.Id));

      await Promise.all(deletePromises);

      this.enplug.dashboard.successIndicator(
        this.transloco.translate('assetList.mySigns.removeSelectedAssets.success', { count })
      );
      this.reloadAssets();
    } catch (error) {
      if (error) {
        this.enplug.dashboard.errorIndicator(
          this.transloco.translate('assetList.mySigns.removeSelectedAssets.failed')
        );
      }
    }
  }

  onBulkEdit(assets: AssetType[]): void {
    // TODO: Implement bulk edit - open editor with multiple assets
    console.log('Bulk edit assets', assets);
  }

  onBulkCopy(assets: AssetType[]): void {
    // TODO: Implement bulk copy - duplicate multiple assets
    console.log('Bulk copy assets', assets);
  }

  onHasUnsavedChanges(hasUnsavedChanges: boolean): void {
    this.enplug.dashboard.setAppHasUnsavedChanges(hasUnsavedChanges);
  }

  async onRemoveAsset(asset: AssetType): Promise<void> {
    if (!asset) return;

    const originalAsset = this.assets.find((a) => a.Id === asset.Id);
    if (!originalAsset) return;

    const assetName =
      originalAsset.JsonValue?.name ||
      originalAsset.JsonValue?.Name ||
      originalAsset.Value?.name ||
      '(no name)';

    try {
      await this.enplug.dashboard.openConfirm({
        title: this.transloco.translate('assetList.mySigns.removeAssetConfirmDialog.title'),
        text: this.transloco.translate('assetList.mySigns.removeAssetConfirmDialog.text', {
          assetName,
        }),
        cancelText: this.transloco.translate('assetList.mySigns.removeAssetConfirmDialog.cancel'),
        confirmText: this.transloco.translate(
          'assetList.mySigns.removeAssetConfirmDialog.confirmDelete'
        ),
        confirmClass: 'btn-danger',
      });

      this.enplug.dashboard.loadingIndicator(
        this.transloco.translate('assetList.mySigns.removeAsset.inProgress', { assetName })
      );

      try {
        await this.enplug.account.deleteAsset(originalAsset.Id);
        this.enplug.dashboard.successIndicator(
          this.transloco.translate('assetList.mySigns.removeAsset.success', { assetName })
        );
        this.reloadAssets();
      } catch {
        this.enplug.dashboard.errorIndicator(
          this.transloco.translate('assetList.mySigns.removeAsset.failed')
        );
      }
    } catch {}
  }

  private setHeader(): void {
    this.enplug.dashboard.setHeaderTitle('');
    this.enplug.dashboard.setHeaderButtons([
      {
        text: this.transloco.translate('assetList.header.addButton'),
        action: () => this.zone.run(() => this.addNewAsset()),
        class: 'btn-primary',
      },
    ]);

    this.enplug.dashboard.setDisplaySelectorCallback((displayId: string) => {
      this.zone.run(() => {
        this.reloadAssets();
      });
    });
  }

  private async addNewAsset(): Promise<void> {
    await this.enplug.dashboard.pageLoading(true);
    this.router.navigateByUrl('assets/add');
  }

  private replaceAsset(asset: Asset<AssetValue>, newAsset: Asset<AssetValue>): void {
    const assetIndex = this.assets.findIndex(({ Id }) => Id === asset.Id);
    if (assetIndex >= 0) {
      this.assets[assetIndex] = newAsset;
    }
  }

  private async reloadAssets(): Promise<void> {
    await this.loadAssets();
  }
}
