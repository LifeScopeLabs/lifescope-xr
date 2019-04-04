import axios from 'axios';
import { StepFunctions } from 'aws-sdk';

const xrModule = {
    namespaced: true,

    state: { 
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        sceneLoaded: false,
        isMobile: false,
        pageStart: 0,
        pageStep: 5,
        numberOfSegments: 36,
        floorMapActive: false,
        worldMapActive: false,
        mapLatitude: 34.023552,
        mapLongitude: -118.286189 },

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
        SET_FLOOR_MAP_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ACTIVE")}
            state.floorMapActive = new Boolean(active);
        },
        SET_WORLD_MAP_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ACTIVE")}
            state.worldMapActive = new Boolean(active);
        },
        SET_MAP_LATITUDE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_MAP_LATITUDE")}
            var num = new Number(val);
            if (num < -90) {num = -90;}
            if (num > 90) {num = 90;}
            state.mapLatitude = num;
        },
        SET_MAP_LONGITUDE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_MAP_LONGITUDE")}
            var num = new Number(val);
            if (num < -180) {num = -180;}
            if (num > 180) {num = 180;}
            state.mapLongitude = num;
        },

        PAGE_LEFT: function(state) {
            if (CONFIG.DEBUG) {console.log("PAGE_LEFT");}
            if (state.pageStart - state.pageStep >= 0) {
                state.pageStart -= state.pageStep;
            }
            else {
                state.pageStart = 0;
            }
        },
        PAGE_RIGHT: function(state) {
            if (CONFIG.DEBUG) {console.log("PAGE_RIGHT");}
            if (state.pageStep + state.pageStart + state.numberOfSegments < state.LSObjs.length) {
                state.pageStart += state.pageStep;
            }
            else {
                state.pageStart = state.LSObjs.length - state.numberOfSegments;
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
                console.log("getObjs action then");
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
