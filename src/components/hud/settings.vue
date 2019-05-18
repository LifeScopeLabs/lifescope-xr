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
        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex';

import { SkyboxEnum } from '../../store/modules/xr/modules/graphics';

export default {

    data() {
        return {
            skySetting: 'STARS',
            settingsStyleObject: {
                visibility: 'hidden',
            },
            mapFloorCheck: false,
            lat: 0,
            lon: 0,
        }
    },

    computed: {
        mapFloorSetting: {
            get () { return this.$store.state.xr.graphics.mapFloorSetting;},
            set (val) { 
                // console.log(this.$store.state.xr.graphics.mapFloorSetting);
                this.$store.commit('xr/graphics/SET_FLOOR_MAP_ACTIVE', val);
                // console.log(this.$store.state.xr.graphics.mapFloorSetting);
                 }
        },
        mapWorldSetting: {
            get () { return this.$store.state.xr.graphics.worldMapActive;},
            set (val) { 
                // console.log(this.$store.state.xr.graphics)
                this.$store.commit('xr/graphics/SET_WORLD_MAP_ACTIVE', val);
                }
        },
        mapLatitude: {
            get () { return this.$store.state.xr.graphics.mapLatitude;},
            set (val) { this.$store.commit('xr/graphics/SET_MAP_LATITUDE', val); }
        },
        mapLongitude: {
            get () { return this.$store.state.xr.graphics.mapLongitude;},
            set (val) { this.$store.commit('xr/graphics/SET_MAP_LONGITUDE', val); }
        },
        inputMapLatitude: {
            get () { return this.lat},
            set (val) { this.lat = val }
        },
        inputMapLongitude: {
            get () { return this.lon},
            set (val) { this.lon = val }
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
            'skybox'
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
        mapFloorCheck: function (newVal, oldVal) {
            console.log(`mapFloorCheck: ${newVal}`);
            console.log(this.$store.state.xr.graphics.mapFloorSetting);
            // this.mapFloorSetting.set(newVal);
            this.$store.commit('xr/graphics/SET_FLOOR_MAP_ACTIVE', newVal);
        }
    },

    mounted() {
        var self = this;
        document.body.addEventListener('keypress', function(evt) {
            if (evt.key == 'g') {
                self.toggleSettingsVisibility();
            }
        });
        
        self.inputMapLatitude = self.mapLatitude;
        self.inputMapLongitude = self.mapLongitude;

        document.body.addEventListener('swapsky', function(evt) {
            self.toggleSky();
        })
    },
    methods: {
        toggleSettingsVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleSettingsVisibility");}
            this.settingsStyleObject.visibility = 
                this.settingsStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
        toggleSky() {
            var newVal = this.skybox == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            this.$store.commit('xr/graphics/SET_SKYBOX', newVal);

        },
        setCoords() {
            this.$store.commit('xr/graphics/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/graphics/SET_MAP_LONGITUDE', this.lon);
        }
    },
}
</script>

<style src="./settings.css"></style>
