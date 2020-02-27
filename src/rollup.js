import XRApp from './App.vue';
import xrModule from './store/modules/xr/index.js';
import { AppTypeEnum } from './store/modules/xr/index.js';
import { registerAframeComponents } from './components/aframe/index.js';
import setupFontAwesome from './util/setupFontAwesome.js';
import registerAframeInput from './controls/registerAframeInput.js';

async function xrPluginStore ({ store }) {
    const opts = {}
    opts.preserveState = false;
    store.registerModule('xr', xrModule, opts);
};

function install(Vue) {
    if (install.installed) return;
    install.installed = true;
        
    registerAframeComponents();
    setupFontAwesome();
    registerAframeInput();
    Vue.component('xr-app', XRApp);

    // ignore elements for Firefox
    // core elements
    ['a-scene', 'a-assets', 'a-entity', 'xr-app'].forEach((val,index) => {Vue.config.ignoredElements.push(val)});
    // primitives
    Object.keys(AFRAME.primitives.primitives).forEach(function(key,index) {
    Vue.config.ignoredElements.push(key);
    });
}

const xrPlugin = {
    install,
}

export { xrPlugin, xrPluginStore, AppTypeEnum };