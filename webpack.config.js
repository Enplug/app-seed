'use strict';

const pkg = require( './package.json' );
const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CombineLoaders = require( 'webpack-combine-loaders' );
const extractCSS = new ExtractTextPlugin( 'css/vendor.'+ pkg.version + '.css' );
const extractSASS = new ExtractTextPlugin('css/bundle.'+ pkg.version + '.css');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let needsVersionDirectory = false;
// Parse script arguments
process.argv.forEach(function (val, index, array) {
  switch ( val ) {
    case '--directory-version' :
      needsVersionDirectory = true;
      break;
  }
});

module.exports = (options) => {

  let targetPath = Path.resolve( __dirname, 'src/' + options.target );

  let baseUrl = '/'; // default local dev set up
  if ( options.isProduction ) {
    if ( needsVersionDirectory ) {
      baseUrl += pkg.config.destination+pkg.version+'/'+options.target+'/';
    } else {
      baseUrl += pkg.config.destination+options.target+'/';
    }
  }

  let webpackConfig = {

    devtool: options.devtool,

    entry: [
      `webpack-dev-server/client?http://localhost:${options.port}`,
      'webpack/hot/dev-server',
      './src/' + options.target + '/js/Main'
    ],

    output: {
      path: Path.join(__dirname, 'dist/' + options.target ),
      filename: 'js/bundle.'+ pkg.version + '.js'
    },

    plugins: [
      // hot module replacement
      // new Webpack.HotModuleReplacementPlugin(),
      // environement variables
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      // html
      new HtmlWebpackPlugin({
        template: './src/' + options.target + '/index.html',
        baseUrl: baseUrl
      }),
      // CSS
      extractCSS,
      // SASS
      extractSASS,
      // Copy Assets
      new CopyWebpackPlugin([
            { from: Path.join(__dirname, 'src/' + options.target + '/img' ), to: Path.join(__dirname, 'dist/' + options.target + '/img' ) },
        ], {
            ignore: [
                '*.txt',
                '.*'
            ],
            copyUnmodified: false
        })
    ],

    module: {
      loaders: [{
        test: /\.js$/,
        include: [ targetPath ],
        exclude: /(node_modules|bower_components)/,
        loader: CombineLoaders([
          {
            loader: 'ng-annotate-loader',
            query: {
              add: true
            }
          },
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: Path.join( __dirname, 'tmp' )
            }
          }
        ]),
      },
      // assets
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        include: [ targetPath ],
        loader: 'file-loader'
      },
      // ng-template html
      {
        test: /\.tpl\.html$/,
        include: [ targetPath ],
        loader: CombineLoaders([
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
      }]
    }

  };

  if (options.isProduction) {

    webpackConfig.entry = ['./src/' + options.target + '/js/Main'];


    webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    );

    // webpackConfig.module.loaders.push({
    //   test: /\.css$/i,
    //   loader: extractCSS.extract(['css', 'sass'])
    // });

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: [ Path.resolve( __dirname, 'node_modules' )],
      loader: extractCSS.extract( ...CombineLoaders([
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          query: {
            minimize: options.isProduction
          }
        }]).split( '!' ))
      },
      {
      test: /\.scss$/i,
      loader: extractSASS.extract(['css', 'sass'])
    });

  } else {

    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: [ Path.resolve( __dirname, 'node_modules' )],
      loader: extractCSS.extract( ...CombineLoaders([
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          query: {
            minimize: options.isProduction
          }
        }]).split( '!' ))
      },
      {
        test: /\.scss$/i,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      });

    webpackConfig.devServer = {
      contentBase: './dist/' + options.target,
      hot: true,
      port: options.port,
      inline: true,
      progress: true
    };
  }

  return webpackConfig;

}
