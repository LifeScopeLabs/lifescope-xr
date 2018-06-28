<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ' + roomName + '; audio: true; debug: true; adapter: easyrtc; connectOnLoad: true;'">

    <!-- Register Aframe components -->

    <!-- Load assets -->
    <!-- <a-assets/> -->
    <a-assets class="aframe-assets">
      <img id="sky" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/skybox/nightsky.jpg"
        crossorigin="anonymous">

      <img id="floor" src="https://s3.amazonaws.com/lifescope-static/static/xr/gallery/floor/wood-panel.jpg"
        crossorigin="anonymous">

      <img id="earth" src="https://s3.amazonaws.com/lifescope-static/static/xr/components/globe/Albedo.jpg"
        crossorigin="anonymous">

      <!-- video controls -->
      <img id="video-play" src="https://res.cloudinary.com/dxbh0pppv/image/upload/c_scale,h_512,q_10/v1471016296/play_wvmogo.png"
        crossorigin="anonymous">
      <img id="video-pause" src="https://res.cloudinary.com/dxbh0pppv/image/upload/c_scale,h_512,q_25/v1471016296/pause_ndega5.png"
        crossorigin="anonymous">

      <!-- gltf -->
      <!-- logo -->
      <a-gltf-model id="logo" src="https://s3.amazonaws.com/lifescope-static/static/xr/logo/logo.gltf"
                    crossorigin="anonymous">
      </a-gltf-model>

    </a-assets>

    <!-- gallery -->
    <gallery :LSObjs='LSObjs' :roomConfig='roomConfig'/>

    <!-- Sky id="Sky" -->
    <a-sky src="#sky" rotation="90 0 90">
    </a-sky>

    <!-- Log wall -->
    <!-- <a-entity id="wall-log" class="boundry"
                :geometry="'primitive: plane; width: 8; height: 4'"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;" 
                rotation="0 180 0"
                :position="'0 2 4'">
    </a-entity> -->

    <!-- test Portal -->
    <!-- <a-entity link="href: ?room=video; title: My Homepage;"
      position="0 2 3.9"
      rotation="0 180 0"
    ></a-entity> -->

    <!-- Log text -->
    <!-- <a-entity id="log-text" scale="2 2 1"
                rotation="0 180 0"
                :text="this.textString('Empty Log')"
                position="0 2 3.9"/> -->
    <!-- Test Video "../static/video/VideoOfWomenModelling.mp4" -->
    <!-- <a-video
            src="https://s3.amazonaws.com/lifescope-static/test/content/video/GirlSittingNearTheWindow.mp4"
            rotation="0 180 0"
            position="0 2 3.9"
            width="3"
            src-fit>
    </a-video> -->
    <!-- <a-entity
            rotation="0 180 0"
            position="0 2 3.9"
            src="../static/video/VideoOfWomenModelling.mp4">
    </a-entity> -->
    <!-- src="../static/video/VideoOfWomenModelling.mp4" -->

  </a-scene>
</template>

<script>
import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";
import objectLoader from "./components/util/object-loader.vue";


console.log("from App.vue <script>")
export default {
    components: {
        gallery,
        objectLoader
    },
    data() {
      return {
        LSObjs: [],
        roomConfig: {},
        roomName: 'ls-room'
      }
    },


    mounted () {
      // Add hand when user enters vr mode
      var self = this;
      document.body.addEventListener('enter-vr', function (evt) {
        console.log('entered vr');
        console.log('adding hand...');
        self.createRightHand();
      });


      // document.body.addEventListener('teleportstart', function (evt) {
      //   console.log('teleportstart');
      //   self.toggleEarthOff();
      // });
      // document.body.addEventListener('teleportend', function (evt) {
      //   console.log('teleportend');
      //   self.toggleEarthOn();
      // });
      // document.body.addEventListener('trackpaddown', function (evt) {
      //   console.log('trackpaddown');
      //   //self.toggleEarthOff();
      // });
      // document.body.addEventListener('trackpadup', function (evt) {
      //   console.log('trackpadup');
      //   //self.toggleEarthOn();
      // });

      // Set eyes to invisible when room connects
      document.body.addEventListener('connected', function (evt) {
        console.log('connected event. clientId =', evt.detail.clientId);
        document.getElementById('face').setAttribute('visible', 'false');
        document.getElementById('head').setAttribute('visible', 'false');
        document.getElementById('cursor').setAttribute('visible', 'true');
        console.log('roomName: ' + this.roomName);
      });
      

      this.getRoomConfig().then((res) => {
          console.log("getRoomConfig().then")

          this.roomConfig = res.roomConfig;
          //this.roomName = res.roomConfig.ROOM_NAME;

          this.getObjs().then((res) => {
            this.LSObjs = res.LSObjs;
            this.createAvatarTemplate();
            this.addAvatarTemplate();
            this.createPlayer();
            }
          );
        }
      );



      this.$nextTick(function () {
          // Code that will run only after the
          // entire view has been rendered
          console.log("mounted nextTick")
          // DO NOT DELETE
          // document.querySelector('a-scene').addEventListener('loaded', function () {
          //    console.log("aframe ready");
          //   AFRAME.scenes[0].emit('connect');
          //   console.log("connect ready");
          // });
          // END DO NOT DELETE
          
        })
    },


    methods: {
      textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
      },
      logText: function (value) {
        var logtext = document.getElementById('log-text');
        logtext.setAttribute('text', this.textString(value));
      },
      
      getRoomConfig () {
        console.log("getRoomConfig");
        return axios.get("/roomconfig")
        .then((res) => {
          console.log(res.data);
          return {roomConfig: res.data}
        })
      },

      getObjs () {
        console.log("getObjs");
        
        var x = '/' + this.roomConfig.BUCKET_PATH;

        if (!this.$route.query.room){
          this.$route.query.room = 'ls-room';
        }

        this.roomName = this.$route.query.room || 'ls-room';

        console.log(x);
        return axios.get(x)
        .then((res) => {
          //console.log("getObjs: axios.get.then");
          var result = [];
          console.log(res.data);
          var someData = res.data[this.roomName].forEach(element => {
            result.push(element);
          });
          return { LSObjs: result }
        })
      },

      createAvatarTemplate() {
        var frag = this.fragmentFromString(`
        <template id="avatar-template" v-pre>
          <a-entity class="avatar" networked-audio-source>
            <a-sphere id="head"
              color="#5985ff"
              scale="0.45 0.5 0.4"
            ></a-sphere>
            <a-entity id="face"
              position="0 0.05 0"
            >
              <a-sphere class="eye"
                color="#efefef"
                position="0.16 0.1 -0.35"
                scale="0.12 0.12 0.12"
              >
                <a-sphere class="pupil"
                  color="#000"
                  position="0 0 -1"
                  scale="0.2 0.2 0.2"
                ></a-sphere>
              </a-sphere>
              <a-sphere class="eye"
                color="#efefef"
                position="-0.16 0.1 -0.35"
                scale="0.12 0.12 0.12"
              >
                <a-sphere class="pupil"
                  color="#000"
                  position="0 0 -1"
                  scale="0.2 0.2 0.2"
                ></a-sphere>
              </a-sphere>
            </a-entity>
          </a-entity>
        </template> 
        `);

        document.getElementsByClassName('aframe-assets')[0].appendChild(frag);

      },

      addAvatarTemplate() {
        console.log("addAvatarTemplate");
        NAF.schemas.add({
          template: '#avatar-template',
          components: [
            'position',
            'rotation',
            {
              selector: '.head',
              component: 'material',
              property: 'color'
            }
          ]
       });
      },

      
      // 
      createPlayer() {
        var frag = this.fragmentFromString(`
        <a-entity id="playerRig"
          position="0 0 0"
          >
          <a-entity id="player" camera position="0 1.3 0" wasd-controls="reverseMouseDrag:true" look-controls networked="template:#avatar-template;attachTemplateToLocal:true;">
            <a-entity id="cursor"
                cursor="fuse: true; fuseTimeout: 500"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                material="color: black; shader: flat">
              </a-entity>
          </a-entity>
        </a-entity>`);
        document.getElementsByTagName('a-scene')[0].appendChild(frag);
      },

      //  
      createRightHand() {
        var frag = this.fragmentFromString(`
        <a-entity id="rightHand"
            teleport-controls="cameraRig: #playerRig; teleportOrigin: #player; startEvents: teleportstart; endEvents: teleportend; collisionEntities:.boundry; landingNormal: 0 0 1;"
            daydream-controls="hand: right;"
            oculus-touch-controls="hand: right"
            vive-controls="hand: right"
            windows-motion-controls="hand: right"
            gearvr-controls="hand: right"
            oculus-go-controls="hand: right">
         </a-entity>`);
        document.getElementById('playerRig').appendChild(frag);
      },

      fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
      },

      toggleEarthOn() {
        document.getElementById('Earth').setAttribute('visible', 'true');
      },
      toggleEarthOff() {
        document.getElementById('Earth').setAttribute('visible', 'false');
      }

    }
  }
</script>