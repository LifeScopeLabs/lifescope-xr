<template>
  <section class="bcontainer">
    <a-scene>

      <!-- Load assets -->
      <a-assets>
        <img id="floor" src="/floor.jpg">
        <img id="sky" src="/nightsky.jpg">
        <img id="earth" src="/earth/Albedo.jpg">
        <img id="clouds" src="/earth/Clouds.png">
        <img id="eye" src="/iris.jpg">
      </a-assets>

      <!-- Load assets with imageLoader -->
      <!-- https://www.pexels.com/search/travel/ -->

      <imageLoader v-for="wimage in wallimages"
                   :key="wimage.id"
                   :image="wimage" />

      

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
      <a-entity id="Back wall stuff"
                position="0 1 7.9"
                rotation="180 0 180">
                <canvasC 
                        :imageC="singleTestImage"
                        :textValueC="'Hello from canvas!'">
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
                        rotation="0 0 0">
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
                        rotation="0 0 0">
              </canvasC>
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
  }
}
</script>