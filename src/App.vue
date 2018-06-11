<template>
  <a-scene :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: ' + roomName + '; audio: true; debug: true; adapter: easyrtc; connectOnLoad: true;'">
    <!-- Register Aframe components -->

    <!-- Load assets -->
    <a-assets class="aframe-assets">
      <img id="sky" src="https://s3.amazonaws.com/lifescope-static/xr/gallery/skybox/nightsky.jpg"
      crossorigin="anonymous">

      <img id="floor" src="https://s3.amazonaws.com/lifescope-static/xr/gallery/floor/wood-panel.jpg"
      crossorigin="anonymous">

      <img id="earth" src="https://s3.amazonaws.com/lifescope-static/xr/components/globe/Albedo.jpg"
      crossorigin="anonymous">

      <!-- gltf -->
      <!-- logo -->
      <a-gltf-model id="logo" src="https://s3.amazonaws.com/lifescope-static/xr/logo/logo.gltf"
                    crossorigin="anonymous">
      </a-gltf-model>

      <!-- Load assets with imageLoader -->
      <imageLoader v-for="content in LSObjs"
                :key="'image-loader-' + content.id"
                :lsobj="content"
                :roomConfig='roomConfig'
      />

    </a-assets>

    <!-- Player -->
    <a-entity id="player-rig"
          movement-controls="speed:0.05"
          position="0 0 0">
      <a-entity id="player" camera position="0 1.3 0" wasd-controls="reverseMouseDrag:true" look-controls touch-controls="reverseMouseDrag:true" networked="template:#avatar-template;attachTemplateToLocal:true;">
      </a-entity>
    </a-entity>

    <!-- gallery -->
    <gallery :LSObjs='LSObjs'/>

    <!-- Sky -->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../static/easyrtc/easyrtc.js';

import gallery from "./components/gallery.vue";
import imageLoader from "./components/util/image-loader.vue";


console.log("from App.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
        // fitTexture
    },
    data() {
      return {
        LSObjs: [],
        roomConfig: {},
        roomName: 'ls-room'
      }
    },

    beforeCreate () {
      console.log("beforeCreate")
    },

    created () {
      console.log("created");
    },

    beforeMount () {
      console.log("beforeMount");
    },

    mounted () {
      console.log("mounted");

      //debugger;
      console.log("query data:" + this.$route.query.roomName);



      document.body.addEventListener('connected', function (evt) {
        console.log('connected event. clientId =', evt.detail.clientId);
        document.getElementById('player').setAttribute('visible', 'false');
        console.log(this.roomName);
      });
      
      this.createAvatarTemplate();
      this.addAvatarTemplate();

      this.getRoomConfig().then((res) => {
          console.log("getRoomConfig().then")

          this.roomConfig = res.roomConfig;
          //this.roomName = res.roomConfig.ROOM_NAME;

          this.getObjs().then((res) => {
            this.LSObjs = res.LSObjs;
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

      fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
      }
    }
  }
</script>