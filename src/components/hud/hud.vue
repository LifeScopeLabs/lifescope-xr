<template>
  <div id="hud" class="hud">
        <room-display/>
        <help-menu/>
        <paginator/>
        <settings/>
  </div>
</template>

<script>

import HelpMenu from './HelpMenu.vue';
import paginator from './paginator.vue';
import RoomDisplay from './RoomDisplay.vue';
import settings from './settings.vue';

export default {
    components: {
        HelpMenu,
        paginator,
        RoomDisplay,
        settings
    },
}
</script>

<style src="./hud.css"></style>
