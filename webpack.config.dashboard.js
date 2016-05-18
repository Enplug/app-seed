'use strict';

const
  env = process.env.npm_package_config_build_env || 'prod',
  path = require( 'path' ),
  webpack = require( 'webpack' ),
  combineLoaders = require( 'webpack-combine-loaders' ),
  HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
  autoprefixer = require( 'autoprefixer' );

const dashboardPath = path.resolve( __dirname, 'src/dashboard' );

var config  = {
  target: 'web',
  entry: './js/main.js',
  context: path.join( __dirname, 'src', 'dashboard' ),
  output: {
    filename: 'js/main.js',
    path: path.join( __dirname, 'dist', 'dashboard' ),
    publicPath: '/'
  },
  module: {
    // linting preloader
    preloaders: [
      {
        test: /\.js$/,
        include: [ dashboardPath ],
        loader: 'eslint-loader'
      }
    ],
    // main loaders: [ html, scss, js ]
    loaders: [
      // assets
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      },
      // ng-template html
      {
        test: /\.tpl\.html$/,
        include: [ dashboardPath ],
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
      // styles
      {
        test: /\.scss$/,
        include: [ dashboardPath ],
        loader: combineLoaders([
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
              minimize: false
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            query: {
              outputStyle: 'nested'
            }
          }
        ])
      },
      // javascript
      {
        test: /\.js$/,
//        exclude: /(node_modules|bower_components)/,
        include: [ dashboardPath ],
        loader: combineLoaders([
          {
            loader: 'ng-annotate-loader'
//            query: {}
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
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],
  eslint: {
    configFile: path.resolve( __dirname, '../.eslintrc' )
  },
  postcss() {
    return [
      autoprefixer({
        browsers: [ 'last 2 versions' ]
      })
    ];
  }
};


if ( env === 'local' ) {

  config.debug = true;
  config.devtool = '#eval-source-map';


} else if ( env === 'prod' ) {



}


module.exports = config;
