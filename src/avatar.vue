<template>
  <a-entity id="playerRig"
          position="0 1.6 -2"
          >
         
         <a-entity id="player-camera"
            class="camera"
            camera
          >
          </a-entity>
    </a-entity>
</template>

<script>

export default {
    data () {
        return {
            teleporting: false,
            teleportThreshold: 0.4
        }
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

        createRightHandNetworked() {
            if (CONFIG.DEBUG) {console.log("creating networked right hand");}
            // 
            //  landingNormal: 0 0 1;
            //  collisionEntities: .boundry;
            var frag = this.fragmentFromString(`
            <a-entity id="rightHandController"
                teleport-controls="cameraRig: #playerRig; teleportOrigin: #player-camera; startEvents: teleportstart; endEvents: teleportend;"
                windows-motion-controls="hand: right;"
                oculus-go-controls="hand: right;"
                >
            </a-entity>`);
                // daydream-controls="hand: right;"
                // oculus-touch-controls="hand: right;"
                // vive-controls="hand: right;"
                // gearvr-controls="hand: right;"
            document.getElementById('playerRig').appendChild(frag);
        },

        setupControls() {
            if (CONFIG.DEBUG) {console.log('setupControls');}
            var self = this;
            
            document.addEventListener('thumbstickmoved', function(evt) {
                if (self.teleporting) {
                    if (evt.detail.y >= -self.teleportThreshold) {
                        var controller = document.querySelector('#rightHandController');
                        controller.emit('teleportend');
                        self.teleporting = false;
                    }
                }
                else {
                    if (evt.detail.y <= -self.teleportThreshold) {
                        var controller = document.querySelector('#rightHandController');
                        controller.emit('teleportstart');
                        self.teleporting = true;
                    }
                }
            });
        },

        fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
        }
    }
}
</script>