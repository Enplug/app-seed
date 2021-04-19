import { Asset } from '@enplug/sdk-dashboard/types'
import { AssetValue } from '../../../../shared/asset-value'

export const getAssetMock: () => Asset<AssetValue> = () => ({
  Id: 'some-id',
  Value: {
    name: 'Asset Name',
    someSetting: 'Setting value'
  },
  VenueIds: []
});
