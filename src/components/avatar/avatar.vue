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
                'inVR',
                'sceneLoaded'
            ]
        ),
        ...mapState('xr/avatar',
            [
                'cursorActive',
                'rightHandControllerActive'
            ]
        )
    },

    watch: {
        sceneLoaded: function (newVal, oldVal) {
            if (newVal) {
                this.onSceneLoaded();
            }
        },
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

        onSceneLoaded() {
            // this.createAvatarRigTemplate();
            this.createAvatarGLTFTemplate();
            this.addAvatarRigTemplate();
            this.networkAvatarRig();
        },

        createAvatarGLTFTemplate() {
            if (CONFIG.DEBUG) {console.log('createAvatarGLTFTemplate()');}
            var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
                    <a-gltf-model class="gltfmodel" src="#avatar-0"
                        scale="0.02 0.02 0.02">
                    </a-gltf-model>
            </template> 
            `);
            var assets = document.querySelector('a-assets');
            try {
                assets.appendChild(frag);
            }
            catch (err) {
                console.log('createAvatarGLTFTemplate error');
                console.log(err);
            }
            
        },

        createAvatarRigTemplate() {
            if (CONFIG.DEBUG) {console.log('createAvatarRigTemplate()');}
            var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
            <a-entity class="player">

                <a-entity class="avatar" networked-audio-source >
                <a-sphere class="head"
                    color="#5985ff"
                    scale="0.45 0.5 0.4"
                ></a-sphere>
                <a-entity class="face"
                    position="0 0.05 0"
                >
                    <a-sphere class="eye"
                    color="#efefef"
                    position="0.16 0.1 -0.35"
                    scale="0.12 0.12 0.12"
                    >
                    <a-sphere class="pupil"
                        color="#000"
                        position="0 0 -1"
                        scale="0.2 0.2 0.2"
                    ></a-sphere>
                    </a-sphere>
                    <a-sphere class="eye"
                    color="#efefef"
                    position="-0.16 0.1 -0.35"
                    scale="0.12 0.12 0.12"
                    >
                    <a-sphere class="pupil"
                        color="#000"
                        position="0 0 -1"
                        scale="0.2 0.2 0.2"
                    ></a-sphere>
                    </a-sphere>
                </a-entity>
                </a-entity>

            </a-entity>
            </template>
            `);

            document.querySelector('a-assets').appendChild(frag);

        },

        addAvatarRigTemplate() {
            if (CONFIG.DEBUG) {console.log("addAvatarRigTemplate");};

            try {
                NAF.schemas.add({
                    template: '#avatar-rig-template',
                    components: [
                    {
                        component: 'position'
                    },
                    {
                        component: 'rotation'
                    },
                    {
                        selector: '.gltfmodel',
                        component: 'rotation'
                    }
                    ]
                });
            }
            catch (err) {
                console.log('addAvatarRigTemplate error');
                console.log(err);
            }
        },

        networkAvatarRig() {
            if (CONFIG.DEBUG) {console.log('networkAvatarRig');}
            var playerRig = document.getElementById('playerRig');
            try {
                if (playerRig) {
                    playerRig.setAttribute("networked",
                        { 'template': '#avatar-rig-template',
                        'attachTemplateToLocal': false });
                }
                else {
                    console.log("failed to set up NAF on playerRig");
                }
            }
            catch (e) {
                console.log("failed to set up NAF on playerRig");
                console.log(e);
            }
            finally {
                // console.log('networkAvatarRig finally');
            }
        },

        fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
        },

    }
}
</script>