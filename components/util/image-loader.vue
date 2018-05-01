<template>

    <a-assets>
        <img :key="image.id"
            :id="image.id"
            :src="this.imageSrc">
    </a-assets>
    
</template>

<script>
export default {
    props: ['image'],

    computed: {
        imageSrc: function () {
            // prepend embed_thumbnail with /photos
            // ex: /iris.jpg returns /photos/iris.jpg
            var x = this.image.embed_thumbnail
            //console.log(x)
            x = "/photos" + x
            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            //console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            return x
        }
    }
  }
</script>
