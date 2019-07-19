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

      <!-- Avatar -->
      <a-asset-item v-for="(av, index) of avatars" :key="av.name"
        :src="av.src"
        :id="'avatar-' + index"
        crossorigin="anonymous">
      </a-asset-item>
    </a-assets>

    <!-- gallery -->
    <gallery/>

    <avatar ref="avatar"/>

    <!-- Sky id="Sky" -->
    <a-sky v-if="skybox==SkyboxEnum.STARS"
      id="starsky" src="#sky" rotation="90 0 90">
    </a-sky>
    <a-sun-sky v-else-if="skybox==SkyboxEnum.SUN"
      id="sunsky" material="side: back" :sun-sky-position="'time: ' + skytime">
    </a-sun-sky>

  </a-scene>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";

import avatar from "./components/avatar/avatar.vue";

import { SkyboxEnum } from './store/modules/xr/modules/graphics';

export default {
    components: {
        gallery,
        avatar,
    },
    data() {
      return {
        avatar: {},
        SkyboxEnum: SkyboxEnum,
        hudhelpactive: false,
        hudsettingsactive: false,
      }
    },

    computed: {
      ...mapState('xr',
        [
          'inVR',
          'roomName'
        ]
      ),

      ...mapState('xr/graphics',
        [
          'skybox',
          'skytime'
        ]
      ),

      ...mapState('xr/avatar',
        [
          'avatars'
        ]
      ),
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

      document.body.addEventListener('clientConnected', function (evt) {
        console.log('clientConnected event. clientId =', evt.detail.clientId);
        console.log('roomName: ' + self.roomName);
      });


      if (!self.$route.query.room){
          self.$route.query.room = 'ls-room';
      }
          
      var queryRoom = this.$route.query.room || 'ls-room';

      this.$store.dispatch('xr/setRoomName', queryRoom)
      .then(() => {
        return this.$store.dispatch('xr/getRoomConfig');
      })
      .then(() => {
          return this.$store.dispatch('xr/getObjs');
      })
      .then(() => {
          return this.$store.dispatch('xr/avatar/getAvatars');
      })
      .then(() => {
            if (AFRAME.utils.device.isMobile()) {
              self.setupMobile();
            } else {
              self.setupDesktop();
            }
      })
      .catch( ( error ) => {
        console.log(error);
      });
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
        self.$store.commit('xr/SET_IN_VR', true);
        this.$refs.avatar.setupVR();

        if (AFRAME.utils.device.isMobile()) {
              this.teardownMobile();
        }
      },
      onExitVR () {
        var self = this;
        if (CONFIG.DEBUG) {console.log('exited vr');};
        self.$store.commit('xr/SET_IN_VR', false);
        self.$refs.avatar.tearDownVR();

        if (AFRAME.utils.device.isMobile()) {
          this.setupMobile();
        }
      },

      setupMobile () {
        if (CONFIG.DEBUG) {console.log("isMobile");};
        this.$refs.avatar.setupMobile();
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
        this.$refs.avatar.setupDesktop();
      },
    }
  }
</script>

<style src="./scene.css"></style>

