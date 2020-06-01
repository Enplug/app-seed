import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetItemListModule } from '@enplug/components/asset-item-list';
import { getEnplugServiceMock } from 'app/mocks/enplug.service.mock.spec';
import { TranslationTestingModule } from 'app/translation-testing.module.spec';
import { AssetListComponent } from './asset-list.component';

describe('AssetListComponent', () => {
  let component: AssetListComponent;
  let fixture: ComponentFixture<AssetListComponent>;

  beforeEach(async(() => {
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
