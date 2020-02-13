import VuePlugin from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/rollup.js',
  output: [
    {
      file: 'dist/lifescope-xr.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/lifescope-xr.umd.js',
      format: 'umd',
      name: 'lifescope-xr',
    },
  ],
  external: [ 'aframe', 'three', 'axios', 'vuex', 'socket.io-client', 'moment', 'nipplejs', 'webfontloader' ],
  plugins: [
    VuePlugin(),
    postcss()
  ]
}