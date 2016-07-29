'use strict';

const
  env = process.env.npm_package_config_build_env || 'prod',
  path = require( 'path' ),
  webpack = require( 'webpack' ),
  combineLoaders = require( 'webpack-combine-loaders' ),
  HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
  ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
  autoprefixer = require( 'autoprefixer' );

const dashboardPath = path.resolve( __dirname, 'src/dashboard' );

const
  extractCss = new ExtractTextPlugin( 'vendor.css' ),
  extractSass = new ExtractTextPlugin( 'styles.css' );

var config  = {
  target: 'web',
  entry: './js/main.js',
  context: path.join( __dirname, 'src', 'dashboard' ),
  output: {
    filename: 'js/main.js',
    path: path.join( __dirname, 'dist', 'dashboard' ),
    publicPath: '/dashboard'
  },
  module: {
    preloaders: [],
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
        test: /\.css$/,
        include: [ path.resolve( __dirname, 'node_modules' )],
        loader: extractCss.extract( ...combineLoaders([
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
              minimize: false
            }
          }
        ]).split( '!' ))
      },
      {
        test: /\.scss$/,
        include: [ dashboardPath ],
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
        include: [ dashboardPath ],
        loader: combineLoaders([
          {
            loader: 'ng-annotate-loader',
            query: {
              add: true
            }
          },
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: path.join( __dirname, 'tmp' )
            }
          }
        ])
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
    extractCss,
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
//    contentBase: path.join( 'dist', 'dashboard' )
//  };

//  config.plugins.push( new webpack.HotModuleReplacementPlugin());

  config.module.preloaders.push({
    test: /\.js$/,
    include: [ dashboardPath ],
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
