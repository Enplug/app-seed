'use strict';

const
    rm = require( 'rimraf' ).sync,
    webpack = require( 'webpack' ),
    prompts = require('./prompts' ),
    appConfigFactory = require( '../webpack.config.app' ),
    dashConfigFactory = require( '../webpack.config.dashboard' );

var
    build,
    args = process.argv.slice( 2 ),
    webPackConfigs = [];

// env is passed to config factories so
// all the webpack config lives in one file

// exports prompt-less build fn
build = module.exports = {
    runBuild: function( toBuild, env, shouldWatch ) {
        var compiler, configs = [];

        // add app to list of configs
        if ( toBuild === 'app' || toBuild === 'both' ) {
            rm( 'dist/app/*' );
            configs.push( appConfigFactory( env ));
        }

        // add dashboard to list of configs
        if ( toBuild === 'dashboard' || toBuild === 'both' ) {
            rm( 'dist/dashboard/*' );
            configs.push( dashConfigFactory( env ));
        }

        // some feedback
        console.log( `\n\tStarting ${ shouldWatch ? 'watch' : '' } build of ${ toBuild === 'both' ? 'app and dashboard' : toBuild } for ${ env === 'stag' ? 'staging' : 'production' }\n` );

        // build the webpack compiler instance
        compiler = webpack( configs );

        return new Promise(function( resolve, reject ) {
            // if we are watch+rebuild use `.watch`
            if ( shouldWatch ) {
                compiler.watch(function( err, stats ) {
                    if ( err ) {
                        console.log( 'There was an error during the webpack watch process.' );
                        reject( err );
                        return;
                    }

                    console.log( 'Webpack watch process stopped' );
                    resolve( stats );
                });

                return;
            }

            // otherwise run regular compile
            compiler.run(function( err, stats ) {
                if ( err ) {
                    console.log( 'There was an error with the webpack build please check the configuration' );
                    reject( err );
                    return;
                }

                console.log( 'Webpack build finished' );
                resolve( stats );
            });
        });


    },
    runWatch: function( toBuild, env ) {
        return build.runBuild( toBuild, env, true );
    }
};


// when being run directly from the command line
if ( require.main === module ) {
    prompts.preBuild().then(function( answer ) {
        return build.runBuild( answer.toBuild, answer.env, args.some(arg => arg === 'watch' ));
    })
    .then(function( stats ) {
        console.log( stats.toString({ colors: true }));
    });
}
