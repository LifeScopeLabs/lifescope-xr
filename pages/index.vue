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

    <!-- Sky -->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import fetch from 'isomorphic-fetch'

import gallery from "../components/gallery.vue"

import imageLoader from "../components/util/image-loader.vue"

console.log("from index.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    asyncData () {
      return fetch("http://localhost:3000/test/content.json")
      .then(function(res) {
        //console.log(res)
        return res.json();
        })
      .then(function(loadedJson) {
        //console.log(loadedJson);
        return { content: loadedJson}
      });
    },

  }
</script>