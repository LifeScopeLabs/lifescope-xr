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
    <imageLoader :LSObjs='LSObjs' />

    <!-- gallery -->
    <gallery :LSObjs="LSObjs"/>

    <!-- Sky   change id to class?-->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import axios from 'axios';

import gallery from "../components/gallery.vue";

import imageLoader from "../components/util/image-loader.vue";

console.log("from index.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    async asyncData (context) {
      console.log("asyncData");
      //console.log(context)
      //debugger; // eslint-disable-line
            
      var testVar = await axios("http://localhost:3000/test/content.json");
      testVar = testVar.data;     
      var result = [];
      var someData = testVar.forEach(element => {
        var item = new context.store.state.LSObjs.Content(element);
        result.push(item);
          //console.log(item instanceof context.app.LSObj.LSObj);
          //console.log(item)
        });
        //console.log(context.app.LSObj)
        return { LSObjs: result };
      }
    
  }
</script>