<template>
    <div class="naf-hud" :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">
        <div class="naf-icons">
            <div id="naf-players-icon"
                class="fas fa-user-friends" ></div>
            <span class="naf-players-count"> 1
            </span>
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

<style src="./NAFHud.scss"></style>
