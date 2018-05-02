<template>
    <a-entity id="globe-container" :position="position">
      <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
    </a-entity>
    
</template>

<script>
// TODO : try moving #geo-assets in here

console.log("from globe.vue <script>")
export default {
    props: {
      'position': {default: '0 1.6 -10'},
      'geoCoordinates': {default: () => [[0,1], [300,-20], [0, -20], [-300, 5], [0,1]]}
      },

    methods: {
        injectGeojson : function (src) {
        // inject a-entity of a globe with geojson from src
        var sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener('loaded', function () {
          console.log("injectGeojsonTest")
          // add GeoJson.  
          var aContainer = document.querySelector('#globe-container')
          aContainer.innerHTML = '<a-entity id="globe" geometry="primitive: sphere; radius: 1;" material="color: #F0A;" geojson="src: #' + src + '; featureKey: name;"></a-entity>'; // 
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
          geoAsset.setAttribute('src', geosrc)

          //console.log(geoAsset)
          aAssets.appendChild(geoAsset)
          //console.log(aAssets)
        });
      },

      latlongToGeojsonPoints : function (coordinates) {
        // creates a geojson FeatureCollection of Points
        // from an array of lat/long values
        console.log("latlongToGeojsonPoint")
        var gj = {"type": "FeatureCollection",
                  "features": []}
        var nextID = 0;
        for (var coord of coordinates) {
          var feature = {
            "type": "Feature",
            // must give name property for featureKey or point will not be shown
            "properties": {"name": 'point-' + nextID++},
            "geometry": {
              "type": "Point",
              "coordinates": [
                coord[0],
                coord[1]
              ]
            }
          }
          gj.features.push(feature)
        }
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
        this.loadGeoAsset(this.latlongToGeojsonPoints(this.geoCoordinates))
        this.injectGeojson('geojson-fly');
    }
  }
</script>
