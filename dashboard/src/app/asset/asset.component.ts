import { Component, NgZone, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnplugService } from 'app/services/enplug.service';

@Component({
  selector: 'ep-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  public asset: any;

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService) { }

  // Initialization of Dashboard items localted outside of the App
  ngOnInit() {
    this.asset = this.route.snapshot.data.asset;
    this.setHeader();
  }

  /**
   * Sets Dashboard header breadcrumbs and buttons.
   */
  setHeader() {
    this.enplug.dashboard.setHeaderTitle('Asset');
    this.enplug.dashboard.setHeaderButtons([
      {
        text: 'Cancel',
        action: () => this.zone.run(() => this.router.navigateByUrl('/assets')),
        class: 'btn-default'
      },
      {
        text: 'Save',
        action: () => this.zone.run(this.saveAsset.bind(this)),
        class: 'btn-primary'
      }
    ]);
  }

  /**
   * Saves current Asset.
   */
  saveAsset() {
    // implement
  }
}
