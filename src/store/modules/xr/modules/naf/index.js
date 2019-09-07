export const state = function () {
    return {
        numberOfPlayers: 1,
        players: []
    };
};

export const mutations = {
    INCREMENT_PLAYERS: function(state,) {
        if (CONFIG.DEBUG) {console.log("INCREMENT_PLAYERS");}
        state.numberOfPlayers += 1;
    },
    DECREMENT_PLAYERS: function(state,) {
        if (CONFIG.DEBUG) {console.log("DECREMENT_PLAYERS");}
        if (state.numberOfPlayers > 1) {
            state.numberOfPlayers -= 1;
        }
    },
};

const nafModule = {
    namespaced: true,
    state,
    mutations
}

export default nafModule;
