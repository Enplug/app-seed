import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetItemListModule } from '@enplug/components/asset-item-list';
import { Asset, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { getAssetMock } from 'app/mocks/asset.mock.spec';
import { getEnplugServiceMock } from 'app/mocks/enplug.service.mock.spec';
import { EnplugService } from 'app/services/enplug.service';
import { TranslationTestingModule } from 'app/translation-testing.module.spec';
import { AssetValue } from '../../../../shared/asset-value';
import { AssetListComponent } from './asset-list.component';

describe('AssetListComponent', () => {
  let component: AssetListComponent;
  let fixture: ComponentFixture<AssetListComponent>;
  let enplugService: EnplugService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AssetItemListModule,
        TranslationTestingModule
      ],
      declarations: [
        AssetListComponent
      ],
      providers: [
        getEnplugServiceMock()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    enplugService = TestBed.inject(EnplugService);
    router = TestBed.inject(Router);
  });

  describe('component initialization', () => {
    it('should initialize the assets', () => {
      // TODO: test
    });

    it('should set the header', () => {
      // TODO: test
    });

    it('should turn off the page loader', () => {
      // TODO: test - how? run ngOnInit once again? or what?
    });
  });

  describe('onAssetNameEdit', () => {
    it('should edit asset name', async () => {
      const asset = getAssetMock();
      asset.Value.name = 'Initial name';
      const newName = 'New name';

      component.assets$.next([asset]);
      
      const expectedAsset = getAssetMock();
      expectedAsset.Value.name = 'New name';

      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.resolve(expectedAsset));
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([expectedAsset]));

      await component.onAssetNameEdit({ asset, newName });

      expect(saveAssetSpy).toHaveBeenCalledOnceWith(expectedAsset);
      expect(getAssetsSpy).toHaveBeenCalledOnceWith();

      expect(component.assets$.value).toEqual([expectedAsset]);
    });

    it('should revert if saving failed', async () => {
      const asset = getAssetMock();
      asset.Value.name = 'Initial name';
      const newName = 'New name';

      component.assets$.next([asset]);
      
      const updatedAsset = getAssetMock();
      updatedAsset.Value.name = 'New name';

      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.reject());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([asset]));

      await component.onAssetNameEdit({ asset, newName });

      expect(saveAssetSpy).toHaveBeenCalledOnceWith(updatedAsset);
      expect(getAssetsSpy).toHaveBeenCalledOnceWith();

      expect(component.assets$.value).toEqual([asset]);
    });
  });

  describe('onDeployAsset', () => {
    it('should open deploy dialog', async () => {
      const mockAsset: Asset<AssetValue> = { ...getAssetMock(), VenueIds: [] };
      const savedMockAsset: Asset<AssetValue> = { ...getAssetMock(), VenueIds: ['some-venue-id'] };

      component.assets$.next([mockAsset]);

      const expectedOptions: DeployDialogOptions = {
        initialTab: 'displays',
        showDeployDialog: true,
        showSchedule: true,
        scheduleOptions: {
          showDuration: true,
          showPriorityPlay: true,
        },
        showTagsEditor: true
      };
      
      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.resolve(savedMockAsset));
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([savedMockAsset]));

      await component.onDeployAsset(mockAsset);
      
      expect(saveAssetSpy).toHaveBeenCalledOnceWith(mockAsset, expectedOptions);
      expect(getAssetsSpy).toHaveBeenCalledOnceWith();

      expect(component.assets$.value).toEqual([savedMockAsset]);
    });
  });

  describe('onDuplicateAsset', () => {
    it('should duplicate the asset', async () => {
      const mockAsset = getAssetMock();
      mockAsset.Id = 'id-1';
      mockAsset.Value.name = 'Some asset';

      const duplicatedAsset = getAssetMock();
      duplicatedAsset.Id = null;
      duplicatedAsset.Value.name = 'Some asset copy';

      const savedDuplicatedAsset = { ...duplicatedAsset, Id: 'id-2' };

      component.assets$.next([mockAsset]);

      const expectedOptions: DeployDialogOptions = {
        showSchedule: true,
        scheduleOptions: {
          showDuration: true,
          showPriorityPlay: true,
        }
      };
      
      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.resolve(savedDuplicatedAsset));
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([mockAsset, savedDuplicatedAsset]));

      await component.onDuplicateAsset(mockAsset);
      
      expect(saveAssetSpy).toHaveBeenCalledOnceWith(duplicatedAsset, expectedOptions);
      expect(getAssetsSpy).toHaveBeenCalledOnceWith();

      expect(component.assets$.value).toEqual([mockAsset, savedDuplicatedAsset]);
    });
  });

  describe('onEditAsset', () => {
    it('should navigate to editing an asset', async () => {
      const pageLoadingSpy = spyOn(enplugService.dashboard, 'pageLoading').and.returnValue(Promise.resolve(true));
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      const asset = getAssetMock();

      await component.onEditAsset(asset);

      expect(pageLoadingSpy).toHaveBeenCalledOnceWith(true);
      expect(navigateSpy).toHaveBeenCalledOnceWith(['/assets/some-id']);
    });
  });

  describe('onRemoveAsset', () => {
    it('should remove the asset after confirmation', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      component.assets$.next([asset, asset2]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.returnValue(Promise.resolve());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([asset2]));

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveAsset(asset);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).toHaveBeenCalled();

      expect(deleteAssetSpy).toHaveBeenCalledOnceWith('some-id');
      expect(getAssetsSpy).toHaveBeenCalled();

      expect(successIndicatorSpy).toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset2]);
    });

    it('should not remove the asset if cancelled', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      component.assets$.next([asset, asset2]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.reject());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.stub();
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.stub();

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveAsset(asset);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).not.toHaveBeenCalled();

      expect(deleteAssetSpy).not.toHaveBeenCalled();
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset, asset2]);
    });

    it('should handle removal failure', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      component.assets$.next([asset, asset2]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.returnValue(Promise.reject());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.stub();

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveAsset(asset);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).toHaveBeenCalled();

      expect(deleteAssetSpy).toHaveBeenCalledOnceWith('some-id');
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset, asset2]);
    });
  });

  describe('onRemoveSelectedAssets', () => {
    it('should remove the assets after confirmation', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      const asset3 = getAssetMock();
      asset3.Id = 'some-id-3';
      component.assets$.next([asset, asset2, asset3]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.returnValue(Promise.resolve());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([asset3]));

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveSelectedAssets([asset, asset2]);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).toHaveBeenCalled();

      expect(deleteAssetSpy).toHaveBeenCalledOnceWith(['some-id', 'some-id-2']);
      expect(getAssetsSpy).toHaveBeenCalled();

      expect(successIndicatorSpy).toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset3]);
    });

    it('should not remove the asset if cancelled', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      const asset3 = getAssetMock();
      asset3.Id = 'some-id-3';
      component.assets$.next([asset, asset2, asset3]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.reject());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.stub();
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.stub();

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveSelectedAssets([asset, asset2]);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).not.toHaveBeenCalled();

      expect(deleteAssetSpy).not.toHaveBeenCalled();
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset, asset2, asset3]);
    });

    it('should handle removal failure', async () => {
      const asset = getAssetMock();
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';
      const asset3 = getAssetMock();
      asset3.Id = 'some-id-3';
      component.assets$.next([asset, asset2, asset3]);

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());
      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();

      const deleteAssetSpy = spyOn(enplugService.account, 'deleteAsset').and.returnValue(Promise.reject());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.stub();

      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      await component.onRemoveSelectedAssets([asset, asset2]);

      expect(openConfirmSpy).toHaveBeenCalled();
      expect(loadingIndicatorSpy).toHaveBeenCalled();

      expect(deleteAssetSpy).toHaveBeenCalledOnceWith(['some-id', 'some-id-2']);
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset, asset2, asset3]);
    });
  });

  describe('onSaveReorder', () => {
    it('should reorder without confirmation if not in account view and no filter applied', async () => {
      const hasFilter = false;
      const isAccountView = false;

      const asset1 = getAssetMock();
      asset1.Id = 'some-id-1';
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';

      component.assets$.next([asset1, asset2]); // Initial order
      const reorderedAssets = [asset2, asset1];

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());

      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.returnValue(Promise.resolve());
      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.returnValue(Promise.resolve());
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.returnValue(Promise.resolve());

      const updateAssetOrderSpy = spyOn(enplugService.account, 'updateAssetOrder').and.returnValue(Promise.resolve());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([asset2, asset1]));

      await component.onSaveReorder({ reorderedAssets, isAccountView, hasFilter });

      expect(openConfirmSpy).not.toHaveBeenCalled();

      expect(loadingIndicatorSpy).toHaveBeenCalled();
      expect(successIndicatorSpy).toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(updateAssetOrderSpy).toHaveBeenCalledWith([asset2, asset1]);
      expect(getAssetsSpy).toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset2, asset1]);
    });

    it('should handle failure for reorder with confirmation if in account view', async () => {
      const hasFilter = false;
      const isAccountView = true;

      const asset1 = getAssetMock();
      asset1.Id = 'some-id-1';
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';

      component.assets$.next([asset1, asset2]); // Initial order
      const reorderedAssets = [asset2, asset1];

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.resolve());

      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.returnValue(Promise.resolve());
      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.returnValue(Promise.resolve());
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.returnValue(Promise.resolve());

      const updateAssetOrderSpy = spyOn(enplugService.account, 'updateAssetOrder').and.returnValue(Promise.reject());
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([asset2, asset1]));

      await component.onSaveReorder({ reorderedAssets, isAccountView, hasFilter });

      expect(openConfirmSpy).toHaveBeenCalled();

      expect(loadingIndicatorSpy).toHaveBeenCalled();
      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).toHaveBeenCalled();

      expect(updateAssetOrderSpy).toHaveBeenCalledWith([asset2, asset1]);
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset1, asset2]);
    });

    it('should not reorder with cancelation if has filters applied', async () => {
      const hasFilter = true;
      const isAccountView = false;

      const asset1 = getAssetMock();
      asset1.Id = 'some-id-1';
      const asset2 = getAssetMock();
      asset2.Id = 'some-id-2';

      component.assets$.next([asset1, asset2]); // Initial order
      const reorderedAssets = [asset2, asset1];

      const openConfirmSpy = spyOn(enplugService.dashboard, 'openConfirm').and.returnValue(Promise.reject());

      const loadingIndicatorSpy = spyOn(enplugService.dashboard, 'loadingIndicator').and.stub();
      const successIndicatorSpy = spyOn(enplugService.dashboard, 'successIndicator').and.stub();
      const errorIndicatorSpy = spyOn(enplugService.dashboard, 'errorIndicator').and.stub();

      const updateAssetOrderSpy = spyOn(enplugService.account, 'updateAssetOrder').and.stub();
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.stub();

      await component.onSaveReorder({ reorderedAssets, isAccountView, hasFilter });

      expect(openConfirmSpy).toHaveBeenCalled();

      expect(loadingIndicatorSpy).not.toHaveBeenCalled();
      expect(successIndicatorSpy).not.toHaveBeenCalled();
      expect(errorIndicatorSpy).not.toHaveBeenCalled();

      expect(updateAssetOrderSpy).not.toHaveBeenCalled();
      expect(getAssetsSpy).not.toHaveBeenCalled();

      expect(component.assets$.value).toEqual([asset1, asset2]);
    });
  });

  describe('onTagClick', () => {
    it('should open deploy dialog with tags tab open', async () => {
      const mockAsset = getAssetMock();
      const savedMockAsset = getAssetMock();
      savedMockAsset.VenueIds = ['changed-venue-id'];

      component.assets$.next([mockAsset]);

      const expectedOptions: DeployDialogOptions = {
        initialTab: 'tags',
        showDeployDialog: true,
        showSchedule: true,
        scheduleOptions: {
          showDuration: true,
          showPriorityPlay: true,
        },
        showTagsEditor: true
      };
      
      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.resolve(savedMockAsset));
      const getAssetsSpy = spyOn(enplugService.account, 'getAssets').and.returnValue(Promise.resolve([savedMockAsset]));

      await component.onTagClick({ asset: mockAsset, tag: undefined });
      
      expect(saveAssetSpy).toHaveBeenCalledOnceWith(mockAsset, expectedOptions);
      expect(getAssetsSpy).toHaveBeenCalledOnceWith();

      expect(component.assets$.value).toEqual([savedMockAsset]);
    });
  });
});
