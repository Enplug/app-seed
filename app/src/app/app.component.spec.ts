import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { EnplugService } from './enplug.service';

describe('AppComponent', () => {
  let enplugService: EnplugService;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const enplugServiceMock = {
      appStatus: {
        start: () => { }
      },
      on: () => { }
    };

    TestBed.configureTestingModule({
      providers: [{ provide: EnplugService, useValue: enplugServiceMock }],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    enplugService = TestBed.get(EnplugService);
  });

  it('creates the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('calls Player\'s start function', waitForAsync(() => {
    const enplugServiceStartSpy = spyOn(enplugService.appStatus, 'start');
    fixture.componentInstance.ngOnInit();
    expect(enplugServiceStartSpy.calls.count()).toBe(1);
  }));

  it('sets up Player\'s destroy listener on init', waitForAsync(() => {
    const destroyDoneSpy = jasmine.createSpy('destroyDone');

    const enplugServiceOnSpy = spyOn(enplugService, 'on').and.callFake(
      (eventName, callback) => {
        if (eventName === 'destroy') {
          return callback(destroyDoneSpy);
        }
      }
    );

    fixture.componentInstance.ngOnInit();

    expect(enplugServiceOnSpy).toHaveBeenCalledWith('destroy', jasmine.any(Function));
    expect(destroyDoneSpy).toHaveBeenCalled();
  }));
});
