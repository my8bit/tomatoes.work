const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');
const OfflinePlugin = require('offline-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const filenamePrefix = process.env.DEVELOPMENT === 'true' ? '.dev' : '';
const configFileName = `config${filenamePrefix}.json`;
const configPath = `../${conf.path.src(configFileName)}`;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
module.exports = {
  eslint: {
    rules: {
      'no-warning-comments': 'off',
      'no-debugger': 'off'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.(css|scss|sass)$/,
        loaders: [
          'style',
          'css',
          'resolve-url-loader',
          'postcss',
          'sass?sourceMap'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=node_modules/roboto-fontface/fonts/[name].[ext]'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader?presets[]=react,presets[]=env'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      isProduction: JSON.stringify(process.env.DEVELOPMENT) || false,
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
      FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
      FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      FIREBASE_MESSEGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSEGING_SENDER_ID),
      IFTT_KEY: JSON.stringify(process.env.IFTT_KEY),
      TRIGGER_NAME: JSON.stringify(process.env.TRIGGER_NAME),
      DOMAIN: JSON.stringify(process.env.URL)
    }),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: 'body'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
    new PreloadWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new OfflinePlugin()
  ],
  postcss: () => [autoprefixer],
  debug: true,
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  resolve: {
    alias: {
      config: path.resolve(__dirname, configPath)
    }
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    `./${conf.path.src('index.jsx')}`
  ]
};
