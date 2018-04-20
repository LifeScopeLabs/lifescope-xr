<template>
    <a-entity
        geometry="primitive: plane; width: 3; height: 2"
        :material="this.imageMaterial"
        rotation="0 0 0">
    </a-entity>
    
</template>

<script>
export default {
    props: ['image'],

    computed: {
        imageMaterial: function () {
            //console.log("id: " + this.image.id)
            return 'src: #' + this.image.id + '; side: double'
        }
    }
  }
</script>
