'use strict';

var
    path = require( 'path' ),
    webpack = require( 'webpack' ),
    combineLoaders = require( 'webpack-combine-loaders' );
//    autoprefixer = require( 'autoprefixer' );


module.exports = function( env ) {
    return {
        target: 'web',
        entry: './src/dashboard/js/main.js',
        output: {
            path: path.join( __dirname, 'dist', 'dashboard', 'js' ),
            filename: 'main.js'
        },
        module: {
            preloaders: [
                {
                    test: /\.js$/,
                    include: [ path.resolve( __dirname, 'src/dashboard' ) ],
                    loader: 'eslint-loader'
                }
            ],
            loaders: [
                {
                    test: /\.tpl\.html$/,
                    include: [ path.resolve( __dirname, 'src/dashboard' )],
                    loader: combineLoaders([
                        {
                            loader: 'ngtemplate-loader'
                        },
                        {
                            loader: 'html-loader',
                            query: {
                                attrs: false
                            }
                        }
                    ])
                },
                {
                    test: /\.js$/,
//                    exclude: /(node_modules|bower_components)/,
                    include: [ path.resolve( __dirname, 'src/dashboard' )],
                    loader: combineLoaders([
                        {
                            loader: 'ng-annotate-loader'
//                            query: {}
                        },
                        {
                            loader: 'babel-loader',
                            query: {
                                presets: [ 'es2015' ],
                                plugins: [ 'transform-runtime' ],
                                cacheDirectory: path.join( __dirname, 'tmp' )
                            }
                        }
                    ])
                }
            ]
        },
        eslint: {
            extends: 'enplug'
        }
    };
};
