<template>
  <a-entity class="theater">
     <!-- loading background -->
     <!-- <a-sky src="#sky" id="asky" rotation="90 0 90">
    </a-sky> -->
  </a-entity>
</template>

<script>

import Vue from 'vue';

import shaka from '../../lib/shaka-player.compiled.js';

export default {
    data () {
        return {
            mediaSource: "",
            sourceBuffer: "",
            videoEl: "",
            mimeCodec: "",
            assetURL: "",
            chunk: 1
        }
    },

    mounted () {

        this.addVideo();
        // this.MSEVideo();
        //("https://s3.amazonaws.com/lifescope-static/test/content/video360/CABLE_CAR_360_optimized.mp4");
        // var manifestUri = '/static/video360/output/stream.mpd';
        shaka.polyfill.installAll();
        var manifestUri = '/static/video360/output/stream.mpd';

        var video = document.getElementById('cable-car');
        var player = new shaka.Player(video);

        var vidSph = document.createElement('a-videosphere');
        vidSph.setAttribute('id', 'video-sphere');
        vidSph.setAttribute('src', '#cable-car');

        document.querySelector('a-scene').appendChild(vidSph);
        
        player.load(manifestUri).then(function() {
            console.log('The video has now been loaded!');
            // var video = document.getElementById('cable-car');
            video.play();
        });

    },

    methods: {
        addVideo: function () {
            console.log('addVideo');
            var assets = document.querySelector('a-assets');

            var videoEl = this.videoEl = document.createElement('video');
            videoEl.setAttribute('crossOrigin', 'anonymous');
            videoEl.setAttribute('id', "cable-car");
            videoEl.setAttribute('autoplay', true);

            assets.appendChild(videoEl);
        },

    }
}
</script>
