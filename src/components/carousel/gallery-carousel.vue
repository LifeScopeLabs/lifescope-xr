<template>
    <a-entity class="gallery-carousel">
    </a-entity>
</template>

<script>

import Vue from 'vue';

export default {

    props: ['LSObjs', 'roomConfig'],

    computed: {
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        items() {
            return this.sortedLSObjs.slice(0, 36);
        }
    },
    methods: {
        imageSrc: function (image) {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
        },
        createImages: function() {
            if (CONFIG.DEBUG) {console.log("createImages")};
            var scene = document.querySelector('a-scene');
            for ( var i = 0; i < this.items.length; i ++ ) {
                var u = i / 36 + 0.5 / 36; // 0.5/36 to get to the post
                var theta = u * Math.PI * 2 + 0;
                var sinTheta = Math.sin( theta );
                var cosTheta = Math.cos( theta );
                var segx = 6.2 * sinTheta;
                var segz = 6.2 * cosTheta;

                var img = document.createElement("a-custom-image");
                img.setAttribute('src', this.imageSrc(this.items[i]));
                var roty = theta * (180/Math.PI); // 
                var rotx = 0;
                img.setAttribute('rotation', rotx + ' ' + roty + ' 0');
                img.setAttribute('position', segx + ' 1.5 ' + segz);
                this.$el.appendChild(img);
            }
        }
    },

    watch: {
        LSObjs: function (newVals, oldVals) {
            if(typeof newVals != "undefined" && newVals != null
                && newVals.length != null && newVals.length > 0
                && oldVals.length == 0) {
                this.createImages();
            }
        }
    },
  }
</script>
