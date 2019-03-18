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
          <div class="help-controls">
            <h2> Controls </h2>
            <ul>
                <li> <b>H - </b> toggle help menu </li>

                <li> <b> WASD - </b> movement controls </li>

                <li> <b> click and drag </b> to look around </li>

                <li> <b> hover room name </b> to select new room </li>
                </ul>
          </div>

          <div class="help-settings">

            <h2> Settings </h2>
            <h3> Sky </h3>
            <div>
                <input type="radio" id="sky-setting-stars" name="sky" value="stars"
                        checked v-model="skySetting">
                <label for="sky-setting-stars">Stars</label>
            </div>

            <div>
                <input type="radio" id="sky-setting-sun" name="sky" value="sun"
                    v-model="skySetting">
                <label for="sky-setting-sun">Sun</label>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

export default {
    data() {
        return {
            skySetting: 'stars',
            helpStyleObject: {
                visibility: 'visible',
            },
            roomName: 'ls-room',
            roomConfig: {},
            rooms: [],
            time: 11, // 24 hours
        }
    },

    watch: {
        skySetting: function (newVals, oldVals) {
            this.changeSky(newVals);
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

        changeSky(val) {
            if (val == 'sun') {
                this.removeStars();
                this.addSun();
            }
            else if (val == 'stars') {
                this.removeSun();
                this.addStars();
            }
        },
        removeStars() {
            var stars = document.querySelector('#starsky');
            stars.parentElement.removeChild(stars);
        },
        addStars() {
            var stars = document.createElement('a-sky');
            stars.setAttribute('id', 'starsky');
            stars.setAttribute('src', '#sky')
            stars.object3D.rotation.x += Math.PI/2;
            stars.object3D.rotation.z += Math.PI/2;
            AFRAME.scenes[0].appendChild(stars);
        },
        removeSun() {
            var sun = document.querySelector('#sunsky');
            sun.parentElement.removeChild(sun);
        },
        addSun() {
            var sun = document.createElement('a-sun-sky');
            sun.setAttribute('id', 'sunsky');
            sun.setAttribute('material', {side: 'back'})
            sun.setAttribute('sun-sky-position', {time: 11});
            AFRAME.scenes[0].appendChild(sun);
        },


    },
}
</script>

<style src="./hud.css"></style>
