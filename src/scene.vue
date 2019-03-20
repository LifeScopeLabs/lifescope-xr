<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ls-room; audio: true; adapter: easyrtc; connectOnLoad: true;'">

    <!-- Load assets -->
    <a-assets class="aframe-assets">
      <img id="sky" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/skybox/nightsky.jpg"
        crossorigin="anonymous">
      <img id="earth" src="https://s3.amazonaws.com/lifescope-static/static/xr/components/globe/Albedo.jpg"
        crossorigin="anonymous">
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
    <gallery/>

    <!-- Sky id="Sky" -->
    <a-sky id="starsky" src="#sky" rotation="90 0 90">
    </a-sky>
    <!-- <a-sun-sky id="sunsky" material="side: back" :sun-sky-position="'time: ' + time"></a-sun-sky> -->

  </a-scene>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";

import Avatar from "./avatar.js";

export default {
    components: {
        gallery
    },
    data() {
      return {
        avatar: {}
      }
    },

    computed: mapState([
        'roomName',
    ]),

    mounted () {
      if (CONFIG.DEBUG) {console.log("App.vue mounted");};
      var self = this;

      var scene = document.querySelector('a-scene');  
      if (scene.hasLoaded) {
        self.onSceneLoaded();
      } else {
        scene.addEventListener('loaded', self.onSceneLoaded);
      }

      document.body.addEventListener('enter-vr', function (evt) {
        self.onEnterVR();
        document.body.addEventListener('exit-vr', function (event) {
          self.onExitVR();
        })
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

      if (!self.$route.query.room){
          self.$route.query.room = 'ls-room';
      }
          
      var queryRoom = this.$route.query.room || 'ls-room';

      this.$store.dispatch('setRoomName', queryRoom).then(() => {
        this.$store.dispatch('getRoomConfig').then(() => {
          this.$store.dispatch('getObjs').then(() => {

            self.setupAvatar();

            if (AFRAME.utils.device.isMobile()) {
              self.setupMobile();
            } else {
              self.setupDesktop();
            }
          })
        });
      });
      
    },


    methods: {
      onSceneLoaded () {
        if (CONFIG.DEBUG) {console.log("onSceneLoaded");}
        var self = this;
        self.$store.commit('SET_SCENELOADED');
        self.$store.commit('SET_ISMOBILE');
      },

      onEnterVR () {
        var self = this;
        if (CONFIG.DEBUG) {console.log('entered vr');};
        if (this.avatar !== null) {
          this.avatar.createRightHandNetworked();
        }
        else {
          document.body.addEventListener('avatarCreated', function(evt) {
            console.log("avatarCreated");
            self.avatar.createRightHandNetworked();
          })
        }

        if (AFRAME.utils.device.isMobile()) {
              this.teardownMobile();
        }
      },
      onExitVR () {
        if (CONFIG.DEBUG) {console.log('exited vr');};
        var rightHand = document.getElementById('rightHandController');
        rightHand.parentElement.removeChild(rightHand);

        if (AFRAME.utils.device.isMobile()) {
          this.setupMobile();
        }
      },

      setupMobile () {
        if (CONFIG.DEBUG) {console.log("isMobile");};
        var playerRig = document.getElementById('playerRig');
        playerRig.setAttribute("virtual-gamepad-controls", {});
        var camera = document.getElementById('player-camera');
        var sceneEl = document.getElementsByTagName('a-scene')[0];
        sceneEl.setAttribute("look-on-mobile", "camera", camera);
        sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
      },

      teardownMobile () {
        if (CONFIG.DEBUG) {console.log("teardownMobile");};
        var playerRig = document.getElementById('playerRig');
        playerRig.removeAttribute('virtual-gamepad-controls');
        var sceneEl = document.getElementsByTagName('a-scene')[0];
        sceneEl.removeAttribute('look-on-mobile');
      },

      setupDesktop () {
        if (CONFIG.DEBUG) {console.log("!isMobile");};
        var playerRig = document.getElementById('playerRig');
        playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
      },

      setupAvatar () {
        if (CONFIG.DEBUG) {console.log("setupAvatar");};

        var avatar = new Avatar();
        this.avatar = avatar;
        avatar.createAvatarRigTemplate();
        avatar.addAvatarRigTemplate();
        avatar.createNetworkedPlayer();

        var avatarCreatedEvent = new Event('avatarCreated');
        document.body.dispatchEvent(avatarCreatedEvent);
      },

    }
  }
</script>

<style src="./scene.css"></style>

