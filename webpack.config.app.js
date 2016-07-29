'use strict';

const
  env = process.env.npm_package_config_build_env || 'prod',
  path = require( 'path' ),
  webpack = require( 'webpack' ),
  combineLoaders = require( 'webpack-combine-loaders' ),
  HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
  ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
  autoprefixer = require( 'autoprefixer' );

const appPath = path.resolve( __dirname, 'src/app' );

const extractSass = new ExtractTextPlugin( 'styles.css' );

var config = {
  target: 'web',
  entry: './js/main.js',
  context: path.join( __dirname, 'src', 'app' ),
  output: {
    filename: 'js/main.js',
    path: path.join( __dirname, 'dist', 'app' ),
    publicPath: '/app'
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
        loader: extractSass.extract( ...combineLoaders([
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
        ]).split( '!' ))
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
    new webpack.DefinePlugin({
      EP_ENV: `"${env}"`
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    extractSass
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

//  config.entry.unshift(
//    'webpack-dev-server/client?http://localhost:50000/',
//    'webpack/hot/dev-server'
//  );
//  config.devServer = {
//    hot: true,
//    contentBase: path.join( 'dist', 'app' )
//  };

//  config.plugins.push( new webpack.HotModuleReplacementPlugin());

  config.module.preloaders.push({
    test: /\.js$/,
    include: [ appPath ],
    loader: 'eslint-loader'
  });

} else if ( env === 'prod' ) {

  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );

}



module.exports = config;
