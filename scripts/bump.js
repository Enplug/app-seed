'use strict';

const
    currVersion = require( '../package.json' ).version,
    semver = require( 'semver' ),
    inquirer = require( 'inquirer' ),
    sh = require( 'shelljs' ),
    newVersions = {
      patch: semver.inc( currVersion, 'patch' ),
      minor: semver.inc( currVersion, 'minor' ),
      major: semver.inc( currVersion, 'major' )
    };

inquirer.prompt({
  message: 'What kind of update is this?',
  name: 'bumpTo',
  type: 'list',
  choices: [
    {
      name: `Patch update to: ${ newVersions.patch } (Backwards-compatible bug fixes)`,
      value: newVersions.patch
    },
    {
      name: `Minor update to: ${ newVersions.minor } (New backwards-compatible functionality)`,
      value: newVersions.minor
    },
    {
      name: `Major update to: ${ newVersions.major } (Incompatible API changes)`,
      value: newVersions.major
    },
    {
      name: 'Skip the version bump (not recommended unless you did it manually)',
      value: 'skip'
    }
  ]
}).then(function( answer ) {
  if ( answer.bumpTo === 'skip' ) {
    return;
  }

  sh.exec( `boxcutter set version ${ answer.bumpTo }` );
  // if you add bower uncomment this line
//  sh.exec( `boxcutter --file bower.json set version ${ answer.bumpTo }` );
  sh.echo( `Version bumped to: ${ answer.bumpTo }` );
});
