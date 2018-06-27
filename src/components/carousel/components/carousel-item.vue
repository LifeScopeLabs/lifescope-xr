<template>
    <a-entity class="carousel-item carousel-content-item">

        
        <a-entity v-if="this.image.type === 'image'"
            geometry="primitive: plane; width: 3;"
            rotation="0 0 0"
            position="0 1 0"
            :material="this.imageMaterial"
            src-fit="orientation: width; maxDimension: 3;"
            >
        </a-entity>

        <a-entity v-else-if="this.image.type === 'video'"
            :id="'video-rig-' + this.image.id">
            <a-video
                :src="this.videoSrc"
                rotation="0 0 0"
                position="0 1 0"
                width="3"
                src-fit
                autoplay="false"
                :play-gaze="'button: true; rig: video-rig-' + this.image.id + '; position: -1 -0.35 0;'">
            </a-video>

            <!-- 
            <a-entity scale="2 2 1"
                    :text="this.textString(image.name)"
                    position="0 -.2 0"/>
            
            <a-entity 
                geometry="primitive: plane; width: 1;"
                rotation="0 0 0"
                position="0 -.4 0"
                material="src:#video-play"
                src-fit="orientation: width; maxDimension: 1;"
                /> -->
        </a-entity>
    </a-entity>

    
</template>

<script>


console.log("from carousel-item.vue <script>")
export default {
    props: ['image', 'roomConfig'],

    computed: {
        imageMaterial: function () {
            //console.log('src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route);
            return 'src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        },
        videoSrc: function () {
            //console.log('src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route);
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        }
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        if (this.image.type === 'video'){
            //console.log(this.image);
        }
        // console.log(this.image.type);
        // console.log(this.image.type === 'image');
        // console.log(this.image.type === 'video');
    }
  }
</script>
