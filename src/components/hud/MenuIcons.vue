<template>
    <div class="xr-menu-container"  :class="{ 'desktop-hud': !isMobile, 'mobile-menu': isMobile }">

        <div class="xr-menu-toggle">
            <div class="fas fa-cog" @click="toggleSettingsVisibility"></div>
            <div class="fas fa-question-circle" @click="toggleHelpVisibility"></div>
            <!-- <div class="fas " v-bind:class="{ 'fa-th-large': sceneLayout == SceneLayoutEnum.GALLERY,
                    'fa-circle': sceneLayout == SceneLayoutEnum.GRID }"
                    @click="toggleLayout"></div> -->
        </div>
    </div> 

</template>

<script>
import { mapState } from 'vuex';

import { SceneLayoutEnum } from '../../store/modules/xr';

export default {

    data() {
        return {
            SceneLayoutEnum: SceneLayoutEnum,
        }
    },

    computed: {
      ...mapState('xr',
      [
        'isMobile',
        'sceneLayout',
      ]),
      ...mapState('xr/hud',
      [
        'helpMenuVisible',
        'graphicsMenuVisible',
      ]),
    },

    methods: {
        toggleHelpVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.$store.commit('xr/hud/SET_HELP_MENU_ACTIVE', !this.helpMenuVisible);
        },
        toggleSettingsVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleSettingsVisibility");}
            this.$store.commit('xr/hud/SET_GRAPHICS_MENU_ACTIVE', !this.graphicsMenuVisible);
        },
        toggleLayout() {
            if (CONFIG.DEBUG) {console.log("toggleLayout");}
            var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
            this.$store.commit('xr/SET_LAYOUT', newVal);
        },
    },
}
</script>

<style src="./MenuIcons.scss"></style>
