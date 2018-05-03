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
                  :image='wimage' />

    <!-- gallery -->
    <gallery :content="content"/>

    <!-- Sky   change id to class?-->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import axios from 'axios';

import gallery from "../components/gallery.vue";

import imageLoader from "../components/util/image-loader.vue";
//import { Vue } from 'vue/types/vue';

console.log("from index.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    asyncData (context) {
      console.log("asyncData");

      //debugger; // eslint-disable-line
            
      return axios("http://localhost:3000/test/content.json")
      .then(function(res) {
        //console.log(res.data)
        return res.data;
        })
      .then(function(loadedJson) {        
        var result = [];
        var someData = loadedJson.forEach(element => {
          var item = new context.app.LSObj.Content(element);
          result.push(item);
          //console.log(item instanceof context.app.LSObj.LSObj);
          //console.log(item)
        });

        return { content: result };
      });

    }
    
  }
</script>