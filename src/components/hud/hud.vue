<template>
  <div id="hud" class="hud ">
        <chat-hud/>
        <help-menu
            :class="helpClassObject"
            v-hammer:swipe.up.down="(event) => changeHelpVisibility(event)"/>
        <map-hud v-if="sceneLayout == SceneLayoutEnum.GALLERY"/>
        <menu-icons/>
        <naf-hud/>
        <paginator v-if="!isMobile && sceneLayout == SceneLayoutEnum.GALLERY"/>
        <settings/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChatHud from './ChatHud.vue';
import HelpMenu from './HelpMenu.vue';
import MapHud from './MapHud.vue';
import MenuIcons from './MenuIcons.vue';
import NafHud from './NAFHud.vue';
import paginator from './paginator.vue';
import settings from './settings.vue';
import { SceneLayoutEnum } from '../../store/modules/xr/index.js';

export default {
    components: {
        ChatHud,
        HelpMenu,
        MapHud,
        MenuIcons,
        NafHud,
        paginator,
        settings,
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
