<template>
    <a-entity class="gallery-carousel">
        <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 4"
                        rotation="0 90 0"
                        position="-3.8 1 0">
                <carouselItem v-for="wimage of itemsLeft"
                            :key="wimage.id"
                            :image='wimage'
                            rotation="0 0 0"
                            :roomConfig='roomConfig'>
                </carouselItem>
        </a-entity>
        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 4"
                    rotation="0 90 0"
                    position="3.8 1 0">
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
            'roomConfig': {}
    },
    components: {
        carouselItem
    },
    computed: {
        LSObjsLength() {
            return this.LSObjs.length;
        },
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        itemsLeft() {
            return this.sortedLSObjs.slice(0, this.LSObjsLength/2);
        },
        itemsRight() {
            var reversed = this.sortedLSObjs.slice(this.LSObjsLength/2, this.LSObjsLength);
            reversed.reverse();
            return reversed;
        }
    }
  }
</script>
