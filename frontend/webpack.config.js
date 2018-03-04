const path = require('path')
const Dotenv = require('dotenv-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: __dirname + '/dist',
    compress: true,
    // hot: true,
    https: false,
    port: 8081,
    disableHostCheck: true
  },
  entry: './src/index.tsx',
  externals: {
    'chart.js': 'Chart',
    lodash: '_',
    'mapbox-gl': 'mapboxgl',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
    rx: 'Rx'
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        test: /\.tsx?$/,
      },
      {
        include: path.resolve(__dirname, 'src'),
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
      }
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
    }),
    new ForkTsCheckerWebpackPlugin
  ]
}
