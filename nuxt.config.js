module.exports = {
    build: {
      vendor: [
        'aframe',
        'aframe-layout-component',
        'aframe-geojson-component',
        'lifescope-objects'
      ]
    },
    plugins: [
      '~/plugins/geojson-plugin.js',
      '~/plugins/lifescope-objects-plugin.js'
    ]
  }