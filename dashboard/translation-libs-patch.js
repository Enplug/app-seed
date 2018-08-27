// This is a patch file that re-enabled some node functions that are disabled by default by Angular CLI 6.0.
// It breaks @biesbjerg/ngx-translate-po-http-loader so this scripts edits webpack config that is embedded in ng CLI.
// This file is intended to be thrown away when this library can function without it.
const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
