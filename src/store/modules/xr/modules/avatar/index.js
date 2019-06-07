const avatarModule = {
    namespaced: true,

    state: { 
        cursorActive: false,
        rightHandControllerActive: false,
    },

    mutations: {
        SET_CURSOR_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_CURSOR_ACTIVE")}
            state.cursorActive = active;
        },
        SET_RIGHT_HAND_CONTROLLER_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_RIGHT_HAND_CONTROLLER_ACTIVE")}
            state.rightHandControllerActive = active;
        },
     }
  }


export default avatarModule;
