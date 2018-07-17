<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ls-room; audio: true; debug: true; adapter: easyrtc; connectOnLoad: true;'">

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
    <gallery :LSObjs='LSObjs' :rooms='rooms' :roomConfig='roomConfig'/>

    <!-- Sky id="Sky" -->
    <a-sky src="#sky" rotation="90 0 90">
    </a-sky>

    <!-- Log wall -->
    <!-- <a-entity id="wall-log" class="boundry"
                :geometry="'primitive: plane; width: 8; height: 4'"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;" 
                rotation="0 180 0"
                :position="'0 2 4'">

            <a-gui-flex-container 
              flex-direction="column" justify-content="center" align-items="normal" component-padding="0.1" 
              opacity="0.7" width="3.5" height="4.5"
              position="0 0 0" rotation="0 0 0"
            >

                <a-gui-button 
                  width="2.5" height="0.75"
                  onclick="testButtonAction" key-code="32"
                  value="test button"
                  font-family="Arial"
                  margin="0 0 0.05 0"
                >
                </a-gui-button>

		          </a-gui-flex-container>
          
    </a-entity> -->


  </a-scene>
</template>

<script>
import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";
import objectLoader from "./components/util/object-loader.vue";


if (CONFIG.DEBUG) {console.log("from App.vue <script>");}
export default {
    components: {
        gallery,
        objectLoader
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

      if (CONFIG.DEBUG) {
        // aframe events
        document.body.addEventListener('hitend', function (evt) {
          console.log('hitend');
        });
        document.body.addEventListener('hit', function (evt) {
          console.log('hit');
        });
        document.body.addEventListener('grabend', function (evt) {
          console.log('grabend');
        });
        document.body.addEventListener('pulse', function (evt) {
          console.log('pulse');
        });
        document.body.addEventListener('model-loaded', function (evt) {
          console.log('model-loaded');
        });
        document.body.addEventListener('model-error', function (evt) {
          console.log('model-error');
        });
        document.body.addEventListener('sound-loaded', function (evt) {
          console.log('sound-loaded');
        });
        document.body.addEventListener('textfontset', function (evt) {
          console.log('textfontset');
        });
        document.body.addEventListener('animationend', function (evt) {
          console.log('animationend');
        });
        document.body.addEventListener('animationstart', function (evt) {
          console.log('animationstart');
        });
        document.body.addEventListener('animationstop', function (evt) {
          console.log('animationstop');
        });
        document.body.addEventListener('loaded', function (evt) {
          console.log('loaded');
        });
        document.body.addEventListener('timeout', function (evt) {
          console.log('timeout');
        });
        document.body.addEventListener('progress', function (evt) {
          console.log('progress');
        });
        document.body.addEventListener('error', function (evt) {
          console.log('error');
        });
        document.body.addEventListener('object3dset', function (evt) {
          console.log('object3dset');
        });
        document.body.addEventListener('object3dremove', function (evt) {
          console.log('object3dremove');
        });
        document.body.addEventListener('child-attached', function (evt) {
          console.log('child-attached');
        });
        document.body.addEventListener('child-detached', function (evt) {
          console.log('child-detached');
        });
        document.body.addEventListener('componentremoved', function (evt) {
          console.log('componentremoved');
        });
        document.body.addEventListener('play', function (evt) {
          console.log('play');
        });
        document.body.addEventListener('pause', function (evt) {
          console.log('pause');
        });
        document.body.addEventListener('stateadded', function (evt) {
          console.log('stateadded');
        });
        document.body.addEventListener('stateremoved', function (evt) {
          console.log('stateremoved');
        });
        document.body.addEventListener('nodeready', function (evt) {
          console.log('nodeready');
        });
        document.body.addEventListener('componentchanged', function (evt) {
          console.log('componentchanged');
        });
        document.body.addEventListener('componentinitialized', function (evt) {
          console.log('componentinitialized');
        });
        document.body.addEventListener('schemachanged', function (evt) {
          console.log('schemachanged');
        });
        document.body.addEventListener('enter-vr', function (evt) {
          console.log('enter-vr');
        });
        document.body.addEventListener('exit-vr', function (evt) {
          console.log('exit-vr');
        });
        document.body.addEventListener('renderstart', function (evt) {
          console.log('renderstart');
        });
        document.body.addEventListener('render-target-loaded', function (evt) {
          console.log('render-target-loaded');
        });
        document.body.addEventListener('camera-ready', function (evt) {
          console.log('camera-ready');
        });
        document.body.addEventListener('camera-set-active', function (evt) {
          console.log('camera-set-active');
        });
        document.body.addEventListener('camera-set-spectator', function (evt) {
          console.log('camera-set-spectator');
        });
        document.body.addEventListener('controllersupdated', function (evt) {
          console.log('controllersupdated');
        });
        document.body.addEventListener('materialtextureloaded', function (evt) {
          console.log('materialtextureloaded');
        });
        document.body.addEventListener('materialvideoloadeddata', function (evt) {
          console.log('materialvideoloadeddata');
        });
        document.body.addEventListener('materialvideoended', function (evt) {
          console.log('materialvideoended');
        });
        document.body.addEventListener('controllerconnected', function (evt) {
          console.log('controllerconnected');
        });
        document.body.addEventListener('controllerdisconnected', function (evt) {
          console.log('controllerdisconnected');
        });

        // networked aframe hooks
        document.body.addEventListener('clientConnected', function (evt) {
          console.log('clientConnected');
        });
        document.body.addEventListener('clientDisconnected', function (evt) {
          console.log('clientDisconnected');
        });
        document.body.addEventListener('entityCreated', function (evt) {
          console.log('entityCreated');
        });
        document.body.addEventListener('entityDeleted', function (evt) {
          console.log('entityDeleted');
        });
        document.body.addEventListener('ownership-gained', function (evt) {
          console.log('ownership-gained');
        });
        document.body.addEventListener('ownership-lost', function (evt) {
          console.log('ownership-lost');
        });
        document.body.addEventListener('ownership-changed', function (evt) {
          console.log('ownership-changed');
        });

      }
      
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


      // Set eyes to invisible when room connects
      document.body.addEventListener('connected', function (evt) {
        if (CONFIG.DEBUG) {console.log('connected event. clientId =', evt.detail.clientId);};
        
        document.getElementsByClassName('player')[0].getElementsByClassName('face')[0].setAttribute('visible', 'false');
        document.getElementsByClassName('player')[0].getElementsByClassName('head')[0].setAttribute('visible', 'false');
      
        if (CONFIG.DEBUG) {console.log('roomName: ' + self.roomName);};
      });
      

      this.getRoomConfig().then((res) => {
          if (CONFIG.DEBUG) {console.log("getRoomConfig().then")};

          this.roomConfig = res.roomConfig;
          //this.roomName = res.roomConfig.ROOM_NAME;

          this.getObjs().then((res) => {
            this.LSObjs = res.LSObjs;
            this.rooms = res.rooms;

            this.createAvatarRigTemplate();
            this.addAvatarRigTemplate();
            this.createNetworkedPlayer();
            }
          );
        }
      );
    },


    methods: {
      textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
      },
      logText: function (value) {
        var logtext = document.getElementById('log-text');
        logtext.setAttribute('text', this.textString(value));
      },
      testButtonAction: function () {
        if (CONFIG.DEBUG) {console.log("testButtonAction");};
      },
      
      getRoomConfig () {
        if (CONFIG.DEBUG) {console.log("getRoomConfig");};
        return axios.get("/roomconfig")
        .then((res) => {
          //console.log(res.data);
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

      createAvatarRigTemplate() {
        var frag = this.fragmentFromString(`
        <template id="avatar-rig-template" v-pre>
          <a-entity class="player">

            <a-entity class="avatar" networked-audio-source >
              <a-sphere class="head"
                color="#5985ff"
                scale="0.45 0.5 0.4"
              ></a-sphere>
              <a-entity class="face"
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
                <a-sphere class="eye dev"
                  color="#efefef"
                  position="0 0.1 0.35"
                  scale="0.12 0.12 0.12"
                >
                  <a-sphere class="pupil dev"
                    color="#000"
                    position="0 0 1"
                    scale="0.2 0.2 0.2"
                  ></a-sphere>
                </a-sphere>
              </a-entity>
            </a-entity>

          </a-entity>
        </template> 
        `);

        document.getElementsByClassName('aframe-assets')[0].appendChild(frag);

      },

      addAvatarRigTemplate() {
        if (CONFIG.DEBUG) {console.log("addAvatarRigTemplate");};
        NAF.schemas.add({
          template: '#avatar-rig-template',
          components: [
            {
              component: 'position'
            },
            {
              component: 'rotation'
            },
            {
              selector: '.avatar',
              component: 'rotation'
            }
          ]
       });
      },


          // <a-entity id="cursor"
          //       cursor="fuse: true; fuseTimeout: 500"
          //       position="0 0 -1"
          //       geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
          //       material="color: black; shader: flat">
          //     </a-entity>
      createNetworkedPlayer() {
        var frag = this.fragmentFromString(`
        <a-entity id="playerRig"
          position="0 1.6 0"
          wasd-controls
          look-controls="reverseMouseDrag:true"
          networked="template:#avatar-rig-template;attachTemplateToLocal:true;"
          avatar-rig="camera:#player-camera;"
          >
         
         <a-entity id="player-camera"
            class="camera"
            camera
            
          >
          
          <a-gui-cursor id="cursor"
					  raycaster="interval: 1000; objects: [gui-interactable]"
					  fuse="true" fuse-timeout="2000"
					  design="dot"
			      >
			    </a-gui-cursor>
          
          </a-entity>
          <a-entity id="rightHandRig"
            class="hand"
          ></a-entity>
        </a-entity>`);
        document.getElementsByTagName('a-scene')[0].appendChild(frag);
      },


      createRightHandNetworked() {
        var frag = this.fragmentFromString(`
        <a-entity id="rightHandController"
           teleport-controls="cameraRig: #playerRig; teleportOrigin: #player-camera; startEvents: teleportstart; endEvents: teleportend; collisionEntities:.boundry; landingNormal: 0 0 1;"
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

    }
  }
</script>