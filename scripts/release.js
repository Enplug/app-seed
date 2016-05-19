'use strict';

const
  fs = require( 'fs' ),
  sh = require( 'shelljs' ),
  AWS = require( 'aws-sdk' ),
  pkg = require( '../package.json' );


// wraps the AWS.S3.upload call in a promise
function uploadFile( s3, key, fileStream ) {
  var params = {
    Key: key,
    Body: fileStream
  };

  return new Promise(function( resolve, reject ) {
    var data = [];
    fileStream.on( 'data', function( chunk ) {
      console.log( 'got some data for file: ' + key );
      console.log( chunk );
      data.push( chunk );
    });

    fileStream.on( 'end', function(){
      console.log( 'ending file ' + key );
      resolve( data );
    });

    fileStream.on( 'error', function( err ) {
      reject( err );
    });
  });

  return new Promise(function( resolve, reject ) {
    s3.upload( params, function( err, data ) {
      if ( err ) {
        reject( err );
        return;
      }

      resolve( data );
    });
  });
}

const release = module.exports = {
  runRelease: function() {
    var
      s3,
      s3Config = Object.assign( {}, pkg.config.aws.s3 );

    // git check on master?
    // git tag?
    // upload to S3

    // todo metadata

    if ( !sh.test( '-f', 'aws.private.json' )) {
//      throw new Error( `"aws.private.json" does not exist in ${ process.cwd() } Please create it with "accessKeyId" and "secretAccessKey" fields.` );
    }

    // load config
//    AWS.config.loadFromPath( './aws.private.json' );

    // add console for logging
//    s3Config.logger = process.stdout;

    // create s3 service
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
//    s3 = new AWS.S3( s3Config );

    sh.cd( 'dist' );
    sh.echo( 'Uploading files to S3' );
    sh.ls( '-RA', './' )
      .filter( fileOrDir => sh.test( '-f', fileOrDir ))
      .reduce(function( lastOp, nextFile ){
        return lastOp.then(function() {
            return uploadFile( s3, nextFile, fs.createReadStream( nextFile ));
          })
          .catch(function( err ) {
            throw err;
          });
      }, Promise.resolve( null ))
      .then(function( result ) {
        console.log( 'last file uploaded' );
      })
      .catch(function( err ) {
        console.error( 'There was an error uploading to S3' );
        console.error( err.stack );
      });

    return;
  }
};

// run directly from cli or 'npm run'
if ( require.main === module ) {
  release.runRelease();
}
