import { Component, NgZone, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, Button, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EnplugService } from '@enplug/components/enplug';
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
  /**
   * The asset as it is saved on the server
   */
  originalAsset$ = new BehaviorSubject<Asset<AssetValue>>(undefined);

  /**
   * The current state of the asset as the user modifies it
   */
  asset$ = new BehaviorSubject<Asset<AssetValue>>(undefined);

  /**
   * Are there any assets added to this app already?
   * If there are some assets in the asset list it should be possible to navigate back to the asset list
   */
  hasAssets$ = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService,
              private transloco: TranslocoService) { }

  async ngOnInit() {
    this.enplug.dashboard.pageLoading(false);

    // Keep updating the header
    // TODO: test
    combineLatest([this.originalAsset$, this.asset$, this.hasAssets$]).pipe(
      untilDestroyed(this),
      map(([originalAsset, asset, hasAssets]) => ({
        isSaveActive: isSaveActive(originalAsset, asset),
        hasAssets
      })),
      distinctUntilChanged(isDeepEqual)
    ).subscribe(({isSaveActive, hasAssets}) => this.setHeader(isSaveActive, hasAssets));

    const loadedAsset = this.route.snapshot.data?.asset || this.getInitialAsset();
    this.asset$.next(loadedAsset);
    this.originalAsset$.next(loadedAsset);
    
    this.hasAssets$.next(this.route.snapshot.data?.hasAssets);

    if (loadedAsset?.Id) {
      // If not a new asset - mark as recently viewed
      this.enplug.account.touchAsset(loadedAsset?.Id);
    }
  }

  // TODO: test
  setAssetName(newName: string) {
    this.setAsset(asset => {
      asset.Value.name = newName;
    });
  }

  // TODO: test
  setSomeSetting(someSetting: string) {
    this.setAsset(asset => {
      asset.Value.someSetting = someSetting;
    });
  }

  // TODO: test
  private async saveAsset() {
    const deployOptions: DeployDialogOptions = {
      showSchedule: true,
      scheduleOptions: {
        showDuration: true,
        showPriorityPlay: true,
      }
    };

    try {
      const savedAsset = await this.enplug.account.saveAsset(this.asset$.value, deployOptions);
      if (!this.asset$.value.Id) { // missing Id means initial save
        this.hasAssets$.next(true); // if there were no assets previously - there is one now
      } else {
        this.asset$.next(savedAsset);
        this.originalAsset$.next(savedAsset);
      }
    } catch {}
  }
  
  /**
   * Sets Dashboard header breadcrumbs and buttons.
   */
   private setHeader(isSaveActive = true, hasAssets = true) {
    this.enplug.dashboard.setHeaderTitle(this.transloco.translate('asset.header.setup'));

    const buttons: Button[] = [];

    if (hasAssets === true) {
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
    this.enplug.dashboard.setDisplaySelectorVisibility(false);
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
    this.asset$.next(produce(this.asset$.value, recipe));
  }
}

function isSaveActive(originalAsset: Asset<AssetValue>, asset: Asset<AssetValue>): boolean {
  return asset?.Id === undefined || !isDeepEqual(originalAsset, asset);
}
