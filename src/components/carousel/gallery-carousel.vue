<template>
    <a-entity class="gallery-carousel">
        <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 1"
                        rotation="0 90 0"
                        :position="-hallWidth/2 + ' 1 0'">
                <carouselItem v-for="wimage of itemsLeft"
                            :key="wimage.id"
                            :image='wimage'
                            rotation="0 0 0"
                            :roomConfig='roomConfig'>
                </carouselItem>
        </a-entity>
        <!-- Carousel back -->
        <a-entity class="gallery-carousel-back"
                    layout="type: line; margin: 1"
                    rotation="0 0 0"
                    :position="-hallDepth/2 + ' 1 ' + -hallDepth">
                <carouselItem v-for="wimage of itemsBack"
                            :key="wimage.id"
                            :image='wimage'
                            rotation="0 0 0"
                            :roomConfig='roomConfig'>
                </carouselItem>
        </a-entity> 
        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 1"
                    rotation="0 90 0"
                    :position="hallWidth/2 + ' 1 0'">
                <carouselItem v-for="wimage of itemsRight"
                            :key="wimage.id"
                            :image='wimage'
                            rotation="180 0 180"
                            :roomConfig='roomConfig'>
                </carouselItem>
        </a-entity> 
    </a-entity>
</template>

<script>

import carouselItem from "./components/carousel-item.vue"

import Vue from 'vue'

if (CONFIG.DEBUG) {console.log("from carousel.vue <script>")}
export default {
    props: {'LSObjs': {
                default: []},
            'roomConfig': {},
            'hallWidth': {
                default: 20},
            'hallDepth': {
                default: 20}
    },
    components: {
        carouselItem
    },
    computed: {
        // TODO: Clean up
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        itemsLeft() {
            return this.sortedLSObjs.slice(0, this.LSObjs.length/3);
        },
        itemsBack() {
            return this.sortedLSObjs.slice(this.LSObjs.length/3, (2*this.LSObjs.length)/3);
        },
        itemsRight() {
            return this.sortedLSObjs.slice((2*this.LSObjs.length)/3, this.LSObjs.length);
        }
    }
  }
</script>
