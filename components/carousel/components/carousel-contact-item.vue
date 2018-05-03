<template>
    <a-entity class="carousel-item carousel-contact-item">
        <a-entity
            geometry="primitive: plane; width: 3; height: 2"
            :material="this.imageMaterial"
            rotation="0 0 0"
            position="0 1 0">
        </a-entity>

        <a-entity scale="2 2 1"
                  :text="this.textString(image.handle)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('connection: ' + image.connection)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('updated: ' + image.updated)"
                   position="0 -.6 0"/>
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
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.image.id)
    }
  }
</script>
