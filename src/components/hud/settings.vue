<template>
    <div class="xr-settings" :class="{ 'desktop-hud': !isMobile, 'mobile-hud': isMobile }">

        <div class="settings-toggle">
            <div class="fas fa-cog" @click="toggleSettingsVisibility"></div>
        </div>

        <div class="help-settings" :style="settingsStyleObject">

            <h2> Settings </h2>
            <h3> Sky </h3>
            <div class="input-sky">
                <div>
                    <input type="radio" id="sky-setting-stars" name="sky" value="STARS"
                            checked v-model="skySetting">
                    <label for="sky-setting-stars">Stars</label>
                </div>

                <div>
                    <input type="radio" id="sky-setting-sun" name="sky" value="SUN"
                        v-model="skySetting">
                    <label for="sky-setting-sun">Sun</label>
                </div>
            </div>

            <h3> Carousel </h3>
            <div class="input-carousel">
                <input type="number" id="car-setting-segements" name="segments"
                        v-model="inputSegments"
                        min="12" max="121">
                <label for="car-setting-segements">Segments</label>

                <input type="number" id="car-setting-radius" name="floorradius"
                        v-model="inputFloorRadius"
                        min="1">
                <label for="car-setting-radius">Floor Radius</label>
            </div>
            <input type="button" v-on:click="updateCarousel" id="car-setting-button" name="car-settings"
                value="Update Carousel">
            

            <h3> Map </h3>
            <div class="latlong">
                <input type="number" id="map-setting-lat" name="lat"
                        v-model="inputMapLatitude"
                        min="-90" max="90">
                <label for="map-setting-lat">Latitude</label>

                <input type="number" id="map-setting-long" name="long"
                        v-model="inputMapLongitude"
                        min="-180" max="180">
                <label for="map-setting-long">Longitude</label>
            </div>





            <!-- <h3> Set coordinates </h3> -->
            <input type="button" v-on:click="setCoords" id="map-setting-latlon" name="coords"
                value="Update Coordinates">
            

            <div class="input-map">
                <div>
                    <input type="checkbox" id="map-setting-floor" name="floor"
                            v-model="mapFloorCheck">
                    <label for="map-setting-floor">Floor Map</label>
                </div>

                <div>
                    <input type="checkbox" id="map-setting-world" name="world"
                        v-model="mapWorldSetting">
                    <label for="map-setting-world">World Map</label>
                </div>
            </div>

            <h3> Textures </h3>
            <div class="input-textures">
                <div>
                    <input type="checkbox" id="textures-setting-bump" name="bump"
                            v-model="bump">
                    <label for="textures-setting-bump">Bumpmap</label>
                </div>

                <div>
                    <input type="checkbox" id="textures-setting-normal" name="normal"
                        v-model="normal">
                    <label for="textures-setting-normal">Normals</label>
                </div>
            </div>

            <h2> Shading </h2>

             <select v-model="shading">
                <option value="DEFAULT">Default</option>
                <option value="CEL">Cel</option>
            </select> 

            <h2> Quality </h2>
            <div class="input-quality">
                <div>
                    <input type="radio" id="quality-setting-low" name="low" value="LOW"
                            v-model="qualitySetting">
                    <label for="quality-setting-low">Low</label>
                </div>

                <div>
                    <input type="radio" id="quality-setting-med" name="med" value="MEDIUM"
                            v-model="qualitySetting">
                    <label for="quality-setting-med">Medium</label>
                </div>

                <div>
                    <input type="radio" id="quality-setting-high" name="hiegh" value="HIGH"
                            checked v-model="qualitySetting">
                    <label for="quality-setting-high">HIGH</label>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex';

import { SkyboxEnum, GraphicsQualityEnum, ShadingEnum } from '../../store/modules/xr/modules/graphics';

import HudUtils from './hudutils';

export default {

    data() {
        return {
            skySetting: 'STARS',
            qualitySetting: 'HIGH',
            settingsStyleObject: {
                visibility: 'hidden',
                opacity: 0
            },
            mapFloorCheck: false,
            lat: 0,
            lon: 0,
            carouselDimensions: {
                segments: 24,
                radius: 5
            }
        }
    },

    computed: {
        mapFloorSetting: {
            get () { return this.$store.state.xr.map.mapFloorSetting;},
            set (val) { 
                this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', val);
            }
        },
        mapWorldSetting: {
            get () { return this.$store.state.xr.map.worldMapActive;},
            set (val) { 
                this.$store.commit('xr/map/SET_WORLD_MAP_ACTIVE', val);
            }
        },
        mapLatitude: {
            get () { return this.$store.state.xr.map.mapLatitude;},
            set (val) { this.$store.commit('xr/map/SET_MAP_LATITUDE', val); }
        },
        mapLongitude: {
            get () { return this.$store.state.xr.map.mapLongitude;},
            set (val) { this.$store.commit('xr/map/SET_MAP_LONGITUDE', val); }
        },
        inputMapLatitude: {
            get () { return this.lat },
            set (val) { this.lat = val }
        },
        inputMapLongitude: {
            get () { return this.lon },
            set (val) { this.lon = val }
        },

        inputSegments: {
            get () { return this.carouselDimensions.segments },
            set (val) { this.carouselDimensions.segments = val }
        },
        inputFloorRadius: {
            get () { return this.carouselDimensions.radius },
            set (val) { this.carouselDimensions.radius = val }
        },

        shading: {
            get () { return this.$store.state.xr.graphics.shading;},
            set (val) { this.$store.commit('xr/graphics/SET_SHADING', val); }
        },

        bump: {
            get () { return this.$store.state.xr.graphics.bump;},
            set (val) { this.$store.commit('xr/graphics/SET_BUMP', val); }
        },
        normal: {
            get () { return this.$store.state.xr.graphics.normal;},
            set (val) { this.$store.commit('xr/graphics/SET_NORMAL', val); }
        },
        ...mapState('xr',
        [
            'isMobile',
        ]),
        ...mapState('xr/graphics',
        [
            'skytime',
            'skybox',
            'quality'
        ]),
        ...mapState('xr/carousel',
        [
            'numberOfSegments',
            'floorRadius'
        ])
    },

    watch: {
        skySetting: function (newVal, oldVal) {
            if (SkyboxEnum.hasOwnProperty(newVal)) {
                this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
            }
            else {
                console.log(`couldn't change skySetting: ${newVal} is not a SkyboxEnum`);
            }
        },
        qualitySetting: function (newVal, oldVal) {
            if (GraphicsQualityEnum.hasOwnProperty(newVal)) {
                this.$store.commit('xr/graphics/SET_QUALITY', newVal);
            }
            else {
                console.log(`couldn't change qualitySetting: ${newVal} is not a GraphicsQualityEnum`);
            }
        },
        mapFloorCheck: function (newVal, oldVal) {
            // this.mapFloorSetting.set(newVal);
            this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', newVal);
        }
    },

    mounted() {
        var self = this;
        self.hudUtils = new HudUtils();
        document.body.addEventListener('keypress', self.keypressListener);
        
        self.inputMapLatitude = self.mapLatitude;
        self.inputMapLongitude = self.mapLongitude;

        self.inputSegments = self.numberOfSegments;
        self.inputFloorRadius = self.floorRadius;

        document.body.addEventListener('swapsky', self.swapskyListener);
    },

    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keypressListener);
        document.body.removeEventListener('swapsky', this.swapskyListener)
    },

    methods: {
        keypressListener(evt) {
            if (evt.key == 'g') {
                this.toggleSettingsVisibility();
            }
        },
        swapskyListener(evt) {
            this.toggleSky();
        },
        toggleSettingsVisibility() {
            this.hudUtils.toggleHud(this.settingsStyleObject);
        },
        toggleSky() {
            var newVal = this.skybox == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
        },
        setCoords() {
            this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
        },
        updateCarousel() {
            this.$store.commit('xr/carousel/SET_NUMBER_OF_SEGMENTS', this.carouselDimensions.segments);
            this.$store.commit('xr/carousel/SET_FLOOR_RADIUS', this.carouselDimensions.radius);
        }
    },
}
</script>

<style src="./settings.css"></style>
