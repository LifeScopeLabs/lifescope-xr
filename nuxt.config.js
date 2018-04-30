module.exports = {
    build: {
      vendor: [
        'aframe',
        'aframe-layout-component',
        'aframe-geojson-component'
      ]
    },
    plugins: [
      '~/plugins/geojson-plugin.js'
    ]
  }