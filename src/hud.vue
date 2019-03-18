<template>
  <div id="hud" class="hud">
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
      <div class="help-menu" :style="helpStyleObject">
          <h2> Controls </h2>
          <ul>
            <li> <b>H - </b> toggle help menu </li>

            <li> <b> WASD - </b> movement controls </li>

            <li> <b> click and drag </b> to look around </li>

            <li> <b> hover room name </b> to select new room </li>
            </ul>
        </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

export default {
    data() {
        return {
            helpStyleObject: {
                visibility: 'visible',
            },
            roomName: 'ls-room',
            roomConfig: {},
            rooms: []
        }
    },

    mounted() {
        var self = this;

        this.roomName = this.$route.query.room || 'ls-room';

        document.body.addEventListener('keypress', function(evt) {
            //console.log(evt.key)
            if (evt.key == 'h') {
                self.toggleHelpVisibility();
            }
        });

        this.getRoomConfig().then((res) => {
          if (CONFIG.DEBUG) {console.log("getRoomConfig().then")};

          this.roomConfig = res.roomConfig;

          this.getRooms().then((res) => {
            console.log("getRooms");
            this.rooms = res.rooms;
          });
        });

    },

    methods: {
        
        toggleHelpVisibility() {
            // if (CONIFG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },

        link: function (room) {
            return '?room=' + room;
        },

        getRoomConfig () {
            if (CONFIG.DEBUG) {console.log("getRoomConfig");};
                return axios.get("/roomconfig")
                .then((res) => {
                return {roomConfig: res.data}
            })
        },

        getRooms () {
            if (CONFIG.DEBUG) {console.log("getObjs");};
            
            var x = '/' + this.roomConfig.BUCKET_PATH;

            if (!this.$route.query.room){
                this.$route.query.room = 'ls-room';
            }

            this.roomName = this.$route.query.room || 'ls-room';

            return axios.get(x)
            .then((res) => {
                var result = [];
                var rooms = Object.keys(res.data);
                //console.log(rooms);
                return { rooms: rooms }
            })
        },

    },
}
</script>

<style src="./hud.css"></style>
