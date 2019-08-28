<template>
    <div class="room-display" :class="{ 'desktop-hud': !isMobile, 'mobile-hud': isMobile }">
          <div class="current-room">
              {{ roomName }}
            </div>
            <div class="room-links">
                <div v-for="(room, index) in rooms" :key="index">
                    <a :href="link(room)"> {{room}} </a>
                </div>
            </div>
      </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
    computed: mapState('xr',
    [
        'roomName',
        'roomConfig',
        'rooms',
        'isMobile',
    ]),
    methods: {
        link: function (room) {
            return '?room=' + room;
        },
    },
}
</script>

<style src="./RoomDisplay.scss"></style>
