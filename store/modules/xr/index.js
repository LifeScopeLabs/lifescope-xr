import axios from 'axios';

import graphicsModule from './modules/graphics';
import carouselModule from './modules/carousel';
import commercialModule from './modules/commercial';

const xrModule = {
    namespaced: true,

    modules: {
        graphics: graphicsModule,
        carousel: carouselModule,
        commercial: commercialModule
    },

    state: { 
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        avatars: [],
        sceneLoaded: false,
        isMobile: false,
     },

    mutations: {
        SET_LSOBJS: function(state, objs) {
            if (CONFIG.DEBUG) {console.log('SET_LSOBJS');}
            state.LSObjs = objs;
            state.LSObjsLoaded = true;
        },
        SET_ROOMS: function(state, rooms) {
            if (CONFIG.DEBUG) {console.log('SET_ROOMS');}
            state.rooms = rooms;
        },
        SET_ROOMCONFIG: function(state, roomConfig) {
            if (CONFIG.DEBUG) {console.log('SET_ROOMCONFIG');}
            state.roomConfig = roomConfig;
        },
        SET_ROOMNAME: function(state, name) {
            if (CONFIG.DEBUG) {console.log('SET_ROOMNAME');}
            state.roomName = name;
        },
        SET_AVATARS: function(state, objs) {
            if (CONFIG.DEBUG) {console.log('SET_AVATARS');}
            state.avatars = objs;
            for (var avatar of objs) {
                console.log(avatar.name);
            }
        },
        SET_SCENELOADED: function(state) {
            if (CONFIG.DEBUG) {console.log('SET_SCENELOADED');}
            if (AFRAME == undefined) {
                state.sceneLoaded = false;
            }
            else {
                var scene = AFRAME.scenes[0];
                state.sceneLoaded = scene == undefined ? false : scene.hasLoaded;
            }
        },
        SET_ISMOBILE: function(state) {
            if (CONFIG.DEBUG) {console.log('SET_ISMOBILE');}
            if (AFRAME == undefined) {
                console.log("Cannto call SET_ISMOBILE before AFRAME is loaded");
            }
            else {
                state.isMobile = AFRAME.utils.device.isMobile();
            }
        },
     },
    actions: {
        setRoomName (context, name) {
            if (CONFIG.DEBUG) {console.log(`setRoomName(${name})`);};
            context.commit('SET_ROOMNAME', name);
        },

        getRoomConfig ({ commit }) {
            if (CONFIG.DEBUG) {console.log("getRoomConfig action");};
            return axios.get("/roomconfig")
            .then((res) => {
                commit('SET_ROOMCONFIG', res.data);
            })
        },

        getAvatars ({ commit }) {
            if (CONFIG.DEBUG) {console.log("getAvatars action");};
            return axios.get("/avatars")
            .then((res) => {
                commit('SET_AVATARS', res.data);
            })
        },

        getObjs (context) {
            if (CONFIG.DEBUG) {console.log("getObjs action");};

            var x = '/' + context.state.roomConfig.BUCKET_PATH;
    
            // context.commit('SET_ROOMNAME', 'ls-room');
    
            return axios.get(x)
            .then((res) => {
                if (CONFIG.DEBUG) {console.log("getObjs action then");};
                var objs = [];
                var rooms = Object.keys(res.data);
                var someData = res.data[context.state.roomName].forEach(element => {
                    objs.push(element);
                });
                context.commit('SET_LSOBJS', objs);
                context.commit('SET_ROOMS', rooms);
            })
          }
     }
  }

export default xrModule;
