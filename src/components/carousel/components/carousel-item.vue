<template>
    <a-entity class="carousel-item carousel-content-item">
        <a-entity
            geometry="primitive: plane; width: 3;"
            rotation="0 0 0"
            position="0 1 0"
            :material="this.imageMaterial"
            src-fit="orientation: width"
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
    props: ['image', 'roomConfig'],

    computed: {
        imageMaterial: function () {
            return 'src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        }
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    }
  }
</script>
