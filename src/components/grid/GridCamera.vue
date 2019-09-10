<template>
  <a-entity id="playerRig">
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
    },

    methods: {
        setupDesktop() {
            if (CONFIG.DEBUG) {console.log("setupDesktop");};
            var self = this;
            var playerRig = document.getElementById('playerRig');
            playerRig.sceneEl.addEventListener('enter-vr', function() {
                self.tearDownDesktop();
            },
            true);
            try {
                if (playerRig) {
                    // playerRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                    // playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
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

        tearDownDesktop() {
            if (CONFIG.DEBUG) {console.log("tearDownDesktop");};
            var playerRig = document.getElementById('playerRig');
            try {
                if (playerRig) {
                    // playerRig.removeAttribute("wasd-controls");
                    // playerRig.removeAttribute("look-controls");
                }
                else {
                    console.log("failed to teardown desktop controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to teardown desktop controls on playerRig");
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
                    // playerRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                    // playerRig.setAttribute("virtual-gamepad-controls", {});
                    // camera.setAttribute('pitch-yaw-rotator', {});
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

        tearDownMobile() {
            if (CONFIG.DEBUG) {console.log("tearDownMobile");};
            var playerRig = document.getElementById('playerRig');
            var camera = playerRig.querySelector('#player-camera');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            try {
                if (playerRig) {
                    // playerRig.removeAttribute("character-controller");
                    // playerRig.removeAttribute("virtual-gamepad-controls");
                    // camera.removeAttribute('pitch-yaw-rotator');
                    sceneEl.removeAttribute("look-on-mobile");
                }
                else {
                    console.log("failed to teardown mobile controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to teardown mobile controls on playerRig");
                console.log(e);
            }
        },

        setupVR() {
            if (CONFIG.DEBUG) {console.log("setupVR");};
            if (this.isMobile) {
                this.tearDownMobile();
            }
            else {
                this.tearDownDesktop();
            }
            var playerRig = document.getElementById('playerRig');
            playerRig.object3D.matrixAutoUpdate = true;
        },

        tearDownVR() {
            if (CONFIG.DEBUG) {console.log("tearDownVR");};
            if (this.isMobile) {
                this.setupMobile();
            }
            else {
                this.setupDesktop();
            }
        },

        onSceneLoaded() {
            var self = this;
        },
    }
}
</script>