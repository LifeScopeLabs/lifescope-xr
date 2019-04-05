<template>
    <div class="xr-settings">

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
            <!-- <div class="latlong">
                <input type="number" id="map-setting-lat" name="lat"
                        v-model="mapLatitude"
                        min="-90" max="90">
                <label for="map-setting-lat">Latitude</label>

                <input type="number" id="map-setting-long" name="long"
                        v-model="mapLongitude"
                        min="-180" max="180">
                <label for="map-setting-long">Longitude</label>
            </div> -->
            <div class="input-map">
                <div>
                    <input type="checkbox" id="map-setting-floor" name="floor"
                            v-model="mapFloorSetting">
                    <label for="map-setting-floor">Floor Map</label>
                </div>

                <div>
                    <input type="checkbox" id="map-setting-world" name="world"
                        v-model="mapWorldSetting">
                    <label for="map-setting-world">World Map</label>
                </div>
            </div>

        </div>
    </div>

</template>

<script>

import { SkyboxEnum } from '../../../store/modules/xr/modules/graphics';

export default {

    data() {
        return {
            skySetting: 'STARS',
            settingsStyleObject: {
                visibility: 'hidden',
            }
        }
    },

    computed: {
        mapFloorSetting: {
            get () { return this.$store.state.xr.graphics.mapFloorSetting;},
            set (val) { this.$store.commit('xr/graphics/SET_FLOOR_MAP_ACTIVE', val); }
        },
        mapWorldSetting: {
            get () { return this.$store.state.xr.graphics.mapWorldSetting;},
            set (val) { this.$store.commit('xr/graphics/SET_WORLD_MAP_ACTIVE', val); }
        },
        mapLatitude: {
            get () { return this.$store.state.xr.graphics.mapLatitude;},
            set (val) { this.$store.commit('xr/graphics/SET_MAP_LATITUDE', val); }
        },
        mapLongitude: {
            get () { return this.$store.state.xr.graphics.mapLongitude;},
            set (val) { this.$store.commit('xr/graphics/SET_MAP_LONGITUDE', val); }
        }
    },

    watch: {
        skySetting: function (newVal, oldVal) {
            console.log(`skySetting: ${newVal}`);
            console.log(SkyboxEnum.hasOwnProperty(newVal));
            if (SkyboxEnum.hasOwnProperty(newVal)) {
                this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
            }
            else {
                console.log(`couldn't change skySetting: ${newVal} is not a SkyboxEnum`);
            }
        },
    },

    methods: {
        toggleSettingsVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleSettingsVisibility");}
            this.settingsStyleObject.visibility = 
                this.settingsStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
    },
}
</script>

<style src="./settings.css"></style>
