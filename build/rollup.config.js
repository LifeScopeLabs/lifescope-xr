import VuePlugin from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/rollup.js',
  output: {
    file: 'dist/lifescope-xr.js',
    format: 'esm'
  },
  external: [ 'aframe', 'three', 'axios', 'vuex', 'socket.io-client', 'moment', 'nipplejs' ],
  plugins: [
    VuePlugin(),
    postcss()
  ]
}