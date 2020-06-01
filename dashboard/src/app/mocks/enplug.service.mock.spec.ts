import { Provider } from '@angular/core';
import { EnplugService } from 'app/services/enplug.service';

class MockEnplugService {
  account = {};
  dashboard = {
    pageLoading: () => true,
    setDisplaySelectorVisibility: () => true,
    setHeaderTitle: () => 'Mock title',
    setHeaderButtons: () => null,
  };
  social = {};
};

export function getEnplugServiceMock(): Provider {
  return {
    provide: EnplugService,
    useClass: MockEnplugService,
  }
}
