<template>
    <a-entity class="gallery-carousel">
        <a-rail v-for="n in radialsegments"
            :key="'railSegment' + n"
            :rotation="railRotation(n-1)"
            :position="railPosition(n-1)"
            :radius="floorRadius"
            :railheight="railHeight"
            :radialsegments="numberOfSegments"
            :bump="bump"
            :normal="normal"
            :quality="textureQuality"
            :shading="textureShading"/>
        <a-diorama v-for="n in numberOfItemsToDisplay"
            :key="'carouselImage' + n"
            :src="imageSrc(items[n-1])"
            :rotation="dioramaRotation(n-1)"
            :position="dioramaPosition(n-1)"
            :railheight="railHeight"
            :bump="bump"
            :normal="normal"
            :quality="textureQuality"
            :shading="textureShading"/>
    </a-entity>
</template>

<script>
import { mapState } from 'vuex';
import { GraphicsQualityEnum, ShadingEnum } from '../../store/modules/xr/modules/graphics';

export default {
    computed: {
        radialsegments() {
            return Math.max(this.numberOfSegments, 12);
        },
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        items() {
            return this.sortedLSObjs.slice(this.pageStart, this.pageStart + this.numberOfSegments);
        },
        totalItems() {
            return this.LSObjs.length;
        },
        numberOfItemsToDisplay() {
            return Math.min(this.numberOfSegments, this.items.length);
        },
        textureQuality() {
            switch (this.quality) {
                case GraphicsQualityEnum.LOW:
                    return 's';
                case GraphicsQualityEnum.MEDIUM:
                    return 'm';
                case GraphicsQualityEnum.HIGH:
                    return 'l';
                default:
                    return 'l';
            }
        },
        textureShading() {
            switch (this.shading) {
                case ShadingEnum.DEFAULT:
                    return 'default';
                case ShadingEnum.CEL:
                    return 'cel';
                default:
                    return 'default';
            }
        },
        // vuex store
        ...mapState('xr',
            [
                'LSObjs',
                'roomConfig'
            ]
        ),
        ...mapState('xr/carousel',
            [
                'pageStart',
                'numberOfSegments',
                'floorRadius',
                'railHeight'
            ]
        ),
        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading'
            ]
        ),
    },
    methods: {
        imageSrc: function (image) {
            if(!image)
                return '';
            else
                return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
        },
        railRotation: function(segment) {
            var u = segment / this.numberOfSegments;
            var theta =  (-3*Math.PI/4) - (u * Math.PI * 2);

            var roty = theta * (180/Math.PI);
            var rotx = 0;

            return `${rotx} ${roty} 0`;
        },
        railPosition: function(segment) {
            var u = segment / this.numberOfSegments + 0.5 / this.numberOfSegments;
            // 0.5/36 to get to the post
            var theta = (-3*Math.PI/4) - (u * Math.PI * 2);

            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            var x = this.floorRadius * sinTheta;
            var z = this.floorRadius * cosTheta;

            return `${x} 0 ${z}`;
        },
        dioramaRotation: function(segment) {
            var u = segment / this.numberOfSegments + 0.5 / this.numberOfSegments;
            // 0.5/36 to get to the post
            var theta =  (-3*Math.PI/4) - (u * Math.PI * 2);

            var roty = theta * (180/Math.PI);
            var rotx = 0;

            return `${rotx} ${roty} 0`;
        },
        dioramaPosition: function(segment) {
            var u = segment / this.numberOfSegments + 0.5 / this.numberOfSegments;
            // 0.5/36 to get to the post
            var theta = (-3*Math.PI/4) - (u * Math.PI * 2);

            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            var x = (this.floorRadius) * sinTheta;
            var z = (this.floorRadius) * cosTheta;

            return `${x} 0 ${z}`;
        },
    },
  }
</script>