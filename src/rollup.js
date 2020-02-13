import XRApp from './App.vue';
import xrModule from './store/modules/xr/index.js';
import { AppTypeEnum } from './store/modules/xr/index.js';
import { registerAframeComponents } from './components/aframe/index.js';
import setupFontAwesome from './util/setupFontAwesome.js';
import registerAframeInput from './controls/registerAframeInput.js';

export { XRApp, xrModule, AppTypeEnum, registerAframeComponents, setupFontAwesome, registerAframeInput };