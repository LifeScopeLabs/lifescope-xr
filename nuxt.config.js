export default {
    build: {
      vendor: [
        'aframe',
        'aframe-layout-component',
        'aframe-geojson-component',
        'lifescope-objects'
      ]
    },
    plugins: [
      '~/plugins/geojson-plugin.js'
    ],
    babel: {
      presets: ['es2015', 'stage-3']
    }
  }