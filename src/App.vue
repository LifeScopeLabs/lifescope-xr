<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ls-room; audio: true; adapter: easyrtc; connectOnLoad: true;'">

    <!-- Load assets -->
    <a-assets class="aframe-assets">
      <img id="sky" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/skybox/nightsky.jpg">
      <img id="earth" src="https://s3.amazonaws.com/lifescope-static/static/xr/components/globe/Albedo.jpg">
      <!-- video controls -->
      <img id="video-play" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/video_play.png"
        crossorigin="anonymous">
      <img id="video-pause" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/video_pause.png"
        crossorigin="anonymous">
      <!-- gltf -->
      <!-- logo -->
      <a-gltf-model id="logo" src="https://s3.amazonaws.com/lifescope-static/static/xr/logo/logo.gltf"
                    crossorigin="anonymous">
      </a-gltf-model>
    </a-assets>

    <!-- gallery -->
    <gallery :LSObjs='LSObjs' :rooms='rooms' :roomConfig='roomConfig'/>

    <!-- Sky id="Sky" -->
    <a-sky src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";

import Avatar from "./avatar.js";

var CONFIG = {};
CONFIG.DEBUG = true;
import debugListeners from './dev/listeners.js';

if (CONFIG.DEBUG) {console.log("from App.vue <script>");}
export default {
    components: {
        gallery
    },
    data() {
      return {
        LSObjs: [],
        rooms: [],
        roomConfig: {},
        roomName: 'ls-room'
      }
    },

    beforeCreate () {
      if (CONFIG.DEBUG) {console.log("beforeCreate");};
    },

    created () {
      if (CONFIG.DEBUG) {console.log("created");};
    },

    beforeMount () {
      if (CONFIG.DEBUG) {console.log("beforeMount");};
    },

    mounted () {
      if (CONFIG.DEBUG) {console.log("App.vue mounted");};
      // set userHeight after a-scene is available
      document.body.addEventListener('renderstart', function (evt) {
        if (CONFIG.DEBUG) {console.log('renderstart');};
        AFRAME.scenes[0].renderer.vr.userHeight = 0;
      });



      //
      // Add hand when user enters vr mode
      var self = this;
      document.body.addEventListener('enter-vr', function (evt) {
        if (CONFIG.DEBUG) {console.log('entered vr');};
        var rightHand = document.getElementById('rightHandController');
        //typeof array != "undefined" && array != null && array.length != null && array.length > 0
        if (rightHand == null) {
          if (CONFIG.DEBUG) {console.log('adding hand...');};
          self.createRightHandNetworked();
        }
      });


      document.body.addEventListener('connected', function (evt) {
        if (CONFIG.DEBUG) {console.log('connected event. clientId =', evt.detail.clientId);};
        if (CONFIG.DEBUG) {console.log('roomName: ' + self.roomName);};

      });

      // make eyes invisible to user when the avatar is created
      document.body.addEventListener('entityCreated', function (evt) {
        if (evt.detail.el.id === 'playerRig') {
          document.getElementsByClassName('player')[0].getElementsByClassName('face')[0].setAttribute('visible', 'false');
          document.getElementsByClassName('player')[0].getElementsByClassName('head')[0].setAttribute('visible', 'false');
        }
      });
      

      this.getRoomConfig().then((res) => {
          if (CONFIG.DEBUG) {console.log("getRoomConfig().then")};

          this.roomConfig = res.roomConfig;
          //this.roomName = res.roomConfig.ROOM_NAME;

          this.getObjs().then((res) => {
            console.log("getObjs");
            this.LSObjs = res.LSObjs;
            this.rooms = res.rooms;

            var avatar = new Avatar();
            avatar.createAvatarRigTemplate();
            avatar.addAvatarRigTemplate();
            avatar.createNetworkedPlayer();

            if (AFRAME.utils.device.isMobile()) {
              if (CONFIG.DEBUG) {console.log("isMobile");};
              var playerRig = document.getElementById('playerRig');
              playerRig.setAttribute("virtual-gamepad-controls", {});
              var camera = document.getElementById('player-camera');
              var sceneEl = document.getElementsByTagName('a-scene')[0];
              //this.eventHandlers.push(new TouchEventsHandler(this.cursor, this.cameraController, this.cursor.el));
              sceneEl.setAttribute("look-on-mobile", "camera", camera);
              sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
            } else {
              if (CONFIG.DEBUG) {console.log("!isMobile");};
              var playerRig = document.getElementById('playerRig');
              playerRig.setAttribute("look-controls", "reverseMouseDrag:true");
            }
            }
          );
        }
      );
    },


    methods: {
      getRoomConfig () {
        if (CONFIG.DEBUG) {console.log("getRoomConfig");};
        return axios.get("/roomconfig")
        .then((res) => {
          return {roomConfig: res.data}
        })
      },

      getObjs () {
        if (CONFIG.DEBUG) {console.log("getObjs");};
        
        var x = '/' + this.roomConfig.BUCKET_PATH;

        if (!this.$route.query.room){
          this.$route.query.room = 'ls-room';
        }

        this.roomName = this.$route.query.room || 'ls-room';

        if (CONFIG.DEBUG) {console.log(x);};
        return axios.get(x)
        .then((res) => {
          var result = [];
          var rooms = Object.keys(res.data);
          var someData = res.data[this.roomName].forEach(element => {
            result.push(element);
          });
          return { LSObjs: result, rooms: rooms }
        })
      },

    }
  }
</script>

<style src="./app.css"></style>

