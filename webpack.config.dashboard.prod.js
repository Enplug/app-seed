module.exports = require('./webpack.config')({
  isProduction: true,
  target: 'dashboard',
  devtool: 'source-map'
});