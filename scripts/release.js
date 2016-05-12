'use strict';

const
    path = require( 'path' ),
    boxcutter = Object.assign({}, require( 'boxcutter' ).Boxcutter ),
    prompts = require( './prompts' ),
    build = require( './build' );

var release;

release = module.exports = {
    runRelease: function() {
        // git check on master?
        // prompt for version change
            // update package.json
        // run build
        // git tag
        // upload to S3

        return prompts.versionBump().then(function( versionAnswer ) {
            // update package.json if needed
            if ( versionAnswer.needsBump ) {
                boxcutter.load( path.normalize( __dirname + '/../package.json' ));
                boxcutter.set( 'version', versionAnswer.bumpTo );
                boxcutter.save( path.normalize( __dirname + '/../package.json' ));
            }

            return prompts.preBuild( true );
        }).then(function( buildAnswers ) {
            return build.runBuild( buildAnswers.toBuild, buildAnswers.env, false );
        }).then(function( stats ) {

            console.log( "Webpack stats from build: " );
            console.log( stats.toString({ colors: true }));

            // todo git tag
            // todo upload to S3

        }).catch(function( error ) {
            console.log( '\nThere was an error duing the release process' );
            console.error( error.stack );
        });
    }
};

// run directly from cli or 'npm run'
if ( require.main === module ) {
    release.runRelease();
}
