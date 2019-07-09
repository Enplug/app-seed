import { AppseedDashboardPage } from './app.po';

describe('appseed-dashboard App', () => {
  let page: AppseedDashboardPage;

  beforeEach(() => {
    page = new AppseedDashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Enplug Dashboard Seed');
  });
});
