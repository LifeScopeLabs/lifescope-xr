<template>
    <div class="xr-settings-container" :class="{ 'desktop-hud': !isMobile, 'mobile-hud': isMobile }">

        <div class="xr-help-settings" :style="settingsStyleObject">

            <!-- <div class="help-header"> Settings </div> -->

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                    <div class="setting-title"> Sky </div>
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



                    <div class="setting-title"> Time </div>

                    <div class="input-time">
                        <input type="time" id="sky-setting-time" name="time"
                                v-model="inputTime">
                        <label for="sky-setting-time">Time</label>
                        <input type="button" v-on:click="updateTime" id="time-setting-button" name="time-settings"
                            value="Update Time">
                    </div>

                    <div class="setting-title"> Carousel </div>
                    <div class="input-floor-active">
                        <input type="checkbox" id="floor-setting-active" name="floor-active"
                                v-model="floorActive">
                            <label for="floor-setting-active">Floor</label>
                    </div>
                    
                    <div class="input-carousel row">
                        <div class="col">
                        <input type="number" id="car-setting-segements" name="segments"
                                v-model="inputSegments"
                                min="12" max="121">
                        <label for="car-setting-segements">Segments</label>
                        </div>
                        <div class="col">
                        <input type="number" id="car-setting-radius" name="floorradius"
                                v-model="inputFloorRadius"
                                min="1">
                        <label for="car-setting-radius">Floor Radius</label>
                        </div>
                    </div>

                    <input type="button" v-on:click="updateCarousel" id="car-setting-button" name="car-settings"
                        value="Update Carousel">
                    

                    <div class="setting-title"> Textures </div>
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
<!-- 
                    <div class="setting-title"> Shading </div>

                    <select v-model="shading">
                        <option value="DEFAULT">Default</option>
                        <option value="CEL">Cel</option>
                    </select>  -->

                    <div class="setting-title"> Quality </div>
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
                            <label for="quality-setting-high">High</label>
                        </div>

                    </div>


                </div>   <!-- settings right -->

                <div class="col-sm">

                    <div class="setting-title"> Map </div>

                        <div class="input-globe">
                            <input type="checkbox" id="globe-setting-active" name="globe"
                                    v-model="globeActive">
                                <label for="globe-setting-active">Globe</label>
                        </div>

                    <div class="settings-latlong">
                        <input type="number" id="map-setting-lat" name="lat"
                                v-model="inputMapLatitude"
                                min="-90" max="90">
                        <label for="map-setting-lat">Latitude</label>

                        <input type="number" id="map-setting-long" name="long"
                                v-model="inputMapLongitude"
                                min="-180" max="180">
                        <label for="map-setting-long">Longitude</label>
                    </div>

                    <input type="button" v-on:click="setMap" id="map-setting-latlon" name="coords"
                        value="Update Map">

                    <div class="setting-title"> Floor </div>
                    <div class="floormapsettings">
                        <div>
                            <input type="checkbox" id="map-setting-floor" name="floor"
                                    v-model="mapFloorCheck">
                            <label for="map-setting-floor">Active</label>
                            <!-- DPI -->
                            <input type="checkbox" id="map-floor-setting-dpi" name="floor-dpi"
                                    v-model="inputMapFloorHighDPI">
                            <label for="map-floor-setting-dpi">High DPI</label>
                            
                            <!-- height map -->
                            <input type="checkbox" id="map-floor-setting-heightmap" name="floor-heightmap"
                                    v-model="inputMapFloorHeightmap">
                            <label for="map-floor-setting-heightmap">Height Map</label>
                        </div>

                        <div class="row">
                        <!-- scale -->
                        <div class="col-sm">
                            <label for="map-floor-scale">Scale</label>
                            <input type="number" id="map-floor-scale" name="floor-scale"
                                    v-model="inputFloorScale"
                                    min="1">
                        </div>
                        <!-- rows -->   
                        <div class="col-sm">
                            <label for="map-floor-setting-rows">Tile Rows</label>
                            <input type="number" id="map-floor-setting-rows" name="floor-rows"
                                    v-model="inputMapFloorRows"
                                    min="1" max="10">
                        </div>

                            <!-- zoom -->
                        <div class="col-sm">
                            <label for="map-floor-setting-zoom">Zoom</label>
                            <input type="number" id="map-floor-setting-zoom" name="floor-zoom"
                                    v-model="inputMapFloorZoom"
                                    min="0" max="19">
                        </div>
                        <!-- height scale -->
                        <div class="col-sm">
                            <label for="map-floor-setting-zoom">Height</label>
                            <input type="number" id="map-floor-setting-height" name="floor-height"
                                    v-model="inputMapFloorHeight"
                                    min="1">
                        </div>
                        </div>
                        <!-- <div>
                        <select v-model="maptype" id="map-setting-type">
                            <option value="SATELLITE">Satellite</option>
                            <option value="STREETS">Streets</option>
                            <option value="SATELLITESTREETS">Satellite-streets</option>
                            <option value="OUTDOORS">Outdoors</option>
                            <option value="LIGHT">Light</option>
                            <option value="DARK">Dark</option>
                        <option value="NAVIGATIONPREVIEWDAY">navigation-preview-day</option>
                        <option value="NAVIGATIONPREVIEWNIGHT">Cel</option>
                        <option value="NAVIGATIONGUIDANCEDAY">Cel</option>
                        <option value="NAVIGATIONGUIDANCENIGHT">Cel</option>
                        </select>
                         <label for="map-setting-type">Map Type</label>
                        </div> -->
                    </div>         

                    <div class="setting-title"> World </div>
                    <div class="worldmapsettings">
                        <div>
                            <input type="checkbox" id="map-setting-world" name="world"
                                v-model="mapWorldCheck">
                            <label for="map-setting-world">Active</label>
                            <!-- DPI -->
                            <input type="checkbox" id="map-world-setting-dpi" name="world-dpi"
                                    v-model="inputMapWorldHighDPI">
                            <label for="map-world-setting-dpi">High DPI</label>
                            
                            <!-- height map -->
                            <input type="checkbox" id="map-world-setting-heightmap" name="world-heightmap"
                                    v-model="inputMapWorldHeightmap">
                            <label for="map-world-setting-heightmap">Height Map</label>
                        </div>

                        <div class="row">
                        <!-- scale -->
                        <div class="col-sm">
                            <label for="map-world-scale">Scale</label>
                            <input type="number" id="map-world-scale" name="world-scale"
                                    v-model="inputWorldScale"
                                    min="1">
                        </div>
                        <!-- rows -->
                        <div class="col-sm">
                            <label for="map-world-setting-rows">Tile Rows</label>
                            <input type="number" id="map-world-setting-rows" name="world-rows"
                                    v-model="inputMapWorldRows"
                                    min="1" max="10">
                        </div>
                        <!-- zoom -->
                        <div class="col-sm">
                            <label for="map-world-setting-zoom">Zoom</label>
                            <input type="number" id="map-world-setting-zoom" name="world-zoom"
                                    v-model="inputMapWorldZoom"
                                    min="0" max="19">
                        </div>
                        <!-- height scale -->
                        <div class="col-sm">
                            <label for="map-world-setting-zoom">Height</label>
                            <input type="number" id="map-world-setting-height" name="world-height"
                                    v-model="inputMapWorldHeight"
                                    min="1">
                        </div>
                        </div>
                    </div>           
                    
                </div>  <!-- settings right -->
            </div>  <!-- settings grid -->
            </div>
        </div> <!-- help settings -->
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
            lat: 0,
            lon: 0,

            mapFloorCheck: false,
            floorMapTileRows: 1,
            floorMapZoom: 11,
            floorscale: 1,
            floorHighDPI: false,
            floorMapHeightmap: false,
            floorMapHeight: 1,

            mapWorldCheck: false,
            worldMapTileRows: 1,
            worldMapZoom: 11,
            worldscale: 1,
            worldHighDPI: false,
            worldMapHeightmap: false,
            worldMapHeight: 1,

            maptype: 'SATELLITE',
            carouselDimensions: {
                segments: 24,
                radius: 5
            },
            time: '0:00'
        }
    },

    computed: {
        inputSegments: {
            get () { return this.carouselDimensions.segments },
            set (val) { this.carouselDimensions.segments = val }
        },
        inputFloorRadius: {
            get () { return this.carouselDimensions.radius },
            set (val) { this.carouselDimensions.radius = val }
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



        inputMapFloorRows: {
            get () { return this.floorMapTileRows },
            set (val) { this.floorMapTileRows = val }
        },
        inputFloorScale: {
            get() { return this.floorscale },
            set (val) { this.floorscale = val }
        },
        inputMapFloorZoom: {
            get () { return this.floorMapZoom },
            set (val) { this.floorMapZoom = val }
        },
        inputMapFloorHighDPI: {
            get () { return this.floorHighDPI },
            set (val) { this.floorHighDPI = val }
        },
        inputMapFloorHeightmap: {
            get () { return this.floorMapHeightmap },
            set (val) { this.floorMapHeightmap = val }
        },
        inputMapFloorHeight: {
            get () { return this.floorMapHeight },
            set (val) { this.floorMapHeight= val }
        },


        inputMapWorldRows: {
            get () { return this.worldMapTileRows },
            set (val) { this.worldMapTileRows = val }
        },
        inputWorldScale: {
            get() { return this.worldscale },
            set (val) { this.worldscale = val }
        },
        inputMapWorldZoom: {
            get () { return this.worldMapZoom },
            set (val) { this.worldMapZoom = val }
        },
        inputMapWorldHighDPI: {
            get () { return this.worldHighDPI },
            set (val) { this.worldHighDPI = val }
        },
        inputMapWorldHeightmap: {
            get () { return this.worldMapHeightmap },
            set (val) { this.worldMapHeightmap = val }
        },
        inputMapWorldHeight: {
            get () { return this.worldMapHeight },
            set (val) { this.worldMapHeight= val }
        },




        inputTime: {
            get () { return this.time },
            set (val) { 
                // console.log(`inputTime: ${val}`);
                this.time = val }
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
        globeActive: {
            get () { return this.$store.state.xr.map.globeActive;},
            set (val) { this.$store.commit('xr/map/SET_GLOBE_ACTIVE', val); }
        },
        floorActive: {
            get () { return this.$store.state.xr.carousel.floorActive;},
            set (val) { this.$store.commit('xr/carousel/SET_FLOOR_ACTIVE', val); }
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
        ]),
        ...mapState('xr/map',
        [
            'floorRows',
            'floorZoom',
            'floorScale',
            'worldRows',
            'worldZoom',
            'worldScale',
        ]),
        ...mapState('xr/hud', [
            'graphicsMenuVisible'
        ]),
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
            this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', newVal);
        },
        mapWorldCheck: function (newVal, oldVal) {
            this.$store.commit('xr/map/SET_WORLD_MAP_ACTIVE', newVal);
        },
        graphicsMenuVisible: function (newVal, oldVal) {
            this.toggleSettingsVisibility();
        },
    },

    mounted() {
        var self = this;
        self.hudUtils = new HudUtils();

        self.time = self.hudUtils.timeStringFromNumber(this.skytime);

        document.body.addEventListener('keypress', self.keypressListener);
        
        self.inputMapLatitude = self.mapLatitude;
        self.inputMapLongitude = self.mapLongitude;

        self.inputMapFloorRows = self.floorRows;
        self.inputMapFloorZoom = self.floorZoom;

        self.inputMapWorldRows = self.worldRows;
        self.inputMapWorldZoom = self.worldZoom;

        self.inputSegments = self.numberOfSegments;
        self.inputFloorRadius = self.floorRadius;

        document.body.addEventListener('swapsky', self.swapskyListener);

        if (this.graphicsMenuVisible) {
            this.toggleSettingsVisibility();
        }
    },

    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keypressListener);
        document.body.removeEventListener('swapsky', this.swapskyListener)
    },

    methods: {
        keypressListener(evt) {
            if (evt.target.tagName == 'BODY' && evt.key == 'g') {
                this.$store.commit('xr/hud/SET_GRAPHICS_MENU_ACTIVE', !this.graphicsMenuVisible);
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
        setMap() {
            this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
            this.$store.commit('xr/map/SET_MAPTYPE', this.maptype);

            this.$store.commit('xr/map/SET_FLOOR_MAP_ROWS', this.floorMapTileRows);
            this.$store.commit('xr/map/SET_FLOOR_MAP_ZOOM', this.floorMapZoom);
            this.$store.commit('xr/map/SET_FLOOR_SCALE', this.floorscale);
            this.$store.commit('xr/map/SET_FLOOR_DPI', this.floorHighDPI);
            this.$store.commit('xr/map/SET_FLOOR_HEIGHTMAP', this.floorMapHeightmap);
            this.$store.commit('xr/map/SET_FLOOR_HEIGHT', this.floorMapHeight);

            this.$store.commit('xr/map/SET_WORLD_MAP_ROWS', this.worldMapTileRows);
            this.$store.commit('xr/map/SET_WORLD_MAP_ZOOM', this.worldMapZoom);
            this.$store.commit('xr/map/SET_WORLD_SCALE', this.worldscale);
            this.$store.commit('xr/map/SET_WORLD_DPI', this.worldHighDPI);
            this.$store.commit('xr/map/SET_WORLD_HEIGHTMAP', this.worldMapHeightmap);
            this.$store.commit('xr/map/SET_WORLD_HEIGHT', this.worldMapHeight);
        },
        updateCarousel() {
            this.$store.commit('xr/carousel/SET_NUMBER_OF_SEGMENTS', this.carouselDimensions.segments);
            this.$store.commit('xr/carousel/SET_FLOOR_RADIUS', this.carouselDimensions.radius);
        },
        updateTime() {
            this.$store.dispatch('xr/graphics/setTimeFromString', this.time);
        }
    },
}
</script>

<style src="./settings.scss"></style>