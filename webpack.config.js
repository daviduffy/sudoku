const webpack = require('webpack');
const path = require('path');
const extractText = require('extract-text-webpack-plugin');
const minify_js = require('uglifyjs-webpack-plugin');
const minify_css = require('optimize-css-assets-webpack-plugin');


let config = {
  entry: './src/input.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.sass', '.css', '.jpeg', '.jpg', '.gif', '.png'],
    alias: { // create aliases
      images: path.resolve(__dirname, 'src/assets/images') // alias for 'images'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/, // files ending with .js
        exclude: /node_modules/, // exclude the node_modules directory
        loader: "babel-loader" // use this (babel-core) loader
      },
      {
        test: /\.sass$/, // files ending with .scss
        use: ['css-hot-loader'].concat(extractText.extract({ // call our plugin with the extract method
          fallback: 'style-loader', // fallback for any CSS not extracted
          use: ['css-loader', 'sass-loader'], // use these loaders
        })),
      },
      {
        test: /\.js?x$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            }
          },
        }],
        exclude: /node_modules/,
        include: __dirname,
      }
    ] // end rules
  },
  plugins: [
    new extractText('app.css'), // call the extractText constructor and name our css file
    new webpack.ProvidePlugin({
      "React": "react",
      "ReactDOM": "react-dom",
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './public'), // a directory or URL to serve content from
    historyApiFallback: true, // fall back to /index.html for Single Page Applications
    inline: true, // inline mode (set to false to disable including client scripts)
    open: true, // open default browser when launching
    compress: true, // enable gzip compression for everything served
    hot: true // enable webpack's Hot Module Replacement feature
  },
  devtool: 'eval-source-map' // enable devtool for better debugging experience
}

module.exports = config;

// push various additional processes to the config object when in production mode
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new minify_js(), // call the uglifyjs plugin to concat/min/purify js
    new minify_css() // call the optimizecss plugin and push it to the config object
  );
}