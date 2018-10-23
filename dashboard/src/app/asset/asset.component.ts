/**
 * Description of the component.
 * @author Your Name (username@enplug.com)
 */


import '@enplug/dashboard-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  NgZone,
} from '@angular/core';


const enplug = window.enplug;

@Component({
  selector: 'ep-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  public asset: any;

  constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute) { }

  // Initialization of Dashboard items localted outside of the App
  ngOnInit() {
    this.asset = this.route.snapshot.data.asset;
    this.zone.run(() => {
      this.setHeader();
    });
  }


  /**
   * Sets Dashboard header breadcrumbs and buttons.
   */
  setHeader() {
    enplug.dashboard.setHeaderTitle('Asset');
    enplug.dashboard.setHeaderButtons([
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
