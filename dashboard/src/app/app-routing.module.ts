import { AssetComponent } from './asset/asset.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/assets',
    pathMatch: 'full'
  },
  {
    path: 'assets',
    component: AssetListComponent,
    resolve: {
      assets: AssetsResolver
    }
  },
  {
    path: 'assets/add',
    component: AssetComponent,
  },
  {
    path: 'assets/:id',
    component: AssetComponent,
    resolve: {
      assets: AssetResolver
    }
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
