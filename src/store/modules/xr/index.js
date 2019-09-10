import axios from 'axios';

import avatarModule from './modules/avatar';
import carouselModule from './modules/carousel';
import chatModule from './modules/chat';
import hudModule from './modules/hud';
import graphicsModule from './modules/graphics';
import mapModule from './modules/map';
import nafModule from './modules/naf';
import gridModule from './modules/grid';

const SceneLayoutEnum = Object.freeze({
    GALLERY: 1,
    GRID: 2
});


export const modules = {
        avatar: avatarModule,
        carousel: carouselModule,
        chat: chatModule,
        graphics: graphicsModule,
        hud: hudModule,
        map: mapModule,
        naf: nafModule,
        grid: gridModule
};

export const state = function () {
    return {
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        sceneLoaded: false,
        isMobile: false,
        inVR: false,
        sceneLayout: SceneLayoutEnum.GALLERY,
    }
};

export const getters = {
    totalItems: (state) => {
        return state.LSObjs.length;
    }
};

export const mutations = {
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
        SET_LAYOUT: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_LAYOUT");}
            if (SceneLayoutEnum.hasOwnProperty(val)) {
                state.sceneLayout = SceneLayoutEnum[val];
            }
            else {
                console.log(`cannot set sceneLayout, ${val} is not a SceneLayoutEnum`);
            }
        },
};
export const actions = {
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
            .catch(function (error) {
                console.log('getRoomConfig error');
                console.log(error);
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
                console.log('getObs error');
                console.log(error);
            })
        }
};

const xrModule = {
    namespaced: true,
    modules,
    state,
    getters,
    mutations,
    actions
};

export { SceneLayoutEnum };
export default xrModule;
