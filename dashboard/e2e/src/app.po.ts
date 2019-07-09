import { browser, by, element } from 'protractor';

export class AppseedDashboardPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ep-app h1.ep-app__header')).getText();
  }
}
