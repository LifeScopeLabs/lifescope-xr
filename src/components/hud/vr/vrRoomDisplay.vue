<template>
    <a-entity class="room-display">
        <a-entity 
            id="room-selector"
            class="clickable"
            :geometry="'primitive: plane; width: ' + width*size + '; height: ' + lineSep*size + ';'"
            :material="'color: ' + headerBackgroundColor + '; side: double;'"
            text="value: Room Selection; align: center;"
            text-link>
        </a-entity>

        <a-entity v-if="displayRooms">
                <a-entity v-for="(room, index) in rooms" v-bind:key="'room-label-' + index"
                    :id="'room-label-' + index"
                    :geometry="'primitive: plane; width: ' + width*size + '; height: ' + lineSep*size + ';'"
                    :material="'color: ' + backgroundColor + '; side: double;'"
                    :text="'value: ' + room + '; align: center;'"
                    text-link
                    :position="'0 ' + (-lineSep*size*(index+1)) + ' 0'"
                    class="clickable"
                    @click="roomClickHandler">
                </a-entity>
            </a-entity>

    </a-entity>
</template>

<script>

import { mapState } from 'vuex';

export default {
    data() {
        return {
            displayRooms: false,
            opacity: 0.7,
            width: 0.1,
            lineSep: .01,
            textScale: 4,
            backgroundColor: '#22252a',
            headerBackgroundColor: '#29434E',
        }
    },

    props: {
        size: {
            type: Number,
            default: 1
        },
    },

    computed: mapState('xr',
    [
        'roomName',
        'roomConfig',
        'rooms',
        'isMobile',
    ]),

    mounted() {
        var self = this;
        self.$el.addEventListener("textclicked", self.textClickedHandler);
    },

    beforeDestroy() {
        var self = this;
        self.$el.removeEventListener("textclicked", self.textClickedHandler);
    },

    methods: {
        link: function (room) {
            return '?room=' + room;
        },
        changeRoom: function (room) {
            window.location.replace( this.link(room) );
        },
        roomClickHandler: function (evt) {
            this.changeRoom(this.rooms[evt.target.id.match(/\d+$/)]);
        },
        toggleRoomVisibility: function() {
            this.displayRooms = !this.displayRooms;
        },

        textClickedHandler(evt) {
            var self = this;
            var el = evt.target;
            var id = el.id;

            if (id == 'room-selector') {
                self.toggleRoomVisibility();
                return;
            }
        }
    },
}

</script>
