export const state = function () {
    return {
        cursorActive: false,
        rightHandControllerActive: false,
    };
}

export const mutations = {
    SET_CURSOR_ACTIVE: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log("SET_CURSOR_ACTIVE")}
        state.cursorActive = active;
    },
    SET_RIGHT_HAND_CONTROLLER_ACTIVE: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log("SET_RIGHT_HAND_CONTROLLER_ACTIVE")}
        state.rightHandControllerActive = active;
    },
};

const avatarModule = {
    namespaced: true,
    state,
    mutations
}

export default avatarModule;
