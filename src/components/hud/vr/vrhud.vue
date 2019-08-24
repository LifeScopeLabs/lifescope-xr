<template>
  <a-entity id="vrhudentity" class="hud">
    <helpmenu id="vrhelpmenu" v-if="vrHelpActive && inVR"
        position="0 0 -1.5"/>
    <settings id="vrsettings" v-if="vrSettingsActive && inVR"
        position="0 0 -1.5"/>
    <a-entity id="vrkeyboard" v-if="showKeyboard"
        position="0 0 -0.5"
        :super-keyboard="'hand: #rightHandCursor; imagePath:/static/aframe/aframe-super-keyboard/;' + ' model: ' + vrKeyboardModel + ';'"
        />
  </a-entity>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import helpmenu from "./HelpMenu.vue";
import settings from "./settings.vue";

export default {
    components: {
        helpmenu,
        settings,
    },


    computed: {
      ...mapState('xr',
      [
        'inVR',
        'isMobile',
      ]),
      ...mapState('xr/hud',
      [
        'vrKeyboardActive',
        'vrKeyboardModel',
        'vrSettingsActive',
        'vrHelpActive',
        'vrActiveHud'
      ]),
      showKeyboard() {
        return this.vrKeyboardActive && this.inVR;
      },
    },

    mounted() {
        document.body.addEventListener('keypress', this.keypressHandler);
        document.body.addEventListener('cyclehud', this.cycleHudHandler);
    },

    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keypressHandler);
        document.body.removeEventListener('cyclehud', this.cycleHudHandler);
    },

    methods: {
      ...mapActions('xr/hud',
      [
        'cycleHud'
      ]),

      cycleHudHandler () {
        if (CONFIG.DEBUG) {console.log("cycleHudHandler");}
        this.updateHudPosition('#vrhud');
        this.cycleHud();
      },

      toggleHudHelp () {
        var self = this;
        if (self.hudhelpactive) {
          self.hudhelpactive = false;
          self.currentMenuIndex = 0;
        }
        else {
          self.updateHudPosition('#vrhud');
          self.hudhelpactive = true;
          self.currentMenuIndex = 1;
        }
      },

      toggleHudSettings () {
        var self = this;
        if (self.hudsettingsactive) {
          self.hudsettingsactive = false;
          self.currentMenuIndex =  0;
        }
        else {
          self.updateHudPosition('#vrhud');
          self.hudsettingsactive = true;
          self.currentMenuIndex = 2;
        }
      },


      keypressHandler (evt) {
        if (evt.key == 'h') {
            this.toggleHudHelp();
        }
        else if (evt.key == 'g') {
            this.toggleHudSettings();
        }
      },

      updateHudPosition(selector) {
        var posentity = document.createElement('a-entity');
        posentity.setAttribute('id', 'posent');
        posentity.setAttribute('position', {x: 0, y: 0, z: 0});

        var playerRig = document.getElementById('playerRig')

        var playerCamera = document.getElementById('player-camera')
        playerCamera.appendChild(posentity);

        var posEntity = document.querySelector('#posent');
        var hud;
        var position, quaternion;
        var loadedHandler = function() {
            position = posEntity.object3D.getWorldPosition();
            playerRig.object3D.worldToLocal(position);
            quaternion = playerCamera.object3D.quaternion
            posEntity.parentElement.removeChild(posEntity);
            hud = document.querySelector(selector);
            posEntity.removeEventListener('loaded', loadedHandler);
            hud.object3D.position.set(position.x, position.y + 5, position.z);
            hud.object3D.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

            AFRAME.ANIME({
                targets: hud.object3D.position,
                easing: 'linear',
                y: [position.y + 5, position.y],
                duration: 0.5*1000,
            })
        }
        posEntity.addEventListener('loaded', loadedHandler)
      }
    }
}
</script>

<!-- <style src="./vrhud.css"></style> -->
