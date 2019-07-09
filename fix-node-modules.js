// This is a patch file that re-enabled some node functions that are disabled by default by Angular CLI 8.0
// It breaks @biesbjerg/ngx-translate-po-http-loader so this scripts edits webpack config that is embedded in ng CLI.
// This file is intended to be thrown away when this library can function without it.
const fs = require('fs');
const path = require('path');

console.log('--- Fixing Webpack config for Angular CLI ---');

const webpackFile = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
const file = path.join(process.cwd(), webpackFile);

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');
  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('--- Successfully patched Webpack config for Angular CLI ---');
  });
});


// This is a patch for Iconv and Iconv lite. As we don't have a direct access to Webpack, this is needed to suppress
// Iconv require() errors. More here: https://github.com/andris9/encoding/issues/18

// IIFE
(function () {
  // Patch encoding module due to iconv issues -> make it use iconv-lite
  const PATCH_VERSION = '0.1.12';
  const PATCH_MODULE = 'encoding';
  const PATCH_REASON = 'Use iconv-lite instead of iconv, helpful for webpack bundling';

  console.log('--- Patching `%s`(%s) module', PATCH_MODULE, PATCH_VERSION, ' ---');

  const pathToModule = path.join(process.cwd(), 'node_modules', PATCH_MODULE);
  const pathToModulePackage = path.join(pathToModule, 'package.json');
  const pathToModulePatchedFile1 = path.join(pathToModule, 'lib/iconv-loader.js');
  const pathToModulePatchedFile2 = path.join(pathToModule, 'lib/encoding.js');
  const moduleInfo = require(pathToModulePackage);

  if (moduleInfo.version !== PATCH_VERSION) {
    console.error(
      '--- Patching `encoding` failed - expected `%s` but detected `%s`',
      PATCH_VERSION,
      moduleInfo.version,
      ' ---',
    );
    process.exit(1);
  }

  let contents;
  if (fs.existsSync(pathToModulePatchedFile1)) {
    contents = [
      '\'use strict\';',
      'module.exports = require(\'iconv-lite\');',
      '',
    ].join('\n');
    fs.writeFileSync(pathToModulePatchedFile1, contents);
  } else {
    console.error('--- Patching `%s` failed because the file does not exist in', PATCH_MODULE, pathToModule, ' ---');
    process.exit(1);
  }
  if (fs.existsSync(pathToModulePatchedFile2)) {
    contents = fs.readFileSync(pathToModulePatchedFile2).toString();
    contents = contents.replace('console.error(E);', '');
    fs.writeFileSync(pathToModulePatchedFile2, contents);
  } else {
    console.error('--- Patching `%s` failed because the file does not exist in', PATCH_MODULE, pathToModule, ' ---');
    process.exit(1);
  }
  console.log('--- Patching `%s`, reason: `%s` - completed', PATCH_MODULE, PATCH_REASON, ' ---');
})(this);
