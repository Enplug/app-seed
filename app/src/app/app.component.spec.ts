import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetValue } from '../../../shared/asset-value';

import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';
import { getEnplugServiceMock } from './mocks/enplug.service.mock.spec';
import { TranslationTestingModule } from './translation-testing.module.spec';

const getMockAssetValue: () => AssetValue = () => ({
  name: 'Some name',
  someSetting: 'Some setting'
});

describe('AppComponent', () => {
  let enplugService: EnplugService;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let getNextSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslationTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        getEnplugServiceMock()
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    enplugService = TestBed.inject(EnplugService);
    
    getNextSpy = spyOn(enplugService.assets, 'getNext').and.returnValue(Promise.resolve(getMockAssetValue()));
  });

  it('should fetch the asset using getNext', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getNextSpy).toHaveBeenCalled();
    expect(component.asset).toEqual(getMockAssetValue());
  });

  it('should call start', async () => {
    const enplugServiceStartSpy = spyOn(enplugService.appStatus, 'start').and.stub();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(enplugServiceStartSpy).toHaveBeenCalled();
  });

  it('should call start even if registering service worker fails', async () => {
    const registerServiceWorkerSpy = spyOn(enplugService.appStatus, 'registerServiceWorker').and.returnValue(Promise.reject('Test error'));
    const consoleErrorSpy = spyOn(console, 'error').and.stub();

    const enplugServiceStartSpy = spyOn(enplugService.appStatus, 'start').and.stub();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(registerServiceWorkerSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
    expect(enplugServiceStartSpy).toHaveBeenCalled();
  });


  it('should set up destroy listener on init', async () => {
    const destroyDoneSpy = jasmine.createSpy('destroyDone');

    const enplugServiceOnSpy = spyOn(enplugService, 'on').and.callFake(
      (eventName, callback) => {
        if (eventName === 'destroy') {
          return callback(destroyDoneSpy);
        }
      }
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(enplugServiceOnSpy).toHaveBeenCalledWith('destroy', jasmine.any(Function));
    expect(destroyDoneSpy).toHaveBeenCalled();
  });
});
