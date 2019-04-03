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

    watch: {
        skySetting: function (newVals, oldVals) {
            this.changeSky(newVals);
        }
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
