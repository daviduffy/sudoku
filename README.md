# Webpack Starter

_Based on the webpack 2.0+ from scratch article series._

## Setup
_The project has a `webpack.config.js` that already includes all of the configuration to use the modules below. You simply need to install them._

1. Initialize a new npm project
  `npm init -y`

  ...and you can add the following entries to your "scripts" object:
  ```JSON
    "build": "webpack",
    "start": "webpack-dev-server -d --hot --config webpack.config.js --watch",
    "production": "NODE_ENV=production webpack"
  ```

2. Save Webpack and Webpack server as project dev dependencies
  `npm i --save-dev webpack@latest webpack-dev-server@latest`

3. Double-check that webpack is saved globally
  do `webpack -v` in a directory that _is not_ associated with this project.
  if you don't get a version number, do `npm i -g webpack@latest`

4. Install Babel to compile ES6 to ES5
  `npm install --save-dev babel-loader babel-core`
  _babel-loader is already accounted for in `webpack.config.js`_
  `npm install --save-dev babel-preset-es2015`
  _the included `.babelrc` contains the es2015 preset already_

5. Install SASS/SCSS to CSS compiler
  `npm i --save-dev sass-loader node-sass css-loader style-loader`
  _This project is set up to use `.sass` instead of `.scss`._

6. Install Extract-Text plugin to create dedicated `.css` file
  `npm install --save-dev extract-text-webpack-plugin`

7. Allow JS minification
  `npm i uglifyjs-webpack-plugin --save-dev`
 
8. Allow CSS minification & hot reload
  `npm i optimize-css-assets-webpack-plugin --save-dev`
  `npm i css-hot-loader --save-dev`

9. Allow image loading
  `npm i image-webpack-loader file-loader --save-dev`
  _Loaders are already included in `webpack.config.js`._

10. Add React to the project
  `npm i react react-dom babel-preset-react --save-dev`
  _"react" already present in the `.babelrc` file._

11. 
