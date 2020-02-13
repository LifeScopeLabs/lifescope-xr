import axios from 'axios';

import avatarModule from './modules/avatar/index.js';
import carouselModule from './modules/carousel/index.js';
import chatModule from './modules/chat/index.js';
import controlsModule from './modules/controls/index.js';
import hudModule from './modules/hud/index.js';
import graphicsModule from './modules/graphics/index.js';
import mapModule from './modules/map/index.js';
import nafModule from './modules/naf/index.js';
import gridModule from './modules/grid/index.js';
import styleModule from './modules/style/index.js';

const AppTypeEnum = Object.freeze({
    XR: 1,
    APP: 2
});


const SceneLayoutEnum = Object.freeze({
    GALLERY: 1,
    GRID: 2
});

export const modules = {
        avatar: avatarModule,
        carousel: carouselModule,
        chat: chatModule,
        controls: controlsModule,
        graphics: graphicsModule,
        hud: hudModule,
        map: mapModule,
        naf: nafModule,
        grid: gridModule,
        style: styleModule,
};

export const state = function () {
    return {
        AppType: AppTypeEnum.XR,
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        sceneLoaded: false,
        isMobile: false,
        inVR: false,
        sceneLayout: SceneLayoutEnum.GRID,
    }
};

export const getters = {
    totalItems: (state, getters, rootState, rootGetters) => {
        if (state.AppType == AppTypeEnum.XR) {
            return state.LSObjs.length;
        }
        else {
            switch (rootState.facet) {
                case 'content':
                    return getters.LS_CONTENT.length;
                case 'events':
                    return getters.LS_EVENTS.length;
                case 'contacts':
                    return getters.LS_CONTACTS.length;
                case 'people':
                    return getters.LS_PEOPLE.length;
                default:
                    return 0;
            }
        }
    },
    LS_CONTENT: (state, getters, rootState, rootGetters) => {
        if (state.AppType != AppTypeEnum.APP) return [];
        return rootState.objects.content;
    },
    LS_EVENTS: (state, getters, rootState, rootGetters) => {
        if (state.AppType != AppTypeEnum.APP) return [];
        var events = rootState.objects.events;
        var items = [];
        events.forEach(event => {
            var obj = {};
            obj.datetime = event.datetime;
            obj.eventtype = event.type;
            obj.connection = event.connection;
            obj.hydratedLocation = event.hydratedLocation;
            obj.location = event.location;
            event.content.forEach(content => {
                items.push({ ...obj, content: content });
            });
        });
        return items;
    },
    LS_CONTACTS: (state, getters, rootState, rootGetters) => {
        if (state.AppType != AppTypeEnum.APP) return [];
        rootState.objects.contacts.forEach(contact => {
            // console.log(contact);
        });

        return rootState.objects.contacts;
    },
    LS_PEOPLE: (state, getters, rootState, rootGetters) => {
        if (state.AppType != AppTypeEnum.APP) return [];
        rootState.objects.people.forEach(person => {
            // console.log(person);
        });

        return rootState.objects.people;
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
        SET_APPTYPE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_APPTYPE");}
            if (AppTypeEnum.hasOwnProperty(val)) {
                state.AppType = AppTypeEnum[val];
            }
            else {
                console.log(`cannot set AppType, ${val} is not a AppTypeEnum`);
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

export { AppTypeEnum, SceneLayoutEnum };
export default xrModule;
