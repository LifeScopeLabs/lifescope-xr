<template>
  <a-entity class="theater">
      <!-- Floor -->
      <!-- <a-entity id="floor" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + hallDepth + ''"
                :material="'src:#floor; repeat: ' + hallWidth + ' ' + -hallDepth"
                rotation="-90 0 0"
                :position="'0 0 ' + -hallWidth/2">
      </a-entity> -->

    <!-- <a-videosphere autoplay loop="true" src="#cable-car"/> -->
    <!-- <a-videosphere id="video-sphere" src="#cable-car"/> -->

  </a-entity>
</template>

<script>

import Vue from 'vue';

if (CONFIG.DEBUG) {console.log("from gallery.vue <script>")}
export default {
    data () {
        return {
            name: "LifeScope"
        }
    },

    props: ['LSObjs', 'rooms', 'roomConfig'],
    
    
    
    // Lifecycle hooks
    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
    beforeCreate () {
        if (CONFIG.DEBUG) {console.log("beforeCreate");};
    },
    created () {
        //  data observation, computed properties, methods, watch/event callbacks
        if (CONFIG.DEBUG) {console.log("created");};
        //debugger;
    },
    beforeMount () {
        if (CONFIG.DEBUG) {console.log("beforeMount");};
    },
    mounted () {
        // el is replaced by the newly created vm.$el
        if (CONFIG.DEBUG) {console.log("mounted");};
        if (CONFIG.DEBUG) {console.log("theater360.vue :" + this.LSObjs);};

        this.addVideo("https://s3.amazonaws.com/lifescope-static/test/content/video360/CABLE_CAR_360_optimized.mp4");

        var vidSph = document.createElement('a-videosphere');
        vidSph.setAttribute('id', 'video-sphere');
        vidSph.setAttribute('src', '#cabel-car');

        //var vidSph = document.getElementById("video-sphere");
        var vidSrc = document.getElementById(vidSph.attributes.src.value.substring(1));

        document.querySelector('a-scene').appendChild(vidSph);
        vidSrc.play();

        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            if (CONFIG.DEBUG) {console.log("mounted nextTick");};
        })
    },
    beforeUpdate () {
        if (CONFIG.DEBUG) {console.log("beforeUpdate");};
    },
    updated () {
        if (CONFIG.DEBUG) {console.log("updated");};
    },
    beforeDestroy () {
        if (CONFIG.DEBUG) {console.log("beforeDestroy");};
    },
    destroyed () {
        if (CONFIG.DEBUG) {console.log("destroyed");};
    },

    methods: {
        addVideo: function (src) {
            console.log('addVideo');
            var assets = document.querySelector('a-assets');

            var videoEl = document.createElement('video');
            videoEl.setAttribute('src', src);
            videoEl.setAttribute('preload', "auto");
            //videoEl.autoplay = true;
            videoEl.setAttribute('loop', 'true');
            videoEl.setAttribute('crossOrigin', 'anonymous');
            videoEl.setAttribute('id', "cabel-car");

            assets.appendChild(videoEl);
        },
    }
}
</script>
