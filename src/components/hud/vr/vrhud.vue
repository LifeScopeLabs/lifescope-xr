<template>
  <a-entity id="vrhudentity" class="hud">
    <helpmenu id="vrhelpmenu" v-if="hudhelpactive && inVR"
        position="0 0 -1.5"/>
    <settings id="vrsettings" v-if="hudsettingsactive && inVR"
        position="0 0 -1.5"/>
  </a-entity>
</template>

<script>
import { mapState } from 'vuex';

import helpmenu from "./HelpMenu.vue";
import settings from "./settings.vue";

export default {
    components: {
        helpmenu,
        settings,
    },

    data() {
        return {
            hudhelpactive: false,
            hudsettingsactive: false,
            menus: ['','vrhelpmenu', 'vrsettings'],
            currentMenuIndex: 0
        }
    },

    computed: {
      ...mapState('xr',
      [
        'inVR',
        'isMobile',
      ])
    },

    mounted() {
        document.body.addEventListener('keypress', this.keypressHandler);
        document.body.addEventListener('cyclehud', this.cycleHud);
    },

    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keypressHandler);
    },

    methods: {
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

      cycleHud () {
        var self = this;
        self.currentMenuIndex = ((self.currentMenuIndex + 1) % self.menus.length);
        switch (self.currentMenuIndex) {
          case 0:
            self.hudhelpactive = false;
            self.hudsettingsactive = false;
            break;
          case 1:
            self.hudhelpactive = true;
            self.hudsettingsactive = false;
            self.updateHudPosition('#vrhud');
            break;
          case 2:
            self.hudhelpactive = false;
            self.hudsettingsactive = true;
            self.updateHudPosition('#vrhud');
            break;
          default:
            break;
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
        var position, rotation;
        var loadedHandler = function() {
            position = posEntity.object3D.getWorldPosition();
            rotation = playerCamera.object3D.rotation;
            posEntity.parentElement.removeChild(posEntity);
            hud = document.querySelector(selector);
            posEntity.removeEventListener('loaded', loadedHandler);
            hud.object3D.position.set(position.x, position.y, position.z);
            hud.object3D.rotation.set(0, rotation.y, 0);
        }
        posEntity.addEventListener('loaded', loadedHandler)
      }
    }
}
</script>

<!-- <style src="./vrhud.css"></style> -->
