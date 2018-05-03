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
import axios from 'axios'

import gallery from "../components/gallery.vue";

import imageLoader from "../components/util/image-loader.vue";

export default {
    components: {
        gallery,
        imageLoader
    },

    async asyncData (context, callback) {
        
      let { data } = await axios.get(`http://localhost:3000/test/content.json`);

      let objArray = [];

      data.forEach(element => {
        objArray.push(new context.app.LSObj.Content(element));
      });

      return {content: objArray};
    }
  }
</script>