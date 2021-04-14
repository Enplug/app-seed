import { Component, NgZone, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, Button, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { EnplugService } from 'app/services/enplug.service';
import { AssetValue } from '../../../../shared/asset-value';

@Component({
  selector: 'ep-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  asset: Asset<AssetValue>;

  constructor(private enplug: EnplugService,
              private router: Router,
              private route: ActivatedRoute,
              private zone: NgZone) {}

  ngOnInit() {
    this.enplug.dashboard.pageLoading(false);

    this.asset = this.route.snapshot.data.asset || this.getInitialAsset();
    this.zone.run(() => {
      this.setHeader();
    });

    if (this.asset?.Id) {
      // If not a new asset - mark as recently viewed
      this.enplug.account.touchAsset(this.asset?.Id);
    }
  }

  /**
   * Sets Dashboard header breadcrumbs and buttons.
   */
  setHeader() {
    this.enplug.dashboard.setHeaderTitle('Setup');

    const buttons: Button[] = [];

    if (this.route.snapshot.data.hasAssets === true) {
      buttons.push({
        text: 'My Assets',
        action: () => this.zone.run(() => this.router.navigateByUrl('/assets')),
        class: 'btn-default'
      });
    }

    buttons.push({
      text: 'Save',
      action: () => this.zone.run(() => this.saveAsset()),
      class: 'btn-primary'
    });

    this.enplug.dashboard.setHeaderButtons(buttons);    
    this.enplug.dashboard.setDisplaySelectorVisibility(false);
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
      const savedAsset = await this.enplug.account.saveAsset(this.asset, deployOptions);
      if (!this.asset.Id) { // missing Id means initial save
        this.router.navigateByUrl('/assets');
      } else {
        this.asset = savedAsset;
      }
    } catch {}
  }

  private getInitialAsset(): Asset<AssetValue> {
    return {
      Id: undefined,
      Value: {
        name: 'New Asset',
        someSetting: 'Default Value'
      },
      VenueIds: []
    };
  }

}
