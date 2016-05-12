'use strict';

var
    path = require( 'path' ),
    webpack = require( 'webpack' );
//    autoprefixer = require( 'autoprefixer' );


module.exports = function( env ) {
   return {
       target: 'web',
       entry: './src/app/js/main.js',
       output: {
           path: path.join( __dirname, 'dist', 'app', 'js' ),
           filename: 'main.js'
       },
       module: {
           preloaders: [

           ],
           loaders: [
               {
                   test: /\.js$/,
                   exclude: /(node_modules|bower_components)/,
                   include: [ path.resolve( __dirname, 'src/app' )],
                   loader: 'babel-loader',
                   query: {
                       presets: [ 'es2015' ],
                       plugins: [ 'transform-runtime' ],
                       cacheDirectory: path.join( __dirname, 'tmp' )
                   }
               }
           ]
       }
   };
};

