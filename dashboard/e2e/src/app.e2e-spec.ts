import { browser, logging } from 'protractor';

import { AppseedDashboardPage } from './app.po';

describe('appseed-dashboard App', () => {
  let page: AppseedDashboardPage;

  beforeEach(() => {
    page = new AppseedDashboardPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    expect(page.getParagraphText()).toEqual('Enplug Dashboard Seed');
  });

  // Code below is commented as Enplug API is unavailable in E2E scenarios and may cause errors
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
