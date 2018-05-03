<template>
  <a-scene>
    <!-- Load assets -->
    <a-assets class="assets-sky">
      <img id="sky" src="/nightsky.jpg">
    </a-assets>

    <a-assets class="assets-floor">
      <img id="floor" src="/floor.jpg">
    </a-assets>

    <a-assets class="assets-earth">
      <img id="earth" src="/earth/Albedo.jpg">
    </a-assets>

    <!-- Geojson -->
    <a-assets class="assets-geo" id="geo-assets">
    </a-assets>

    <!-- Load assets with imageLoader -->
    <!-- https://www.pexels.com/search/travel/ -->
    <imageLoader v-for="wimage in content"
                  :key="wimage.id"
                  :image="wimage" />

    <!-- gallery -->
    <gallery :content="content"/>

    <!-- Sky   change id to class?-->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import fetch from 'isomorphic-fetch';

import gallery from "../components/gallery.vue";

import imageLoader from "../components/util/image-loader.vue";

console.log("from index.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    asyncData (context) {

      debugger; // eslint-disable-line

      console.log("asyncData");
      
      console.log(context.app.LSObj);
      
      return fetch("http://localhost:3000/test/content.json")
      .then(function(res) {
        //console.log(res);
        return res.json();
        })
      .then(function(loadedJson) {
        //console.log("loadedJson: " + loadedJson);
        
        var result = [];
        var someData = loadedJson.forEach(element => {
          var item = element;
          result.push(item);
          //console.log(item instanceof Vue.LSObj.Content);
        });//loadedJson.map(x=> new Vue.LSObj.Content(x.id, x))
        //console.log("someData: " + someData);
        //console.log("result: " + result);
        return { content: result };
      });

    }
    
  }
</script>