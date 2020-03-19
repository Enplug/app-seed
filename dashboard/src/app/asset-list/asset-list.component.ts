import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const enplug = window.enplug;

@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  public assets: Array<any>;

  constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.assets = this.route.snapshot.data.assets;

    // Initialization of Dashboard items localted outside of the App
    this.zone.run(() => {
      this.setHeader();
    });
  }

  setHeader() {
    enplug.dashboard.setHeaderTitle('Assets');
    enplug.dashboard.setHeaderButtons([
      {
        text: 'Add',
        action: () => this.zone.run(() => this.router.navigateByUrl('assets/add')),
        class: 'btn-primary'
      },
    ]);
  }
}
