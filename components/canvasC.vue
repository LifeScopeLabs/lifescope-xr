<template>
    <a-entity event-set__click="testMethod">
        <wallimage :image="imageC"
                   position="0 1 0"/>
        

        <xrtext :textValue="textValueC"
                position="0 -.2 0"/>


        <xrtext :textValue="imageC.connection"
                   position="0 -.4 0"/>
        <xrtext :textValue="imageC.updated"
                   position="0 -.6 0"/>
        <xrtext :textValue="imageC.homepoint"
                   position="0 -.8 0"/>
    </a-entity>
    
</template>

<script>
// naming this file canvas.vue instead of canvasC.vue caused problems
import xrtext from "../components/xrtext.vue"
import wallimage from "../components/wallimage.vue"

console.log("from canvas.vue <script>")
export default {
    props: ['imageC', 'textValueC', 'connection'],
    components: {
        xrtext,
        wallimage
    },
    methods: {
        testMethod: function (event) {
            conosle.log("testMethod called")
        }
    }
  }
</script>
