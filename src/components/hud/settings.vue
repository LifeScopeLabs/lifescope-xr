<template>
    <div class="xr-settings">

        <div class="settings-toggle">
            <div class="fas fa-cog" @click="toggleSettingsVisibility"></div>
        </div>

        <div class="help-settings" :style="settingsStyleObject">

        <h2> Settings </h2>
        <h3> Sky </h3>
        <div>
            <input type="radio" id="sky-setting-stars" name="sky" value="stars"
                    checked v-model="skySetting">
            <label for="sky-setting-stars">Stars</label>
        </div>

        <div>
            <input type="radio" id="sky-setting-sun" name="sky" value="sun"
                v-model="skySetting">
            <label for="sky-setting-sun">Sun</label>
        </div>
        

        <h3> Map </h3>
        <!-- <div>
            <input type="number" id="map-setting-lat" name="lat"
                    v-model="mapLatitude"
                    min="-90" max="90">
            <label for="map-setting-lat">Latitude</label>

            <input type="number" id="map-setting-long" name="long"
                    v-model="mapLongitude"
                    min="-180" max="180">
            <label for="map-setting-long">Longitude</label>
        </div> -->
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

</template>

<script>

export default {

    data() {
        return {
            skySetting: 'stars',
            settingsStyleObject: {
                visibility: 'hidden',
            },
            time: 11, // 24 hours
        }
    },

    computed: {
        mapFloorSetting: {
            get () { return this.$store.state.xr.mapFloorSetting;},
            set (val) { this.$store.commit('xr/SET_FLOOR_MAP_ACTIVE', val); }
        },
        mapWorldSetting: {
            get () { return this.$store.state.xr.mapWorldSetting;},
            set (val) { this.$store.commit('xr/SET_WORLD_MAP_ACTIVE', val); }
        },
        mapLatitude: {
            get () { return this.$store.state.xr.mapLatitude;},
            set (val) { this.$store.commit('xr/SET_MAP_LATITUDE', val); }
        },
        mapLongitude: {
            get () { return this.$store.state.xr.mapLongitude;},
            set (val) { this.$store.commit('xr/SET_MAP_LONGITUDE', val); }
        }
    },

    watch: {
        skySetting: function (newVal, oldVal) {
            this.changeSky(newVal);
        },
    },

    methods: {
        
        toggleSettingsVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleSettingsVisibility");}
            this.settingsStyleObject.visibility = 
                this.settingsStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },

        changeSky(val) {
            if (val == 'sun') {
                this.removeStars();
                this.addSun();
            }
            else if (val == 'stars') {
                this.removeSun();
                this.addStars();
            }
        },
        removeStars() {
            var stars = document.querySelector('#starsky');
            stars.parentElement.removeChild(stars);
        },
        addStars() {
            var stars = document.createElement('a-sky');
            stars.setAttribute('id', 'starsky');
            stars.setAttribute('src', '#sky')
            stars.object3D.rotation.x += Math.PI/2;
            stars.object3D.rotation.z += Math.PI/2;
            AFRAME.scenes[0].appendChild(stars);
        },
        removeSun() {
            var sun = document.querySelector('#sunsky');
            sun.parentElement.removeChild(sun);
        },
        addSun() {
            var sun = document.createElement('a-sun-sky');
            sun.setAttribute('id', 'sunsky');
            sun.setAttribute('material', {side: 'back'})
            sun.setAttribute('sun-sky-position', {time: 11});
            AFRAME.scenes[0].appendChild(sun);
        },
    },
}
</script>

<style src="./settings.css"></style>
