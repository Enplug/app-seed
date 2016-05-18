'use strict';

const
  silent = { silent: true },
  inquirer = require( 'inquirer' ),
  sh = require( 'shelljs' );

sh.echo();

// removes this script from getting executed again
if ( sh.exec( 'boxcutter get scripts.postinstall', silent ).toString() === 'node scripts/init.js\n' ) {
  sh.echo( 'Removing post install init script' );
  sh.exec( 'boxcutter set scripts.postinstall' );

  sh.echo( 'Resetting Version Numbers to 1.0.0' );
  sh.exec( 'boxcutter set version 1.0.0' );
  sh.exec( 'boxcutter --file bower.json set version 1.0.0' );
  sh.echo();
}

// changes "enplug-seed" to something defined by the user
if ( sh.exec( 'boxcutter get name', silent ).toString() === 'enplug-seed\n' ) {
  inquirer.prompt({
    message: [
      'Make sure to follow npm naming rules found here: https://docs.npmjs.com/files/package.json#name',
      'What name do you want to use in package.json for this app?'
    ].join( '\n' ),
    name: 'appName',
    type: 'input'
    // todo add validation?
  }).then(function( answers ) {
    sh.sed( '-i', 'enplug-seed', answers.appName, 'package.json' );
    sh.sed( '-i', 'enplug-seed', answers.appName, 'bower.json' );
    // could possibly commit these changes from here

    sh.echo();
    sh.echo( 'Please commit the changes to package.json and bower.json' );
    sh.echo();
  });
}
