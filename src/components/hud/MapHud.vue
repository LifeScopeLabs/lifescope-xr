<template>
    <div class="map-hud " :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">

        <div class="map-hud-row">
            <div class="paginator-input-time">
                <input type="time" id="sky-setting-time" name="time"
                        v-model="inputTime">
            </div>
        </div>

        <div class="map-hud-row">
            <div>
                <input type="number" id="map-setting-lat" name="lat"
                        v-model="inputMapLatitude"
                        min="-90" max="90"
                        step=0.000001>
                <label for="map-setting-lat">Lat</label>
            </div>
        </div>

        <div class="map-hud-row">
            <div>
                <input type="number" id="map-setting-long" name="long"
                        v-model="inputMapLongitude"
                        min="-180" max="180"
                        step=0.000001>
                <label for="map-setting-long">Long</label>
            </div>
        </div>

        <div class="map-hud-row">
            <input class="paginator-set-latlong-btn" type="button" v-on:click="setMap" id="map-setting-latlon" name="coords"
                value="Update Coordinates">
        </div>

        <div class="map-hud-row paginator-icons">
            <div  id="paginator-weather" class="fas fa-cloud-sun-rain" ></div>
            <div  id="paginator-sky" class="fas"
                    v-bind:class="{ 'fa-sun': skybox == SkyboxEnum.STARS,
                    'fa-star': skybox == SkyboxEnum.SUN }"
                    @click="toggleSky"></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { SkyboxEnum } from '../../store/modules/xr/modules/graphics';

export default {

    data() {
        return {
            latlong: '0,0',
            lat: 0,
            lon: 0,
            time: '0:00',
            SkyboxEnum: SkyboxEnum
        }
    },

    computed: {
        ...mapState('xr',
        [
        'isMobile',
        ]),
        ...mapState('xr/graphics',
        [
            'skytime',
            'skybox',
        ]),
        inputLatLong: {
            get () { return this.latlong },
            set (val) { 
                this.latlong = val }
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
        inputTime: {
            get () { return this.time },
            set (val) { 
                this.time = val;
                this.$store.dispatch('xr/graphics/setTimeFromString', this.time); }
        },
    },

    methods: {
        pageLeft() {
            if(CONFIG.DEBUG) {console.log("hud pageLeft");}
            this.$store.dispatch('xr/carousel/pageLeft');
        },
        pageRight() {
            if(CONFIG.DEBUG) {console.log("hud pageRight");}
            this.$store.dispatch('xr/carousel/pageRight');
        },

        setMap() {
            this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
        },

        toggleSky() {
            var newVal = this.skybox == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
        },


        timeStringFromNumber(timeNum) {
            var hours = Math.floor(timeNum);
            var hourDecimal = timeNum - hours;
            var minutes = hourDecimal * 60;
            var minutesStr = minutes.toString().padStart(2, '0');
            var timeStr = `${hours}:${minutesStr}`;
            return timeStr;
        }
    },

    mounted() {
        var self = this;
        self.inputMapLatitude = self.mapLatitude;
        self.inputMapLongitude = self.mapLongitude;
        this.inputTime = this.timeStringFromNumber(this.skytime);
    }
}
</script>

<style src="./MapHud.scss"></style>
