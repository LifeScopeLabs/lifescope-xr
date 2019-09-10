export const state = function () {
    return {
        page: 0,
        rows: 4,
        columns: 5,
        radius: 4,
        top: 1,
        bottom: -0.7,
        cellWidth: 0.6,
        arrowWidth: 0.2,
        arrowHeight: 0.3
     };
};

export const getters = {
    itemsPerPage: (state) => {
        return state.rows * state.columns;
    },
    canPageLeft: (state) => {
        return !!state.page;
    },
    canPageRight: (state, getters, rootState, rootGetters) => {
        if (getters.itemsPerPage >= rootGetters['xr/totalItems']) {
            return false;
        }
        var result = (state.page+1)*getters.itemsPerPage <= rootGetters['xr/totalItems'];
        return result;
    },
};

export const mutations = {
    PAGE_LEFT: function(state) {
        if (CONFIG.DEBUG) {console.log("PAGE_LEFT");}
        if (state.page >= 1) {
            state.page -= 1;
        }
        else {
            state.page = 0;
        }
    },
    PAGE_RIGHT: function(state) {
        if (CONFIG.DEBUG) {console.log("PAGE_RIGHT");}
        state.page += 1;
    },
};

export const actions = {
    pageRight: function(context) {
        if (CONFIG.DEBUG) {console.log("pageRight");}
        if (context.getters.canPageRight) {
            context.commit('PAGE_RIGHT');
        }
    },
    pageLeft: function(context) {
        if (CONFIG.DEBUG) {console.log("pageLeft");}
        if (context.getters.canPageLeft) {
            context.commit('PAGE_LEFT');
        }
    },
    
}

const gridModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}

export default gridModule;
