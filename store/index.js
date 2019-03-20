import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const store = () => new Vuex.Store({
	state: {
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        isMobile: false,
        browser: '',
	},

	getters: {
	},

	mutations: {
        SET_LSOBJS: function(state, objs) {
            console.log('SET_LSOBJS');
            state.LSObjs = objs;
            state.LSObjsLoaded = true;
        },
        SET_ROOMS: function(state, rooms) {
            console.log('SET_ROOMS');
            state.rooms = rooms;
        },
        SET_ROOMCONFIG: function(state, roomConfig) {
            console.log('SET_ROOMCONFIG');
            state.roomConfig = roomConfig;
        },
        SET_ROOMNAME: function(state, name) {
            console.log('SET_ROOMNAME');
            state.roomName = name;
        }
	},

	actions: {

        setRoomName (context, name) {
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
});

export default store;
