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
      component.assets$.next([]);

      const mockAsset: Asset<AssetValue> = { ...getAssetMock(), VenueIds: [] };
      const savedMockAsset: Asset<AssetValue> = { ...getAssetMock(), VenueIds: ['some-venue-id'] };

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

  fdescribe('onEditAsset', () => {
    it('should navigate to editing an asset', async () => {
      const pageLoadingSpy = spyOn(enplugService.dashboard, 'pageLoading').and.returnValue(Promise.resolve(true));
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      const asset = getAssetMock();

      await component.onEditAsset(asset);

      expect(pageLoadingSpy).toHaveBeenCalledOnceWith(true);
      expect(navigateSpy).toHaveBeenCalledOnceWith(['/assets/some-id']);
    });
  });
});
