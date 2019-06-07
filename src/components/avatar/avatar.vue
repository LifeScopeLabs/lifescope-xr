<template>
  <a-entity id="playerRig"
        position="0 1.6 -2"
        >
        <vrhud id="vrhud" v-if="inVR"/>
        
        <a-entity id="player-camera"
            class="camera"
            camera>
        </a-entity>

        <a-gui-cursor id="cursor" v-if="cursorActive"
            raycaster="interval: 1000; objects: gui-interactable, .clickable"
            fuse="true" fuse-timeout="2000"
            design="dot">
        </a-gui-cursor>

        <rightHandController ref="righthand" />

    </a-entity>
</template>

<script>
import { mapState } from 'vuex';

import vrhud from "../hud/vr/vrhud.vue";
import rightHandController from "./RightHandController.vue";

export default {
    components: {
        vrhud,
        rightHandController
    },

    data () {
        return {
            teleporting: false,
            teleportThreshold: 0.4,
        }
    },

    computed: {
        ...mapState('xr',
            [
                'inVR'
            ]
        ),
        ...mapState('xr/avatar',
            [
                'cursorActive',
                'rightHandControllerActive'
            ]
        )
    },

    methods: {
        setupDesktop() {
            if (CONFIG.DEBUG) {console.log("setupDesktop");};
            var playerRig = document.getElementById('playerRig');
            try {
                if (playerRig) {
                    playerRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                    playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                }
                else {
                    console.log("failed to set controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerRig");
                console.log(e);
            }
        },

        setupMobile() {
            if (CONFIG.DEBUG) {console.log("setupMobile");};
            var playerRig = document.getElementById('playerRig');
            var camera = playerRig.querySelector('#player-camera');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            try {
                if (playerRig) {
                    playerRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                    playerRig.setAttribute("virtual-gamepad-controls", {});
                    camera.setAttribute('pitch-yaw-rotator', {});
                    sceneEl.setAttribute("look-on-mobile", "camera", camera);
                    // sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
                }
                else {
                    console.log("failed to set controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerRig");
                console.log(e);
            }
        },

        setupVR() {
            if (CONFIG.DEBUG) {console.log("setupMobile");};
            this.$store.commit('xr/avatar/SET_RIGHT_HAND_CONTROLLER_ACTIVE', true);
            this.$refs.righthand.setupControls();
        },

        tearDownVR() {
            this.$store.commit('xr/avatar/SET_RIGHT_HAND_CONTROLLER_ACTIVE', false);
            this.$refs.righthand.tearDownControls();
        },

    }
}
</script>