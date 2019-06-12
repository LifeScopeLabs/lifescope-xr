export const state = function () {
    return {
        floorMapActive: false,
        worldMapActive: false,
        mapLatitude: 34.023552,
        mapLongitude: -118.286189,
    };
};

export const mutations = {
    SET_FLOOR_MAP_ACTIVE: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ACTIVE")}
        console.log('before_FLOOR');
        state.floorMapActive = active;
        console.log('after_FLOOR');
    },
    SET_WORLD_MAP_ACTIVE: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ACTIVE")}
        state.worldMapActive = active;
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
};

const mapModule = {
    namespaced: true,
    state,
    mutations
}

export default mapModule;
