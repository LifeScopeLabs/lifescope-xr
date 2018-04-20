<template>
    <a-entity>
        <wallimage :image="imageC"
                   position="0 1 0"/>
        <xrtext :textValue="textValueC"
                   position="0 -.2 0"/>
    </a-entity>
    
</template>

<script>
// naming this file canvas.vue instead of canvasC.vue caused problems
import xrtext from "../components/xrtext.vue"
import wallimage from "../components/wallimage.vue"

console.log("from canvas.vue <script>")
export default {
    props: ['imageC', 'textValueC'],
    components: {
        xrtext,
        wallimage
    }
  }
</script>
