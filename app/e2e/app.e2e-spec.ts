import { AppseedPlayerPage } from './app.po';

describe('appseed-player App', () => {
  let page: AppseedPlayerPage;

  beforeEach(() => {
    page = new AppseedPlayerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
