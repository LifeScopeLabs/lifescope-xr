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

        <!-- second column -->
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

                                <a-gui-label value="Shading"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>
                <a-gui-radio class="clickable"
                    value="DEFAULT"
                    onclickevent="updateshading"
                    radiogroup='shading'
                    :checked="shading==ShadingEnum.DEFAULT"
                    :opacity="opacity" 
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio>
                <a-gui-radio class="clickable"
                    value="CEL"
                    onclickevent="updateshading"
                    :opacity="opacity"
                    radiogroup='shading'
                    :checked="shading==ShadingEnum.CEL"
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio>
        </a-gui-flex-container>

    </a-entity>
</template>


<script>
import { mapState } from 'vuex';
import { ShadingEnum } from '../../../store/modules/xr/modules/graphics';

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
            guiActive: true,
            shadingSetting: {
                DEFAULT: true,
                CEL: false
            },
            ShadingEnum: ShadingEnum,
        }
    },

    computed: {
        ...mapState('xr/graphics',
        [
            'shading',
        ]),
    },


    mounted() {
        var self = this;
        // self.gui = document.querySelector('#vrhudentity');

        // document.body.addEventListener('togglemenu', self.toggleHud());
        self.$el.addEventListener('updatesky', self.updateSkyListener);
        self.$el.addEventListener('updatebump', self.updateBumpListener);
        self.$el.addEventListener('updatenormal', self.updateNormalListener);
        self.$el.addEventListener('updatefloormap', self.updateFloorMapListener);
        self.$el.addEventListener('updateworldmap', self.updateWorldMapListener);
        self.$el.addEventListener('updateshading', self.updateShadingListener);

        sha
    },

    beforeDestroy() {
        var self = this;
        // document.body.removeEventListener('togglemenu', self.toggleHud());
        self.$el.removeEventListener('updatesky', self.updateSkyListener);
        self.$el.removeEventListener('updatebump', self.updateBumpListener);
        self.$el.removeEventListener('updatenormal', self.updateNormalListener);
        self.$el.removeEventListener('updatefloormap', self.updateFloorMapListener);
        self.$el.removeEventListener('updateworldmap', self.updateWorldMapListener);
        self.$el.removeEventListener('updateshading', self.updateShadingListener);
    },

    methods: {
        toggleHelpVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
        toggleHud() {
            // console.log('toggleHud');
            var self = this;

            if (self.guiActive) {
                self.gui.parentElement.removeChild(self.gui);
                self.guiActive = false;
            }
            else {
                AFRAME.scenes[0].appendChild(self.gui);
                self.guiActive = true;
            }
        },
        updateSkyListener(evt) {
            // console.log('updateSky');
            var val = evt.detail.value;
            var newVal = val.toUpperCase();// == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
        },
        updateBumpListener(evt) {
            var val = evt.detail.value;
            console.log(`updateBump(${val})`)
            this.$store.commit('xr/graphics/SET_BUMP', val);
        },
        updateNormalListener(evt) {
            var val = evt.detail.value;
            console.log(`updateNormal(${val})`)
            this.$store.commit('xr/graphics/SET_NORMAL', val);
        },
        updateFloorMapListener(evt) {
            var val = evt.detail.value;
            console.log(`updateFloorMap(${val})`)
            this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', val);
        },
        updateWorldMapListener(evt) {
            var val = evt.detail.value;
            console.log(`updateWorldMap(${val})`)
            this.$store.commit('xr/map/SET_WORLD_MAP_ACTIVE', val);
        },
        updateShadingListener(evt) {
            var val = evt.detail.value;
            // console.log('updateSky');
            var newVal = val.toUpperCase();
            this.$store.commit('xr/graphics/SET_SHADING', newVal);
        },
    },
}
</script>

<!-- <style src="./settings.css"></style> -->