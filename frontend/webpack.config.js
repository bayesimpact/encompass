const path = require('path')
const Dotenv = require('dotenv-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/dist',
    compress: true,
    // hot: true,
    https: false,
    port: 8081
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
              })
            ]
          }
        }]
      })
    },
    ]
  },
  plugins: [
    new Dotenv({
      path: '../.env'
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
      title: 'bayes-network-adequacy-explorer',
      favicon: path.join(__dirname, 'src/images/favicon.png')
    })
  ]
}
