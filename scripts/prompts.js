'use strict';

const
    currVersion = require( '../package.json' ).version,
    semver = require( 'semver' ),
    inquirer = require( 'inquirer' );

var
    toBuildPrompt,
    envPrompt,
    versionPrompt,
    newVersions;

// inquirer settings for which app to build
toBuildPrompt = {
    message: 'What do you want to build?',
    name: 'toBuild',
    type: 'list',
    default: 'both',
    choices: [
        {
            name: 'Player App (src/app/*)',
            value: 'app'
        },
        {
            name: 'Dashboard App (src/dashboard/*)',
            value: 'dashboard'
        },
        {
            name: 'Both the Player and Dashboard Apps',
            value: 'both'
        }
    ]
};

// inquirer settings for which environment to build to
envPrompt = {
    message: 'Build for which environment?',
    name: 'env',
    type: 'list',
    choices: [
        {
            name: 'Local',
            value: 'local'
        },
        {
            name: 'Staging',
            value: 'stag'
        },
        {
            name: 'Production',
            value: 'prod'
        }
    ],
    validate: function( selection ) {
        return new Promise(function( resolve, reject ) {
            if ( ![ 'stag', 'prod', 'local' ].some(env => env === selection )) {
                reject( 'You must select an environment for this build!' );
                return;
            }

            resolve( true );
        });
    }
};

// incremented semver versions
newVersions = {
    patch: semver.inc( currVersion, 'patch' ),
    minor: semver.inc( currVersion, 'minor' ),
    major: semver.inc( currVersion, 'major' )
};

// inquirer settings for version bumpting
versionPrompt = [
    {
        message: `Do you need to update the version number? current: ${ currVersion }`,
        name: 'needsBump',
        type: 'confirm',
        default: true
    },
    {
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
            }
        ],
        when: function( answers ) {
            return new Promise(function( resolve ) {
                resolve( answers.needsBump );
            });
        }
    }
];


module.exports = {
    envValues: {
        local: 'local',
        staging: 'stag',
        production: 'prod'
    },
    // what to build, then which env
    // pass true to exclude 'local' env
    preBuild( isRelease ) {
        var thisEnvPrompt = Object.assign({}, envPrompt );

        if ( isRelease ) {
            thisEnvPrompt.choices.shift();
        }

        return inquirer.prompt([
            toBuildPrompt,
            thisEnvPrompt
        ]);
    },
    // just the app build prompt
    whatToBuild() {
        return inquirer.prompt( toBuildPrompt );
    },
    // just the env prompt
    whichEnv() {
        return inquirer.prompt( envPrompt );
    },
    // just the version bump prompt
    versionBump() {
        return inquirer.prompt( versionPrompt );
    }
};
