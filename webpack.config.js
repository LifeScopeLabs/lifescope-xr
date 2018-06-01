var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      rules: [
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
          // Transform it with vue
          loader: 'vue-loader',
          // don't transform node_modules folder (which don't need to be compiled)
          exclude: /(node_modules|bower_components)/,
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
  externals: ['socket.io', 'easyrtc'],
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'LIFESCOPE XR Gallery',
      // Load a custom template (lodash by default see the FAQ for details)
      template: './src/index.html'
    })
  ]
};