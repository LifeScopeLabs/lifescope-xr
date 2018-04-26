<template>
  <section class="bcontainer">
    <a-scene log="AFRAME component log: a-scene">

      <!-- Load assets -->
      <a-assets>
        <img id="floor" src="/floor.jpg">
        <img id="sky" src="/nightsky.jpg">
        <img id="earth" src="/earth/Albedo.jpg">
        <img id="clouds" src="/earth/Clouds.png">
        <img id="eye" src="/iris.jpg">
      </a-assets>

      <!-- Geojson -->
      <a-assets>
        <a-asset-item id="geojson-simple" src="geodata/simple.geojson" />
      </a-assets>
 
      

      <!-- Load assets with imageLoader -->
      <!-- https://www.pexels.com/search/travel/ -->

      <imageLoader v-for="wimage in wallimages"
                   :key="wimage.id"
                   :image="wimage" />

      

      <!-- Camera -->
      <a-camera>
        <a-entity cursor="rayOrigin: mouse"></a-entity>
        <!-- Or <a-cursor></a-cursor> -->
      </a-camera>

      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor"
                geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      


      <!-- Wall left -->
      <a-entity id="wall-left"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 90 0"
                position="-4 2 4">
      </a-entity>
      
      <!-- Wall right -->
      <a-entity id="wall-right"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="180 90 0"
                position="4 2 4">
      </a-entity>
      
      <!-- Wall back -->
      <a-entity id="wall-back"
                geometry="primitive: plane; width: 8; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 180 0"
                position="0 2 8">
      </a-entity>



      <!-- put stuff on back wall -->
      <a-entity id="back-wall-stuff"
                position="0 1 7.9"
                rotation="180 0 180">
                <canvasC 
                        :imageC="singleTestImage"
                        :textValueC="'Hello from canvas!'"
                        :cursor-listener-openlink="singleTestImage.url">
                </canvasC> 
      </a-entity>
      

      <!-- Canvas left -->
      <a-entity id="canvas-left"
                      layout="type: line; margin: 4"
                      rotation="0 90 0"
                      position="-3.8 1 0">
              <canvasC v-for="wimage of wallimages.slice(0, wallimages.length/2)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0"
                        :cursor-listener-openlink="wimage.url">
              </canvasC>
      </a-entity>

      <!-- Canvas right -->
      <!-- TODO : flip text -->
      <a-entity id="canvas-right"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 1 0">
              <canvasC v-for="wimage of wallimages.slice(wallimages.length/2, wallimages.length)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0"
                        :cursor-listener-openlink="wimage.url">
              </canvasC>
      </a-entity>
      
      
      <!-- Globe -->
      <a-entity id="globe-container"
                position="0 2 -10">
                    
      </a-entity>
      <!-- Earth -->
      <a-sphere id="Earth" position="0 1 -4" radius="1" material="src:#earth; metalness: ; roughness: 1;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
      </a-sphere>
      
      <!-- Sky -->
      <a-sky id="Sky" src="#sky" rotation="90 0 90">
      </a-sky>
      
    </a-scene>
  </section>
</template>





<script>
import fetch from 'isomorphic-fetch'

import xrtext from "../components/xrtext.vue"
import wallimage from "../components/wallimage.vue"
import imageLoader from "../components/imageLoader.vue"
import canvasC from "../components/canvasC.vue"

console.log("from index.vue <script>");

export default {

  data () {
    return {
      name: "Lifescope",
      description: "The Internet of You",
    }
  },
  asyncData () {
    return fetch("http://localhost:3000/test/content.json")
    .then(function(res) {
      //console.log(res)
      return res.json();
      })
    .then(function(loadedJson) {
      //console.log(loadedJson);
      //console.log(loadedJson[0])
      return { wallimages: loadedJson,
              singleTestImage: loadedJson[0] }
    });
  },
  computed: {
    numberOfPhotos: function () {
      return wallimages.length
    }
  },
  components: {
    xrtext,
    wallimage,
    imageLoader,
    canvasC
  },
  methods: {
    testMethod: function () {
      console.log("testMethod called")
    },
    testBrowser: function () {
      // check if we have access to the browser
      if (process.browser) {
        console.log("process.browser")
      }
    },
    createLogAFRAMEcomponent: function () {
      // create AFRAME component log
      // logs a message to console
      // ex: <a-scene log="Hello, a-scene!">
      // TODO : check that component DNE before creating
      if (process.browser) {
        console.log("AFRAME = require('aframe')")
        AFRAME = require('aframe')
      
        AFRAME.registerComponent('log', {
          schema: {type: 'string'},

          init: function () {
            var stringToLog = this.data;
            console.log(stringToLog);
          }
        });
      }
    },

    changeTextOnBackwall: function (new_text) {
      // Demonstrates how to change an attribute within an a-frame entity
      // TODO : Refactor so we can just change textValueC in the canvasC
      console.log("changeTextOnBackwall")
      var sceneEl = document.querySelector('a-scene');
      var backWall = sceneEl.querySelector('#back-wall-stuff')
      var textBox = backWall.querySelector('a-entity').querySelectorAll('a-entity')[1]
      //console.log(backWall);
      //console.log(textBox)
      textBox.setAttribute('text', {value: new_text})
    },

    openLink: function (link) {
      console.log("openLink: " + link)
      window.open(link, "_self")
    },

    addEventListenerToBackwall: function () {
      // Demonstrate how to use an on click listener 
      // on an a-frame entity to follow a regular web link

      console.log("addEventListenerToBackwall")
      var sceneEl = document.querySelector('a-scene');
      var backWall = sceneEl.querySelector('#back-wall-stuff')
      var aCanvas = backWall.querySelector('a-entity')
      
      // TODO : there has got to be a better way to do this
      var openLink = this.openLink

      aCanvas.addEventListener("click", function () {
        console.log("clicked!")
        openLink("https://www.duckduckgo.com")
      })
    },

    createOpenLinkOnClickListenerAframeComponent: function () {
      // create an aframe component that adds an onClick event listener  
      // that opens a link
      // TODO : Decide if this belongs in canvasC.vue
      
      console.log("createOpenLinkOnClickListenerAframeComponent")
      if (process.browser) {
        console.log("AFRAME = require('aframe')")
        AFRAME = require('aframe')

        // TODO : there has got to be a better way to do this
        var openLink = this.openLink

        AFRAME.registerComponent('cursor-listener-openlink', {
          // regisers an Aframe component that opens a link
          // when the a-entity is clicked
          // ex: <a-entity cursor-listener-openlink="https://aframe.io/docs/0.8.0/components/cursor.html">

          schema: {
            type: 'string'
          },

          init: function () {
            //console.log("registerComponent cursor-listener-openlink init")

            // TODO : refactor?
            var link = this.data

            this.el.addEventListener('click', function (evt) {
              //console.log('I was clicked at: ', evt.detail.intersection.point);
              openLink(link)// "https://www.duckduckgo.com")
            });
          }
        });
      }
    },

    injectGeojson : function () {
        var sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener('loaded', function () {
          console.log("injectGeojson")
          // add GeoJson.  
          var aContainer = sceneEl.querySelector('#globe-container')
          aContainer.innerHTML = '<a-entity id="globe" geometry="primitive: sphere; radius: 1;" material="color: #F0A;" geojson="src: #geojson-simple; featureKey: name;"></a-entity>';
        });
      }
  
  },

  // Lifecycle hooks
  // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
  beforeCreate () {
    console.log("beforeCreate")
  },
  created () {
    //  data observation, computed properties, methods, watch/event callbacks
    console.log("created")
  },
  beforeMount () {
    console.log("beforeMount")
  },
  mounted () {
    // el is replaced by the newly created vm.$el
    console.log("mounted")

    // Create Aframe components
    this.createLogAFRAMEcomponent()
    this.createOpenLinkOnClickListenerAframeComponent()

    // Inject geojson
    this.injectGeojson()

    // test
    //this.changeTextOnBackwall("Hello from changeTextOnBackwall")
 
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      console.log("mounted nextTick")
    })
  },
  beforeUpdate () {
    console.log("beforeUpdate")
  },
  updated () {
    console.log("updated")
  },
  beforeDestroy () {
    console.log("beforeDestroy")
  },
  destroyed () {
    console.log("destroyed")
  }
}
</script>