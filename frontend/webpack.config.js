const path = require('path')
const Dotenv = require('dotenv-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'eval',
  devServer: {
    contentBase: __dirname + '/dist',
    compress: true,
    // hot: true,
    https: false,
    port: 8081,
    disableHostCheck: true
  },
  externals: {
    'chart.js': 'Chart',
    lodash: '_',
    'mapbox-gl': 'mapboxgl',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
    rx: 'Rx'
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
      include: path.resolve(__dirname, "src"),
      loader: 'awesome-typescript-loader'
    },
    {
      enforce: 'pre',
      test: /\.js$/,
      include: path.resolve(__dirname, "src"),
      loader: 'source-map-loader'
    },
    {
      test: /\.css$/,
      include: path.resolve(__dirname, "src"),
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
