const pkg = require( './package.json' );

module.exports = require('./webpack.config')({
  isProduction: false,
  target: 'dashboard',
  devtool: 'cheap-eval-source-map',
  port: pkg.config.ports.dashboard
});
