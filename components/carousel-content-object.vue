<template>
    <a-entity>
        <wallimage :image="image"
                   position="0 1 0"/>
        

        <xrtext :textValue="textValue"
                position="0 -.2 0"/>


        <xrtext :textValue="image.connection"
                   position="0 -.4 0"/>
        <xrtext :textValue="image.updated"
                   position="0 -.6 0"/>
        <xrtext :textValue="image.homepoint"
                   position="0 -.8 0"/>
    </a-entity>
    
</template>

<script>

import xrtext from "../components/xrtext.vue"
import wallimage from "../components/wallimage.vue"

console.log("from carousel-content-object.vue <script>")
export default {
    props: ['image', 'textValue', 'connection'],
    components: {
        xrtext,
        wallimage
    }
  }
</script>
