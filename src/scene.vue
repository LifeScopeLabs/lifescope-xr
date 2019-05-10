<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ls-room; audio: true; adapter: easyrtc; connectOnLoad: true;'"
  fog="type: exponential; color: white; density: 0.025;"
    >

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

      <a-gltf-model  v-for="(av, index) of avatars" :key="av.name"
        :src="av.src"
        :id="'avatar-' + index"
        crossorigin="anonymous">
      </a-gltf-model>
    </a-assets>

    <!-- gallery -->
    <gallery/>

    <!-- <avatarcomp ref="avatar"/> -->
    <a-entity
      id="commercial-camera"
      class="camera"
      camera
      >
    </a-entity>

    <!-- Sky id="Sky" v-if="skybox==SkyboxEnum.STARS" -->
    <a-sky visible="false"
      id="starsky" src="#sky" rotation="90 0 90">
    </a-sky>
    <!-- v-else-if="skybox==SkyboxEnum.SUN" -->
    <a-sun-sky visible="true"
      rotation="0 0 90"
      id="sunsky" material="side: back" :sun-sky-position="'time: ' + sky.time">
    </a-sun-sky>

  </a-scene>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";

import Avatar from "./avatar.js";
import avatarcomp from "./avatar.vue";

import { SkyboxEnum } from '../store/modules/xr/modules/graphics';

export default {
    components: {
        gallery,
        avatarcomp
    },
    data() {
      return {
        avatar: {},
        SkyboxEnum: SkyboxEnum,
        skytime: 11,
        sky: {
            time: 0
        },
        comCam: {
          position: {
            x: -5,
            y: 1.5,
            z: 0,
          }
        },
        position: {
            x: -5,
            y: 1.5,
            z: 0,
          }
      }
    },

    computed: {
      roomName() { return this.$store.state.xr.roomName; },
      skybox() { return this.$store.state.xr.graphics.skybox; },
      // skytime() { return this.$store.state.xr.graphics.skytime; },
      avatars() { return this.$store.state.xr.avatars; }
    },

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
          self.$route.query.room = 'commercial';
      }
          
      var queryRoom = this.$route.query.room || 'commercial';

      this.$store.dispatch('xr/getAvatars');
      this.$store.dispatch('xr/setRoomName', queryRoom).then(() => {
        this.$store.dispatch('xr/getRoomConfig').then(() => {
          this.$store.dispatch('xr/getObjs').then(() => {

            if (AFRAME.utils.device.isMobile()) {
              self.setupMobile();
            } else {
              self.setupDesktop();
            }
          })
        });
      });
      
      AFRAME.ANIME({
            targets: self.sky,   
            easing: 'linear',
            time: 24,
            loop: true,
            duration: 1000,
        })

      // var flipSky = function(sunvis) {
      //   var sun = document.querySelector('#sunsky');
      //   var stars = document.querySelector('#starsky');

      //   if(sunvis) {
      //     sun.setAttribute('visible', false);
      //     stars.setAttribute('visible', true);
      //     setTimeout( function() {
      //       flipSky(false);
      //     }, 500);
      //   }
      //   else {
      //     sun.setAttribute('visible', true);
      //     stars.setAttribute('visible', false);
      //     setTimeout( function() {
      //       flipSky(true);
      //     }, 500);
      //   }
      // }
      
      // setTimeout(
      //   flipSky(true),
      //   250
      // );


      var camera = document.querySelector("#commercial-camera");
      AFRAME.ANIME({
            targets: camera.object3D.position,
            easing: 'linear',
            y: [1.5, 5],
            z: 20,
            loop: true,
            duration: 4*1000,
            delay: 1* 1000
      })

    },


    methods: {
      onSceneLoaded () {
        if (CONFIG.DEBUG) {console.log("onSceneLoaded");}
        var self = this;
        self.$store.commit('xr/SET_SCENELOADED');
        self.$store.commit('xr/SET_ISMOBILE');
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
        // this.$refs.avatar.setupMobile();
      },

      teardownMobile () {
        if (CONFIG.DEBUG) {console.log("teardownMobile");};
        var playerRig = document.getElementById('playerRig');
        if (playerRig) {
          playerRig.removeAttribute('virtual-gamepad-controls');
        }
        var sceneEl = document.getElementsByTagName('a-scene')[0];
        sceneEl.removeAttribute('look-on-mobile');
      },

      setupDesktop () {
        if (CONFIG.DEBUG) {console.log("!isMobile");};
        // this.$refs.avatar.setupDesktop();
      },
    }
  }
</script>

<style src="./scene.css"></style>

