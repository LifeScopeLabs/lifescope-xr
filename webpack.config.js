var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    // This is the "main" file which should include all other modules
    entry: './src/main.js',
    // Where should the compiled file go?
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/dist/',
      filename: 'build.js'
    },
    resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
    module: {
      // Special compilation rules
      loaders: [
        {
          // Ask webpack to check: If this file ends with .js, then apply some transforms
          test: /\.js$/,
          // Transform it with babel
          loader: 'babel-loader',
          // don't transform node_modules folder (which don't need to be compiled)
          exclude: /node_modules/
        },
        {
          // Ask webpack to check: If this file ends with .vue, then apply some transforms
          test: /\.vue$/,
          // don't transform node_modules folder (which don't need to be compiled)
          exclude: /(node_modules|bower_components)/,
          // Transform it with vue
        use: {
          loader: 'vue-loader'
        }
      },
      // images
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      }
    ]
  },
  devServer: {
         port: 3000
  },
  externals: ['socket.io', 'easyrtc']
};