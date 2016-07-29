'use strict';

const
  fs = require( 'fs' ),
  path = require( 'path' ),
  s3 = require( 's3' ),
  inquirer = require( 'inquirer' ),
  pkg = require( '../package.json' );

// prompt for bucket
// create client
// sync folder

function promptForBucket() {
  return inquirer.prompt({
    message: 'Which bucket do you want to release to?',
    name: 's3Bucket',
    type: 'list',
    choices: pkg.config.aws.buckets
  });
}

function createS3Client() {
  var
    creds,
    s3Options = Object.assign({}, pkg.config.aws.s3 );

  try {
    creds = JSON.parse(
      fs.readFileSync(
        path.resolve( 'aws.private.json' ),
        'utf8'
      )
    );
  } catch ( e ) {
    console.error( 'Error finding aws.private.json' );
    throw e;
  }

  if ( creds.accessKeyId == null || creds.secretAccessKey == null ) {
    throw new TypeError(
      'Error could not fine accessKeyId or secretAccessKey in aws.private.json file.'
    );
  }

  Object.assign( s3Options, creds );

  // s3Options is what is used by the AWS SDK
  // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property

  return s3.createClient({
    // default options
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520,
    multipartUploadSize: 15728640,
    s3Options
  });
}

function promiseWrapUploader( uploader ) {
  return new Promise(function( resolve, reject ) {

    uploader.on( 'error', reject );
    uploader.on( 'end', resolve );

    uploader.on( 'fileUploadEnd', function( localFilePath, s3Key ) {
      console.log( `Pushed ${ localFilePath } to ${ s3Key }` );
    });

  });
}

function syncDist() {
  promptForBucket()
    .then( function( answer ) {
      // return s3 client params
      return {
        localDir: 'dist',
        deleteRemoved: true,
        s3Params: {
          Bucket: answer.s3Bucket,
          Prefix: ''
          // can add options for putObject command
          // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        }
      };
    })
    .then( function( uploadOptions ) {
      var s3Client = createS3Client();

      return promiseWrapUploader( s3Client.uploadDir( uploadOptions ));
    })
    .catch(function( error ) {
      console.error( 'There was an error during the release process!' );
      console.error( error.stack );

      return null;
    })
    .then( function( result ) {
      if ( result == null ) {
        return;
      }

      console.log( 'Release finished' );
    });
}


module.exports = {
  runRelease: syncDist
};

// run directly from cli or 'npm run'
if ( require.main === module ) {
  syncDist();
}
