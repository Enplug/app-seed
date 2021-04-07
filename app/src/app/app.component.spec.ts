import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';
import { getEnplugServiceMock } from './mocks/enplug.service.mock.spec';
import { TranslationTestingModule } from './translation-testing.module.spec';

describe('AppComponent', () => {
  let enplugService: EnplugService;
  let fixture: ComponentFixture<AppComponent>;

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
    enplugService = TestBed.inject(EnplugService);
  });

  it('creates the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('calls Player\'s start function', fakeAsync(() => {
    const enplugServiceStartSpy = spyOn(enplugService.appStatus, 'start');
    fixture.componentInstance.ngOnInit();

    tick();

    expect(enplugServiceStartSpy.calls.count()).toBe(1);
  }));

  it('sets up Player\'s destroy listener on init', fakeAsync(() => {
    const destroyDoneSpy = jasmine.createSpy('destroyDone');

    const enplugServiceOnSpy = spyOn(enplugService, 'on').and.callFake(
      (eventName, callback) => {
        if (eventName === 'destroy') {
          return callback(destroyDoneSpy);
        }
      }
    );

    fixture.componentInstance.ngOnInit();

    tick();

    expect(enplugServiceOnSpy).toHaveBeenCalledWith('destroy', jasmine.any(Function));
    expect(destroyDoneSpy).toHaveBeenCalled();
  }));
});
