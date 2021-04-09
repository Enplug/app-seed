import { Component, NgZone, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, Button, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EnplugService } from 'app/services/enplug.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AssetValue } from '../../../../shared/asset-value';
import isDeepEqual from 'fast-deep-equal';
import produce from 'immer';

@UntilDestroy()
@Component({
  selector: 'ep-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  originalAsset = new BehaviorSubject<Asset<AssetValue>>(undefined);
  asset = new BehaviorSubject<Asset<AssetValue>>(undefined);

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService,
              private transloco: TranslocoService) { }

  async ngOnInit() {
    this.enplug.dashboard.pageLoading(false);

    // Keep updating the header everytime the asset gets updated
    combineLatest([this.originalAsset, this.asset]).pipe(
      untilDestroyed(this),
      map(([originalAsset, asset]) => isSaveActive(originalAsset, asset)),
      distinctUntilChanged()
    ).subscribe(isSaveActive => {
      this.setHeader(isSaveActive);
    });

    const loadedAsset = this.route.snapshot.data.asset || this.getInitialAsset();
    this.asset.next(loadedAsset);
    this.originalAsset.next(loadedAsset);

    if (loadedAsset?.Id) {
      // If not a new asset - mark as recently viewed
      this.enplug.account.touchAsset(this.asset.value?.Id);
    }
  }

  setAssetName(newName: string) {
    this.setAsset(asset => {
      asset.Value.name = newName;
    });
  }

  setSomeSetting(someSetting: string) {
    this.setAsset(asset => {
      asset.Value.someSetting = someSetting;
    });
  }

  /**
   * Sets Dashboard header breadcrumbs and buttons.
   */
  setHeader(isSaveActive = true) {
    this.enplug.dashboard.setHeaderTitle(this.transloco.translate('asset.header.setup'));

    const buttons: Button[] = [];

    if (this.route.snapshot.data.hasAssets === true) {
      buttons.push({
        text: this.transloco.translate('asset.header.myAssetsButton'),
        action: () => this.zone.run(() => this.router.navigateByUrl('/assets')),
        class: 'btn-default'
      });
    }

    buttons.push({
      text: this.transloco.translate('asset.header.saveButton'),
      action: () => this.zone.run(() => this.saveAsset()),
      class: 'btn-primary',
      disabled: !isSaveActive
    });

    this.enplug.dashboard.setHeaderButtons(buttons);
  }

  /**
   * Saves current Asset.
   */
  async saveAsset() {
    const deployOptions: DeployDialogOptions = {
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      }
    };

    try {
      const savedAsset = await this.enplug.account.saveAsset(this.asset.value, deployOptions);
      if (!this.asset.value.Id) { // missing Id means initial save
        this.router.navigateByUrl('/assets');
      } else {
        this.asset.next(savedAsset);
        this.originalAsset.next(savedAsset);
      }
    } catch {}
  }

  private getInitialAsset(): Asset<AssetValue> {
    return {
      Id: undefined,
      Value: {
        name: this.transloco.translate('asset.initialAssetName'),
        someSetting: 'Default Value'
      },
      VenueIds: []
    };
  }

  private setAsset(recipe: (draft: Asset<AssetValue>) => Asset<AssetValue> | void) {
    this.asset.next(produce(this.asset.value, recipe));
  }
}

function isSaveActive(originalAsset: Asset<AssetValue>, asset: Asset<AssetValue>): boolean {
  return asset?.Id === undefined || !isDeepEqual(originalAsset, asset);
}
