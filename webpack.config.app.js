'use strict';

const
  env = process.env.npm_package_config_build_env || 'prod',
  path = require( 'path' ),
  combineLoaders = require( 'webpack-combine-loaders' ),
  HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
  autoprefixer = require( 'autoprefixer' );

const appPath = path.resolve( __dirname, 'src/app' );

var config = {
  target: 'web',
  entry: './js/main.js',
  context: path.join( __dirname, 'src', 'app' ),
  output: {
    filename: 'js/main.js',
    path: path.join( __dirname, 'dist', 'app' ),
    publicPath: '/'
  },
  module: {
    preloaders: [],
    loaders: [
      // assets
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      },
      // styles
      {
        test: /\.scss$/,
        include: [ appPath ],
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
        include: [ appPath ],
        loader: 'babel-loader',
        query: {
          cacheDirectory: path.join( __dirname, 'tmp' )
        }
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

  config.module.preloaders.push({
    test: /\.js$/,
    include: [ appPath ],
    loader: 'eslint-loader'
  });

} else if ( env === 'prod' ) {



}



module.exports = config;
