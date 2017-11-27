'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  var config = {};

  config.entry = isTest ? void 0 : {
    app: './src/frontend/index.js'
  };

  config.output = isTest ? {} : {
    path: __dirname + '/dist',
    publicPath: isProd ? '/' : 'http://localhost:8080/',
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  if (isTest) {
    config.devtool = 'inline-source-map';
  }
  else if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  config.module = {
    rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|IconemPotree)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy', 'transform-object-rest-spread'],
        }
      }, {
        test: /\.css$/,
        exclude: /mapbox-gl\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader" // has separate config, see postcss.config.js nearby
        ]
      },
      {
        test: /mapbox-gl\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }, 
    {
      // /!\ /!\ /!\ There is a lot of custom process here in order to make potree works since it is currently not a npm module /!\ /!\ /!\ 
      test: /(\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$)|(BinaryDecoderWorker|GreyhoundBinaryDecoderWorker|lasdecoder-worker|laslaz-worker)/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]?[hash]',
        outputPath: function(url) {
          var destFolder;
          if(url.indexOf('IconemPotree') >= 0){
            if(url.indexOf('resources') >= 0) destFolder = 'public/iconem-potree' + url.match(/potree(.*)/)[1];
            if(url.indexOf('workers') >= 0) destFolder = url.match(/potree(.*)/)[1];
          }
          else destFolder = 'assets' + url.match(/build(.*)/)[1];
          return destFolder;
        }
      }
    }, 
    {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  };

  if (isTest) {
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader',
      query: {
        esModules: true
      }
    })
  }

  config.plugins = [];

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
        minChunks(module, count) {
            var context = module.context;
            return context && ((context.indexOf('node_modules') >= 0 && (context.indexOf('@iconem') === -1) || context.indexOf('IconemPotree') >= 0));
        },
    })
  );

  // Skip rendering index.html in test mode
  if (!isTest) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/www/index.html',
        inject: 'body',
        filename: 'index.html'
      }),

      new ExtractTextPlugin({filename: isProd ? 'styles/[name].[hash].css' : 'style/[name].bundle.css', allChunks: true})
    )
  }

  if (isProd) {
    config.plugins.push(
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        exclude: /(vendors|worker).*\.js$/,
        compress: {
            comparisons: false,  // don't optimize comparisons because it was buggy with mapbox
        },
      }),
      new BundleAnalyzerPlugin({analyzerMode: 'static'}) 
    )
  }

  config.devServer = {
    contentBase: './src',
    stats: 'minimal',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    proxy : {
      "*": {
        target: "http://localhost:9000"
      }
    }
  };

  return config;
}();