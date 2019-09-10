<template>
  <div id="hud" class="hud ">
        <help-menu
            :class="helpClassObject"
            v-hammer:swipe.up.down="(event) => changeHelpVisibility(event)"/>
        <paginator v-if="!isMobile && sceneLayout == SceneLayoutEnum.GALLERY"/>
        <settings/>
        <map-hud v-if="sceneLayout == SceneLayoutEnum.GALLERY"/>
        <naf-hud/>
        <chat-hud/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import HelpMenu from './HelpMenu.vue';
import paginator from './paginator.vue';
import settings from './settings.vue';
import MapHud from './MapHud.vue';
import NafHud from './NAFHud.vue';
import ChatHud from './ChatHud.vue';

import { SceneLayoutEnum } from '../../store/modules/xr';

export default {
    components: {
        HelpMenu,
        paginator,
        settings,
        MapHud,
        NafHud,
        ChatHud
    },

    data() {
        return {
            helpStyleObject: {
                visibility: 'visible',
            },
            helpClassObject: {
                fakehidden: false,
            },
            SceneLayoutEnum: SceneLayoutEnum,
        }
    },

    computed: {
      ...mapState('xr',
      [
        'isMobile',
        'sceneLayout'
      ])
    },

    methods: {
        changeHelpVisibility(event) {
            if (CONFIG.DEBUG) {console.log("changeHelpVisibility");}
            switch (event.direction) {
                case 8: // up
                    this.helpClassObject.fakehidden = true;
                    break;
                case 16: // down
                    this.helpClassObject.fakehidden = false;
                    break;
            };
        },
    }
}
</script>

<style src="./hud.scss"></style>
