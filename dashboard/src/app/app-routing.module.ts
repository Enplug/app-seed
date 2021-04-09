import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetComponent } from './asset/asset.component';
import { AssetResolver } from './resolvers/asset.resolver';
import { AssetsResolver } from './resolvers/assets.resolver';
import { HasAssetsResolver } from './resolvers/has-assets.resolver';

export const appRoutes: Routes = [
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
    resolve: {
      hasAssets: HasAssetsResolver
    }
  },
  {
    path: 'assets/:id',
    component: AssetComponent,
    resolve: {
      asset: AssetResolver,
      hasAssets: HasAssetsResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
