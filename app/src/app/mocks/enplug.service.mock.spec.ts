import { Provider } from '@angular/core';
import { EnplugService } from 'app/enplug.service';

const enplugServiceMock = {
  appStatus: {
    start: () => { },
    error: () => { },
    registerServiceWorker: async () => {}
  },
  on: () => { }
};

export  function getEnplugServiceMock(): Provider {
  return {
    provide: EnplugService,
    useValue: enplugServiceMock,
  }
}
