import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { getEnplugServiceMock } from 'app/mocks/enplug.service.mock.spec';
import { TranslationTestingModule } from 'app/translation-testing.module.spec';
import { AssetComponent } from './asset.component';

describe('AssetComponent', () => {
  let component: AssetComponent;
  let fixture: ComponentFixture<AssetComponent>;

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
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
