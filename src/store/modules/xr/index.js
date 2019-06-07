import axios from 'axios';

import avatarModule from './modules/avatar';
import carouselModule from './modules/carousel';
import graphicsModule from './modules/graphics';

const xrModule = {
    namespaced: true,

    modules: {
        avatar: avatarModule,
        carousel: carouselModule,
        graphics: graphicsModule,
    },

    state: { 
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        sceneLoaded: false,
        isMobile: false,
        inVR: false
     },

    mutations: {
        SET_IN_VR: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_IN_VR")}
            state.inVR = active;
        },
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

        getObjs (context) {
            if (CONFIG.DEBUG) {console.log("getObjs action");};

            var x = '/' + context.state.roomConfig.BUCKET_PATH;
    
            // context.commit('SET_ROOMNAME', 'ls-room');
    
            return axios.get(x)
            .then((res) => {
                var objs = [];
                var rooms = Object.keys(res.data);
                if (res.data[context.state.roomName] !== undefined) {
                    var someData = res.data[context.state.roomName].forEach(element => {
                        objs.push(element);
                    });
                }
                context.commit('SET_LSOBJS', objs);
                context.commit('SET_ROOMS', rooms);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
          }
     }
  }

export default xrModule;
