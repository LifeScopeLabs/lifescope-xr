<template>
    <div class="paginator" :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">

        <div class="pageLeft fas fa-chevron-left" @click="pageLeft">
        </div>

        <div class="paginator-center-col">
            <!-- <div class="room-display">
                <div class="room-selector">
                    <div class="current-room">
                    {{ roomName }}
                    </div>
                    <div class="room-links">
                        <div v-for="(room, index) in rooms" :key="index">
                            <a :href="link(room)"> {{room}} </a>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="pages">
                {{ pageRange }} / {{ totalItems }}
            </div>
        </div>
            <div class="pageRight fas fa-chevron-right" @click="pageRight">
            </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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
            'roomName',
            'roomConfig',
            'rooms',
        ]),
        ...mapGetters('xr',
        [
            'totalItems',
        ]
        ),
        ...mapState('xr/graphics',
        [
            'skytime',
            'skybox',
        ]),
        ...mapState('xr/carousel',
        [
            'pageStart',
            'numberOfSegments',
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
        pageRange() {
            if (this.totalItems == 0) {
                return '0';
            }
            return `${this.pageStart + 1}  - ${this.pageStart + this.numberOfSegments}`;
        }
    },

    methods: {
        pageLeft() {
            if(CONFIG.DEBUG) {console.log("hud pageLeft");}
            this.$store.dispatch('xr/carousel/pageLeft');
        },
        pageRight() {
            if(CONFIG.DEBUG) {console.log("hud pageRight");}
            this.$store.dispatch('xr/carousel/pageRight', { length: this.totalItems });
        },

        setMap() {
            this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
        },

        toggleSky() {
            // var newVal = this.skybox == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            // this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
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

<style src="./paginator.scss"></style>
