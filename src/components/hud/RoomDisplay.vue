<template>
    <div class="room-display">
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
    ]),
    methods: {
        link: function (room) {
            return '?room=' + room;
        },
    },
}
</script>

<style src="./RoomDisplay.css"></style>
