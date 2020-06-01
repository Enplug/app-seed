import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnplugService } from 'app/services/enplug.service';

@Component({
  selector: 'ep-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  public assets: Array<any>;

  constructor(private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private enplug: EnplugService) { }

  ngOnInit() {
    this.assets = this.route.snapshot.data.assets;
    this.setHeader();
  }

  setHeader() {
    this.enplug.dashboard.setHeaderTitle('Assets');
    this.enplug.dashboard.setHeaderButtons([
      {
        text: 'Add',
        action: () => this.zone.run(() => this.router.navigateByUrl('assets/add')),
        class: 'btn-primary'
      },
    ]);
  }
}
