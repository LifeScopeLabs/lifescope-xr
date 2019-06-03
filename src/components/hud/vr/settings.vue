<template>
    <a-entity class="hud-gui">

            <a-gui-flex-container flex-direction="column" :width="width/2" :height="height" :position="-width/4 + ' 0 0'"
                is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                <a-gui-label value="Settings"
                    :opacity="opacity"
                    :font-size="headerStyle.fontSize" :background-color="headerStyle.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="headerStyle.weight"
                    :height="lineSep + 0.2">
                </a-gui-label>
                <a-gui-label value="Skybox"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>
                <a-gui-radio class="clickable"
                    value="Stars"
                    onclickevent="updatesky"
                    radiogroup='skybox'
                    :checked="true"
                    :opacity="opacity" 
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio>
                <a-gui-radio class="clickable"
                    value="Sun"
                    onclickevent="updatesky"
                    :opacity="opacity"
                    radiogroup='skybox'
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio>

                <a-gui-label value="Textures"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>

                <a-gui-toggle class="clickable"
                    value="bump"
                    onclickevent="updatebump"
                    :opacity="opacity"
                    :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                    :height="lineSep" lablelzoffset="0">
                </a-gui-toggle>

                <a-gui-toggle class="clickable"
                    value="normals"
                    onclickevent="updatenormal"
                    :opacity="opacity"
                    :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                    :height="lineSep" lablelzoffset="0">
                </a-gui-toggle>

        </a-gui-flex-container>

        <a-gui-flex-container flex-direction="column" :width="width/2" :height="height" :position="width/4 + ' 0 0'"
            is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                <a-gui-label value="Maps"
                    :opacity="opacity"
                    :font-size="headerStyle.fontSize" :background-color="headerStyle.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="headerStyle.weight"
                    :height="lineSep + 0.2">
                </a-gui-label>
                <a-gui-toggle class="clickable"
                    value="Floor"
                    onclickevent="updatefloormap"
                    :opacity="opacity"
                    :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                    :height="lineSep" lablelzoffset="0">
                </a-gui-toggle>
                <a-gui-toggle class="clickable"
                    value="World"
                    onclickevent="updateworldmap"
                    :opacity="opacity"
                    :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                    :height="lineSep" lablelzoffset="0">
                </a-gui-toggle>
        </a-gui-flex-container>

    </a-entity>
</template>


<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            opacity: 0.7,
            width: 2,
            height: 1,
            lineSep: .1,
            panelColor: '#22252a',
            headerStyle: {
                fontSize: '50px',
                backgroundColor: '#22252a',
                weight: 'bold'
            },
            header2Style: {
                fontSize: '40px',
                backgroundColor: '#22252a',
                weight: 'bold'
            },
            textStyle: {
                fontSize: '30px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            radioStyle: {
                fontSize: '30px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            toggleStyle: {
                fontSize: '30px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            gui: {},
            guiActive: true
        }
    },


    mounted() {
        var self = this;
        self.gui = document.querySelector('#helpgui');
        console.log(self.gui);

        document.body.addEventListener('togglemenu', function(evt) {
            self.toggleHud();
        });

        self.$el.addEventListener('updatesky', function(evt) {
            // console.log('updatesky');
            self.updateSky(evt.detail.value);
        });

        self.$el.addEventListener('updatebump', function(evt) {
            // console.log('updatesky');
            self.updateBump(evt.detail.value);
        });

        self.$el.addEventListener('updatenormal', function(evt) {
            // console.log('updatesky');
            self.updateNormal(evt.detail.value);
        });

        self.$el.addEventListener('updatefloormap', function(evt) {
            // console.log('updatesky');
            self.updateFloorMap(evt.detail.value);
        });

        self.$el.addEventListener('updateworldmap', function(evt) {
            // console.log('updatesky');
            self.updateWorldMap(evt.detail.value);
        });
    },

    methods: {
        toggleHelpVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
        toggleHud() {
            console.log('toggleHud');
            console.log(this);
            var self = this;

            if (self.guiActive) {
                self.gui.parentElement.removeChild(self.gui);
                self.guiActive = false;
                console.log(self.gui);
            }
            else {
                AFRAME.scenes[0].appendChild(self.gui);
                self.guiActive = true;
            }
        },
        updateSky(val) {
            // console.log('updateSky');
            var newVal = val.toUpperCase();// == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
        },
        updateBump(val) {
            console.log(`updateBump(${val})`)
            this.$store.commit('xr/graphics/SET_BUMP', val);
        },
        updateNormal(val) {
            console.log(`updateNormal(${val})`)
            this.$store.commit('xr/graphics/SET_NORMAL', val);
        },
        updateFloorMap(val) {
            console.log(`updateFloorMap(${val})`)
            this.$store.commit('xr/graphics/SET_FLOOR_MAP_ACTIVE', val);
        },
        updateWorldMap(val) {
            console.log(`updateWorldMap(${val})`)
            this.$store.commit('xr/graphics/SET_WORLD_MAP_ACTIVE', val);
        }
    },
}
</script>

<!-- <style src="./AframeHud.css"></style> -->