<template>
    <a-entity class="carousel-item carousel-content-item">
        <a-entity
            geometry="primitive: plane; width: 3;"
            :material="this.imageMaterial"
            rotation="0 0 0"
            position="0 1 0"
            src-fit 
            >
        </a-entity>

        <a-entity scale="2 2 1"
                  :text="this.textString(image.name)"
                  position="0 -.2 0"/>
    </a-entity>
    
</template>

<script>


console.log("from carousel-item.vue <script>")
export default {
    props: ['image'],

    computed: {
        imageMaterial: function () {
            //console.log("id: " + this.image.id)
            //debugger;
            //console.log("crossorigin: " + this.image.crossorigin);
            
            return 'src: #image-' + this.image.id + '; side: double'
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
