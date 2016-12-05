'use strict';

const
    pkg = require( '../package.json' ),
    inquirer = require( 'inquirer' ),
    sh = require( 'shelljs' );

// Realease after build?
let buildForRelease = false;
let needsDevServer = false;
// add one level directory with version number (/vendor/version/app-or-dashboard)
let needsVersionDirectory = false;
// Parse script arguments
process.argv.forEach(function (val, index, array) {
  switch ( val ) {
    case '--build-for-release' :
      buildForRelease = true;
      break;
    case '--dev-server' :
      needsDevServer = true;
      break;
  }
});

let target = undefined; // app or dashboard
let bucket = undefined; // s3 bucket apps.enplug.in or apps.enplug.com

function promptForBucket () {
  return inquirer.prompt({
    message: 'Which bucket do you want to use?',
    name: 's3Bucket',
    type: 'list',
    choices: pkg.config.aws.buckets
  });
}

function promptForProject () {
  return inquirer.prompt({
    message: 'Which target do you want to build?',
    name: 'target',
    type: 'list',
    choices: pkg.config.targets
  });
}

function confirmDestination(bucket, prefix) {
  return inquirer.prompt({
    message: 'Confirm destination: "' + bucket + '/' + prefix + '"',
    name: 'confirm',
    type: 'confirm'
  });
}

if ( buildForRelease ) {

  promptForBucket().then(function(answer) {
    bucket = answer.s3Bucket;
    if ( bucket == 'apps.enplug.com' ) {
      needsVersionDirectory = true;
    }
    continuePrompting();
  });

} else {
  continuePrompting();
}

function continuePrompting () {

  promptForProject().then(function(answer) {
    target = answer.target;
    runBuild();
  });

}

function runBuild () {

  let command = ''
  if ( !needsDevServer ) {
     command += 'rimraf dist/'+target // clean previous build
     command += ' &&rimraf tmp ' // clean tmp
     command += ' && '
   }
   command += ' '+(needsDevServer?'webpack-dev-server':'webpack'); // webpack server or regular webpack?
   command += ' --config webpack.config.'+target+'.'+ (needsDevServer?'dev':'prod' ) +'.js '; // proper config, proper target
   command += needsDevServer ? ' --watch --colors --inline  --progress  --host 0.0.0.0 ' + (target == 'dashboard' ? '--https' : '') : ' --bail --progress --profile ';
   command += needsVersionDirectory ? ' --directory-version' : '';

  sh.exec( command, function(argument) {
    if ( buildForRelease ) {
      let prefix = pkg.config.destination;
      prefix += needsVersionDirectory ? pkg.version +'/' : '';
      prefix += target;

      confirmDestination(bucket, prefix).then(function(response) {
        if ( response.confirm ) {
          sh.exec( `node scripts/release.js ${target} ${bucket} ${prefix}` );
        }
      });
    }
  } );
}
