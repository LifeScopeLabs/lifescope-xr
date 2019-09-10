export const state = function () {
    return {
        page: 0,
        rows: 4,
        columns: 5,
        radius: 4,
        top: 1,
        bottom: -0.7,
        cellWidth: 0.6
     };
};

export const getters = {
    itemsPerPage: (state) => {
        return state.rows * state.columns;
    }
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
};

const gridModule = {
    namespaced: true,
    state,
    getters,
    mutations,
}

export default gridModule;
