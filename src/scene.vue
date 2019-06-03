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

    <avatarcomp ref="avatar"/>

    <hudgui id="scenehud" v-if="hudhelpactive"/>
    <vrhudsettings id="scenesettingshud" v-if="hudsettingsactive"/>

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
import hudgui from "./components/hud/hudgui.vue";
import vrhudsettings from "./components/hud/vr/settings.vue";

import Avatar from "./avatar.js";
import avatarcomp from "./avatar.vue";

import { SkyboxEnum } from './store/modules/xr/modules/graphics';

export default {
    components: {
        gallery,
        avatarcomp,
        hudgui,
        vrhudsettings
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
        ['roomName']
      ),

      ...mapState('xr/graphics',
        [
          'skybox',
          'skytime'
        ]
      )
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

      document.body.addEventListener('keypress', function(evt) {
            if (evt.key == 'h') {
                self.toggleHudHelp();
            }
            else if (evt.key == 'g') {
                self.toggleHudSettings();
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

      if (!self.$route.query.room){
          self.$route.query.room = 'ls-room';
      }
          
      var queryRoom = this.$route.query.room || 'ls-room';

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
        this.$refs.avatar.createRightHandNetworked();
        this.$refs.avatar.setupControls();
        var playerRig = document.querySelector('#playerRig');
        playerRig.setAttribute('position', 'y', 0.2);

        if (AFRAME.utils.device.isMobile()) {
              this.teardownMobile();
        }
      },
      onExitVR () {
        if (CONFIG.DEBUG) {console.log('exited vr');};
        var rightHand = document.getElementById('rightHandController');
        if (rightHand) {
          rightHand.parentElement.removeChild(rightHand);
        }
        var playerRig = document.querySelector('#playerRig');
        playerRig.setAttribute('position', 'y', 1.6);

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

      toggleHudHelp () {
        var self = this;
        if (self.hudhelpactive) {
          self.hudhelpactive = false;
        }
        else {
          self.updateHudPosition('#scenehud');
          self.hudhelpactive = true;
        }
      },

      toggleHudSettings () {
        var self = this;
        if (self.hudsettingsactive) {
          self.hudsettingsactive = false;
        }
        else {
          self.updateHudPosition('#scenesettingshud');
          self.hudsettingsactive = true;
        }
      },

      updateHudPosition(selector) {
        var posentity = document.createElement('a-entity');
        posentity.setAttribute('id', 'posent');
        posentity.setAttribute('position', {x: 0, y: 0, z: -1});

        var playerRig = document.getElementById('playerRig')
        playerRig.appendChild(posentity);

        var posEntity = document.querySelector('#posent');
        var hud;
        var position, rotation;
        var loadedHandler = function() {
            console.log('posEntity loaded');
            position = posEntity.object3D.getWorldPosition();
            rotation = playerRig.object3D.rotation;
            console.log(position);
            posEntity.parentElement.removeChild(posEntity);
            hud = document.querySelector(selector);
            posEntity.removeEventListener('loaded', loadedHandler);
            hud.object3D.position.set(position.x, position.y, position.z);
            hud.object3D.rotation.set(0, rotation.y, 0);
        }
        posEntity.addEventListener('loaded', loadedHandler)
      }
      
    }
  }
</script>

<style src="./scene.css"></style>

