<template>
    <a-entity id="globe-container" position="0 1.8 -10"></a-entity>
    
</template>

<script>
// TODO : try moving #geo-assets in here

console.log("from globe.vue <script>")
export default {
    methods: {
        testMethod: function (event) {
            console.log("testMethod called")
        },

        injectGeojson : function (src) {
        // inject a-entity of a globe with geojson from src
        var sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener('loaded', function () {
          console.log("injectGeojsonTest")
          // add GeoJson.  
          var aContainer = document.querySelector('#globe-container')
          aContainer.innerHTML = '<a-entity id="globe" geometry="primitive: sphere; radius: 1;" material="color: #F0A;" geojson="src: #' + src + '; featureKey: name;"></a-entity>';
        });
      },

      loadGeoAsset : function (geoAsset) {
        // loads geojson data into assets on the fly
        console.log("loadGeoAsset")

        var sceneEl = document.querySelector('a-scene');
        var geosrc = this.geoObjectToUrl(geoAsset)
        //console.log(geosrc)

        sceneEl.addEventListener('loaded', function () {
          console.log("loadGeoAsset")
          
          // add GeoJson asset  
          var aAssets = sceneEl.querySelector('#geo-assets')
          var geoAsset = document.createElement("a-asset-item");
          geoAsset.setAttribute('id', 'geojson-fly')
          geoAsset.setAttribute('src', geosrc)//'/simple.geojson')//geosrc)

          //console.log(geoAsset)
          aAssets.appendChild(geoAsset)
          //console.log(aAssets)
        });
      },

      latlongToGeojsonPoint : function (lat, long) {
        // creates a geojson point object from lat/long values
        console.log("latlongToGeojsonPoint")
        var gj = {"type": "FeatureCollection",
                  "features": []}
        var feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              lat,
              long
            ]
          }
        }
        gj.features.push(feature)
        //console.log(gj)
        return(gj)
      },

      latlongToGeojsonLine : function (coordinates) {
        console.log("latlongToGeojsonLine")
        // creates a geojson line object from an array of lat/long values
        // coordinates is an array of lat long values
        // [[0,1], [300,-20], [0, -20]]
        var gj = {"type": "FeatureCollection",
                  "features": []}
        var feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          }
        }
        gj.features.push(feature)
        //console.log(gj)
        return(gj)
      },

      geoObjectToUrl : function (geo) {
        // converts a geojson object into a url
        console.log("geoObjectToUrl")
        //console.log(geo)
        var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(geo));
        //console.log(url)
        return(url)
      }

    },
    
    mounted () {
        console.log("globe mounted")
        this.loadGeoAsset(this.latlongToGeojsonLine([[0,1], [300,-20], [0, -20], [-300, 5], [0,1]]))
        this.injectGeojson('geojson-fly');
    }
  }
</script>
