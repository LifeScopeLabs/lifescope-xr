<template>
  <a-entity id="playerGridRig">
        <a-entity id="camera-rig" class="camera-rig"
            position="0 0 0">
            <a-entity id="player-camera"
                class="player-camera camera"
                camera>
            </a-entity>
        </a-entity>
        <a-entity cursor="rayOrigin: mouse"
            raycaster="interval: 1000; objects: .clickable;">
        </a-entity>

    </a-entity>
</template>

<script>
import { mapState } from 'vuex';

export default {

    computed: {
        ...mapState('xr',
            [
                'inVR',
                'sceneLoaded',
                'isMobile'
            ]
        ),
    },

    watch: {
        sceneLoaded: function (newVal, oldVal) {
            if (newVal) {
                this.onSceneLoaded();
            }
        },
        inVR: function (newVal, oldVal) {
            if (newVal) {
                if (AFRAME.utils.device.isMobile()) {
                    this.tearDownMobile();
                } else {
                    this.tearDownDesktop();
                }
                this.setupVR();
            }
            else {
                this.tearDownVR();
                if (AFRAME.utils.device.isMobile()) {
                    this.setupMobile();
                } else {
                    this.setupDesktop();
                }
            }
        },
    },

    mounted() {
        var self = this;
        if (self.sceneLoaded) {
            self.onSceneLoaded();
        }
    },

    beforeDestroy() {
        if (this.$el.sceneEl.is('vr-mode')) {
            this.tearDownVR();
        }
        else {
            if (AFRAME.utils.device.isMobile()) {
                this.tearDownMobile();
            } else {
                this.tearDownDesktop();
            }
        }
    },

    methods: {
        setupDesktop() {
            if (CONFIG.DEBUG) {console.log("setupDesktop");};
            var self = this;
            var playerGridRig = self.$el;
            if (playerGridRig.hasLoaded) {
                playerGridRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop);
            }
            else {
                playerGridRig.addEventListener('loaded', function () {
                    playerGridRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop);
                })
            }
            try {
                if (playerGridRig) {
                    // playerGridRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                    // playerGridRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                }
                else {
                    console.log("failed to set controls on playerGridRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerGridRig");
                console.log(e);
            }

            
        },

        tearDownDesktop() {
            if (CONFIG.DEBUG) {console.log("tearDownDesktop");};
            var playerGridRig = this.$el;
            try {
                if (playerGridRig) {
                    // playerGridRig.removeAttribute("wasd-controls");
                    // playerGridRig.removeAttribute("look-controls");
                }
                else {
                    console.log("failed to teardown desktop controls on playerGridRig");
                }
            }
            catch (e) {
                console.log("failed to teardown desktop controls on playerGridRig");
                console.log(e);
            }
        },

        setupMobile() {
            if (CONFIG.DEBUG) {console.log("setupMobile");};
            var playerGridRig = this.$el;
            var camera = playerGridRig.querySelector('#player-camera');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            try {
                if (playerGridRig) {
                    // playerGridRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                    // playerGridRig.setAttribute("virtual-gamepad-controls", {});
                    // camera.setAttribute('pitch-yaw-rotator', {});
                    sceneEl.setAttribute("look-on-mobile", "camera", camera);
                    // sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
                }
                else {
                    console.log("failed to set controls on playerGridRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerGridRig");
                console.log(e);
            }
        },

        tearDownMobile() {
            if (CONFIG.DEBUG) {console.log("tearDownMobile");};
            var playerGridRig = this.$el;
            var camera = playerGridRig.querySelector('#player-camera');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            try {
                if (playerGridRig) {
                    // playerGridRig.removeAttribute("character-controller");
                    // playerGridRig.removeAttribute("virtual-gamepad-controls");
                    // camera.removeAttribute('pitch-yaw-rotator');
                    sceneEl.removeAttribute("look-on-mobile");
                }
                else {
                    console.log("failed to teardown mobile controls on playerGridRig");
                }
            }
            catch (e) {
                console.log("failed to teardown mobile controls on playerGridRig");
                console.log(e);
            }
        },

        setupVR() {
            if (CONFIG.DEBUG) {console.log("setupVR");};
            var playerGridRig = document.getElementById('playerGridRig');
            playerGridRig.object3D.matrixAutoUpdate = true;
        },

        tearDownVR() {
            if (CONFIG.DEBUG) {console.log("tearDownVR");};
        },

        onSceneLoaded() {
            if (this.$el.sceneEl.is('vr-mode')) {
                this.setupVR();
            }
            else {
                if (AFRAME.utils.device.isMobile()) {
                    this.setupMobile();
                } else {
                    this.setupDesktop();
                }
            }
        },
    }
}
</script>