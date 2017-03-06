var webpack = require('webpack')


module.exports = {
  entry: './index.js',
  devtool: 'sourcemap',
  output: {
    path: 'dist',
    filename: '/esp/js/bundle.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      {
        test: /\.css$/,
        loader: 'css-loader'
      }
    ]
  },

  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ] : [],

  devServer : {
    inline: true,
    host: "0.0.0.0",
    contentBase: "dist",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      "/esp/v1": {
        "target": "http://localhost",
        ws: true
      }
    }
  }

}