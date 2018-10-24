import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { EnplugService } from './enplug.service';
import { AppComponent } from './app.component';

let enplugServiceMock: any;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(() => {
    enplugServiceMock = {
      appStatus: jasmine.createSpyObj('appStatus', ['start']),
      on: jasmine.createSpy('on')
    };

    TestBed.configureTestingModule({
      providers: [{ provide: EnplugService, useValue: enplugServiceMock }],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeDefined();
  }));

  it('calls Player\'s start function on init', async(() => {
    fixture.componentInstance.ngOnInit();
    expect(enplugServiceMock.appStatus.start.calls.count()).toBe(1);
  }));

  it('sets up Player\'s destroy listener on init', async(() => {
    fixture.componentInstance.ngOnInit();
    expect(enplugServiceMock.on.calls.count()).toBe(1);
  }));
});
