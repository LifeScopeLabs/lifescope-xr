var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConfigWebpackPlugin = require("config-webpack");

module.exports = {
    // This is the "main" file which should include all other modules
    entry: './src/main.js',
    // Where should the compiled file go?
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/dist/',
      filename: 'build.js'
    },
    mode: 'none',
    resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
    module: {
      // Special compilation rules
      rules: [
        // babel
        { 
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },

        // css
        { 
          test: /\.css$/, 
          loader: "style-loader!css-loader" ,
          // exclude: /node_modules/
        },

        // scss
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            },
            'sass-loader',
          ],
          exclude: /node_modules/
        },
  
        // fonts
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader?name=public/fonts/[name].[ext]',
          exclude: /node_modules/ 
        },

        // vue
        {
          test: /\.vue$/,
          loader: 'vue-loader',
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
      },
    ]
  },
  devServer: {
         port: 3000
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'LifeScope XR Gallery',
      // Load a custom template (lodash by default see the FAQ for details)
      template: './src/index.html'
    }),
    new ConfigWebpackPlugin()
  ]
};