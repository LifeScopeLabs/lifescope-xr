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
    },

    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keypressHandler);
    },

    methods: {
      toggleHudHelp () {
        var self = this;
        if (self.hudhelpactive) {
          self.hudhelpactive = false;
        }
        else {
          self.updateHudPosition('#vrhud');
          self.hudhelpactive = true;
        }
      },

      toggleHudSettings () {
        var self = this;
        if (self.hudsettingsactive) {
          self.hudsettingsactive = false;
        }
        else {
          self.updateHudPosition('#vrhud');
          self.hudsettingsactive = true;
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
