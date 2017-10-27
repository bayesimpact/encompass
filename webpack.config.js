const Dotenv = require('dotenv-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/dist',
    compress: true,
    // hot: true,
    https: true,
    port: 9000
  },
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-import')(),
                require('postcss-cssnext')({
                  browsers: '>2%'
                }),
                require('postcss-inline-svg')({
                  path: './node_modules'
                }),
                require('postcss-svgo')(),
              ]
            }
          }]
        })
      },
    ]
  },
  plugins: [
    new Dotenv,
    new ExtractTextPlugin({
      filename: 'bundle.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
      title: 'bayes-mvp'
    })
  ]
}