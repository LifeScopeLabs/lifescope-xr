import Vue from 'vue';

const commercialModule = {
    namespaced: true,

    state: {
        isCommercial: true,
        avatarURLs: {}
     },

    mutations: {
        ADD_AVATARURL: function(state, payload) {
            Vue.set(state.avatarURLs, payload.key, payload.url);
        }
     },

     getters: {
        getAvatarURL: (state) => (key) => {
            return state.avatarURLs[ key ];
        }
     }
  }

export default commercialModule;
