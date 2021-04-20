import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EnplugService } from '@enplug/components/enplug';
import { Button, DeployDialogOptions } from '@enplug/sdk-dashboard/types';
import { getAssetMock } from 'app/mocks/asset.mock.spec';

import { getEnplugServiceMock } from 'app/mocks/enplug.service.mock.spec';
import { TranslationTestingModule } from 'app/translation-testing.module.spec';
import { produce } from 'immer';
import { AssetComponent } from './asset.component';

fdescribe('AssetComponent', () => {
  let component: AssetComponent;
  let fixture: ComponentFixture<AssetComponent>;
  let enplugService: EnplugService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        FormsModule,
        MatInputModule,
        TranslationTestingModule
      ],
      declarations: [
        AssetComponent
      ],
      providers: [
        getEnplugServiceMock()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetComponent);
    component = fixture.componentInstance;
    
    activatedRoute = TestBed.inject(ActivatedRoute);
    enplugService = TestBed.inject(EnplugService);
    router = TestBed.inject(Router);
  });

  describe('component initialization', () => {
    it('should turn off the page loader', () => {
      const pageLoadingSpy = spyOn(enplugService.dashboard, 'pageLoading').and.stub();

      fixture.detectChanges();

      expect(pageLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('should initialize the asset (asset provided)', () => {
      expect(component.originalAsset$.value).toBeUndefined();
      expect(component.asset$.value).toBeUndefined();

      const asset = getAssetMock();
      activatedRoute.snapshot.data = { asset };
      fixture.detectChanges();

      expect(component.originalAsset$.value).toEqual(asset);
      expect(component.asset$.value).toEqual(asset);
    });

    it('should initialize the asset (new asset)', () => {
      expect(component.originalAsset$.value).toBeUndefined();
      expect(component.asset$.value).toBeUndefined();

      const asset = {
        Id: undefined,
        Value: {
          name: 'New Asset',
          someSetting: 'Default Value'
        },
        VenueIds: []
      };
      activatedRoute.snapshot.data = { asset: undefined };
      fixture.detectChanges();

      expect(component.originalAsset$.value).toEqual(asset);
      expect(component.asset$.value).toEqual(asset);
    });

    it('should initialize the hasAssets value', () => {
      expect(component.hasAssets$.value).toBe(false);

      activatedRoute.snapshot.data = { hasAssets: true };
      fixture.detectChanges();

      expect(component.hasAssets$.value).toEqual(true);
    });

    it('should not touch new asset', () => {
      const touchAssetSpy = spyOn(enplugService.account, 'touchAsset').and.stub();

      activatedRoute.snapshot.data = { asset: undefined };
      fixture.detectChanges();

      expect(touchAssetSpy).not.toHaveBeenCalled();
    });

    it('should touch existing asset', () => {
      const touchAssetSpy = spyOn(enplugService.account, 'touchAsset').and.stub();

      const asset = getAssetMock();
      activatedRoute.snapshot.data = { asset };
      fixture.detectChanges();

      expect(touchAssetSpy).toHaveBeenCalledOnceWith('some-id');
    });
  });

  // TODO: implement better setHeader update testing - based not on spies, but fake header state? or most recent calls?
  describe('header', () => {
    it('should be set if editing new asset with changes and no previous assets', async () => {
      const asset = getAssetMock();
      asset.Id = undefined; // new asset
      activatedRoute.snapshot.data = { asset, hasAssets: false };

      fixture.detectChanges();

      const setHeaderTitleSpy = spyOn(enplugService.dashboard, 'setHeaderTitle').and.stub();
      const setHeaderButtonsSpy = spyOn(enplugService.dashboard, 'setHeaderButtons').and.stub();
      const setDisplaySelectorVisibilitySpy = spyOn(enplugService.dashboard, 'setDisplaySelectorVisibility').and.stub();
      const saveAssetSpy = spyOn(enplugService.account, 'saveAsset').and.returnValue(Promise.reject()); // Simulate cancellation

      const expectedDeployOptions: DeployDialogOptions = {
        showSchedule: true,
        scheduleOptions: {
          showDuration: true,
          showPriorityPlay: true,
        }
      };

      const newAsset = produce(asset, draft => {
        draft.Value.someSetting = 'changed-setting';
      });
      component.asset$.next(newAsset);
  
      expect(setHeaderTitleSpy).toHaveBeenCalledOnceWith('Setup');
      expect(setHeaderButtonsSpy).toHaveBeenCalled();
      const buttons: Button[] = setHeaderButtonsSpy.calls.mostRecent().args[0];
      expect(buttons.length).toBe(1);
      expect(buttons[0].text).toBe('Save');
      expect(buttons[0].class).toBe('btn-primary');
      expect(buttons[0].disabled).toBe(false);
      // Check whether button causes save
      buttons[0].action.call(component);
      await fixture.whenStable();
      expect(saveAssetSpy).toHaveBeenCalledOnceWith(newAsset, expectedDeployOptions);

      expect(setDisplaySelectorVisibilitySpy).toHaveBeenCalledOnceWith(false);
    });

    it('should be set if editing new asset without changes and with previous assets', () => {
      const asset = getAssetMock();
      asset.Id = undefined; // new asset
      activatedRoute.snapshot.data = { asset, hasAssets: false };
      
      fixture.detectChanges();

      const setHeaderTitleSpy = spyOn(enplugService.dashboard, 'setHeaderTitle').and.stub();
      const setHeaderButtonsSpy = spyOn(enplugService.dashboard, 'setHeaderButtons').and.stub();
      const setDisplaySelectorVisibilitySpy = spyOn(enplugService.dashboard, 'setDisplaySelectorVisibility').and.stub();
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.stub();

      component.hasAssets$.next(true);

      expect(setHeaderTitleSpy).toHaveBeenCalledOnceWith('Setup');
      expect(setHeaderButtonsSpy).toHaveBeenCalled();
      const buttons: Button[] = setHeaderButtonsSpy.calls.mostRecent().args[0];
      expect(buttons.length).toBe(2);
      expect(buttons[0].text).toBe('My Assets');
      expect(buttons[0].class).toBe('btn-default');
      buttons[0].action.call(component);
      expect(navigateByUrlSpy).toHaveBeenCalledWith('/assets');

      expect(buttons[1].text).toBe('Save');
      expect(buttons[1].class).toBe('btn-primary');
      expect(buttons[1].disabled).toBe(false);

      expect(setDisplaySelectorVisibilitySpy).toHaveBeenCalledOnceWith(false);
    });

    it('should set buttons if editing existing asset without any changes', () => {
      const asset = getAssetMock();
      asset.Id = 'some-id'; // existing asset
      activatedRoute.snapshot.data = { asset, hasAssets: false };
      
      fixture.detectChanges();

      const setHeaderButtonsSpy = spyOn(enplugService.dashboard, 'setHeaderButtons').and.stub();

      component.hasAssets$.next(true); // Emit change to trigger the header update

      expect(setHeaderButtonsSpy).toHaveBeenCalled();

      const buttons: Button[] = setHeaderButtonsSpy.calls.mostRecent().args[0];
      expect(buttons.length).toBe(2);
      expect(buttons[0].text).toBe('My Assets');
      expect(buttons[0].class).toBe('btn-default');

      expect(buttons[1].text).toBe('Save');
      expect(buttons[1].class).toBe('btn-primary');
      expect(buttons[1].disabled).toBe(true);
    });

    it('should be set if editing existing asset with changes', () => {
      const asset = getAssetMock();
      asset.Id = 'some-id'; // existing asset
      activatedRoute.snapshot.data = { asset, hasAssets: true };
      
      fixture.detectChanges();

      const setHeaderButtonsSpy = spyOn(enplugService.dashboard, 'setHeaderButtons').and.stub();

      component.asset$.next(produce(asset, draft => {
        draft.Value.someSetting = 'New value';
      })); // Emit change to trigger the header update

      expect(setHeaderButtonsSpy).toHaveBeenCalled();

      const buttons: Button[] = setHeaderButtonsSpy.calls.mostRecent().args[0];
      expect(buttons.length).toBe(2);
      expect(buttons[0].text).toBe('My Assets');
      expect(buttons[0].class).toBe('btn-default');

      expect(buttons[1].text).toBe('Save');
      expect(buttons[1].class).toBe('btn-primary');
      expect(buttons[1].disabled).toBe(false);
    });
  });
});
