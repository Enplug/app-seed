import { Routes } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list';
import { AssetComponent } from './asset/asset';
import { assetResolver } from './resolvers/asset.resolver';
import { assetsResolver } from './resolvers/assets.resolver';
import { hasAssetsResolver } from './resolvers/has-assets.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/assets',
    pathMatch: 'full',
  },
  {
    path: 'assets',
    component: AssetListComponent,
    resolve: {
      assets: assetsResolver,
    },
  },
  {
    path: 'assets/add',
    component: AssetComponent,
    resolve: {
      hasAssets: hasAssetsResolver,
    },
  },
  {
    path: 'assets/:id',
    component: AssetComponent,
    resolve: {
      asset: assetResolver,
      hasAssets: hasAssetsResolver,
    },
  },
];
