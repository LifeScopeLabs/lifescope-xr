<template>
    <a-entity class="commercial">
       
        <!-- 
            Concast
            Perplexa
                Liam
            Nile
            PayFriend
            Oogler
            Kumquat
            Fakebook
         -->

        <!-- characters -->
        <a-gltf-model v-for="c in characters"
            :key="c.name"
            :id="c.name + '-gltf'"
            :src="avatarURLs[c.name]"
            :position="c.position"
            :rotation="c.rotation"
            :scale="scaleValue(0.02)"
            animate-avatar
            >
        </a-gltf-model>

  </a-entity>
</template>

<script>
import axios from 'axios';

import { mapState } from 'vuex';

import { ModifiedGLTFLoader } from '../../util/loaders/ModifiedGLTFLoader.js';

export default {

    data() {
      return {
          doneloading: false,

        /* Avatar Order
        0 head_female_-_low_poly
        1 head_planar_01
        2 human_head_base_mesh 0.05
        3 low_poly_avatar_head 0.004
        4 low_poly_head 0.15
        5 low_poly_head_with_hair_free_download
        */
       characters: [
            // 'concast': {
            {
                name: 'concast',
                avatarName: 'head_planar_01',
                color: [.9, .15, .2, 1], // red
                position: {x: -4.5, y: 1.5, z:-4},//{x: 2.121, y: 1.5, z: -2.121},
                rotation: {x: 0,  y: 0, z:0},//{x: -0.752, y: 0, z: 0.15},
                scale: .02//.03,
            },
            // 'perplexa': {
            {
                name: 'perplexa',
                avatarName: 'head_female_-_low_poly',
                color: [1,.55,0,1],
                position: {x: -3, y: 1.5, z:-4.33},//{x: 1.268, y: 1.5, z: -2.719},
                rotation: {x: 0,  y: 0, z:0},//{x: -14.26, y: 0, z: 2.852},
                scale: .02,
            },
            // 'liam': 
            {    
                name: 'liam',
                avatarName: 'human_head_base_mesh',
                color: [0.165, 0.757, 0.871, 1], // LifeScope blue #2ac1de
                position: {x: -2.5, y: 2.5, z:-5},
                rotation: {x: 0,  y: 0, z:0},
                scale: .02
            },
            // 'nile': {
            {
                name: 'nile',
                avatarName: 'low_poly_head_with_hair_free_download',
                color: [], // white
                position: {x: -1.5, y: 1.5, z:-4.67},//{x: 0.261, y: 1.5, z: -2.989},
                rotation: {x: 0,  y: 0, z:0},//{x: -12.01, y: 0, z: 2.402},
                scale: .02//.01
            },
            // 'payfriend': 
            {    
                name: 'payfriend',
                avatarName: 'human_head_base_mesh',
                color: [0,.2,.37,1], // dark blue
                position: {x: 0, y: 2.5, z:-5},//{x: -0.776, y: 1.5, z: -3.5},
                rotation: {x: 0,  y: 0, z:0},//{x: -4.249, y: 0, z: 0.85},
                scale: .02//0.05,
            },
            // 'oogler': 
            {
                name: 'oogler',
                avatarName: 'low_poly_avatar_head',
                color: [.6, .3, .6, 1], // purple
                position: {x: 1.5, y: 1.5, z:-4.66},//{x: -1.721, y: 1.5, z: -2.457},
                rotation: {x: 0,  y: 0, z:0},//{x: -2.761, y: 0, z: 0.552},
                scale: .02//0.004,
            },
            // 'kumquat':
            {
                name: 'kumquat',
                avatarName: 'low_poly_head',
                color: [.66, .69, .76, 1], // gray
                position: {x: 3, y: 1.5, z:-4.33},//{x: -3.998, y: 0, z: 0.8},
                rotation: {x: 0,  y: 0, z:0},//{x: -3.998, y: 0, z: 0.8},
                scale: .02//0.15,
            },
            // 'fakebook': 
            {
                name: 'fakebook',
                avatarName: 'head_planar_01',
                color: [.21, .39, .63, 1], // light blue
                position: {x: 4.5, y: 1.5, z:-4},//{x: -2.457, y: 1.5, z: -1.721},
                rotation: {x: 0,  y: 0, z:0},//{x: -3.998, y: 0, z: 0.8},
                scale: .02//.03,
            }
       ],
      }
    },

    computed: {
      gltfurl() { return this.$store.state.xr.commercial.roomName; },
      avatarURLs() { return this.$store.state.xr.commercial.avatarURLs; },
      avatars() { return this.$store.state.xr.avatars; },
    },


    mounted () {
        var self = this;

        for (var c of self.characters) {
            self.loadAvatar(c.name, c.avatarName, c.color);
        }
    },

    methods: {
        loadAvatar: function(name, avatarName, colorArray) {
            var self = this;
            var baseURI = 'https://s3.amazonaws.com/lifescope-static/static/xr/avatars/';
            var manager = THREE.DefaultLoadingManager;

            var loader = new ModifiedGLTFLoader(manager);
            loader.setCachePath(name);
            loader.setColorArray(colorArray);

            loader.load(`${baseURI}${avatarName}/scene.gltf` ,
                function() {
                    // console.log("commercial onLoad");
                    self.$store.commit({ type:'xr/commercial/ADD_AVATARURL',
                        key: name,
                        url: `${name}/scene.gltf`});
                    self.doneloading = true;
                },
                function() { console.log("onProgress")},
                function(e) { console.log("onError"); console.log(e);})
        },

        scaleValue: function(scale) {
            return `${scale} ${scale} ${scale}`;
        },
    }
}
</script>
