const SkyboxEnum = Object.freeze({
    STARS: 1,
    SUN: 2
});

const GraphicsQualityEnum = Object.freeze({
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
});

const ShadingEnum = Object.freeze({
    DEFAULT: 1,
    CEL: 2,
});

export const state = function () {
    return {
        skybox: SkyboxEnum.STARS,
        skytime: 11, // 24 hours
        bump: false,
        normal: false,
        quality: GraphicsQualityEnum.HIGH,
        shading: ShadingEnum.DEFAULT
    };
};

export const mutations = {
    SET_SKYBOX: function(state, val) {
        if (CONFIG.DEBUG) {console.log("SET_SKYBOX");}
        if (SkyboxEnum.hasOwnProperty(val)) {
            state.skybox = SkyboxEnum[val];
        }
        else {
            console.log(`cannot set skybox, ${val} is not a SkyboxEnum`);
        }
    },
    SET_QUALITY: function(state, val) {
        if (CONFIG.DEBUG) {console.log("SET_QUALITY");}
        if (GraphicsQualityEnum.hasOwnProperty(val)) {
            state.quality = GraphicsQualityEnum[val];
        }
        else {
            console.log(`cannot set quality, ${val} is not a GraphicsQualityEnum`);
        }
    },
    SET_SHADING: function(state, val) {
        if (CONFIG.DEBUG) {console.log("SET_SHADING");}
        console.log(val);
        if (ShadingEnum.hasOwnProperty(val)) {
            state.shading = ShadingEnum[val];
        }
        else {
            console.log(`cannot set shading, ${val} is not a ShadingEnum`);
        }
    },
    SET_BUMP: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log(`SET_BUMP: ${active}`)}
        state.bump = active ? true : false;
    },
    SET_NORMAL: function(state, active=true) {
        if (CONFIG.DEBUG) {console.log(`SET_NORMAL: ${active}`)}
        state.normal = active ? true : false;
    },
};

const graphicsModule = {
    namespaced: true,
    state,
    mutations
}

export { SkyboxEnum, GraphicsQualityEnum, ShadingEnum };
export default graphicsModule;
