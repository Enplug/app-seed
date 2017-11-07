import { AppseedAppPage } from './app.po';

describe('appseed-app App', () => {
  let page: AppseedAppPage;

  beforeEach(() => {
    page = new AppseedAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
