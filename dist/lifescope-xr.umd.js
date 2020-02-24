(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vuex'), require('axios'), require('moment')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vuex', 'axios', 'moment'], factory) :
    (global = global || self, factory(global['lifescope-xr'] = {}, global.vuex, global.axios, global.moment));
}(this, (function (exports, vuex, axios, moment) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
    moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;

    class TimeUtils {

        static timeStringFromNumber(timeNum) {
            var hours = this.getTimeHours(timeNum);
            var minutes = this.getTimeMinutes(timeNum);
            var minutesStr = minutes.toString().padStart(2, '0');
            var timeStr = `${hours}:${minutesStr}`;
            return timeStr;
        }
        static minuteNumberToString(minutesNum) {
            // var hours = this.getTimeHours(timeNum);
            // var minutes = this.getTimeMinutes(timeNum);
            var minutes = Math.floor(minutesNum);
            var minutesStr = minutes.toString();
            var seconds = Math.floor(60 * (minutesNum - Math.floor(minutesNum)));
            var secondsStr = seconds.toString().padStart(2, '0');
            var timeStr = `${minutesStr}:${secondsStr}`;
            return timeStr;
        }
        
        static getTimeHours(time) {
            return Math.floor(time);
        }
        static getTimeMinutes(time) {
            return Math.floor(60 * (time - Math.floor(time)));
        }
        static getPaddedMinutesString(minutes) {
            return minutes.toString().padStart(2, '0');
        }
        static minutesToHourDecimal(minutes) {
            return minutes/60;
        }
        static secondsToHours(seconds) {
            return seconds/(60*60);
        }
        static millisecondsToHours(milliseconds) {
            return milliseconds / (1000 * 60 * 60);
        }

        // takes JavaScript Date object
        // returns the time of day in 24 hours
        // with minutes as a decimal
        // ex: 2020-01-01T13:30:00.000Z returns 13.5
        static datetimeToHourDecimal(datetime) {
            if (!(datetime instanceof Date)) {
                datetime = new Date(datetime);
            }
            var hours = datetime.getHours();
            var minutesDecimal = this.minutesToHourDecimal(datetime.getMinutes());
            var result = hours + minutesDecimal;
            if (result > 24) result = result - 24;
            return result;
        }

    }

    const SkyboxEnum = Object.freeze({
        STARS: 1,
        SUN: 2
    });

    const GraphicsQualityEnum = Object.freeze({
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    });

    const GraphicsQualityString = new Map([
        [GraphicsQualityEnum.LOW, 's'], // small
        [GraphicsQualityEnum.MEDIUM, 'm'],
        [GraphicsQualityEnum.HIGH, 'l'], // large
    ]);

    const ShadingEnum = Object.freeze({
        DEFAULT: 1,
        CEL: 2,
    });

    const GraphicsShadingString = new Map([
        [ShadingEnum.DEFAULT, 'default'],
        [ShadingEnum.CEL, 'cel'],
    ]);


    const state = function () {
        return {
            skybox: SkyboxEnum.STARS,
            skytime: 0, // 24 hours, number
            bump: false,
            normal: false,
            quality: GraphicsQualityEnum.HIGH,
            shading: ShadingEnum.DEFAULT,
        };
    };

    const getters = {
        skybox: state => {
            return (state.skytime > 20) || (state.skytime < 6) ? SkyboxEnum.STARS : SkyboxEnum.SUN;
        },
        timeHours: state => {
            return TimeUtils.getTimeHours(state.skytime);
        },
        timeMinutes: state => {
            return TimeUtils.getTimeMinutes(state.skytime);
        },
        timeMinutesHourDecimal: (state, getters) => {
            return TimeUtils.minutesToHourDecimal(getters.timeMinutes);
        },
        timeMinutesString: (state, getters) => {
            return TimeUtils.getPaddedMinutesString(getters.timeMinutes);
        },
        qualityString: (state) => {
            return GraphicsQualityString.get(state.quality);
        },
        shadingString: (state) => {
            return GraphicsShadingString.get(state.shading);
        }
    };

    const mutations = {
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
            if (CONFIG.DEBUG) {console.log(`SET_BUMP: ${active}`);}
            state.bump = active ? true : false;
        },
        SET_NORMAL: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log(`SET_NORMAL: ${active}`);}
            state.normal = active ? true : false;
        },
        SET_SKYTIME: function(state, value) {
            if (CONFIG.DEBUG) {console.log(`SET_SKYTIME: ${value}`);}
            state.skytime = value;
        },
    };

    const actions = {
        setTimeFromString: function(context, timeStr) {
            if (CONFIG.DEBUG) {console.log("setTimeFromString");}
            var timeNum = 0;
            var timeArray = timeStr.split(':');
            var hours = Number.parseInt(timeArray[0]);
            var minutes = Number.parseInt(timeArray[1]);
            var hourDecimal = minutes / 60;
            timeNum = hours + hourDecimal;
            context.commit('SET_SKYTIME', timeNum);
        },
        updateTimeHours: function(context, hours) {
            if (CONFIG.DEBUG) {console.log("updateTimeHours");}
            var newTime = +hours + +context.getters.timeMinutesHourDecimal;
            console.log(`hours ${hours}, newTime: ${newTime}`);
            context.commit('SET_SKYTIME', newTime);
        },
        updateTimeMinutes: function(context, minutes) {
            if (CONFIG.DEBUG) {console.log("updateTimeMinutes");}
            var newTime = +context.getters.timeHours + +TimeUtils.minutesToHourDecimal(minutes);
            context.commit('SET_SKYTIME', newTime);
        },
    };

    const graphicsModule = {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    };

    //

    var script = {
        computed: {
            radialsegments() {
                return Math.max(this.numberOfSegments, 12);
            },
            sortedLSObjs() {
                var sorted = this.LSObjs;
                sorted.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                return sorted;
            },
            items() {
                return this.sortedLSObjs.slice(this.pageStart, this.pageStart + this.numberOfSegments);
            },
            numberOfItemsToDisplay() {
                return Math.min(this.numberOfSegments, this.items.length);
            },
            ...vuex.mapState('xr',
                [
                    'LSObjs',
                    'roomConfig'
                ]
            ),
            ...vuex.mapState('xr/carousel',
                [
                    'pageStart',
                    'numberOfSegments',
                    'floorRadius',
                    'railHeight',
                    'floorActive'
                ]
            ),

            ...vuex.mapState('xr/grid',
                [
                    'page',
                    'columns',
                    'rows',
                    'radius',
                    'top',
                    'bottom',
                    'cellWidth',
                    'cellHeight',
                    'cellContentHeight',
                    'gridCellsPerRow',
                    'focusedCellPosititon',
                    'focusedCellScale',
                    'arrowWidth',
                    'arrowHeight',
                    'focusArrowHeight',
                    'focusArrowWidth',
                    'focusArrowMargin',
                    'animateInSeconds',
                    'animateOutSeconds',
                ]
            ),

            ...vuex.mapState('xr/style',
                [
                    'hoverColor',
                    'activeColor',
                ]
            ),

            ...vuex.mapState('xr/graphics',
                [
                    'bump',
                    'normal',
                    'quality',
                    'shading'
                ]
            ),
            ...vuex.mapGetters('xr/graphics',
                [
                    'qualityString',
                    'shadingString',
                ]
            ),
        },
        methods: {
            imageSrc: function (image) {
                if(!image)
                    return '';
                else
                    return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
            },
            railRotation: function(segment) {
                var u = (segment + 0.5) / this.numberOfSegments;
                var theta = (135 - u * 360);

                var roty = theta - 90;
                var rotx = 0;

                return `${rotx} ${roty} 0`;
            },
            railPosition: function(segment) {
                var u = segment / this.numberOfSegments;
                var theta = (3*Math.PI/4 -u * 2 * Math.PI);

                var sinTheta = Math.sin( theta );
                var cosTheta = Math.cos( theta );

                var x = + this.floorRadius * cosTheta;
                var z = - this.floorRadius * sinTheta;

                return `${x} 0 ${z}`;
            },
            dioramaRotation: function(segment) {
                var u = segment / this.numberOfSegments;
                var theta =  - (u * Math.PI * 2) + (-3*Math.PI/4); //(-3*Math.PI/4)

                var roty = theta * (180/Math.PI);
                var rotx = 0;

                return `${rotx} ${roty} 0`;
            },
            dioramaPosition: function(segment) {
                var u = segment / this.numberOfSegments;
                var theta = (-3*Math.PI/4) - (u * Math.PI * 2);

                var sinTheta = Math.sin( theta );
                var cosTheta = Math.cos( theta );

                var x = (this.floorRadius) * sinTheta;
                var y = 0;
                var z = (this.floorRadius) * cosTheta;

                return `${x} ${y} ${z}`;
            },
        },
      };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "gallery-carousel" },
        [
          _vm.floorActive
            ? _c(
                "a-entity",
                _vm._l(_vm.radialsegments, function(n) {
                  return _c("a-diorama-column", {
                    key: "railSegment" + n,
                    attrs: {
                      rotation: _vm.railRotation(n - 1),
                      position: _vm.railPosition(n - 1),
                      radius: _vm.floorRadius,
                      railheight: _vm.railHeight,
                      radialsegments: _vm.numberOfSegments,
                      bump: _vm.bump,
                      normal: _vm.normal,
                      quality: _vm.qualityString,
                      shading: _vm.shadingString
                    }
                  })
                }),
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._l(_vm.items, function(item, n) {
            return _c(
              "a-entity",
              { key: "carouselItem" + n },
              [
                _c("a-diorama", {
                  attrs: {
                    type: item.type,
                    src: _vm.imageSrc(item),
                    rotation: _vm.dioramaRotation(n - 1),
                    position: _vm.dioramaPosition(n - 1),
                    railheight: _vm.railHeight,
                    bump: _vm.bump,
                    normal: _vm.normal,
                    rail: _vm.floorActive,
                    quality: _vm.qualityString,
                    shading: _vm.shadingString
                  }
                })
              ],
              1
            )
          })
        ],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        undefined,
        undefined,
        undefined
      );

    const state$1 = function () {
        return {
            cursorActive: true,
            rightHandControllerActive: false,
            avatars: [],
            avatarURLs: {},
            playerHeight: 1.6
        };
    };

    const mutations$1 = {
        SET_CURSOR_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_CURSOR_ACTIVE");}
            state.cursorActive = active;
        },
        SET_RIGHT_HAND_CONTROLLER_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_RIGHT_HAND_CONTROLLER_ACTIVE");}
            state.rightHandControllerActive = active;
        },
        SET_AVATARS: function(state, objs) {
            if (CONFIG.DEBUG) {console.log('SET_AVATARS');}
            state.avatars = objs;
            // for (var avatar of objs) {
            //     console.log(avatar.name);
            //     console.log(avatar.src);
            // }
        },
        ADD_AVATARURL: function(state, payload) {
            Vue.set(state.avatarURLs, payload.key, payload.url);
        }
    };

    const getters$1 = {
        getAvatarURL: (state) => (key) => {
            return state.avatarURLs[ key ];
        }
    };

    const actions$1 = {
        getAvatars ({ commit }) {
            if (CONFIG.DEBUG) {console.log("getAvatars action");}        return axios.get("/avatars")
            .then((res) => {
                commit('SET_AVATARS', res.data);
            })
            .catch(function (error) {
                // handle error
                console.log('getAvatars error');
                console.log(error);
            })
        },
    };

    const avatarModule = {
        namespaced: true,
        state: state$1,
        getters: getters$1,
        mutations: mutations$1,
        actions: actions$1
    };

    const state$2 = function () {
        return {
            pageStart: 0,
            pageStep: 5,
            numberOfSegments: 24,
            floorRadius: 5,
            railHeight: 1.2,
            floorActive: true,
            spawnRingOuterRadius: 0.25,
            spawnRingInnerRadius: 0.2
         };
    };

    const mutations$2 = {
        PAGE_LEFT: function(state) {
            if (CONFIG.DEBUG) {console.log("PAGE_LEFT");}
            if (state.pageStart - state.pageStep >= 0) {
                state.pageStart -= state.pageStep;
            }
            else {
                state.pageStart = 0;
            }
        },
        PAGE_RIGHT: function(state, length) {
            if (CONFIG.DEBUG) {console.log(`PAGE_RIGHT`);}
            if (length == 0) {return;}
            if (state.pageStep + state.pageStart + state.numberOfSegments < length) {
                state.pageStart += state.pageStep;
            }
            else if (length - state.numberOfSegments >= 0) {
                state.pageStart = length - state.numberOfSegments;
            }
        },
        SET_NUMBER_OF_SEGMENTS: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_NUMBER_OF_SEGMENTS");}
            var num = new Number(val);
            if (num < 12) {num = 12;}
            if (num > 121) {num = 121;}
            state.numberOfSegments = num;
        },
        SET_FLOOR_RADIUS: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_RADIUS");}
            var num = new Number(val);
            if (num < 1) {num = 1;}
            // if (num > 24) {num = 24;}
            state.floorRadius = num;
        },
        SET_FLOOR_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_ACTIVE");}
            state.floorActive = active;
        },
    };
         
    const actions$2 = {
        pageLeft: function(context) {
            if (CONFIG.DEBUG) {console.log("pageLeft");}
            context.commit('PAGE_LEFT');
            },
        pageRight: function(context) {
            if (CONFIG.DEBUG) {console.log("pageRight");}
            context.commit('PAGE_RIGHT', context.rootState.xr.LSObjs.length);
        }
    };

    const carouselModule = {
        namespaced: true,
        state: state$2,
        mutations: mutations$2,
        actions: actions$2
    };

    const state$3 = function () {
        return {
            messages: []
        };
    };

    const mutations$3 = {
        // payload: fromClientId, dataType, data, source
        MESSAGE_RECEIVED: function(state, payload) {
            if (CONFIG.DEBUG) {console.log("MESSAGE_RECEIVED");}
            state.messages.push({playerName: payload.fromClientId, msg: payload.data});
        },
        // payload: clientId, data
        MESSAGE_SENT: function(state, payload) {
            if (CONFIG.DEBUG) {console.log("MESSAGE_SENT");}
            state.messages.push({playerName: payload.clientId, msg: payload.data});
        },
    };

    const chatModule = {
        namespaced: true,
        state: state$3,
        mutations: mutations$3
    };

    const state$4 = function () {
        return {
            cursorActive: true,
            rightHandControllerActive: false,
            raycasterTargets: ['.clickable', '.a-enter-vr'],
        };
    };

    const mutations$4 = {
        SET_CURSOR_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_CURSOR_ACTIVE");}
            state.cursorActive = active;
        },
        SET_RIGHT_HAND_CONTROLLER_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_RIGHT_HAND_CONTROLLER_ACTIVE");}
            state.rightHandControllerActive = active;
        },
    };

    const controlsModule = {
        namespaced: true,
        state: state$4,
        // getters,
        mutations: mutations$4,
        // actions
    };

    const VRHudEnum = Object.freeze({
        NONE: 0,
        HELP: 1,
        SETTINGS: 2
    });

    const state$5 = function () {
        return {
            vrKeyboardActive: false,
            vrKeyboardTarget: '',
            vrKeyboardModel: 'basic',
            vrSettingsActive: false,
            vrHelpActive: false,
            vrActiveHud: VRHudEnum.NONE,

            helpMenuVisible: false,
            graphicsMenuVisible: false,
        };
    };

    const mutations$5 = {
        SET_VR_KEYBOARD_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log(`SET_VR_KEYBOARD_ACTIVE: ${active}`);}
            state.vrKeyboardActive = active;
        },
        SET_VR_KEYBOARD_TARGET: function(state, target) {
            if (CONFIG.DEBUG) {console.log("SET_VR_KEYBOARD_TARGET");}
            state.vrKeyboardTarget = target;
        },
        SET_VR_KEYBOARD_MODEL: function(state, model) {
            if (CONFIG.DEBUG) {console.log("SET_VR_KEYBOARD_MODEL");}
            if (['basic', 'numpad'].includes(model)) {
                state.vrKeyboardModel = model;
                console.log(state.vrKeyboardModel);
            }
        },
        SET_VR_HELP_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_VR_HELP_ACTIVE");}
            state.vrHelpActive = active;
        },
        SET_VR_SETTINGS_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_VR_SETTINGS_ACTIVE");}
            state.vrSettingsActive = active;
        },
        SET_ACTIVE_HUD: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_ACTIVE_HUD");}
            if (VRHudEnum.hasOwnProperty(val)) {
                state.vrActiveHud = VRHudEnum[val];
            }
            else {
                console.log(`cannot set active hud, ${val} is not a VRHudEnum`);
            }
        },
        SET_HELP_MENU_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log(`SET_HELP_MENU_ACTIVE: ${active}`);}
            state.helpMenuVisible = active;
        },
        SET_GRAPHICS_MENU_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log(`SET_GRAPHICS_MENU_ACTIVE: ${active}`);}
            state.graphicsMenuVisible = active;
        },
    };

    const actions$3 = {
        cycleHud: function(context) {
            if (CONFIG.DEBUG) {console.log("cycleHud");}
            context.commit('SET_VR_KEYBOARD_ACTIVE', false);
            switch (context.state.vrActiveHud) {
              case VRHudEnum.NONE:
                // change to Help
                context.commit('SET_VR_HELP_ACTIVE', true);
                context.commit('SET_VR_SETTINGS_ACTIVE', false);
                context.commit('SET_ACTIVE_HUD', 'HELP');
                break;
              case VRHudEnum.HELP:
                // change to Settings
                context.commit('SET_VR_HELP_ACTIVE', false);
                context.commit('SET_VR_SETTINGS_ACTIVE', true);
                context.commit('SET_ACTIVE_HUD', 'SETTINGS');
                break;
              case VRHudEnum.SETTINGS:
                // change to None
                context.commit('SET_VR_HELP_ACTIVE', false);
                context.commit('SET_VR_SETTINGS_ACTIVE', false);
                context.commit('SET_ACTIVE_HUD', 'NONE');
                break;
            }
        }
    };

    const hudModule = {
        namespaced: true,
        state: state$5,
        mutations: mutations$5,
        actions: actions$3
    };

    const MapboxTypeEnum = Object.freeze({
        SATELLITE: 'satellite',
        STREETS: 'streets',
        SATELLITESTREETS: 'satellite-streets',
        OUTDOORS: 'outdoors',
        LIGHT: 'light',
        DARK: 'dark',
        NAVIGATIONPREVIEWDAY: 'navigation-preview-day',
        NAVIGATIONPREVIEWNIGHT: 'navigation-preview-night',
        NAVIGATIONGUIDANCEDAY: 'navigation-guidance-day',
        NAVIGATIONGUIDANCENIGHT: 'navigation-guidance-night',
    });

    const state$6 = function () {
        return {
            floorMapActive: false,
            worldMapActive: false,
            mapLatitude: 34.023552,
            mapLongitude: -118.286189,

            floorMapType: 'satellite',
            floorRows: 1,
            floorZoom: 11,
            floorHighDPI: false,
            floorScale: 1,
            floorMapHeightmap: false,
            floorMapHeight: 1,

            worldRows: 1,
            worldZoom: 11,
            worldHighDPI: false,
            worldScale: 8,
            worldMapHeightmap: false,
            worldMapFloorHeight: 1,

            mapboxType: MapboxTypeEnum.SATELLITE,
            worldRows: 10,
            worldZoom: 8,

            globeActive: true,
        };
    };

    const mutations$6 = {
        SET_FLOOR_MAP_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ACTIVE");}
            state.floorMapActive = active;
        },
        SET_WORLD_MAP_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ACTIVE");}
            state.worldMapActive = active;
        },
        SET_MAP_LATITUDE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_MAP_LATITUDE");}
            var num = new Number(val);
            if (num < -90) {num = -90;}
            if (num > 90) {num = 90;}
            state.mapLatitude = num;
        },
        SET_MAP_LONGITUDE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_MAP_LONGITUDE");}
            var num = new Number(val);
            if (num < -180) {num = -180;}
            if (num > 180) {num = 180;}
            state.mapLongitude = num;
        },

        SET_FLOOR_MAP_ROWS: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ROWS");}
            state.floorRows = val;
        },
        SET_FLOOR_MAP_ZOOM: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ZOOM");}
            state.floorZoom = val;
        },
        SET_FLOOR_DPI: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_DPI");}
            state.floorHighDPI = val;
        },
        SET_FLOOR_SCALE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_SCALE");}
            state.floorScale = val;
        },
        SET_FLOOR_HEIGHTMAP: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_HEIGHTMAP");}
            state.floorMapHeightmap = val;
        },
        SET_FLOOR_HEIGHT: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_FLOOR_HEIGHT");}
            state.floorMapHeight = val;
        },


        SET_WORLD_MAP_ROWS: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ROWS");}
            state.worldRows = val;
        },
        SET_WORLD_MAP_ZOOM: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ZOOM");}
            state.worldZoom = val;
        },
        SET_WORLD_DPI: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_DPI");}
            state.worldHighDPI = val;
        },
        SET_WORLD_SCALE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_SCALE");}
            state.worldScale = val;
        },
        SET_WORLD_HEIGHTMAP: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_HEIGHTMAP");}
            state.worldMapHeightmap = val;
        },
        SET_WORLD_HEIGHT: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_WORLD_HEIGHT");}
            state.worldMapHeight = val;
        },
        SET_MAPTYPE: function(state, val) {
            if (CONFIG.DEBUG) {console.log("SET_MAPTYPE");}
            if (MapboxTypeEnum.hasOwnProperty(val)) {
                state.mapboxType = MapboxTypeEnum[val];
            }
            else {
                console.log(`cannot set mapboxType, ${val} is not a MapboxTypeEnum`);
            }
        },
        SET_GLOBE_ACTIVE: function(state, active=true) {
            if (CONFIG.DEBUG) {console.log("SET_GLOBE_ACTIVE");}
            state.globeActive = active;
        },
    };

    const mapModule = {
        namespaced: true,
        state: state$6,
        mutations: mutations$6
    };

    const state$7 = function () {
        return {
            numberOfPlayers: 0,
            playerNames: new Map(),
            updateNames: 1,
            connectOnLoad: false,
        };
    };

    const mutations$7 = {
        INCREMENT_PLAYERS: function(state) {
            if (CONFIG.DEBUG) {console.log("INCREMENT_PLAYERS");}
            state.numberOfPlayers += 1;
        },
        DECREMENT_PLAYERS: function(state) {
            if (CONFIG.DEBUG) {console.log("DECREMENT_PLAYERS");}
            if (state.numberOfPlayers > 0) {
                state.numberOfPlayers -= 1;
            }
        },
        // payload: clientId, name
        CHANGE_PLAYER_NAME: function(state, payload) {
            if (CONFIG.DEBUG) {console.log(`CHANGE_PLAYER_NAME (${payload.clientId}, ${payload.name})`);}
            // only set name to clientId if it isn't already in map
            if ( (payload.clientId != payload.name) ||
                (payload.clientId == payload.name && !state.playerNames.has(payload.clientId))) {
                    state.playerNames.set(payload.clientId, payload.name);
                    state.updateNames += 1;
            }
        },
        SET_CONNECT_ON_LOAD: function(state, bool=true) {
            if (CONFIG.DEBUG) {console.log("SET_CONNECT_ON_LOAD");}
            state.connectOnLoad = true;
        },
    };


    const actions$4 = {
        // payload: clientId, name
        addPlayer: function(context, payload) {
            if (CONFIG.DEBUG) {console.log("addPlayer");}
            context.commit('INCREMENT_PLAYERS');
            context.state.playerNames.set(payload.clientId, payload.name);
        },
        // payload: clientId
        removePlayer: function(context, payload) {
            if (CONFIG.DEBUG) {console.log("removePlayer");}
            context.commit('DECREMENT_PLAYERS');
            // context.state.playerNames.delete(payload.clientId);
        }
    };

    const nafModule = {
        namespaced: true,
        state: state$7,
        mutations: mutations$7,
        actions: actions$4
    };

    const state$8 = function () {
        return {
            page: 0,
            rows: 3,
            columns: 5,
            radius: 6,
            cellWidth: 1.5,
            cellHeight: 0.7,
            cellContentHeight: 0.6,
            gridCellsPerRow: 24,
            focusedCellPosititon: { x:0, y:0.1, z:-1.5 },
            focusedCellScale: { x:1, y:1, z:1 },
            arrowWidth: 0.4,
            arrowHeight: 0.6,
            focusArrowHeight: 0.2,
            focusArrowWidth: 0.35,
            focusArrowMargin: 0.15,
            animateInSeconds: 1,
            animateOutSeconds: 0.2,
         };
    };

    const getters$2 = {
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

    const mutations$8 = {
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
        RESET_PAGE: function(state) {
            state.page = 0;
        },
    };

    const actions$5 = {
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
        
    };

    const gridModule = {
        namespaced: true,
        state: state$8,
        getters: getters$2,
        mutations: mutations$8,
        actions: actions$5,
    };

    const state$9 = function () {
        return {
            hoverColor: '#2ac1de',
            activeColor: '#f93',
         };
    };

    const styleModule = {
        namespaced: true,
        state: state$9,
    };

    const AppTypeEnum = Object.freeze({
        XR: 1,
        APP: 2
    });


    const SceneLayoutEnum = Object.freeze({
        GALLERY: 1,
        GRID: 2
    });

    const modules = {
            avatar: avatarModule,
            carousel: carouselModule,
            chat: chatModule,
            controls: controlsModule,
            graphics: graphicsModule,
            hud: hudModule,
            map: mapModule,
            naf: nafModule,
            grid: gridModule,
            style: styleModule,
    };

    const state$a = function () {
        return {
            AppType: AppTypeEnum.XR,
            LSObjs: [],
            LSObjsLoaded: false,
            roomConfig: {},
            roomName: 'ls-room',
            rooms: [],
            sceneLoaded: false,
            isMobile: false,
            inVR: false,
            sceneLayout: SceneLayoutEnum.GRID,
        }
    };

    const getters$3 = {
        totalItems: (state, getters, rootState, rootGetters) => {
            if (state.AppType == AppTypeEnum.XR) {
                return state.LSObjs.length;
            }
            else {
                switch (rootState.facet) {
                    case 'content':
                        return getters.LS_CONTENT.length;
                    case 'events':
                        return getters.LS_EVENTS.length;
                    case 'contacts':
                        return getters.LS_CONTACTS.length;
                    case 'people':
                        return getters.LS_PEOPLE.length;
                    default:
                        return 0;
                }
            }
        },
        LS_CONTENT: (state, getters, rootState, rootGetters) => {
            if (state.AppType != AppTypeEnum.APP) return [];
            return rootState.objects.content;
        },
        LS_EVENTS: (state, getters, rootState, rootGetters) => {
            if (state.AppType != AppTypeEnum.APP) return [];
            var events = rootState.objects.events;
            var items = [];
            events.forEach(event => {
                var obj = {};
                obj.datetime = event.datetime;
                obj.eventtype = event.type;
                obj.connection = event.connection;
                obj.hydratedLocation = event.hydratedLocation;
                obj.location = event.location;
                event.content.forEach(content => {
                    items.push({ ...obj, content: content });
                });
            });
            return items;
        },
        LS_CONTACTS: (state, getters, rootState, rootGetters) => {
            if (state.AppType != AppTypeEnum.APP) return [];
            rootState.objects.contacts.forEach(contact => {
                // console.log(contact);
            });

            return rootState.objects.contacts;
        },
        LS_PEOPLE: (state, getters, rootState, rootGetters) => {
            if (state.AppType != AppTypeEnum.APP) return [];
            rootState.objects.people.forEach(person => {
                // console.log(person);
            });

            return rootState.objects.people;
        }
    };

    const mutations$9 = {
            SET_IN_VR: function(state, active=true) {
                if (CONFIG.DEBUG) {console.log("SET_IN_VR");}
                state.inVR = active;
            },
            SET_LSOBJS: function(state, objs) {
                if (CONFIG.DEBUG) {console.log('SET_LSOBJS');}
                state.LSObjs = objs;
                state.LSObjsLoaded = true;
            },
            SET_ROOMS: function(state, rooms) {
                if (CONFIG.DEBUG) {console.log('SET_ROOMS');}
                state.rooms = rooms;
            },
            SET_ROOMCONFIG: function(state, roomConfig) {
                if (CONFIG.DEBUG) {console.log('SET_ROOMCONFIG');}
                state.roomConfig = roomConfig;
            },
            SET_ROOMNAME: function(state, name) {
                if (CONFIG.DEBUG) {console.log('SET_ROOMNAME');}
                state.roomName = name;
            },
            SET_SCENELOADED: function(state) {
                if (CONFIG.DEBUG) {console.log('SET_SCENELOADED');}
                if (AFRAME == undefined) {
                    state.sceneLoaded = false;
                }
                else {
                    var scene = AFRAME.scenes[0];
                    state.sceneLoaded = scene == undefined ? false : scene.hasLoaded;
                }
            },
            SET_ISMOBILE: function(state) {
                if (CONFIG.DEBUG) {console.log('SET_ISMOBILE');}
                if (AFRAME == undefined) {
                    console.log("Cannto call SET_ISMOBILE before AFRAME is loaded");
                }
                else {
                    state.isMobile = AFRAME.utils.device.isMobile();
                }
            },
            SET_LAYOUT: function(state, val) {
                if (CONFIG.DEBUG) {console.log("SET_LAYOUT");}
                if (SceneLayoutEnum.hasOwnProperty(val)) {
                    state.sceneLayout = SceneLayoutEnum[val];
                }
                else {
                    console.log(`cannot set sceneLayout, ${val} is not a SceneLayoutEnum`);
                }
            },
            SET_APPTYPE: function(state, val) {
                if (CONFIG.DEBUG) {console.log("SET_APPTYPE");}
                if (AppTypeEnum.hasOwnProperty(val)) {
                    state.AppType = AppTypeEnum[val];
                }
                else {
                    console.log(`cannot set AppType, ${val} is not a AppTypeEnum`);
                }
            },
    };
    const actions$6 = {
            setRoomName (context, name) {
                if (CONFIG.DEBUG) {console.log(`setRoomName(${name})`);}            context.commit('SET_ROOMNAME', name);
            },

            getRoomConfig ({ commit }) {
                if (CONFIG.DEBUG) {console.log("getRoomConfig action");}            return axios.get("/roomconfig")
                .then((res) => {
                    commit('SET_ROOMCONFIG', res.data);
                })
                .catch(function (error) {
                    console.log('getRoomConfig error');
                    console.log(error);
                })
            },

            getObjs (context) {
                if (CONFIG.DEBUG) {console.log("getObjs action");}
                var x = '/' + context.state.roomConfig.BUCKET_PATH;
        
                // context.commit('SET_ROOMNAME', 'ls-room');
        
                return axios.get(x)
                .then((res) => {
                    var objs = [];
                    var rooms = Object.keys(res.data);
                    if (res.data[context.state.roomName] !== undefined) {
                        var someData = res.data[context.state.roomName].forEach(element => {
                            objs.push(element);
                        });
                    }
                    context.commit('SET_LSOBJS', objs);
                    context.commit('SET_ROOMS', rooms);
                })
                .catch(function (error) {
                    // handle error
                    console.log('getObs error');
                    console.log(error);
                })
            }
    };

    const xrModule = {
        namespaced: true,
        modules,
        state: state$a,
        getters: getters$3,
        mutations: mutations$9,
        actions: actions$6
    };

    //

    var script$1 = {

        components: {
            galleryCarousel: __vue_component__
        },

        computed: {
            ...vuex.mapState('xr',
                [
                    'sceneLayout',
                ]
            ),

            ...vuex.mapState('xr/graphics',
                [
                    'bump',
                    'normal',
                    'quality',
                    'shading',
                ]
            ),

            ...vuex.mapGetters('xr/graphics',
                [
                    'qualityString',
                ]
            ),
            
            ...vuex.mapState('xr/map',
                [
                    'globeActive',
                    'floorMapActive',
                    'worldMapActive',
                    'mapLatitude',
                    'mapLongitude',
                    'mapboxType',

                    'floorRows',
                    'floorZoom',
                    'floorHighDPI',
                    'floorScale',
                    'floorMapHeightmap',
                    'floorMapHeight',

                    'worldRows',
                    'worldZoom',
                    'worldHighDPI',
                    'worldScale',
                    'worldMapHeightmap',
                    'worldMapHeight',

                ]
            ),

            ...vuex.mapState('xr/carousel',
                [
                    'floorActive',
                    'floorRadius',
                    'numberOfSegments'
                ]
            ),
        },

        methods: {
            toggleLayout() {
                if (CONFIG.DEBUG) {console.log("toggleLayout");}
                var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
                this.$store.commit('xr/SET_LAYOUT', newVal);
            },
        }
    };

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "gallery" },
        [
          _c("a-entity", {
            attrs: { light: "type: ambient; color: #FFF; intensity: 0.8" }
          }),
          _vm._v(" "),
          _c("a-entity", {
            attrs: {
              id: "dirLight",
              light: "type: directional; color: #FFF; intensity: 0.8;",
              position: "-1 -1 0"
            }
          }),
          _vm._v(" "),
          _c("a-light", {
            attrs: {
              type: "point",
              color: "#FFF",
              intensity: "0.8",
              position: "10 10 0"
            }
          }),
          _vm._v(" "),
          _vm.floorActive
            ? _c("a-wooden-floor", {
                staticClass: "boundry",
                attrs: {
                  radius: _vm.floorRadius,
                  radialsegments: _vm.numberOfSegments,
                  bump: _vm.bump,
                  normal: _vm.normal,
                  quality: _vm.quality,
                  shading: _vm.qualityString,
                  rotation: "0 135 0"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _c("gallery-carousel"),
          _vm._v(" "),
          _vm.globeActive
            ? _c("a-sphere", {
                staticClass: "boundry clickable",
                attrs: {
                  id: "Earth",
                  position: "0 1.5 0",
                  radius: ".99",
                  material:
                    "src:#earth; roughness: 1; transparent: true; opacity: 0.9;",
                  animation:
                    "property: rotation; easing: linear; to: 0 360; dur: 150000; loop: true;"
                },
                on: { click: _vm.toggleLayout }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.globeActive
            ? _c(
                "a-entity",
                {
                  attrs: {
                    id: "Logo",
                    position: "0 2.6 0",
                    rotation: "0 0 0",
                    animation:
                      "property: rotation; easing: linear; to: 0 -360; dur: 42000; loop: true;"
                  }
                },
                [
                  _c("a-gltf-model", {
                    staticClass: "clickable",
                    attrs: { src: "#logo", scale: "0.075 0.075 0.075" },
                    on: { click: _vm.toggleLayout }
                  })
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.floorMapActive == true
            ? _c("a-mapbox-terrain", {
                attrs: {
                  position: "0 0.1 0",
                  scale: _vm.floorScale + " 1 " + _vm.floorScale,
                  latitude: _vm.mapLatitude,
                  longitude: _vm.mapLongitude,
                  "zoom-level": _vm.floorZoom,
                  rows: _vm.floorRows,
                  highdpi: _vm.floorHighDPI,
                  heightmap: _vm.floorMapHeightmap,
                  heightmapheight: _vm.floorMapHeight,
                  type: _vm.mapboxType
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.worldMapActive == true
            ? _c("a-mapbox-terrain", {
                attrs: {
                  position: "0 -4 0",
                  scale: _vm.worldScale + " 1 " + _vm.worldScale,
                  latitude: _vm.mapLatitude,
                  longitude: _vm.mapLongitude,
                  "zoom-level": _vm.worldZoom,
                  rows: _vm.worldRows,
                  highdpi: _vm.worldHighDPI,
                  heightmap: _vm.worldMapHeightmap,
                  heightmapheight: _vm.worldMapHeight
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$1 = normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        false,
        undefined,
        undefined,
        undefined
      );

    class Cylinder {
        constructor(cellsPerRow=36, cellHeight=1, radius=1) {
            this.cellsPerRow = cellsPerRow;
            this.cellHeight = cellHeight;
            this.radius = radius;
        }

        cellPosition(cellIndexOrColumn, cellRow=undefined) {
            var row = cellRow == undefined ? this.getCellRow(cellIndexOrColumn) : cellRow;
            var theta = cellRow == undefined ? this.getCellTheta(cellIndexOrColumn) : this.getColumnTheta(cellIndexOrColumn);

            var x = this.radius * Math.sin(theta);
            var z = this.radius * Math.cos(theta);
            var y = row * this.cellHeight;

            return {x:x, y:y, z:z};
        }

        // Degrees
        cellRotation(cellIndex) {
            var theta = this.getCellTheta(cellIndex);

            var roty = theta * (180/Math.PI);
            var rotx = 0;
            var rotz = 0;

            return {x:rotx, y:roty, z:rotz};
        }

        // azimuthal angle
        getCellTheta(cellIndex) {
            var column = this.getCellColumn(cellIndex);
            var thetaPrime = 2 * Math.PI / this.cellsPerRow;
            return thetaPrime * column;
        }
        getColumnTheta(column) {
            return column * 2 * Math.PI / this.cellsPerRow;    }

        getCellColumn(cellIndex) {
            return Cylinder._mod(cellIndex, this.cellsPerRow);
        }

        getCellRow(cellIndex) {
            return Math.floor(cellIndex/this.cellsPerRow);
        }

        cellIndexFromColumnRow(column, row) {
            return column + (row * this.cellsPerRow);
        }

        static _mod(n, m) {
            return ((n % m) + m) % m;
        }
    }

    class CylindricalGrid extends Cylinder{
        constructor(cellsPerRow=36, cellHeight=1, radius=1, rows=1, columns=1) {
            super(cellsPerRow, cellHeight, radius);
            this.rows = rows;
            this.columns = columns;
        }

        cellIndex(subCellIndex, reverse=true) {
           if (reverse) {
            subCellIndex = (this.rows * this.columns - 1) - subCellIndex;
           }
           var sColumn =  Cylinder._mod(subCellIndex, this.columns);
           var sRow = Math.floor(subCellIndex/this.columns);

           var index = sColumn + (sRow * this.cellsPerRow);
           return index;
        }

        cellPosition(subCellIndex) {
            return super.cellPosition(this.cellIndex(subCellIndex));
        }
        cellRotation(subCellIndex) {
            return super.cellRotation(this.cellIndex(subCellIndex));
        }
    }

    //

    var script$2 = {
        data() {
            return {
                displayRooms: false,
                opacity: 0.7,
                width: 0.1,
                lineSep: .01,
                textScale: 4,
                backgroundColor: '#22252a',
                headerBackgroundColor: '#29434E',
            }
        },

        props: {
            size: {
                type: Number,
                default: 1
            },
        },

        computed: vuex.mapState('xr',
        [
            'roomName',
            'roomConfig',
            'rooms',
            'isMobile',
        ]),

        mounted() {
            var self = this;
            self.$el.addEventListener("textclicked", self.textClickedHandler);
        },

        beforeDestroy() {
            var self = this;
            self.$el.removeEventListener("textclicked", self.textClickedHandler);
        },

        methods: {
            link: function (room) {
                return '?room=' + room;
            },
            changeRoom: function (room) {
                window.location.replace( this.link(room) );
            },
            roomClickHandler: function (evt) {
                this.changeRoom(this.rooms[evt.target.id.match(/\d+$/)]);
            },
            toggleRoomVisibility: function() {
                this.displayRooms = !this.displayRooms;
            },

            textClickedHandler(evt) {
                var self = this;
                var el = evt.target;
                var id = el.id;

                if (id == 'room-selector') {
                    self.toggleRoomVisibility();
                    return;
                }
            }
        },
    };

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "room-display" },
        [
          _c("a-entity", {
            staticClass: "clickable",
            attrs: {
              id: "room-selector",
              geometry:
                "primitive: plane; width: " +
                _vm.width * _vm.size +
                "; height: " +
                _vm.lineSep * _vm.size +
                ";",
              material: "color: " + _vm.headerBackgroundColor + "; side: double;",
              text: "value: Room Selection; align: center;",
              "text-link": ""
            }
          }),
          _vm._v(" "),
          _vm.displayRooms
            ? _c(
                "a-entity",
                _vm._l(_vm.rooms, function(room, index) {
                  return _c("a-entity", {
                    key: "room-label-" + index,
                    staticClass: "clickable",
                    attrs: {
                      id: "room-label-" + index,
                      geometry:
                        "primitive: plane; width: " +
                        _vm.width * _vm.size +
                        "; height: " +
                        _vm.lineSep * _vm.size +
                        ";",
                      material: "color: " + _vm.backgroundColor + "; side: double;",
                      text: "value: " + room + "; align: center;",
                      "text-link": "",
                      position: "0 " + -_vm.lineSep * _vm.size * (index + 1) + " 0"
                    },
                    on: { click: _vm.roomClickHandler }
                  })
                }),
                1
              )
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$2 = normalizeComponent(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    // import searchMany from '../../../../apollo/queries/search-many.gql';


    var script$3 = {

        components: {
        },

        data () {
            return {
                favorites: [],
                opacity: 0.7,
                width: 0.1,
                lineSep: .1,
                textScale: 4,
                backgroundColor: '#22252a',
                headerBackgroundColor: '#29434E',
                displaySearches: false,
                page: 0,
                itemsPerPage: 10,
            }
        },

        computed: {
            ...vuex.mapState(
                [
                    'facet',
                ]
            ),

            currentFavorites() {
                return this.favorites.slice(this.page * this.itemsPerPage,
                        (this.page+1) * this.itemsPerPage);
            },

            numberOfFavorites() {
                return this.favorites.length;
            },

            paginatorText() {
                var numberOfPages = Math.ceil(this.numberOfFavorites / this.itemsPerPage);
                return (this.page+1) + '/' + numberOfPages;
            },

            canPageRight() {
                if (this.itemsPerPage >= this.numberOfFavorites) {
                    return false;
                }
                var result = (this.page+1)*this.itemsPerPage <= this.numberOfFavorites;
                return result;
            },
        },

        watch: {
            currentFavorites: function (newVal, oldVal) {
                var flexContainer = document.querySelector('.xr-search-favorites');
                if (!!flexContainer) {
                    var scene = AFRAME.scenes[0];
                    var behavior = {
                        el: scene,
                        get tick() {
                            return function() {
                                console.log('flex behavior');
                                flexContainer.setAttribute('flex-container', {'needsupdate': true});
                                scene.removeBehavior(this);
                            }
                        }
                    };
                    scene.addBehavior(behavior);
                }
            },
        },

        mounted() {
            this.fetchFavoriteSearches();

            this.$el.addEventListener('togglesavedsearch', this.toggleSavedSearch);
            this.$el.addEventListener('changesearch', this.changeSearch);
            this.$el.addEventListener('pageleft-favorites', this.pageLeft);
            this.$el.addEventListener('pageright-favorites', this.pageRight);
        },

        beforeDestroy() {
            this.$el.removeEventListener('togglesavedsearch', this.toggleSavedSearch);
            this.$el.removeEventListener('changesearch', this.changeSearch);
            this.$el.removeEventListener('pageleft-favorites', this.pageLeft);
            this.$el.removeEventListener('pageright-favorites', this.pageRight);
        },

        methods: {
            fetchFavoriteSearches: async function() {
                // let result = await this.$apollo.query({
    			// 			query: searchMany,
    			// 			fetchPolicy: 'no-cache'
                //         });
                // var searches = result.data.searchMany;
                // this.favorites = searches.filter( search => {return search.favorited;} );
            },

            toggleSavedSearch() {
                this.displaySearches = !this.displaySearches;
            },

            changeSearch(evt) {
                var searchid = evt.originalTarget.id.match(/(search-)(.+)$/)[2];
                this.$router.push({
                    path: 'explore',
                    query: {
                        view: 'xr',
                        facet: this.facet,
                        qid: searchid
                    }
                });
            },

            constructLink: function(search) {
                return '/explore?qid=' + search.id;
            },

            pageLeft() {
                if (this.page > 0) {
                    this.page -= 1;
                }
            },

            pageRight() {
                if (this.canPageRight) {
                    this.page += 1;
                }
            },

        }
    };

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { attrs: { id: "xr-saved-searches" } },
        [
          _c("a-entity", {
            staticClass: "clickable",
            attrs: {
              "text-cell":
                "text: Saved Searches; width: 1; height: " +
                _vm.lineSep +
                "; fontsize: 3;",
              clickable: "clickevent: togglesavedsearch;",
              geometry: "primitive: plane; width: 1; height: " + _vm.lineSep + ";",
              material: "color: " + _vm.headerBackgroundColor + "; side: double;",
              highlight: "type: text; color: 0xFFFFFF;"
            }
          }),
          _vm._v(" "),
          _vm.displaySearches
            ? _c(
                "a-entity",
                [
                  _c(
                    "a-flex-container",
                    {
                      staticClass: "xr-search-favorites",
                      attrs: {
                        width: "1",
                        height: _vm.lineSep * 11,
                        "flex-direction": "column",
                        position: "0 " + (-_vm.lineSep * 13) / 2 + "0"
                      }
                    },
                    [
                      _vm._l(_vm.currentFavorites, function(search, index) {
                        return _c("a-entity", {
                          key: "search-label-" + index,
                          staticClass: "clickable",
                          attrs: {
                            id: "search-" + search.id,
                            clickable: "clickevent: changesearch;",
                            "text-cell":
                              "text: " +
                              search.name +
                              "; width: 1; height: " +
                              _vm.lineSep +
                              "; fontsize: 3; " +
                              "nobr: true;",
                            geometry:
                              "primitive: plane; width: 1; height: " +
                              _vm.lineSep +
                              ";",
                            material:
                              "color: " + _vm.backgroundColor + "; side: double;",
                            highlight: "type: text; color: 0xFFFFFF;",
                            "flex-item": "dimtype: attr; dimattr: text-cell;"
                          }
                        })
                      }),
                      _vm._v(" "),
                      _c(
                        "a-flex-container",
                        {
                          attrs: {
                            width: "1",
                            height: _vm.lineSep,
                            "flex-direction": "row",
                            position: "0 " + (-_vm.lineSep * 13) / 2 + "0"
                          }
                        },
                        [
                          _c("a-entity", {
                            staticClass: "clickable",
                            attrs: {
                              clickable: "clickevent: pageleft-favorites;",
                              "text-cell":
                                "text: <; width: 0.33; height: " +
                                _vm.lineSep +
                                "; fontsize: 3; " +
                                "nobr: true;",
                              geometry:
                                "primitive: plane; width: 0.33; height: " +
                                _vm.lineSep +
                                ";",
                              material:
                                "color: " + _vm.backgroundColor + "; side: double;",
                              "flex-item": "dimtype: attr; dimattr: text-cell;",
                              highlight:
                                "type: text; color: 0xFFFFFF; disabled: " +
                                (_vm.page == 0)
                            }
                          }),
                          _vm._v(" "),
                          _c("a-entity", {
                            attrs: {
                              "text-cell":
                                "text: " +
                                _vm.paginatorText +
                                "; width: 0.34; height: " +
                                _vm.lineSep +
                                "; fontsize: 3; " +
                                "nobr: true;",
                              geometry:
                                "primitive: plane; width: 0.34; height: " +
                                _vm.lineSep +
                                ";",
                              material:
                                "color: " + _vm.backgroundColor + "; side: double;",
                              "flex-item": "dimtype: attr; dimattr: text-cell;"
                            }
                          }),
                          _vm._v(" "),
                          _c("a-entity", {
                            staticClass: "clickable",
                            attrs: {
                              clickable: "clickevent: pageright-favorites;",
                              "text-cell":
                                "text: >; width: 0.33; height: " +
                                _vm.lineSep +
                                "; fontsize: 3; " +
                                "nobr: true;",
                              geometry:
                                "primitive: plane; width: 0.33; height: " +
                                _vm.lineSep +
                                ";",
                              material:
                                "color: " + _vm.backgroundColor + "; side: double;",
                              "flex-item": "dimtype: attr; dimattr: text-cell;",
                              highlight:
                                "type: text; color: 0xFFFFFF; disabled: " +
                                !_vm.canPageRight
                            }
                          })
                        ],
                        1
                      )
                    ],
                    2
                  )
                ],
                1
              )
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$3 = [];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$3 = normalizeComponent(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        false,
        undefined,
        undefined,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$4 = {
        props: {
          'radius': {
                type: Number,
                default: 1
            },
        },

        computed:{
            geoCoords: function() {
                var coords = [];
                switch (this.$store.state.facet) {
                    case 'events':
                        var events = this.$store.state.objects.events;
                        for (var event of events) {
                            if (typeof event.hydratedLocation != 'undefined') {
                                coords.push(event.hydratedLocation.geolocation);
                            }
                            else if (typeof event.location != 'undefined' & event.location != null) {
                                coords.push(event.location.geolocation);
                            }
                        }
                        break;
                    default:
                        console.debug('only the events facet has location data');
                        break;
                }
                return coords;
            },
        },

    };

    /* script */
    const __vue_script__$4 = script$4;

    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { attrs: { id: "globe-container" } },
        [
          _c("a-sphere", {
            staticClass: "boundry",
            attrs: {
              id: "Earth",
              rotation: "0 0 0",
              radius: _vm.radius,
              material: "src:#earth; roughness: 1; transparent: true; opacity: 0.9;"
            }
          }),
          _vm._v(" "),
          _vm.$store.state.facet == "events"
            ? _c("a-globe-points", {
                attrs: { points: _vm.geoCoords, radius: _vm.radius }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$4 = [];
    __vue_render__$4._withStripped = true;

      /* style */
      const __vue_inject_styles__$4 = undefined;
      /* scoped */
      const __vue_scope_id__$4 = undefined;
      /* module identifier */
      const __vue_module_identifier__$4 = undefined;
      /* functional template */
      const __vue_is_functional_template__$4 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$4 = normalizeComponent(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$4,
        __vue_script__$4,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$5 = {

        components: {
            RoomDisplay: __vue_component__$2,
            SavedSearches: __vue_component__$3,
            Globe: __vue_component__$4,
        },

        data () {
            return {
                focusedCell: '',
                dur: 0.5, //seconds
                cylinder: null,
                cylindricalGrid: null,
                AppTypeEnum: AppTypeEnum,
                SkyboxEnum: SkyboxEnum,
                paginatorOffsetZ: 1.4,
                searchJustChanged: false,
            }
        },

        props: ['offsety', 'offsetz'],

        computed: {
            gridRotation() {
                return (180-(360/this.gridCellsPerRow)*2);
            },

            gridOffsetY() {
                return (1-this.rows/2)*this.cellHeight;
            },

            sortedLSObjs() {
                var sorted = this.LSObjs;
                sorted.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                return sorted;
            },

            LSItems() {
                return this.sortedLSObjs.slice(this.page * this.itemsPerPage, (this.page+1) * this.itemsPerPage);
            },
            items: function() {
                var items;
                if (this.$store.state.facet === 'contacts') {
                    items = this.LS_CONTACTS.slice(this.page * this.itemsPerPage,
                        (this.page+1) * this.itemsPerPage);
                }
                else if (this.$store.state.facet === 'content') {
                    items = this.LS_CONTENT.slice(this.page * this.itemsPerPage,
                        (this.page+1) * this.itemsPerPage);
                }
                else if (this.$store.state.facet === 'events') {
                    items = this.LS_EVENTS.slice(this.page * this.itemsPerPage,
                        (this.page+1) * this.itemsPerPage);
                }
                else if (this.$store.state.facet === 'people') {
                    items = this.LS_PEOPLE.slice(this.page * this.itemsPerPage,
                        (this.page+1) * this.itemsPerPage);
                }
                return items;
            },
            numberOfItemsToDisplay() {
                var length = this.AppType == AppTypeEnum.XR ? this.LSItems.length : this.items.length;
                return Math.min(this.itemsPerPage, length);
            },

            focusedCellIndex() {
                if (this.focusedCell == '') {
                    return -1;
                }
                return +(this.focusedCell.match(/\d+$/)[0]);
            },

            focusedHasLocation() {
                var items = this.AppType == AppTypeEnum.XR ? this.LSItems : this.items;
                var item = items[this.focusedCellIndex];
                var result = (typeof item.hydratedLocation != 'undefined' || 
                    typeof item.location != 'undefined' & item.location != null);
                return result;
            },

            focusedLatitude() {
                var items = this.AppType == AppTypeEnum.XR ? this.LSItems : this.items;
                var item = items[this.focusedCellIndex];
                if (item.location != null && item.location.geolocation != null) {
                    return item.location.geolocation[1];
                }
                return 0;
            },

            focusedLongitude() {
                var items = this.AppType == AppTypeEnum.XR ? this.LSItems : this.items;
                var item = items[this.focusedCellIndex];
                if (item.location != null && item.location.geolocation != null) {
                    return item.location.geolocation[0];
                }
                return 0;
            },

            roomDisplayRotation() {
                return Math.tan(this.floorRadius/this.offsetz)* (180/Math.PI)-90;
            },

            ...vuex.mapState(
                [
                    'facet',
                    'searching'
                ]
            ),
            ...vuex.mapState('xr',
                [
                    'AppType',
                    'inVR',
                    'LSObjs',
                    'roomConfig',
                    'sceneLayout',
                ]
            ),

            ...vuex.mapState('xr/graphics',
                [
                    'bump',
                    'normal',
                    'quality',
                    'shading',
                ]
            ),

            ...vuex.mapGetters('xr/graphics',
                [
                    'qualityString',
                    'skybox',
                ]
            ),

            ...vuex.mapState('xr/style',
                [
                    'hoverColor',
                    'activeColor',
                ]
            ),
            
            ...vuex.mapState('xr/map',
                [
                    // 'globeActive',
                    'floorMapActive',
                    'worldMapActive',
                    'mapLatitude',
                    'mapLongitude',
                    'mapboxType',

                    'floorRows',
                    'floorZoom',
                    'floorHighDPI',
                    'floorScale',
                    'floorMapHeightmap',
                    'floorMapHeight',

                    'worldRows',
                    'worldZoom',
                    'worldHighDPI',
                    'worldScale',
                    'worldMapHeightmap',
                    'worldMapHeight',

                ]
            ),

            ...vuex.mapState('xr/grid',
                [
                    'page',
                    'columns',
                    'rows',
                    'radius',
                    'top',
                    'bottom',
                    'cellWidth',
                    'cellHeight',
                    'cellContentHeight',
                    'gridCellsPerRow',
                    'focusedCellPosititon',
                    'focusedCellScale',
                    'arrowWidth',
                    'arrowHeight',
                    'focusArrowHeight',
                    'focusArrowWidth',
                    'focusArrowMargin',
                    'animateInSeconds',
                    'animateOutSeconds',
                ]
            ),

            ...vuex.mapGetters('xr',
                [
                    'LS_CONTENT',
                    'LS_EVENTS',
                    'LS_CONTACTS',
                    'LS_PEOPLE'
                ]
            ),

            ...vuex.mapGetters('xr/grid',
                [
                    'itemsPerPage',
                    'canPageLeft',
                    'canPageRight',
                ]
            ),

            ...vuex.mapState('xr/carousel',
                [
                    'floorActive',
                    'floorRadius',
                    'numberOfSegments',
                    'spawnRingInnerRadius',
                    'spawnRingOuterRadius'
                ]
            ),

            ...vuex.mapState('xr/avatar',
                [
                    'playerHeight',
                ]
            ),

            leftArrowPosition() {
                return `${-this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.floorRadius}`;
            },

            rightArrowPosition() {
                return `${this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.floorRadius}`;
            },

        },

        watch: {
            facet: function (newVal, oldVal) {
                this.facetJustChanged = true;
                this.$store.commit('xr/grid/RESET_PAGE');
            },

            searching: function (newVal, oldVal) {
                this.searchJustChanged = true;
                this.$store.commit('xr/grid/RESET_PAGE');
            },

            gridCellsPerRow: function (newVal, oldVal) {
                this.cylinder.cellsPerRow = newVal;
                this.cylindricalGrid.cellsPerRow = newVal;
            },
            cellHeight: function (newVal, oldVal) {
                this.cylinder.cellHeight = newVal;
                this.cylindricalGrid.cellHeight = newVal;
            },
            radius: function (newVal, oldVal) {
                this.cylinder.radius = newVal;
                this.cylindricalGrid.radius = newVal;
            },
            items: function (newVal, oldVal) {
                var self = this;
                var scene = AFRAME.scenes[0];
                if (!scene) {console.log('no aframe scene');return;}
                var self = this;
                var behavior = {
                    el: scene,
                    get tick() {
                        return function() {
                            for (var n=0; n < self.numberOfItemsToDisplay; n++) {
                                var cell = document.querySelector(`#grid-cell-${n}`);
                                cell.components['ls-cell'].updateCell();
                            }
                            scene.removeBehavior(this);
                        }
                    }
                };
                if( !this.searching ) {
                    if ( !this.searchJustChanged ){
                        scene.addBehavior(behavior);
                    }
                    else if ( this.searchJustChanged ) {
                        this.searchJustChanged = false;
                    }
                }
            },

            LS_CONTENT: function (newVal, oldVal) {
                this.$store.commit('xr/grid/RESET_PAGE');
            },
            LS_EVENTS: function (newVal, oldVal) {
                this.$store.commit('xr/grid/RESET_PAGE');
            },
            LS_CONTACTS: function (newVal, oldVal) {
                this.$store.commit('xr/grid/RESET_PAGE');
            },
            LS_PEOPLE: function (newVal, oldVal) {
                this.$store.commit('xr/grid/RESET_PAGE');
            },
        },
        
        created() {
            this.cylinder = new Cylinder(this.gridCellsPerRow, this.cellHeight, this.radius);
            this.cylindricalGrid = new CylindricalGrid(this.gridCellsPerRow, this.cellHeight,
                this.radius, this.rows, this.columns);
        },

        mounted() {
            var self = this;
            this.$el.addEventListener('cellclicked', self.cellClickedHandler);
            // this.$el.addEventListener('objectclicked', self.objectClickedHandler);
            this.$el.addEventListener('media-mesh-set', self.mediaMeshLoadedHandler);
            this.$el.addEventListener('pageleft', self.handlePageLeft);
            this.$el.addEventListener('pageright', self.handlePageRight);
            this.$el.addEventListener('previouscell', self.previousCell);
            this.$el.addEventListener('nextcell', self.nextCell);
        },

        beforeDestroy() {
            var self = this;
            this.$el.removeEventListener('cellclicked', self.cellClickedHandler);
            // this.$el.removeEventListener('objectclicked', self.objectClickedHandler);
            this.$el.removeEventListener('media-mesh-set', self.mediaMeshLoadedHandler);
            this.$el.removeEventListener('pageleft', self.handlePageLeft);
            this.$el.removeEventListener('pageright', self.handlePageRight);
            this.$el.removeEventListener('previouscell', self.previousCell);
            this.$el.removeEventListener('nextcell', self.nextCell);
            this.$store.commit('xr/grid/RESET_PAGE');
        },

        methods: {

            ...vuex.mapActions('xr/grid/',
            [
                'pageRight',
                'pageLeft'
            ]),

            imageSrc: function (image) {
                if(!image)
                    return '';
                else
                    return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
            },

            gridCellRotation: function(itemNum) {
                var rot = this.cylindricalGrid.cellRotation(itemNum);
                return `${rot.x} ${rot.y + 180} ${rot.z}`;
            },

            gridCellPosition: function(itemNum) {
                var pos = this.cylindricalGrid.cellPosition(itemNum);
                return `${pos.x} ${pos.y} ${pos.z}`;
            },

            cylinderRotation: function(column, row) {
                var rot = this.cylinder.cellRotation(column, row);
                return `${rot.x} ${rot.y} ${rot.z}`;
            },

            cylinderPosition: function(column, row) {
                var pos = this.cylinder.cellPosition(column, row);
                return `${pos.x} ${pos.y} ${pos.z}`;
            },

            nextCell(evt) {
                var n = this.focusedCellIndex;
                var m = (n + 1) % this.numberOfItemsToDisplay;
                var nextCellId = this.focusedCell.replace(/\d+$/, m);
                var focusedCellEl = document.querySelector('#' + this.focusedCell);
                var nextCellEl =  document.querySelector('#' + nextCellId);
                this.focusedCell = nextCellId;

                this.unFocusCell(focusedCellEl);
                if (n == this.numberOfItemsToDisplay - 1 && this.canPageRight) {
                    this.pageRight();
                    this.focusedCell = '';
                    this.revealNonFocusedCells();
                    return;
                }
                focusedCellEl.components['fade'].animateHideCellPromise();
                this.focusCell(nextCellEl);
                nextCellEl.components['fade'].animateRevealCellPromise();
            },

            previousCell(evt) {
                var self = this;
                var n = this.focusedCellIndex;
                var m = n == 0 ? this.itemsPerPage - 1 : n - 1;
                var previousCellId = this.focusedCell.replace(/\d+$/, m);
                var focusedCellEl = document.querySelector('#' + this.focusedCell);
                var previousCellEl = document.querySelector('#' + previousCellId);
                this.focusedCell = previousCellId;

                this.unFocusCell(focusedCellEl);

                if (n == 0 && this.canPageLeft) {
                    this.pageLeft();
                    this.focusedCell = '';
                    self.revealNonFocusedCells();
                    return;
                }
                focusedCellEl.components['fade'].animateHideCellPromise();
                if (!!previousCellEl) {
                    this.focusCell(previousCellEl);
                    previousCellEl.components['fade'].animateRevealCellPromise();
                }
                else {
                    var mediaSetCallback =  function(evt) {
                        if (evt.target.id == previousCellId) {
                            self.focusCell(evt.target);
                            self.$el.removeEventListener('media-mesh-set', mediaSetCallback);
                        }
                    };
                    self.$el.addEventListener('media-mesh-set', mediaSetCallback);
                }
            },

            cellClickedHandler(evt) {
                var self = this;
                var el = evt.target;
                var id = el.id;

                if (id == 'grid-cell-carousel') {
                    self.toggleLayout();
                    return;
                }

                switch (self.focusedCell) {
                    case '':
                        self.focusedCell = id;
                        self.focusCell(el);
                        self.hideNonFocusedCells();
                        break;
                    case id:
                        const unFocusingCellIndex = self.focusedCellIndex;
                        self.unFocusCell(el);
                        self.focusedCell = '';
                        self.revealNonFocusedCells(unFocusingCellIndex);
                        break;
                    default:
                        var focusedCellEl = document.querySelector('#' + self.focusedCell);
                        self.unFocusCell(focusedCellEl);
                        self.focusCell(el);
                        break;
                }
            },

            // objectClickedHandler(evt) {
            //     var self = this;
            //     var el = evt.target;
            //     var id = el.id;

            //     switch (id) {
            //         case 'floor-map-selector':
            //             this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', !this.floorMapActive);
            //             break;
            //         default:
            //             break;
            //     }
            // },

            mediaMeshLoadedHandler(evt) {
                var self = this;
                if (self.focusedCell != '') {
                    if (evt.detail.id != self.focusedCell) {
                        evt.target.components['fade'].animateHideCellPromise();
                    }
                }
            },

            focusCell(el) {
                var self = this;
                if (CONFIG.DEBUG) {console.log('focusCell');}

                var cylinderEl = this.$el.querySelector(".grid-cylinder");
                var fcp = self.focusedCellPosititon;
                var position = new THREE.Vector3( fcp.x, fcp.y + this.offsety, fcp.z );
                position = cylinderEl.object3D.worldToLocal(position);
                if (this.inVR) {
                    self.focusedCell = el.id;
                    self.setSkyFromFocusedCell();
                    el.parentEl.object3D.position.set(position.x, position.y, position.z);
                    el.parentEl.object3D.rotation.set(0, THREE.Math.degToRad(360-self.gridRotation), 0);
                    el.setAttribute('selected', true);
                    return;
                }

                var positionAnimation = AFRAME.ANIME({ 
                    targets: el.parentEl.object3D.position,
                    easing: 'linear',
                    x: position.x,
                    y: position.y,
                    z: position.z,
                    duration: self.dur*1000,
                    begin: function(anim) {
                        self.focusedCell = el.id;
                        self.setSkyFromFocusedCell();
                    },
                    complete: function(anim) {
                        el.setAttribute('selected', true);
                    }
                });
                var rotationAnimation = AFRAME.ANIME({
                    targets: el.parentEl.object3D.rotation,
                    easing: 'linear',
                    x: 0,
                    y: THREE.Math.degToRad(360-self.gridRotation),
                    z: 0,
                    duration: self.dur*1000
                });
                // AFRAME.ANIME({
                //     targets: el.parentEl.object3D.scale,
                //     easing: 'linear',
                //     x: self.focusedCellScale.x,
                //     y: self.focusedCellScale.y,
                //     z: self.focusedCellScale.z,
                //     duration: self.dur*1000
                // });
            },

            unFocusCell(el) {
                var self = this;
                if (CONFIG.DEBUG) {console.log('unFocusCell');}      
                var posx, posy, posz, rotx, roty, rotz;
                var id = el.id;
                var n = id.match(/\d+$/);
                var position = self.gridCellPosition(+n);
                var positionArray = position.split(' ');
                posx = +positionArray[0];
                posy = +positionArray[1];
                posz = +positionArray[2];
                var rotation = self.gridCellRotation(+n);
                var rotationArray = rotation.split(' ');
                rotx = +rotationArray[0] * (Math.PI/180) ;
                roty = +rotationArray[1] * (Math.PI/180);
                rotz = +rotationArray[2] * (Math.PI/180);

                if (this.inVR) {
                    el.setAttribute('selected', false);
                    el.parentEl.object3D.position.set(posx, posy, posz);
                    el.parentEl.object3D.rotation.set(rotx, roty, rotz);
                    return;
                }

                AFRAME.ANIME({
                    targets: el.parentEl.object3D.position,
                    easing: 'linear',
                    x: posx,
                    y: posy,
                    z: posz,
                    duration: self.dur*1000,
                    begin: function(anim) {
                        el.setAttribute('selected', false);
                    }
                });
                AFRAME.ANIME({
                    targets: el.parentEl.object3D.rotation,
                    easing: 'linear',
                    x: rotx,
                    y: roty,
                    z: rotz,
                    duration: self.dur*1000
                });
                // AFRAME.ANIME({
                //     targets: el.parentEl.object3D.scale,
                //     easing: 'linear',
                //     x: 1,
                //     y: 1,
                //     z: 1,
                //     duration: self.dur*1000
                // });
            },
            unFocusFoscusedCell() {
                if (this.focusedCell) {
                    var focusedCellEl = document.querySelector('#' + this.focusedCell);
                    this.focusedCell = '';
                    this.unFocusCell(focusedCellEl);
                }
            },

            hideNonFocusedCells() {
                for (var i=0; i<this.numberOfItemsToDisplay; i++) {
                    if (i==this.focusedCellIndex) continue;
                    var el = document.querySelector(`#grid-cell-${i}`);
                    var anim = el.components['fade'].animateHideCellPromise();
                }
                var leftArrow = document.querySelector('.grid-arrow-left');
                var rightArrow = document.querySelector('.grid-arrow-right');
                // var floorMapSelector = document.querySelector('.floor-map-selector');
                leftArrow.setAttribute('visible', false);
                rightArrow.setAttribute('visible', false);
            },
            revealNonFocusedCells(skipCellIndex=-1) {
                for (var i=0; i<this.numberOfItemsToDisplay; i++) {
                    if (i==skipCellIndex) continue;
                    var el = document.querySelector(`#grid-cell-${i}`);
                    var anim = el.components['fade'].animateRevealCellPromise();
                }
                var leftArrow = document.querySelector('.grid-arrow-left');
                var rightArrow = document.querySelector('.grid-arrow-right');
                // var floorMapSelector = document.querySelector('.floor-map-selector');
                // animationPromises.push(floorMapSelector.components['fade'].animateRevealCellPromise());
                leftArrow.setAttribute('visible', true);
                rightArrow.setAttribute('visible', true);
            },
            handlePageLeft() {
                if(!this.canPageLeft) return;
                this.unFocusFoscusedCell();
                this.pageAnimation(this.pageLeft);
            },

            handlePageRight() {
                if(!this.canPageRight) return;
                this.unFocusFoscusedCell();
                this.pageAnimation(this.pageRight);
            },

            pageAnimation(pageCallback) {
                var self = this;
                var cellObjs = [];
                var cells = [];
                var animationPromises = [];
                for (var n=0; n < this.numberOfItemsToDisplay; n++) {
                    var cell = document.querySelector(`#grid-cell-${n}`);
                    if(!this.inVR) animationPromises.push(this.animateCellRemovalPromise(cell.object3D));
                    cellObjs.push(cell.object3D);
                    cells.push(cell);
                }
                Promise.all(animationPromises)
                .then((results) => {
                    pageCallback();
                    if (this.AppType == AppTypeEnum.XR) {
                        cellObjs.forEach((obj) => self.resetCellScale(obj));
                    }
                    else {
                        cells.forEach((cell) => {
                            self.resetCellScale(cell.object3D);
                            // cell.components['ls-cell'].updateCell();
                        });
                    }
                });
            },

            animateCellRemovalPromise(obj) {
                var self = this;
                return new Promise((resolve, reject) => {
                    try {
                        if (!this.inVR) {
                            AFRAME.ANIME({
                                targets: obj.scale,
                                easing: 'linear',
                                x: [1, 0],
                                y: [1, 0],
                                z: [1, 0],
                                duration: 1000*(self.animateOutSeconds),
                                complete: function(anim) {
                                    resolve();
                                }
                            });
                        }
                        else {
                            obj.scale.set(0,0,0);
                            resolve();
                        }
                    }
                    catch (error) {
                        console.error('animateCellRemovalPromise error');
                        console.log(error);
                        reject(error);
                    }
                });
            },

            resetCellScale(obj) {
                obj.scale.set(1,1,1);
            },

            toggleLayout() {
                if (CONFIG.DEBUG) {console.log("toggleLayout");}
                var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
                this.$store.commit('xr/SET_LAYOUT', newVal);
            },

            updateSkyTime(item) {
                var newTime = TimeUtils.datetimeToHourDecimal(item.datetime);
                this.$store.commit('xr/graphics/SET_SKYTIME', newTime);
            },

            setSkyFromFocusedCell() {
                var items = this.AppType == AppTypeEnum.XR ? this.LSItems : this.items;
                var item = items[this.focusedCellIndex];
                if (typeof item.datetime != 'undefined' && item.datetime != null) {
                    this.updateSkyTime(item);
                }
            },
        }
    };

    /* script */
    const __vue_script__$5 = script$5;

    /* template */
    var __vue_render__$5 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        {
          staticClass: "xr-grid",
          attrs: { position: "0 " + _vm.offsety + " " + _vm.offsetz }
        },
        [
          _c("a-entity", {
            attrs: { light: "type: ambient; color: #FFF; intensity: 0.8" }
          }),
          _vm._v(" "),
          _c("a-entity", {
            attrs: {
              id: "dirLight",
              light: "type: directional; color: #FFF; intensity: 0.8;",
              position: "-1 -1 0"
            }
          }),
          _vm._v(" "),
          _c("a-light", {
            attrs: {
              type: "point",
              color: "#FFF",
              intensity: "0.8",
              position: "10 10 0"
            }
          }),
          _vm._v(" "),
          _c("a-light", {
            attrs: {
              type: "hemisphere",
              color: "#FFF",
              groundColor: "#00F",
              intensity: "0.8"
            }
          }),
          _vm._v(" "),
          _vm.AppType == _vm.AppTypeEnum.APP && _vm.searching
            ? _c("a-searching", {
                attrs: {
                  radius: "0.5",
                  position:
                    _vm.focusedCellPosititon.x +
                    " " +
                    _vm.focusedCellPosititon.y +
                    " " +
                    (_vm.focusedCellPosititon.z - _vm.offsetz)
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.AppType == _vm.AppTypeEnum.XR
            ? _c(
                "a-entity",
                {
                  staticClass: "grid-cylinder",
                  attrs: {
                    rotation: "0 " + _vm.gridRotation + " 0",
                    position: "0 " + _vm.gridOffsetY + " 0"
                  }
                },
                _vm._l(_vm.LSItems, function(item, n) {
                  return _c(
                    "a-entity",
                    {
                      key: "grid-cell-" + n,
                      attrs: {
                        position: _vm.gridCellPosition(n),
                        rotation: _vm.gridCellRotation(n)
                      }
                    },
                    [
                      _c("a-media-cell", {
                        staticClass: "clickable gridcell",
                        attrs: {
                          clickable: "clickevent: cellclicked;",
                          highlight:
                            "type: border; target: " +
                            item.type +
                            "; hoverColor: " +
                            _vm.hoverColor +
                            "; activeColor: " +
                            _vm.activeColor +
                            "; createborder: true; borderbaseopacity: 0.7;",
                          id: "grid-cell-" + n,
                          type: item.type,
                          src: _vm.imageSrc(item),
                          width: _vm.cellWidth,
                          height: _vm.cellContentHeight,
                          srcFit: "bothmax",
                          animatein: _vm.animateInSeconds,
                          fade: "animate: " + !_vm.inVR,
                          animateload: _vm.inVR ? "false" : "true"
                        }
                      })
                    ],
                    1
                  )
                }),
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.AppType == _vm.AppTypeEnum.APP
            ? _c(
                "a-entity",
                {
                  staticClass: "grid-cylinder",
                  attrs: {
                    rotation: "0 " + _vm.gridRotation + " 0",
                    position: "0 " + _vm.gridOffsetY + " 0"
                  }
                },
                _vm._l(_vm.items, function(item, n) {
                  return _c(
                    "a-entity",
                    {
                      key: "grid-cell-" + n,
                      attrs: {
                        position: _vm.gridCellPosition(n),
                        rotation: _vm.gridCellRotation(n)
                      }
                    },
                    [
                      _vm.$store.state.facet == "events"
                        ? _c("a-ls-cell", {
                            staticClass: "clickable gridcell",
                            attrs: {
                              clickable: "clickevent: cellclicked;",
                              highlight:
                                "type: border; hoverColor: " +
                                _vm.hoverColor +
                                "; activeColor: " +
                                _vm.activeColor +
                                ";" +
                                "borderbaseopacity: 0.7;",
                              id: "grid-cell-" + n,
                              mediatype: item.content.type,
                              mediaurl: item.content.embed_content,
                              width: _vm.cellWidth,
                              height: _vm.cellContentHeight,
                              srcFit: "bothmax",
                              animatein: _vm.animateInSeconds,
                              "animate-load": _vm.inVR ? "false" : "true",
                              provider: item.connection.provider.name,
                              contenttype: item.content.type,
                              value: item.content.text,
                              title: item.content.title,
                              price: item.content.price,
                              url: item.content.url,
                              tags: item.content.tags,
                              facet: _vm.$store.state.facet,
                              eventtype: item.eventtype,
                              datetime: item.datetime,
                              fontsize: "1",
                              wrapcount: "44",
                              color: "#a2a2a2",
                              nobr: "false",
                              background: "true",
                              wrapfit: "true",
                              fade: "animate: " + !_vm.inVR
                            }
                          })
                        : _vm.$store.state.facet == "content"
                        ? _c("a-ls-cell", {
                            key: "grid-cell-" + n,
                            staticClass: "clickable gridcell",
                            attrs: {
                              id: "grid-cell-" + n,
                              width: _vm.cellWidth,
                              height: _vm.cellContentHeight,
                              fontsize: "1",
                              wrapcount: "44",
                              color: "#a2a2a2",
                              nobr: "false",
                              background: "true",
                              wrapfit: "true",
                              srcFit: "bothmax",
                              animatein: _vm.animateInSeconds,
                              "animate-load": _vm.inVR ? "false" : "true",
                              fade: "animate: " + !_vm.inVR,
                              clickable: "clickevent: cellclicked;",
                              highlight:
                                "type: border; hoverColor: " +
                                _vm.hoverColor +
                                "; activeColor: " +
                                _vm.activeColor +
                                ";" +
                                "borderbaseopacity: 0.7;",
                              facet: _vm.$store.state.facet,
                              contenttype: item.type,
                              provider: item.connection.provider.name,
                              mediatype: item.type,
                              mediaurl: item.embed_content,
                              value: item.text,
                              title: item.title,
                              price: item.price,
                              url: item.url,
                              tags: item.tags
                            }
                          })
                        : _vm.$store.state.facet == "contacts"
                        ? _c("a-ls-cell", {
                            staticClass: "clickable gridcell",
                            attrs: {
                              clickable: "clickevent: cellclicked;",
                              highlight:
                                "type: border; hoverColor: " +
                                _vm.hoverColor +
                                "; activeColor: " +
                                _vm.activeColor +
                                ";" +
                                "borderbaseopacity: 0.7;",
                              id: "grid-cell-" + n,
                              mediatype: item.type,
                              mediaurl: item.embed_content,
                              width: _vm.cellWidth,
                              height: _vm.cellContentHeight,
                              srcFit: "bothmax",
                              animatein: _vm.animateInSeconds,
                              "animate-load": _vm.inVR ? "false" : "true",
                              facet: _vm.$store.state.facet,
                              avatarurl: item.avatar_url,
                              contactname: item.name,
                              contacthandle: item.handle,
                              tags: item.tags,
                              fontsize: "1",
                              wrapcount: "44",
                              color: "#a2a2a2",
                              nobr: "false",
                              background: "true",
                              wrapfit: "true",
                              fade: "animate: " + !_vm.inVR
                            }
                          })
                        : _vm.$store.state.facet == "people"
                        ? _c("a-ls-cell", {
                            staticClass: "clickable gridcell",
                            attrs: {
                              clickable: "clickevent: cellclicked;",
                              highlight:
                                "type: border; hoverColor: " +
                                _vm.hoverColor +
                                "; activeColor: " +
                                _vm.activeColor +
                                ";" +
                                "borderbaseopacity: 0.7;",
                              id: "grid-cell-" + n,
                              mediatype: item.type,
                              mediaurl: item.embed_content,
                              width: _vm.cellWidth,
                              height: _vm.cellContentHeight,
                              srcFit: "bothmax",
                              animatein: _vm.animateInSeconds,
                              "animate-load": _vm.inVR ? "false" : "true",
                              avatarurl: item.avatar_url,
                              firstname: item.first_name,
                              lastname: item.last_name,
                              middlename: item.middle_name,
                              tags: item.tags,
                              facet: _vm.$store.state.facet,
                              fontsize: "1",
                              wrapcount: "44",
                              color: "#a2a2a2",
                              nobr: "false",
                              background: "true",
                              wrapfit: "true",
                              fade: "animate: " + !_vm.inVR
                            }
                          })
                        : _vm._e()
                    ],
                    1
                  )
                }),
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c("a-arrow", {
            staticClass: "grid-arrow-left clickable",
            attrs: {
              direction: "left",
              clickable: "clickevent: pageleft;",
              position: _vm.leftArrowPosition,
              width: _vm.arrowWidth,
              height: _vm.arrowHeight,
              disabled: !_vm.canPageLeft,
              hoverColor: _vm.hoverColor,
              activeColor: _vm.activeColor
            }
          }),
          _vm._v(" "),
          _c("a-arrow", {
            staticClass: "grid-arrow-right clickable",
            attrs: {
              direction: "right",
              clickable: "clickevent: pageright;",
              position: _vm.rightArrowPosition,
              width: _vm.arrowWidth,
              height: _vm.arrowHeight,
              disabled: !_vm.canPageRight,
              hoverColor: _vm.hoverColor,
              activeColor: _vm.activeColor
            }
          }),
          _vm._v(" "),
          _vm.focusedCell != ""
            ? _c(
                "a-entity",
                {
                  staticClass: "focused-cell-controls",
                  attrs: {
                    position:
                      _vm.focusedCellPosititon.x +
                      " " +
                      _vm.focusedCellPosititon.y +
                      " " +
                      (_vm.focusedCellPosititon.z - _vm.offsetz)
                  }
                },
                [
                  _c("a-arrow", {
                    staticClass: "cell-arrow-left clickable",
                    attrs: {
                      disabled: _vm.focusedCellIndex == 0 && !_vm.canPageLeft,
                      clickable:
                        "clickevent: previouscell; enabled: " +
                        (_vm.focusedCellIndex != 0 || _vm.canPageLeft),
                      direction: "left",
                      position:
                        -(
                          (_vm.cellWidth * _vm.focusedCellScale.x) / 2 +
                          _vm.focusArrowMargin
                        ) + " 0 0",
                      width: _vm.focusArrowWidth,
                      height: _vm.focusArrowHeight,
                      hoverColor: _vm.hoverColor,
                      activeColor: _vm.activeColor
                    }
                  }),
                  _vm._v(" "),
                  _c("a-arrow", {
                    staticClass: "cell-arrow-right clickable",
                    attrs: {
                      disabled:
                        _vm.focusedCellIndex == _vm.numberOfItemsToDisplay - 1 &&
                        !_vm.canPageRight,
                      direction: "right",
                      clickable:
                        "clickevent: nextcell; enabled: " +
                        (_vm.focusedCellIndex != _vm.numberOfItemsToDisplay - 1 ||
                          _vm.canPageRight),
                      position:
                        (_vm.cellWidth * _vm.focusedCellScale.x) / 2 +
                        _vm.focusArrowMargin +
                        " 0 0",
                      width: _vm.focusArrowWidth,
                      height: _vm.focusArrowHeight,
                      hovercolor: _vm.hoverColor,
                      activecolor: _vm.activeColor
                    }
                  }),
                  _vm._v(" "),
                  _vm.focusedHasLocation
                    ? _c("a-mapbox-terrain", {
                        staticClass: "focused-cell-map",
                        attrs: {
                          position: "0 -0.75 0",
                          rotation: "45 0 0",
                          scale: _vm.floorScale + " 1 " + _vm.floorScale,
                          latitude: _vm.focusedLatitude,
                          longitude: _vm.focusedLongitude,
                          "zoom-level": _vm.floorZoom,
                          rows: _vm.floorRows,
                          highdpi: _vm.floorHighDPI,
                          heightmap: _vm.floorMapHeightmap,
                          heightmapheight: _vm.floorMapHeight,
                          type: _vm.mapboxType
                        }
                      })
                    : _vm._e()
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c("a-ring", {
            attrs: {
              position: "0 " + (-_vm.playerHeight + 0.01) + " " + -_vm.offsetz,
              rotation: "-90 0 0",
              color: "teal",
              "radius-inner": _vm.spawnRingInnerRadius,
              "radius-outer": _vm.spawnRingOuterRadius
            }
          }),
          _vm._v(" "),
          _vm.floorMapActive == true
            ? _c("a-mapbox-terrain", {
                attrs: {
                  position: "0 -1.6 " + -_vm.offsetz,
                  scale: _vm.floorScale + " 1 " + _vm.floorScale,
                  latitude: _vm.mapLatitude,
                  longitude: _vm.mapLongitude,
                  "zoom-level": _vm.floorZoom,
                  rows: _vm.floorRows,
                  highdpi: _vm.floorHighDPI,
                  heightmap: _vm.floorMapHeightmap,
                  heightmapheight: _vm.floorMapHeight,
                  type: _vm.mapboxType
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.worldMapActive == true
            ? _c("a-mapbox-terrain", {
                attrs: {
                  position: "0 -4 0",
                  scale: _vm.worldScale + " 1 " + _vm.worldScale,
                  latitude: _vm.mapLatitude,
                  longitude: _vm.mapLongitude,
                  "zoom-level": _vm.worldZoom,
                  rows: _vm.worldRows,
                  highdpi: _vm.worldHighDPI,
                  heightmap: _vm.worldMapHeightmap,
                  heightmapheight: _vm.worldMapHeight
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _c(
            "a-entity",
            {
              attrs: {
                position: "0 " + "-0.5" + " " + +_vm.floorRadius,
                animation:
                  "property: rotation; easing: linear; to: 0 360; dur: 15000; loop: true;"
              }
            },
            [_c("globe")],
            1
          ),
          _vm._v(" "),
          _vm.AppType == _vm.AppTypeEnum.XR
            ? _c("room-display", {
                attrs: {
                  id: "room-display",
                  position:
                    _vm.floorRadius + " " + _vm.cellHeight * 2 + " " + -_vm.offsetz,
                  rotation: "0 " + _vm.roomDisplayRotation + " 0",
                  size: 30
                }
              })
            : _vm.AppType == _vm.AppTypeEnum.APP
            ? _c("saved-searches", {
                attrs: { position: "1 0.5 " + -_vm.offsetz, rotation: "0 -90 0" }
              })
            : _vm._e(),
          _vm._v(" "),
          _c(
            "a-entity",
            {
              attrs: {
                id: "Logo",
                position: "0 1.1 0",
                rotation: "0 0 0",
                animation:
                  "property: rotation; easing: linear; to: 0 -360; dur: 42000; loop: true;"
              }
            },
            [
              _c("a-gltf-model", {
                attrs: { src: "#logo", scale: "0.075 0.075 0.075" }
              })
            ],
            1
          ),
          _vm._v(" "),
          _vm.floorActive
            ? _c("a-wooden-floor", {
                staticClass: "boundry",
                attrs: {
                  position: "0 " + -_vm.playerHeight + " 0",
                  radius: _vm.floorRadius,
                  radialsegments: _vm.numberOfSegments,
                  bump: _vm.bump,
                  normal: _vm.normal,
                  quality: _vm.quality,
                  shading: _vm.qualityString,
                  rotation: "0 135 0"
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$5 = [];
    __vue_render__$5._withStripped = true;

      /* style */
      const __vue_inject_styles__$5 = undefined;
      /* scoped */
      const __vue_scope_id__$5 = undefined;
      /* module identifier */
      const __vue_module_identifier__$5 = undefined;
      /* functional template */
      const __vue_is_functional_template__$5 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$5 = normalizeComponent(
        { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
        __vue_inject_styles__$5,
        __vue_script__$5,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$6 = {

        data() {
            return {
                opacity: 0.7,
                width: 1,
                height: 1,
                lineSep: .1,
                headerStyle: {
                    fontSize: '50px',
                    backgroundColor: '#22252a',
                    weight: 'bold',
                    margin: ".1 0 0 0"
                },
                textStyle: {
                    fontSize: '30px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae'
                },
                textList: [
                    'Thumbstick forward - begin teleport',
                    'Thumbstick release - teleport',
                    'Menu button - cycle through menus',
                    'Trigger - interact with gui',
                ],
                gui: {},
                guiActive: true
            }
        },


        mounted() {
            var self = this;
            self.gui = document.querySelector('#helpgui');
            console.log(self.gui);

            document.body.addEventListener('togglemenu', function(evt) {
                self.toggleHud();
            });
        },


        methods: {
            toggleHelpVisibility() {
                if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
                this.helpStyleObject.visibility = 
                    this.helpStyleObject.visibility == 'visible' ?
                    'hidden' : 'visible';
            },
            toggleHud() {
                // console.log('toggleHud');
                var self = this;

                if (self.guiActive) {
                    self.gui.parentElement.removeChild(self.gui);
                    self.guiActive = false;
                    console.log(self.gui);
                }
                else {
                    AFRAME.scenes[0].appendChild(self.gui);
                    self.guiActive = true;
                }
            },
        },
    };

    /* script */
    const __vue_script__$6 = script$6;

    /* template */
    var __vue_render__$6 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "hud-gui" },
        [
          _c(
            "a-gui-flex-container",
            {
              attrs: {
                id: "helpgui",
                opacity: _vm.opacity,
                width: _vm.width,
                height: _vm.height,
                "flex-direction": "column"
              }
            },
            [
              _c("a-gui-label", {
                attrs: {
                  value: "Controls",
                  opacity: _vm.opacity,
                  "font-size": _vm.headerStyle.fontSize,
                  "background-color": _vm.headerStyle.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.headerStyle.weight,
                  height: _vm.lineSep,
                  margin: _vm.headerStyle.margin
                }
              }),
              _vm._v(" "),
              _vm._l(_vm.textList, function(text, index) {
                return _c("a-gui-label", {
                  key: "hudguilabel-" + index,
                  attrs: {
                    value: text,
                    opacity: _vm.opacity,
                    "font-size": _vm.textStyle.fontSize,
                    "background-color": _vm.textStyle.backgroundColor,
                    "font-color": _vm.textStyle.fontColor,
                    height: _vm.lineSep
                  }
                })
              })
            ],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$6 = [];
    __vue_render__$6._withStripped = true;

      /* style */
      const __vue_inject_styles__$6 = undefined;
      /* scoped */
      const __vue_scope_id__$6 = undefined;
      /* module identifier */
      const __vue_module_identifier__$6 = undefined;
      /* functional template */
      const __vue_is_functional_template__$6 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$6 = normalizeComponent(
        { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
        __vue_inject_styles__$6,
        __vue_script__$6,
        __vue_scope_id__$6,
        __vue_is_functional_template__$6,
        __vue_module_identifier__$6,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var baseFontSize = 15;

    var script$7 = {

        data() {
            return {
                opacity: 0.7,
                width: 2,
                height: 1,
                lineSep: baseFontSize/300,
                panelColor: '#22252a',
                headerStyle: {
                    fontSize:  baseFontSize*5/3 + 'px',
                    backgroundColor: '#22252a',
                    weight: 'bold'
                },
                header2Style: {
                    fontSize:  baseFontSize*4/3 + 'px',
                    backgroundColor: '#22252a',
                    weight: 'bold'
                },
                textStyle: {
                    fontSize: baseFontSize + 'px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae'
                },
                radioStyle: {
                    fontSize:  baseFontSize + 'px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae',
                    radioSizeCoef: 2,
                },
                toggleStyle: {
                    fontSize:  baseFontSize + 'px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae'
                },
                inputStyle: {
                    fontSize:  baseFontSize + 'px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae',
                    weight: 'bold'
                },
                buttonStyle: {
                    fontSize:  baseFontSize + 'px',
                    backgroundColor: '#22252a',
                    fontColor: '#aeaeae',
                    weight: 'bold'
                },
                gui: {},
                guiActive: true,
                shadingSetting: {
                    DEFAULT: true,
                    CEL: false
                },
                ShadingEnum: ShadingEnum,
                carouselDimensions: {
                    segments: 24,
                    radius: 5
                },
                lat: 0,
                lon: 0,

                globeCheck: true,

                mapFloorCheck: false,
                floorMapTileRows: 1,
                floorMapZoom: 11,
                floorscale: 1,
                floorHighDPI: false,
                floorMapHeightmap: false,
                floorMapHeight: 1,


                mapWorldCheck: false,
                worldMapTileRows: 1,
                worldMapZoom: 11,
                worldscale: 1,
                worldHighDPI: false,
                worldMapHeightmap: false,
                worldMapHeight: 1,
            }
        },

        computed: {
            ...vuex.mapState('xr/graphics',
            [
                'shading',
                'skytime'
            ]),

            ...vuex.mapState('xr/hud',
            [
                'vrKeyboardTarget',
            ]),

            ...vuex.mapGetters('xr/graphics',
            [
                'timeHours',
                'timeMinutes',
                'timeMinutesString'
            ]),

            ...vuex.mapState('xr/carousel',
            [
                'numberOfSegments',
                'floorRadius'
            ]),

            ...vuex.mapState('xr/map',
            [
                'globeActive'
            ]),

            inputGlobeActive: {
                get () { return this.globeCheck;},
                set (val) { this.globeCheck = val; }
            },

            inputSegments: {
                get () { return this.carouselDimensions.segments },
                set (val) { this.carouselDimensions.segments = val; }
            },
            inputFloorRadius: {
                get () { return this.carouselDimensions.radius },
                set (val) { this.carouselDimensions.radius = val; }
            },
            inputMapLatitude: {
                get () { return this.lat },
                set (val) { this.lat = val; }
            },
            inputMapLongitude: {
                get () { return this.lon },
                set (val) { this.lon = val; }
            },
            mapLatitude: {
                get () { return this.$store.state.xr.map.mapLatitude;},
                set (val) { this.$store.commit('xr/map/SET_MAP_LATITUDE', val); }
            },
            mapLongitude: {
                get () { return this.$store.state.xr.map.mapLongitude;},
                set (val) { this.$store.commit('xr/map/SET_MAP_LONGITUDE', val); }
            },


            inputMapFloorRows: {
                get () { return this.floorMapTileRows },
                set (val) { this.floorMapTileRows = val; }
            },
            inputFloorScale: {
                get() { return this.floorscale },
                set (val) { this.floorscale = val; }
            },
            inputMapFloorZoom: {
                get () { return this.floorMapZoom },
                set (val) { this.floorMapZoom = val; }
            },
            inputMapFloorHighDPI: {
                get () { return this.floorHighDPI },
                set (val) { this.floorHighDPI = val; }
            },
            inputMapFloorHeightmap: {
                get () { return this.floorMapHeightmap },
                set (val) { this.floorMapHeightmap = val; }
            },
            inputMapFloorHeight: {
                get () { return this.floorMapHeight },
                set (val) { this.floorMapHeight= val; }
            },

            inputMapWorldRows: {
                get () { return this.worldMapTileRows },
                set (val) { this.worldMapTileRows = val; }
            },
            inputWorldScale: {
                get() { return this.worldscale },
                set (val) { this.worldscale = val; }
            },
            inputMapWorldZoom: {
                get () { return this.worldMapZoom },
                set (val) { this.worldMapZoom = val; }
            },
            inputMapWorldHighDPI: {
                get () { return this.worldHighDPI },
                set (val) { this.worldHighDPI = val; }
            },
            inputMapWorldHeightmap: {
                get () { return this.worldMapHeightmap },
                set (val) { this.worldMapHeightmap = val; }
            },
            inputMapWorldHeight: {
                get () { return this.worldMapHeight },
                set (val) { this.worldMapHeight= val; }
            },
        },

        mounted() {
            var self = this;
            // self.gui = document.querySelector('#vrhudentity');

            // document.body.addEventListener('togglemenu', self.toggleHud());
            self.$el.addEventListener('updatesky', self.updateSkyListener);
            self.$el.addEventListener('updatebump', self.updateBumpListener);
            self.$el.addEventListener('updatenormal', self.updateNormalListener);
            self.$el.addEventListener('updatefloormap', self.updateFloorMapListener);
            self.$el.addEventListener('updatefloordpi', self.updateFloorDPIListener);
            self.$el.addEventListener('updatefloorheightmap', self.updateFloorHeightMapListener);
            self.$el.addEventListener('updateworldmap', self.updateWorldMapListener);
            self.$el.addEventListener('updateshading', self.updateShadingListener);
            self.$el.addEventListener('updateflooractive', self.updateFloorActiveListener);
            self.$el.addEventListener('updateglobeactive', self.updateGlobeActiveListener);
            self.$el.addEventListener('updatequality', self.updateQualityListener);
            self.$el.addEventListener('editTime', self.editTimeHandler);

            document.addEventListener('superkeyboardinput', self.keyboardInputHandler);

            self.$el.addEventListener('click', self.clickHandler);

            self.inputSegments = self.numberOfSegments;
            self.inputFloorRadius = self.floorRadius;
            self.inputMapLatitude = self.mapLatitude;
            self.inputMapLongitude = self.mapLongitude;
            self.inputGlobeActive = self.globeActive;
        },

        beforeDestroy() {
            var self = this;
            // document.body.removeEventListener('togglemenu', self.toggleHud());
            self.$el.removeEventListener('updatesky', self.updateSkyListener);
            self.$el.removeEventListener('updatebump', self.updateBumpListener);
            self.$el.removeEventListener('updatenormal', self.updateNormalListener);
            self.$el.removeEventListener('updatefloormap', self.updateFloorMapListener);
            self.$el.removeEventListener('updateflooractive', self.updateFloorActiveListener);
            self.$el.removeEventListener('updatefloordpi', self.updateFloorDPIListener);
            self.$el.removeEventListener('updateworldmap', self.updateWorldMapListener);
            self.$el.removeEventListener('updateshading', self.updateShadingListener);
            self.$el.removeEventListener('updatefloorheightmap', self.updateFloorHeightMapListener);
            self.$el.removeEventListener('updateglobeactive', self.updateGlobeActiveListener);
            self.$el.removeEventListener('updatequality', self.updateQualityListener);
            self.$el.removeEventListener('editTime', self.editTimeHandler);

            document.removeEventListener('superkeyboardinput', self.keyboardInputHandler);

            self.$el.removeEventListener('click', self.clickHandler);
        },

        methods: {
            toggleHelpVisibility() {
                if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
                this.helpStyleObject.visibility = 
                    this.helpStyleObject.visibility == 'visible' ?
                    'hidden' : 'visible';
            },
            toggleHud() {
                // console.log('toggleHud');
                var self = this;

                if (self.guiActive) {
                    self.gui.parentElement.removeChild(self.gui);
                    self.guiActive = false;
                }
                else {
                    AFRAME.scenes[0].appendChild(self.gui);
                    self.guiActive = true;
                }
            },
            updateSkyListener(evt) {
                // console.log('updateSky');
                // var val = evt.detail.value;
                // var newVal = val.toUpperCase();// == SkyboxEnum.STARS ? 'SUN' : 'STARS';
                // this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
            },
            updateBumpListener(evt) {
                var val = evt.detail.value;
                console.log(`updateBump(${val})`);
                this.$store.commit('xr/graphics/SET_BUMP', val);
            },
            updateNormalListener(evt) {
                var val = evt.detail.value;
                console.log(`updateNormal(${val})`);
                this.$store.commit('xr/graphics/SET_NORMAL', val);
            },
            updateFloorMapListener(evt) {
                var val = evt.detail.value;
                console.log(`updateFloorMap(${val})`);
                this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', val);
            },
            updateFloorDPIListener(evt) {
                this.inputMapFloorHighDPI = !this.inputMapFloorHighDPI;
            },
            updateFloorHeightMapListener(evt) {
                this.inputMapFloorHeightmap = !this.inputMapFloorHeightmap;
            },
            updateWorldMapListener(evt) {
                var val = evt.detail.value;
                console.log(`updateWorldMap(${val})`);
                this.$store.commit('xr/map/SET_WORLD_MAP_ACTIVE', val);
            },
            updateShadingListener(evt) {
                var val = evt.detail.value;
                // console.log('updateSky');
                var newVal = val.toUpperCase();
                this.$store.commit('xr/graphics/SET_SHADING', newVal);
            },
            updateFloorActiveListener(evt) {
                var newVal = !this.$store.state.xr.carousel.floorActive;
                this.$store.commit('xr/carousel/SET_FLOOR_ACTIVE', newVal); 
            },

            updateGlobeActiveListener(evt) {
                var newVal = !this.$store.state.xr.map.globeActive;
                this.$store.commit('xr/map/SET_GLOBE_ACTIVE', newVal); 
            },
            updateQualityListener(evt) {
                var val = evt.detail.value;
                console.log(val);
                if (GraphicsQualityEnum.hasOwnProperty(val)) {
                    this.$store.commit('xr/graphics/SET_QUALITY', val);
                }
                else {
                    console.log(`couldn't change qualitySetting: ${val} is not a GraphicsQualityEnum`);
                }
            },
            clickHandler(evt) {
                console.log('clickHandler');
                switch (evt.target.id) {
                    case 'vr-setting-time-hours-input':
                    case 'vr-setting-time-minutes-input':
                    case 'vr-setting-carousel-segments-input':
                    case 'vr-setting-carousel-radius-input':
                    case 'vr-setting-map-lat-input':
                    case 'vr-setting-map-long-input':
                    case 'vr-setting-map-floor-scale-input':
                    case 'vr-setting-map-floor-rows-input':
                    case 'vr-setting-map-floor-zoom-input':
                    case 'vr-setting-map-floor-height-scale-input':
                    case 'vr-setting-map-world-scale-input':
                    case 'vr-setting-map-world-rows-input':
                    case 'vr-setting-map-world-zoom-input':
                    case 'vr-setting-map-world-height-scale-input':
                        this.$store.commit('xr/hud/SET_VR_KEYBOARD_MODEL', 'numpad');
                        this.$store.commit('xr/hud/SET_VR_KEYBOARD_ACTIVE', true);
                        this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', evt.target.id);
                        break;
                    case 'vr-setting-carousel-button':
                        this.updateCarousel();
                        break;
                    case 'vr-setting-map-button':
                        this.setMap();
                        break;
                }
            },
            keyboardInputHandler(evt) {
                console.log('keyboardInputHandler');
                console.log(evt);
                console.log(evt.detail.value);
                console.log(`${this.vrKeyboardTarget} input handler`);
                switch (this.vrKeyboardTarget) {
                    case 'vr-setting-time-hours-input':
                        this.$store.dispatch('xr/graphics/updateTimeHours', evt.detail.value);
                        this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', '');
                        break;
                    case 'vr-setting-time-minutes-input':
                        this.$store.dispatch('xr/graphics/updateTimeMinutes', evt.detail.value);
                        this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', '');
                        break;
                    case 'vr-setting-carousel-segments-input':
                        this.inputSegments = +evt.detail.value;
                        break;
                    case 'vr-setting-carousel-radius-input':
                        this.inputFloorRadius = +evt.detail.value;
                        break;
                    case 'vr-setting-map-lat-input':
                        this.inputMapLatitude =  +evt.detail.value;
                        break;
                    case 'vr-setting-map-long-input':
                        this.inputMapLongitude =  +evt.detail.value;
                        break;
                    case 'vr-setting-map-floor-scale-input':
                        this.inputFloorScale = +evt.detail.value;
                        break;
                    case 'vr-setting-map-floor-rows-input':
                        this.inputMapFloorRows = +evt.detail.value;
                        break;
                    case 'vr-setting-map-floor-zoom-input':
                        this.inputMapFloorZoom = +evt.detail.value;
                        break;
                    case 'vr-setting-map-floor-height-scale-input':
                        this.inputMapFloorHeight = +evt.detail.value;
                        break;
                    case 'vr-setting-map-world-scale-input':
                        this.inputWorldScale = +evt.detail.value;
                        break;
                    case 'vr-setting-map-world-rows-input':
                        this.inputMapWorldRows = +evt.detail.value;
                        break;
                    case 'vr-setting-map-world-zoom-input':
                        this.inputMapWorldZoom = +evt.detail.value;
                        break;
                    case 'vr-setting-map-world-height-scale-input':
                        this.inputMapWorldHeight = +evt.detail.value;
                }
                this.$store.commit('xr/hud/SET_VR_KEYBOARD_ACTIVE', false);
            },

            updateCarousel() {
                this.$store.commit('xr/carousel/SET_NUMBER_OF_SEGMENTS', this.carouselDimensions.segments);
                this.$store.commit('xr/carousel/SET_FLOOR_RADIUS', this.carouselDimensions.radius);
            },

            setMap() {
                this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
                this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
                // this.$store.commit('xr/map/SET_MAPTYPE', this.maptype);

                this.$store.commit('xr/map/SET_FLOOR_MAP_ROWS', this.floorMapTileRows);
                this.$store.commit('xr/map/SET_FLOOR_MAP_ZOOM', this.floorMapZoom);
                this.$store.commit('xr/map/SET_FLOOR_SCALE', this.floorscale);
                this.$store.commit('xr/map/SET_FLOOR_DPI', this.floorHighDPI);
                this.$store.commit('xr/map/SET_FLOOR_HEIGHTMAP', this.floorMapHeightmap);
                this.$store.commit('xr/map/SET_FLOOR_HEIGHT', this.floorMapHeight);

                // this.$store.commit('xr/map/SET_WORLD_MAP_ROWS', this.worldMapTileRows);
                // this.$store.commit('xr/map/SET_WORLD_MAP_ZOOM', this.worldMapZoom);
                // this.$store.commit('xr/map/SET_WORLD_SCALE', this.worldscale);
                // this.$store.commit('xr/map/SET_WORLD_DPI', this.worldHighDPI);
                // this.$store.commit('xr/map/SET_WORLD_HEIGHTMAP', this.worldMapHeightmap);
                // this.$store.commit('xr/map/SET_WORLD_HEIGHT', this.worldMapHeight);
            },
        },
    };

    /* script */
    const __vue_script__$7 = script$7;

    /* template */
    var __vue_render__$7 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "hud-gui" },
        [
          _c(
            "a-gui-flex-container",
            {
              attrs: {
                "flex-direction": "column",
                width: _vm.width / 2,
                height: _vm.height,
                position: -_vm.width / 4 + " 0 0",
                "is-top-container": "true",
                opacity: _vm.opacity,
                "panel-color": _vm.panelColor
              }
            },
            [
              _c("a-gui-label", {
                attrs: {
                  value: "Settings",
                  opacity: _vm.opacity,
                  "font-size": _vm.headerStyle.fontSize,
                  "background-color": _vm.headerStyle.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.headerStyle.weight,
                  height: _vm.lineSep * 3
                }
              }),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Skybox",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-radio", {
                    staticClass: "clickable",
                    attrs: {
                      height: _vm.lineSep,
                      width: _vm.width / 4,
                      value: "Stars",
                      onclickevent: "updatesky",
                      radiogroup: "skybox",
                      checked: true,
                      opacity: _vm.opacity,
                      "font-size": _vm.radioStyle.fontSize,
                      "background-color": _vm.radioStyle.backgroundColor,
                      "font-color": _vm.radioStyle.fontColor,
                      radiosizecoef: _vm.radioStyle.radioSizeCoef,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-radio", {
                    staticClass: "clickable",
                    attrs: {
                      height: _vm.lineSep,
                      width: _vm.width / 4,
                      value: "Sun",
                      onclickevent: "updatesky",
                      opacity: _vm.opacity,
                      radiogroup: "skybox",
                      "font-size": _vm.radioStyle.fontSize,
                      "background-color": _vm.radioStyle.backgroundColor,
                      "font-color": _vm.radioStyle.fontColor,
                      radiosizecoef: _vm.radioStyle.radioSizeCoef,
                      lablelzoffset: "0"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Time",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "justify-content": "center",
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-time-hours-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.timeHours
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: ":",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 32
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-time-minutes-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.timeMinutesString
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Carousel",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c("a-gui-toggle", {
                staticClass: "clickable",
                attrs: {
                  value: "Floor",
                  onclickevent: "updateflooractive",
                  opacity: _vm.opacity,
                  "font-size": _vm.toggleStyle.fontSize,
                  "background-color": _vm.toggleStyle.backgroundColor,
                  "font-color": _vm.toggleStyle.fontColor,
                  height: _vm.lineSep,
                  width: _vm.width / 4,
                  lablelzoffset: "0"
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-carousel-segments-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.inputSegments
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Segments",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: (_vm.width * 3) / 32
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-carousel-radius-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.inputFloorRadius
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Radius",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: (_vm.width * 3) / 32
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-button", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-carousel-button",
                      opacity: _vm.opacity,
                      "font-size": _vm.buttonStyle.fontSize,
                      "background-color": _vm.buttonStyle.backgroundColor,
                      "font-color": _vm.buttonStyle.fontColor,
                      "font-weight": _vm.buttonStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8,
                      value: "Update Carousel"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Textures",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-toggle", {
                    staticClass: "clickable",
                    attrs: {
                      value: "bump",
                      onclickevent: "updatebump",
                      opacity: _vm.opacity,
                      "font-size": _vm.toggleStyle.fontSize,
                      "background-color": _vm.toggleStyle.backgroundColor,
                      "font-color": _vm.toggleStyle.fontColor,
                      height: _vm.lineSep,
                      width: _vm.width / 4,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-toggle", {
                    staticClass: "clickable",
                    attrs: {
                      value: "normals",
                      onclickevent: "updatenormal",
                      opacity: _vm.opacity,
                      "font-size": _vm.toggleStyle.fontSize,
                      "background-color": _vm.toggleStyle.backgroundColor,
                      "font-color": _vm.toggleStyle.fontColor,
                      height: _vm.lineSep,
                      width: _vm.width / 4,
                      lablelzoffset: "0"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Quality",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-radio", {
                    staticClass: "clickable",
                    attrs: {
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      value: "LOW",
                      onclickevent: "updatequality",
                      radiogroup: "quality",
                      opacity: _vm.opacity,
                      "font-size": _vm.radioStyle.fontSize,
                      "background-color": _vm.radioStyle.backgroundColor,
                      "font-color": _vm.radioStyle.fontColor,
                      radiosizecoef: _vm.radioStyle.radioSizeCoef,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-radio", {
                    staticClass: "clickable",
                    attrs: {
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      value: "MEDIUM",
                      onclickevent: "updatequality",
                      opacity: _vm.opacity,
                      radiogroup: "quality",
                      "font-size": _vm.radioStyle.fontSize,
                      "background-color": _vm.radioStyle.backgroundColor,
                      "font-color": _vm.radioStyle.fontColor,
                      radiosizecoef: _vm.radioStyle.radioSizeCoef,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-radio", {
                    staticClass: "clickable",
                    attrs: {
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      checked: true,
                      value: "HIGH",
                      onclickevent: "updatequality",
                      opacity: _vm.opacity,
                      radiogroup: "quality",
                      "font-size": _vm.radioStyle.fontSize,
                      "background-color": _vm.radioStyle.backgroundColor,
                      "font-color": _vm.radioStyle.fontColor,
                      radiosizecoef: _vm.radioStyle.radioSizeCoef,
                      lablelzoffset: "0"
                    }
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "a-gui-flex-container",
            {
              attrs: {
                "flex-direction": "column",
                width: _vm.width / 2,
                height: _vm.height,
                position: _vm.width / 4 + " 0 0",
                "is-top-container": "true",
                opacity: _vm.opacity,
                "panel-color": _vm.panelColor
              }
            },
            [
              _c("a-gui-label", {
                attrs: {
                  value: "Maps",
                  opacity: _vm.opacity,
                  "font-size": _vm.headerStyle.fontSize,
                  "background-color": _vm.headerStyle.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.headerStyle.weight,
                  height: _vm.lineSep + 0.2
                }
              }),
              _vm._v(" "),
              _c("a-gui-button", {
                staticClass: "clickable",
                attrs: {
                  id: "vr-setting-map-button",
                  opacity: _vm.opacity,
                  "font-size": _vm.buttonStyle.fontSize,
                  "background-color": _vm.buttonStyle.backgroundColor,
                  "font-color": _vm.buttonStyle.fontColor,
                  "font-weight": _vm.buttonStyle.weight,
                  height: _vm.lineSep,
                  width: _vm.width / 8,
                  value: "Update Map"
                }
              }),
              _vm._v(" "),
              _c("a-gui-toggle", {
                staticClass: "clickable",
                attrs: {
                  value: "Globe",
                  onclickevent: "updateglobeactive",
                  opacity: _vm.opacity,
                  "font-size": _vm.toggleStyle.fontSize,
                  "background-color": _vm.toggleStyle.backgroundColor,
                  "font-color": _vm.toggleStyle.fontColor,
                  height: _vm.lineSep,
                  width: _vm.width / 4,
                  lablelzoffset: "0"
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-lat-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.inputMapLatitude
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Latitude",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: (_vm.width * 3) / 32
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-long-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 16,
                      value: _vm.inputMapLongitude
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Longitude",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: (_vm.width * 3) / 32
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("a-gui-label", {
                attrs: {
                  value: "Floor",
                  opacity: _vm.opacity,
                  "font-size": _vm.header2Style.fontSize,
                  "background-color": _vm.header2Style.backgroundColor,
                  "font-color": _vm.textStyle.fontColor,
                  "font-weight": _vm.header2Style.weight,
                  height: _vm.lineSep
                }
              }),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-toggle", {
                    staticClass: "clickable",
                    attrs: {
                      value: "Active",
                      onclickevent: "updatefloormap",
                      opacity: _vm.opacity,
                      "font-size": _vm.toggleStyle.fontSize,
                      "background-color": _vm.toggleStyle.backgroundColor,
                      "font-color": _vm.toggleStyle.fontColor,
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-toggle", {
                    staticClass: "clickable",
                    attrs: {
                      value: "High DPI",
                      onclickevent: "updatefloordpi",
                      checked: _vm.inputMapFloorHighDPI,
                      opacity: _vm.opacity,
                      "font-size": _vm.toggleStyle.fontSize,
                      "background-color": _vm.toggleStyle.backgroundColor,
                      "font-color": _vm.toggleStyle.fontColor,
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      lablelzoffset: "0"
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-toggle", {
                    staticClass: "clickable",
                    attrs: {
                      value: "Height Map",
                      onclickevent: "updatefloorheightmap",
                      opacity: _vm.opacity,
                      "font-size": _vm.toggleStyle.fontSize,
                      "background-color": _vm.toggleStyle.backgroundColor,
                      "font-color": _vm.toggleStyle.fontColor,
                      height: _vm.lineSep,
                      width: _vm.width / 6,
                      lablelzoffset: "0"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-floor-scale-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8,
                      value: _vm.inputFloorScale
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Scale",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-floor-rows-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8,
                      value: _vm.inputMapFloorRows
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Rows",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "a-gui-flex-container",
                {
                  attrs: {
                    "flex-direction": "row",
                    width: _vm.width / 4,
                    height: _vm.lineSep,
                    "align-items": "center",
                    "is-top-container": "true",
                    opacity: _vm.opacity,
                    "panel-color": _vm.panelColor
                  }
                },
                [
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-floor-zoom-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8,
                      value: _vm.inputMapFloorZoom
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Zoom",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-input", {
                    staticClass: "clickable",
                    attrs: {
                      id: "vr-setting-map-floor-height-scale-input",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8,
                      value: _vm.inputMapFloorHeight
                    }
                  }),
                  _vm._v(" "),
                  _c("a-gui-label", {
                    attrs: {
                      value: "Height Scale",
                      opacity: _vm.opacity,
                      "font-size": _vm.inputStyle.fontSize,
                      "background-color": _vm.inputStyle.backgroundColor,
                      "font-color": _vm.inputStyle.fontColor,
                      "font-weight": _vm.inputStyle.weight,
                      height: _vm.lineSep,
                      width: _vm.width / 8
                    }
                  })
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$7 = [];
    __vue_render__$7._withStripped = true;

      /* style */
      const __vue_inject_styles__$7 = undefined;
      /* scoped */
      const __vue_scope_id__$7 = undefined;
      /* module identifier */
      const __vue_module_identifier__$7 = undefined;
      /* functional template */
      const __vue_is_functional_template__$7 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$7 = normalizeComponent(
        { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
        __vue_inject_styles__$7,
        __vue_script__$7,
        __vue_scope_id__$7,
        __vue_is_functional_template__$7,
        __vue_module_identifier__$7,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$8 = {
        components: {
            helpmenu: __vue_component__$6,
            settings: __vue_component__$7,
        },


        computed: {
          ...vuex.mapState('xr',
          [
            'inVR',
            'isMobile',
          ]),
          ...vuex.mapState('xr/hud',
          [
            'vrKeyboardActive',
            'vrKeyboardModel',
            'vrSettingsActive',
            'vrHelpActive',
            'vrActiveHud'
          ]),
          showKeyboard() {
            return this.vrKeyboardActive && this.inVR;
          },
        },

        mounted() {
            document.body.addEventListener('keypress', this.keypressHandler);
            document.body.addEventListener('cyclehud', this.cycleHudHandler);
        },

        beforeDestroy() {
            document.body.removeEventListener('keypress', this.keypressHandler);
            document.body.removeEventListener('cyclehud', this.cycleHudHandler);
        },

        methods: {
          ...vuex.mapActions('xr/hud',
          [
            'cycleHud'
          ]),

          cycleHudHandler () {
            if (CONFIG.DEBUG) {console.log("cycleHudHandler");}
            this.updateHudPosition('#vrhud');
            this.cycleHud();
          },

          toggleHudHelp () {
            var self = this;
            if (self.hudhelpactive) {
              self.hudhelpactive = false;
              self.currentMenuIndex = 0;
            }
            else {
              self.updateHudPosition('#vrhud');
              self.hudhelpactive = true;
              self.currentMenuIndex = 1;
            }
          },

          toggleHudSettings () {
            var self = this;
            if (self.hudsettingsactive) {
              self.hudsettingsactive = false;
              self.currentMenuIndex =  0;
            }
            else {
              self.updateHudPosition('#vrhud');
              self.hudsettingsactive = true;
              self.currentMenuIndex = 2;
            }
          },


          keypressHandler (evt) {
            if (evt.key == 'h') {
                this.toggleHudHelp();
            }
            else if (evt.key == 'g') {
                this.toggleHudSettings();
            }
          },

          updateHudPosition(selector) {
            var posentity = document.createElement('a-entity');
            posentity.setAttribute('id', 'posent');
            posentity.setAttribute('position', {x: 0, y: 0, z: 0});

            var playerRig = document.getElementById('playerRig');

            var playerCamera = document.getElementById('player-camera');
            playerCamera.appendChild(posentity);

            var posEntity = document.querySelector('#posent');
            var hud;
            var position, quaternion;
            var loadedHandler = function() {
                position = posEntity.object3D.getWorldPosition();
                playerRig.object3D.worldToLocal(position);
                quaternion = playerCamera.object3D.quaternion;
                posEntity.parentElement.removeChild(posEntity);
                hud = document.querySelector(selector);
                posEntity.removeEventListener('loaded', loadedHandler);
                hud.object3D.position.set(position.x, position.y + 5, position.z);
                hud.object3D.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

                AFRAME.ANIME({
                    targets: hud.object3D.position,
                    easing: 'linear',
                    y: [position.y + 5, position.y],
                    duration: 0.5*1000,
                });
            };
            posEntity.addEventListener('loaded', loadedHandler, {once: true});
          }
        }
    };

    /* script */
    const __vue_script__$8 = script$8;

    /* template */
    var __vue_render__$8 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { staticClass: "hud", attrs: { id: "vrhudentity" } },
        [
          _vm.vrHelpActive && _vm.inVR
            ? _c("helpmenu", { attrs: { id: "vrhelpmenu", position: "0 0 -1.5" } })
            : _vm._e(),
          _vm._v(" "),
          _vm.vrSettingsActive && _vm.inVR
            ? _c("settings", { attrs: { id: "vrsettings", position: "0 0 -1.5" } })
            : _vm._e(),
          _vm._v(" "),
          _vm.showKeyboard
            ? _c("a-entity", {
                attrs: {
                  id: "vrkeyboard",
                  position: "0 0 -0.5",
                  "super-keyboard":
                    "hand: #rightHandCursor; imagePath:/static/aframe/aframe-super-keyboard/;" +
                    " model: " +
                    _vm.vrKeyboardModel +
                    ";"
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$8 = [];
    __vue_render__$8._withStripped = true;

      /* style */
      const __vue_inject_styles__$8 = undefined;
      /* scoped */
      const __vue_scope_id__$8 = undefined;
      /* module identifier */
      const __vue_module_identifier__$8 = undefined;
      /* functional template */
      const __vue_is_functional_template__$8 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$8 = normalizeComponent(
        { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
        __vue_inject_styles__$8,
        __vue_script__$8,
        __vue_scope_id__$8,
        __vue_is_functional_template__$8,
        __vue_module_identifier__$8,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$9 = {

        data () {
            return {
                teleporting: false,
                teleportThreshold: 0.4,
                intersected: null
            }
        },

        computed: {
            ...vuex.mapState('xr/avatar',
                [
                    'rightHandControllerActive'
                ]
            )
        },

        mounted () {
            document.addEventListener('controllerconnected', this.controllerConnectedListener); 
        },

        beforeDestroy() {
            document.body.removeEventListener('controllerconnected', this.controllerConnectedListener);
        },

        methods: {
            setupControls() {
                if (CONFIG.DEBUG) {console.log('setupControls');}
                var self = this;
                document.addEventListener('thumbstickmoved', self.thumbstickmovedListener);
                document.addEventListener('raycaster-intersected', self.intersectedListener);
                document.addEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
                document.addEventListener('triggerup', self.triggerUpListener);

            },

            tearDownControls() {
                if (CONFIG.DEBUG) {console.log('tearDownControls');}
                var self = this;
                document.removeEventListener('thumbstickmoved', self.thumbstickmovedListener);
                document.removeEventListener('raycaster-intersected', self.intersectedListener);
                document.removeEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
                document.removeEventListener('triggerup', self.triggerUpListener);
            },

            thumbstickmovedListener(evt) {
                var self = this;
                if (self.teleporting) {
                    if (evt.detail.y >= -self.teleportThreshold) {
                        self.$el.emit('teleportend');
                        self.teleporting = false;
                    }
                }
                else {
                    if (evt.detail.y <= -self.teleportThreshold) {
                        self.$el.emit('teleportstart');
                        self.teleporting = true;
                    }
                }
            },

            intersectedListener(evt) {
                this.intersected = evt.target;
            },

            intersectedClearListener(evt) {
                this.intersected = null;
            },

            triggerUpListener(evt) {
                var self = this;
                if (self.intersected) {
                    var rightHandCursor = document.querySelector('#rightHandCursor');
                    var intersectedEl = self.intersected;
                    var intersection = rightHandCursor.components.raycaster.getIntersection(intersectedEl);
                    var eventDetail = {};
                    eventDetail.intersectedEl = intersectedEl;
                    eventDetail.intersection = intersection;
                    self.intersected.emit('click', eventDetail);
                }
            },

            controllerConnectedListener(evt) {
                console.log(`controller connected: ${evt.detail.name}`);
                this.fixCursorPosition(evt.detail.name);
            },

            fixCursorPosition(controllerName) {
                var cursor = document.querySelector('#rightHandCursor');
                switch (controllerName) {
                    case 'oculus-touch-controls':
                        cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, -0.01, 0);
                        break;
                    case 'windows-motion-controls':
                        cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, 0, -0.03);
                        break;
                    default:
                        cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, -0.01, 0);
                        break;
                }
            }
        }
    };

    /* script */
    const __vue_script__$9 = script$9;

    /* template */
    var __vue_render__$9 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.rightHandControllerActive
        ? _c(
            "a-entity",
            {
              attrs: {
                id: "rightHandController",
                "teleport-controls":
                  "cameraRig: #playerRig; startEvents: teleportstart; endEvents: teleportend; collisionEntities: .boundry;",
                "windows-motion-controls": "hand: right;",
                "oculus-go-controls": "hand: right;",
                "oculus-touch-controls": "hand: right;",
                "daydream-controls": "hand: right;",
                "vive-controls": "hand: right;",
                "gearvr-controls": "hand: right;"
              }
            },
            [
              _c("a-entity", {
                attrs: {
                  id: "rightHandCursor",
                  raycaster: "objects: .clickable, .a-enter-vr; showLine: true;"
                }
              })
            ],
            1
          )
        : _vm._e()
    };
    var __vue_staticRenderFns__$9 = [];
    __vue_render__$9._withStripped = true;

      /* style */
      const __vue_inject_styles__$9 = undefined;
      /* scoped */
      const __vue_scope_id__$9 = undefined;
      /* module identifier */
      const __vue_module_identifier__$9 = undefined;
      /* functional template */
      const __vue_is_functional_template__$9 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$9 = normalizeComponent(
        { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
        __vue_inject_styles__$9,
        __vue_script__$9,
        __vue_scope_id__$9,
        __vue_is_functional_template__$9,
        __vue_module_identifier__$9,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$a = {
        components: {
            vrhud: __vue_component__$8,
            rightHandController: __vue_component__$9
        },

        data () {
            return {
                teleporting: false,
                teleportThreshold: 0.4,
            }
        },

        computed: {
            ...vuex.mapState('xr',
                [
                    'inVR',
                    'sceneLoaded',
                    'isMobile'
                ]
            ),
            ...vuex.mapState('xr/avatar',
                [
                    'cursorActive',
                    'rightHandControllerActive',
                    'playerHeight'
                ]
            )
        },

        watch: {
            sceneLoaded: function (newVal, oldVal) {
                if (newVal) {
                    this.onSceneLoaded();
                }
            },
            inVR: function (newVal, oldVal) {
                if (newVal) {
                    if (AFRAME.utils.device.isMobile()) {
                        this.tearDownMobile();
                    } else {
                        this.tearDownDesktop();
                    }
                    this.setupVR();
                }
                else {
                    this.tearDownVR();
                    if (AFRAME.utils.device.isMobile()) {
                        this.setupMobile();
                    } else {
                        this.setupDesktop();
                    }
                }
            },
        },

        mounted() {
            var self = this;
            if (this.$el.hasLoaded) {
                self.onSceneLoaded();
            }
            else {
                this.$el.addEventListener('loaded', function () {
                    self.onSceneLoaded();
                    }, {once : true}
                );
            }
        },

        beforeDestroy() {
            if (this.$el.sceneEl.is('vr-mode')) {
                this.tearDownVR();
            }
            else {
                if (AFRAME.utils.device.isMobile()) {
                    this.tearDownMobile();
                } else {
                    this.tearDownDesktop();
                }
            }
        },

        methods: {
            setupDesktop() {
                if (CONFIG.DEBUG) {console.log("setupDesktop");}            var self = this;
                var playerRig = self.$el;
                if (playerRig.hasLoaded) {
                    playerRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop, {once : true});
                }
                else {
                    playerRig.addEventListener('loaded', function () {
                        playerRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop, {once : true});
                    });
                }
                try {
                    if (playerRig) {
                        playerRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                        playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                    }
                    else {
                        console.log("failed to set controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set controls on playerRig");
                    console.log(e);
                }

                
            },

            tearDownDesktop() {
                if (CONFIG.DEBUG) {console.log("tearDownDesktop");}            var playerRig = this.$el;
                try {
                    if (playerRig) {
                        playerRig.removeAttribute("wasd-controls");
                        playerRig.removeAttribute("look-controls");
                        playerRig.sceneEl.canvas.classList.remove('a-grab-cursor');
                    }
                    else {
                        console.log("failed to teardown desktop controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to teardown desktop controls on playerRig");
                    console.log(e);
                }
            },

            setupMobile() {
                if (CONFIG.DEBUG) {console.log("setupMobile");}            var playerRig = this.$el;
                var camera = playerRig.querySelector('#player-camera');
                var sceneEl = document.getElementsByTagName('a-scene')[0];
                try {
                    if (playerRig) {
                        // playerRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                        // playerRig.setAttribute("virtual-gamepad-controls", {});
                        // camera.setAttribute('pitch-yaw-rotator', {});
                        // sceneEl.setAttribute("look-on-mobile", "camera", camera);
                        // sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
                    }
                    else {
                        console.log("failed to set controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set controls on playerRig");
                    console.log(e);
                }
            },

            tearDownMobile() {
                if (CONFIG.DEBUG) {console.log("tearDownMobile");}            var playerRig = this.$el;
                var camera = playerRig.querySelector('#player-camera');
                var sceneEl = document.getElementsByTagName('a-scene')[0];
                try {
                    if (playerRig) {
                        // playerRig.removeAttribute("character-controller");
                        // playerRig.removeAttribute("virtual-gamepad-controls");
                        // camera.removeAttribute('pitch-yaw-rotator');
                        // sceneEl.removeAttribute("look-on-mobile");
                    }
                    else {
                        console.log("failed to teardown mobile controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to teardown mobile controls on playerRig");
                    console.log(e);
                }
            },

            setupVR() {
                if (CONFIG.DEBUG) {console.log("setupVR");}            this.fixVRCameraPosition();
                this.$store.commit('xr/avatar/SET_RIGHT_HAND_CONTROLLER_ACTIVE', true);
                this.$refs.righthand.setupControls();

                var playerRig = document.getElementById('playerRig');
                playerRig.object3D.matrixAutoUpdate = true;
            },

            tearDownVR() {
                if (CONFIG.DEBUG) {console.log("tearDownVR");}            this.$store.commit('xr/avatar/SET_RIGHT_HAND_CONTROLLER_ACTIVE', false);
                this.$refs.righthand.tearDownControls();
                this.unFixVRCameraPosition();
            },

            onSceneLoaded() {
                if (this.$el.sceneEl.is('vr-mode')) {
                    this.setupVR();
                }
                else {
                    if (AFRAME.utils.device.isMobile()) {
                        this.setupMobile();
                    } else {
                        this.setupDesktop();
                    }
                }
                this.createAvatarTemplate();
                this.addAvatarTemplate();
                this.networkAvatarRig();
            },

            createAvatarTemplate() {
                if (CONFIG.DEBUG) {console.log('createAvatarGLTFTemplate()');}
                //                         <rightHandController ref="righthand" />
                var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
                <a-entity>
                    <a-entity class="camera-rig"
                        position="0 0 0">
                        <a-entity
                            class="player-camera camera">
                            <a-gltf-model class="gltfmodel" src="#avatar-0"
                                scale="0.02 0.02 0.02">
                            </a-gltf-model>
                        </a-entity>
                    </a-entity>
                </a-entity>
            </template> 
            `);
                var assets = document.querySelector('a-assets');
                try {
                    assets.appendChild(frag);
                }
                catch (err) {
                    console.log('createAvatarGLTFTemplate error');
                    console.log(err);
                }
                
            },

            createAvatarGLTFTemplate() {
                if (CONFIG.DEBUG) {console.log('createAvatarGLTFTemplate()');}
                var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
                    <a-gltf-model class="gltfmodel" src="#avatar-0"
                        scale="0.02 0.02 0.02">
                    </a-gltf-model>
            </template> 
            `);
                var assets = document.querySelector('a-assets');
                try {
                    assets.appendChild(frag);
                }
                catch (err) {
                    console.log('createAvatarGLTFTemplate error');
                    console.log(err);
                }
                
            },

            createAvatarRigTemplate() {
                if (CONFIG.DEBUG) {console.log('createAvatarRigTemplate()');}
                var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
            <a-entity class="player">

                <a-entity class="avatar" networked-audio-source >
                <a-sphere class="head"
                    color="#5985ff"
                    scale="0.45 0.5 0.4"
                ></a-sphere>
                <a-entity class="face"
                    position="0 0.05 0"
                >
                    <a-sphere class="eye"
                    color="#efefef"
                    position="0.16 0.1 -0.35"
                    scale="0.12 0.12 0.12"
                    >
                    <a-sphere class="pupil"
                        color="#000"
                        position="0 0 -1"
                        scale="0.2 0.2 0.2"
                    ></a-sphere>
                    </a-sphere>
                    <a-sphere class="eye"
                    color="#efefef"
                    position="-0.16 0.1 -0.35"
                    scale="0.12 0.12 0.12"
                    >
                    <a-sphere class="pupil"
                        color="#000"
                        position="0 0 -1"
                        scale="0.2 0.2 0.2"
                    ></a-sphere>
                    </a-sphere>
                </a-entity>
                </a-entity>

            </a-entity>
            </template>
            `);

                document.querySelector('a-assets').appendChild(frag);

            },

            addAvatarTemplate() {
                if (CONFIG.DEBUG) {console.log("addAvatarTemplate");}
                try {
                    NAF.schemas.add({
                        template: '#avatar-rig-template',
                        components: [
                        {
                            component: 'position'
                        },
                        {
                            component: 'rotation'
                        },
                        {
                            selector: '.camera-rig',
                            component: 'rotation'
                        },
                        {
                            selector: '.camera-rig',
                            component: 'position'
                        },
                        {
                            selector: '.player-camera',
                            component: 'rotation'
                        },
                        {
                            selector: '.player-camera',
                            component: 'position'
                        },
                        ]
                    });
                }
                catch (err) {
                    console.log('addAvatarRigTemplate error');
                    console.log(err);
                }
            },

            addAvatarRigTemplate() {
                if (CONFIG.DEBUG) {console.log("addAvatarRigTemplate");}
                try {
                    NAF.schemas.add({
                        template: '#avatar-rig-template',
                        components: [
                        {
                            component: 'position'
                        },
                        {
                            component: 'rotation'
                        },
                        {
                            selector: '.gltfmodel',
                            component: 'rotation'
                        }
                        ]
                    });
                }
                catch (err) {
                    console.log('addAvatarRigTemplate error');
                    console.log(err);
                }
            },

            networkAvatarRig() {
                if (CONFIG.DEBUG) {console.log('networkAvatarRig');}
                var playerRig = document.getElementById('playerRig');
                try {
                    if (playerRig) {
                        playerRig.setAttribute("networked",
                            { 'template': '#avatar-rig-template',
                            'attachTemplateToLocal': false });
                    }
                    else {
                        console.log("failed to set up NAF on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set up NAF on playerRig");
                    console.log(e);
                }
                finally {
                    // console.log('networkAvatarRig finally');
                }
            },

            fragmentFromString(strHTML) {
                return document.createRange().createContextualFragment(strHTML);
            },

            fixVRCameraPosition() {
                if(CONFIG.DEBUG){console.log('fixVRCameraPosition');}

                var playerRig = this.$el;

                var playerCamera = document.getElementById('player-camera');
                var cameraRig = document.getElementById('camera-rig');

                var position;
                position = playerRig.object3D.getWorldPosition();
                playerRig.object3D.worldToLocal(position);
                cameraRig.object3D.position.set(position.x, -this.playerHeight, position.z);
                cameraRig.object3D.updateMatrix();
            },

            unFixVRCameraPosition() {
                if(CONFIG.DEBUG){console.log('unFixVRCameraPosition');}

                var playerRig = this.$el;

                var playerCamera = document.getElementById('player-camera');
                var cameraRig = document.getElementById('camera-rig');

                var position;
                position = playerRig.object3D.getWorldPosition();
                playerRig.object3D.worldToLocal(position);
                cameraRig.object3D.position.set(position.x, 0, position.z);
                cameraRig.object3D.updateMatrix();
                playerCamera.object3D.position.set(0, 0, 0);
                playerCamera.object3D.updateMatrix();
            },
            

        }
    };

    /* script */
    const __vue_script__$a = script$a;

    /* template */
    var __vue_render__$a = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { attrs: { id: "playerRig", position: "0 " + _vm.playerHeight + " 0" } },
        [
          _vm.inVR ? _c("vrhud", { attrs: { id: "vrhud" } }) : _vm._e(),
          _vm._v(" "),
          _c(
            "a-entity",
            {
              staticClass: "camera-rig",
              attrs: { id: "camera-rig", position: "0 0 0" }
            },
            [
              _c("a-entity", {
                staticClass: "player-camera camera",
                attrs: { id: "player-camera", camera: "" }
              }),
              _vm._v(" "),
              _c("rightHandController", { ref: "righthand" })
            ],
            1
          ),
          _vm._v(" "),
          _vm.cursorActive
            ? _c("a-entity", {
                attrs: {
                  cursor: "rayOrigin: mouse",
                  raycaster: "interval: 1000; objects: .clickable, .a-enter-vr;"
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$a = [];
    __vue_render__$a._withStripped = true;

      /* style */
      const __vue_inject_styles__$a = undefined;
      /* scoped */
      const __vue_scope_id__$a = undefined;
      /* module identifier */
      const __vue_module_identifier__$a = undefined;
      /* functional template */
      const __vue_is_functional_template__$a = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$a = normalizeComponent(
        { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
        __vue_inject_styles__$a,
        __vue_script__$a,
        __vue_scope_id__$a,
        __vue_is_functional_template__$a,
        __vue_module_identifier__$a,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$b = {

        data () {
            return {
                teleporting: false,
                teleportThreshold: 0.4,
                intersected: null,
                activeEl: null,
            }
        },

        computed: {
            ...vuex.mapState('xr',
                [
                    'inVR',
                ]
            )
        },

        mounted () {
            document.addEventListener('controllerconnected', this.controllerConnectedListener);
            this.setupControls();
        },

        beforeDestroy() {
            document.body.removeEventListener('controllerconnected', this.controllerConnectedListener);
        },

        methods: {
            setupControls() {
                if (CONFIG.DEBUG) {console.log('setupControls');}
                var self = this;
                document.addEventListener('thumbstickmoved', self.thumbstickmovedListener);
                document.addEventListener('raycaster-intersected', self.intersectedListener);
                document.addEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
                document.addEventListener('triggerdown', self.triggerDownListener);
                document.addEventListener('triggerup', self.triggerUpListener);

            },

            tearDownControls() {
                if (CONFIG.DEBUG) {console.log('tearDownControls');}
                var self = this;
                document.removeEventListener('thumbstickmoved', self.thumbstickmovedListener);
                document.removeEventListener('raycaster-intersected', self.intersectedListener);
                document.removeEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
                document.removeEventListener('triggerdown', self.triggerDownListener);
                document.removeEventListener('triggerup', self.triggerUpListener);
            },

            thumbstickmovedListener(evt) {
                var self = this;
                if (self.teleporting) {
                    if (evt.detail.y >= -self.teleportThreshold) {
                        self.$el.emit('teleportend');
                        self.teleporting = false;
                    }
                }
                else {
                    if (evt.detail.y <= -self.teleportThreshold) {
                        self.$el.emit('teleportstart');
                        self.teleporting = true;
                    }
                }
            },

            intersectedListener(evt) {
                this.intersected = evt.target;
            },

            intersectedClearListener(evt) {
                this.intersected = null;
            },

            triggerDownListener(evt) {
                var self = this;
                if (self.intersected) {
                    self.activeEl = self.intersected;
                    self.intersected.emit('mousedown');
                }
            },

            triggerUpListener(evt) {
                var self = this;
                if (self.intersected) {
                    var gridCursor = document.querySelector('#gridCursor');
                    var intersectedEl = self.intersected;
                    var intersection = gridCursor.components.raycaster.getIntersection(intersectedEl);
                    var eventDetail = {};
                    eventDetail.intersectedEl = intersectedEl;
                    eventDetail.intersection = intersection;
                    self.intersected.emit('click', eventDetail);
                }
                if (self.activeEl) {
                    self.intersected.emit('mouseup');
                    self.activeEl = null;
                }
            },

            controllerConnectedListener(evt) {
                this.fixCursorPosition(evt.detail.name);
            },

            fixCursorPosition(controllerName) {
                var cursor = document.querySelector('#gridCursor');
                switch (controllerName) {
                    case 'oculus-touch-controls':
                        // cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, -0.01, 0);
                        break;
                    case 'windows-motion-controls':
                        cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, 0, -0.03);
                        break;
                    default:
                        cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                        cursor.object3D.position.set(0, 0, -0.03);
                        break;
                }
            }
        }
    };

    /* script */
    const __vue_script__$b = script$b;

    /* template */
    var __vue_render__$b = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        {
          attrs: {
            id: "gridController",
            "teleport-controls":
              "cameraRig: #camera-rig; startEvents: teleportstart; endEvents: teleportend; collisionEntities: .boundry;",
            "windows-motion-controls": "hand: right;",
            "oculus-go-controls": "hand: right;",
            "oculus-touch-controls": "hand: right;",
            "daydream-controls": "hand: right;",
            "vive-controls": "hand: right;",
            "gearvr-controls": "hand: right;",
            "magicleap-controls": ""
          }
        },
        [
          _c("a-entity", {
            attrs: {
              id: "gridCursor",
              cursor: "",
              raycaster: "objects: .clickable, .a-enter-vr; showLine: true; "
            }
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$b = [];
    __vue_render__$b._withStripped = true;

      /* style */
      const __vue_inject_styles__$b = undefined;
      /* scoped */
      const __vue_scope_id__$b = undefined;
      /* module identifier */
      const __vue_module_identifier__$b = undefined;
      /* functional template */
      const __vue_is_functional_template__$b = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$b = normalizeComponent(
        { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
        __vue_inject_styles__$b,
        __vue_script__$b,
        __vue_scope_id__$b,
        __vue_is_functional_template__$b,
        __vue_module_identifier__$b,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$c = {

        components: {
            GridController: __vue_component__$b,
        },

        computed: {
            ...vuex.mapState('xr',
                [
                    'inVR',
                    'sceneLoaded',
                    'isMobile'
                ]
            ),
            ...vuex.mapState('xr/avatar',
                [
                    'playerHeight',
                ]
            ),
        },

        watch: {
            sceneLoaded: function (newVal, oldVal) {
                if (newVal) {
                    this.onSceneLoaded();
                }
            },
            inVR: function (newVal, oldVal) {
                if (newVal) {
                    if (AFRAME.utils.device.isMobile()) {
                        this.tearDownMobile();
                    } else {
                        this.tearDownDesktop();
                    }
                    this.setupVR();
                }
                else {
                    this.tearDownVR();
                    if (AFRAME.utils.device.isMobile()) {
                        this.setupMobile();
                    } else {
                        this.setupDesktop();
                    }
                }
            },
        },

        mounted() {
            var self = this;
            if (this.$el.hasLoaded) {
                self.onSceneLoaded();
            }
            else {
                this.$el.addEventListener('loaded', function () {
                    self.onSceneLoaded();
                    }, {once : true}
                );
            }
            document.body.addEventListener('keypress', self.keypressListener);
        },

        beforeDestroy() {
            document.body.removeEventListener('keypress', this.keypressListener);

            if (this.$el.sceneEl.is('vr-mode')) {
                this.tearDownVR();
            }
            else {
                if (AFRAME.utils.device.isMobile()) {
                    this.tearDownMobile();
                } else {
                    this.tearDownDesktop();
                }
            }
        },

        methods: {
            setupDesktop() {
                if (CONFIG.DEBUG) {console.log("setupDesktop");}            var self = this;
                var playerRig = self.$el;
                if (playerRig.hasLoaded) {
                    playerRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop, {once : true});
                }
                else {
                    playerRig.addEventListener('loaded', function () {
                        playerRig.sceneEl.addEventListener('enter-vr', self.tearDownDesktop, {once : true});
                    }, {once : true});
                }
                try {
                    if (playerRig) {
                        playerRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                        playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                    }
                    else {
                        console.log("failed to set controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set controls on playerRig");
                    console.log(e);
                }

                
            },

            tearDownDesktop() {
                if (CONFIG.DEBUG) {console.log("tearDownDesktop");}            var playerRig = this.$el;
                try {
                    if (playerRig) {
                        playerRig.removeAttribute("wasd-controls");
                        playerRig.removeAttribute("look-controls");
                        playerRig.sceneEl.canvas.classList.remove('a-grab-cursor');
                    }
                    else {
                        console.log("failed to teardown desktop controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to teardown desktop controls on playerRig");
                    console.log(e);
                }
            },

            setupMobile() {
                if (CONFIG.DEBUG) {console.log("setupMobile");}            var playerRig = this.$el;
                var camera = playerRig.querySelector('#player-camera');
                var sceneEl = document.getElementsByTagName('a-scene')[0];
                try {
                    if (playerRig) {
                        // playerRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                        // playerRig.setAttribute("virtual-gamepad-controls", {});
                        // camera.setAttribute('pitch-yaw-rotator', {});
                        playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                    }
                    else {
                        console.log("failed to set controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set controls on playerRig");
                    console.log(e);
                }
            },

            tearDownMobile() {
                if (CONFIG.DEBUG) {console.log("tearDownMobile");}            var playerRig = this.$el;
                var camera = playerRig.querySelector('#player-camera');
                var sceneEl = document.getElementsByTagName('a-scene')[0];
                try {
                    if (playerRig) {
                        // playerRig.removeAttribute("character-controller");
                        // playerRig.removeAttribute("virtual-gamepad-controls");
                        // camera.removeAttribute('pitch-yaw-rotator');
                        playerRig.removeAttribute("look-controls");
                    }
                    else {
                        console.log("failed to teardown mobile controls on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to teardown mobile controls on playerRig");
                    console.log(e);
                }
            },

            setupVR() {
                if (CONFIG.DEBUG) {console.log("setupVR");}            this.fixVRCameraPosition();
                var playerRig = document.getElementById('playerRig');
                playerRig.object3D.matrixAutoUpdate = true;
            },

            tearDownVR() {
                if (CONFIG.DEBUG) {console.log("tearDownVR");}            this.unFixVRCameraPosition();
                this.$refs.gridcontroller.tearDownControls();
            },

            onSceneLoaded() {
                if (this.$el.sceneEl.is('vr-mode')) {
                    this.setupVR();
                }
                else {
                    if (AFRAME.utils.device.isMobile()) {
                        this.setupMobile();
                    } else {
                        this.setupDesktop();
                    }
                }
                this.createAvatarTemplate();
                this.addAvatarTemplate();
                this.networkAvatarRig();
            },

            createAvatarTemplate() {
                if (CONFIG.DEBUG) {console.log('createAvatarGLTFTemplate()');}
                //                         <rightHandController ref="righthand" />
                var frag = this.fragmentFromString(`
            <template id="avatar-rig-template" v-pre>
                <a-entity>
                    <a-entity class="camera-rig"
                        position="0 0 0">
                        <a-entity
                            class="player-camera camera">
                            <a-gltf-model class="gltfmodel" src="#avatar-0"
                                scale="0.02 0.02 0.02">
                            </a-gltf-model>
                        </a-entity>
                    </a-entity>
                </a-entity>
            </template> 
            `);
                var assets = document.querySelector('a-assets');
                try {
                    assets.appendChild(frag);
                }
                catch (err) {
                    console.log('createAvatarGLTFTemplate error');
                    console.log(err);
                }
                
            },

            addAvatarTemplate() {
                if (CONFIG.DEBUG) {console.log("addAvatarTemplate");}
                try {
                    NAF.schemas.add({
                        template: '#avatar-rig-template',
                        components: [
                        {
                            component: 'position'
                        },
                        {
                            component: 'rotation'
                        },
                        {
                            selector: '.camera-rig',
                            component: 'rotation'
                        },
                        {
                            selector: '.camera-rig',
                            component: 'position'
                        },
                        {
                            selector: '.player-camera',
                            component: 'rotation'
                        },
                        {
                            selector: '.player-camera',
                            component: 'position'
                        },
                        ]
                    });
                }
                catch (err) {
                    console.log('addAvatarRigTemplate error');
                    console.log(err);
                }
            },

            networkAvatarRig() {
                if (CONFIG.DEBUG) {console.log('networkAvatarRig');}
                var playerRig = document.getElementById('playerRig');
                try {
                    if (playerRig) {
                        playerRig.setAttribute("networked",
                            { 'template': '#avatar-rig-template',
                            'attachTemplateToLocal': false });
                    }
                    else {
                        console.log("failed to set up NAF on playerRig");
                    }
                }
                catch (e) {
                    console.log("failed to set up NAF on playerRig");
                    console.log(e);
                }
                finally {
                    // console.log('networkAvatarRig finally');
                }
            },

            fragmentFromString(strHTML) {
                return document.createRange().createContextualFragment(strHTML);
            },

            keypressListener(evt) {
                if (evt.key == 'c') {
                    this.centerCamera();
                }
            },

            centerCamera() {
                this.$el.object3D.position.set(0, this.playerHeight, 0);
            },

            fixVRCameraPosition() {
                if(CONFIG.DEBUG){console.log('fixVRCameraPosition');}
                if (!AFRAME.utils.checkHeadsetConnected()) return;

                var playerRig = this.$el;

                var playerCamera = document.getElementById('player-camera');
                var cameraRig = document.getElementById('camera-rig');

                var position;
                position = playerRig.object3D.getWorldPosition();
                playerRig.object3D.worldToLocal(position);
                cameraRig.object3D.position.set(position.x, -this.playerHeight, position.z);
                cameraRig.object3D.updateMatrix();
            },

            unFixVRCameraPosition() {
                if(CONFIG.DEBUG){console.log('unFixVRCameraPosition');}
                if (!AFRAME.utils.checkHeadsetConnected()) return;

                var playerRig = this.$el;

                var playerCamera = document.getElementById('player-cameraf');
                var cameraRig = document.getElementById('camera-rig');

                var position;
                position = playerRig.object3D.getWorldPosition();
                playerRig.object3D.worldToLocal(position);
                cameraRig.object3D.position.set(position.x, 0, position.z);
                cameraRig.object3D.updateMatrix();
                playerCamera.object3D.position.set(0, 0, 0);
                playerCamera.object3D.updateMatrix();
            },

        }
    };

    /* script */
    const __vue_script__$c = script$c;

    /* template */
    var __vue_render__$c = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-entity",
        { attrs: { id: "playerRig" } },
        [
          _c(
            "a-entity",
            { staticClass: "camera-rig", attrs: { id: "camera-rig" } },
            [
              _c("a-entity", {
                staticClass: "player-camera camera",
                attrs: { id: "player-camera", camera: "" }
              }),
              _vm._v(" "),
              _vm.inVR ? _c("grid-controller", { ref: "gridcontroller" }) : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          !_vm.inVR
            ? _c("a-entity", {
                attrs: {
                  cursor: "rayOrigin: mouse",
                  raycaster: "interval: 1000; objects: .clickable, .a-enter-vr;"
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$c = [];
    __vue_render__$c._withStripped = true;

      /* style */
      const __vue_inject_styles__$c = undefined;
      /* scoped */
      const __vue_scope_id__$c = undefined;
      /* module identifier */
      const __vue_module_identifier__$c = undefined;
      /* functional template */
      const __vue_is_functional_template__$c = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$c = normalizeComponent(
        { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
        __vue_inject_styles__$c,
        __vue_script__$c,
        __vue_scope_id__$c,
        __vue_is_functional_template__$c,
        __vue_module_identifier__$c,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$d = {
        components: {
            gallery: __vue_component__$1,
            GridLayout: __vue_component__$5,
            GridCamera: __vue_component__$c,
            avatar: __vue_component__$a,
        },
        data() {
          return {
            SkyboxEnum: SkyboxEnum,
            SceneLayoutEnum: SceneLayoutEnum,
          }
        },

        computed: {
          ...vuex.mapState('xr',
            [
              'AppType',
              'inVR',
              'roomName',
              'sceneLayout'
            ]
          ),

          ...vuex.mapState('xr/graphics',
            [
              'skytime'
            ]
          ),

          ...vuex.mapGetters('xr/graphics',
            [
              'skybox',
            ]
          ),

          ...vuex.mapState('xr/avatar',
            [
              'avatars',
              'playerHeight',
            ]
          ),

          ...vuex.mapState('xr/naf',
            [
              'connectOnLoad'
            ]
          ),
        },

        mounted () {
          if (CONFIG.DEBUG) {console.log("App.vue mounted");}      var self = this;

          var scene = document.querySelector('a-scene');  
          if (scene.hasLoaded) {
            self.onSceneLoaded();
          } else {
            scene.addEventListener('loaded', self.onSceneLoaded);
          }

          if (scene.is('vr-mode')) {
            self.onEnterVR();
          }
          document.body.addEventListener('enter-vr', function (evt) {
            self.onEnterVR();
            document.body.addEventListener('exit-vr', function (event) {
              self.onExitVR();
            });
          });


          // var socketIO = io('http://localhost');
          // socketIO.on("connection", socket => {
          //   console.log("user connected", socket.id);
          // });

          document.body.addEventListener('connected', function (evt) {
            if (CONFIG.DEBUG) {console.log('connected event. clientId =', evt.detail.clientId);}        if (CONFIG.DEBUG) {console.log('roomName: ' + self.roomName);}
            // setup chat
            // self.$store.dispatch('xr/naf/addPlayer', { clientId: evt.detail.clientId, name: evt.detail.clientId });
            // NAF.connection.subscribeToDataChannel('chat', self.chatCB);
            // NAF.connection.subscribeToDataChannel('nameUpdate', self.nameUpdateCB);
          });

          document.body.addEventListener('clientConnected', function (evt) {
            if (CONFIG.DEBUG) {console.log('clientConnected event. clientId =', evt.detail.clientId);}        if (CONFIG.DEBUG) {console.log('roomName: ' + self.roomName);}
            self.$store.dispatch('xr/naf/addPlayer', { clientId: evt.detail.clientId, name: evt.detail.clientId });
            NAF.connection.sendData(evt.detail.clientId, 'nameUpdate', self.$store.state.xr.naf.playerNames.get(NAF.clientId));
          });

          document.body.addEventListener('clientDisconnected', function (evt) {
            if (CONFIG.DEBUG) {console.log('clientDisconnected event. clientId =', evt.detail.clientId);}        // self.$store.commit('xr/naf/DECREMENT_PLAYERS');
            self.$store.dispatch('xr/naf/removePlayer', { clientId: evt.detail.clientId });
          });

          var roomName = this.$route.query.room || 'ls-room';

          // name == 'shared'
          // query.id
          // query.passcode
          if (this.AppType == AppTypeEnum.APP && self.$route.name == 'shared') {
            roomName = 'id' + self.$route.query.id + 'passcode' + self.$route.query.passcode;
            this.$store.dispatch('xr/setRoomName', roomName);
          }

          if (this.AppType == AppTypeEnum.XR) {
            this.$store.dispatch('xr/setRoomName', roomName)
            .then(() => {
              return this.$store.dispatch('xr/getRoomConfig');
            })
            .then(() => {
                return this.$store.dispatch('xr/getObjs');
            })
            .then(() => {
                return this.$store.dispatch('xr/avatar/getAvatars');
            })
            .catch( ( error ) => {
              console.log(error);
            });
          }

        },


        methods: {
          onSceneLoaded () {
            if (CONFIG.DEBUG) {console.log("onSceneLoaded");}
            var self = this;
            self.$store.commit('xr/SET_SCENELOADED');
            self.$store.commit('xr/SET_ISMOBILE');
          },

          onEnterVR () {
            var self = this;
            if (CONFIG.DEBUG) {console.log('entered vr');}        self.$store.commit('xr/SET_IN_VR', true);

            if (AFRAME.utils.device.isMobile()) {
              this.teardownMobile();
            }
          },
          onExitVR () {
            var self = this;
            if (CONFIG.DEBUG) {console.log('exited vr');}        self.$store.commit('xr/SET_IN_VR', false);

            if (AFRAME.utils.device.isMobile()) {
              this.setupMobile();
            }
          },

          setupMobile () {
            if (CONFIG.DEBUG) {console.log("isMobile");}      },

          teardownMobile () {
            if (CONFIG.DEBUG) {console.log("teardownMobile");}        var playerRig = document.getElementById('playerRig');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            sceneEl.removeAttribute('look-on-mobile');
          },

          setupDesktop () {
            if (CONFIG.DEBUG) {console.log("!isMobile");}      },

          chatCB(fromClientId, dataType, data, source) {
              this.$store.commit('xr/chat/MESSAGE_RECEIVED', {
                fromClientId: fromClientId,
                dataType: dataType,
                data: data,
                source: source}
              );
          },

          nameUpdateCB(fromClientId, dataType, data, source) {
              this.$store.commit('xr/naf/CHANGE_PLAYER_NAME', {
                clientId: fromClientId,
                name: data}
              );
          }
        }
      };

    const isOldIE = typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
        return (id, style) => addStyle(id, style);
    }
    let HEAD;
    const styles = {};
    function addStyle(id, css) {
        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
        if (!style.ids.has(id)) {
            style.ids.add(id);
            let code = css.source;
            if (css.map) {
                // https://developer.chrome.com/devtools/docs/javascript-debugging
                // this makes source maps inside style tags work properly in Chrome
                code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
                // http://stackoverflow.com/a/26603875
                code +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                        ' */';
            }
            if (!style.element) {
                style.element = document.createElement('style');
                style.element.type = 'text/css';
                if (css.media)
                    style.element.setAttribute('media', css.media);
                if (HEAD === undefined) {
                    HEAD = document.head || document.getElementsByTagName('head')[0];
                }
                HEAD.appendChild(style.element);
            }
            if ('styleSheet' in style.element) {
                style.styles.push(code);
                style.element.styleSheet.cssText = style.styles
                    .filter(Boolean)
                    .join('\n');
            }
            else {
                const index = style.ids.size - 1;
                const textNode = document.createTextNode(code);
                const nodes = style.element.childNodes;
                if (nodes[index])
                    style.element.removeChild(nodes[index]);
                if (nodes.length)
                    style.element.insertBefore(textNode, nodes[index]);
                else
                    style.element.appendChild(textNode);
            }
        }
    }

    /* script */
    const __vue_script__$d = script$d;

    /* template */
    var __vue_render__$d = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a-scene",
        {
          attrs: {
            embedded: "",
            "networked-scene":
              "serverURL: https://nxr.lifescope.io; app: lifescope-xr; room: " +
              _vm.roomName +
              "; connectOnLoad: " +
              _vm.connectOnLoad +
              "; audio: true; adapter: webrtc;",
            "loading-screen": "enabled: false"
          }
        },
        [
          _c(
            "a-assets",
            { staticClass: "aframe-assets" },
            [
              _c("img", {
                attrs: {
                  id: "sky",
                  src:
                    "https://s3.amazonaws.com/lifescope-static/static/xr/gallery/skybox/nightsky.jpg",
                  crossorigin: "anonymous"
                }
              }),
              _vm._v(" "),
              _c("img", {
                attrs: {
                  id: "earth",
                  src:
                    "https://s3.amazonaws.com/lifescope-static/static/xr/components/globe/Albedo.jpg",
                  crossorigin: "anonymous"
                }
              }),
              _vm._v(" "),
              _c("img", {
                attrs: {
                  id: "video-play",
                  src:
                    "https://s3.amazonaws.com/lifescope-static/static/xr/gallery/video_play.png",
                  crossorigin: "anonymous"
                }
              }),
              _vm._v(" "),
              _c("img", {
                attrs: {
                  id: "video-pause",
                  src:
                    "https://s3.amazonaws.com/lifescope-static/static/xr/gallery/video_pause.png",
                  crossorigin: "anonymous"
                }
              }),
              _vm._v(" "),
              _c("a-gltf-model", {
                attrs: {
                  id: "logo",
                  src:
                    "https://s3.amazonaws.com/lifescope-static/static/xr/logo/logo.gltf",
                  crossorigin: "anonymous"
                }
              }),
              _vm._v(" "),
              _c("a-gltf-model", {
                attrs: {
                  id: "avatar-0",
                  src:
                    "https://lifescope-static.s3.amazonaws.com/static/xr/avatars/head_female_-_low_poly/scene.gltf"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _vm.sceneLayout == _vm.SceneLayoutEnum.GALLERY
            ? _c("gallery")
            : _vm.sceneLayout == _vm.SceneLayoutEnum.GRID
            ? _c("grid-layout", {
                attrs: { offsety: _vm.playerHeight, offsetz: 1.5 }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.sceneLayout == _vm.SceneLayoutEnum.GALLERY
            ? _c("avatar", {
                ref: "avatar",
                attrs: { position: "0 " + _vm.playerHeight + " 0" }
              })
            : _vm.sceneLayout == _vm.SceneLayoutEnum.GRID
            ? _c("grid-camera", {
                ref: "avatar",
                attrs: { position: "0 " + _vm.playerHeight + " 0" }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.skybox == _vm.SkyboxEnum.STARS
            ? _c("a-sky", {
                attrs: { id: "starsky", src: "#sky", rotation: "90 0 90" }
              })
            : _vm.skybox == _vm.SkyboxEnum.SUN
            ? _c("a-sun-sky", {
                attrs: {
                  id: "sunsky",
                  material: "side: back",
                  "sun-sky-position": "starttime: " + _vm.skytime
                }
              })
            : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$d = [];
    __vue_render__$d._withStripped = true;

      /* style */
      const __vue_inject_styles__$d = function (inject) {
        if (!inject) return
        inject("data-v-c8e17234_0", { source: ".visuallyhidden {\n    display: block;\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    width: 1px;\n    margin: -1px;\n    padding: 0;\n    overflow: hidden;\n    position: absolute !important;\n}\na-scene {\n    position: absolute\n}\n.a-enter-vr {\n    height: 100%;\n    pointer-events: none;\n}\n.a-enter-vr-button {\n    z-index: 99999;\n    right: 3%;\n    bottom: 1%;\n    pointer-events: visible;\n}", map: undefined, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$d = undefined;
      /* module identifier */
      const __vue_module_identifier__$d = undefined;
      /* functional template */
      const __vue_is_functional_template__$d = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$d = normalizeComponent(
        { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
        __vue_inject_styles__$d,
        __vue_script__$d,
        __vue_scope_id__$d,
        __vue_is_functional_template__$d,
        __vue_module_identifier__$d,
        false,
        createInjector,
        undefined,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //


    var script$e = {
      data() {
          return {
            LoadingMessage: 'Loading...',
            particlesJSON: {
              "particles": {
                "number": {
                  "value": 80,
                  "density": {
                    "enable": true,
                    "value_area": 800
                  }
                },
                "color": {
                  "value": "#000000"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 5,
                    "color": "#ff00d1"
                  },
                  "polygon": {
                    "nb_sides": 5
                  },
                  "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                  }
                },
                "opacity": {
                  "value": 0.5,
                  "random": false,
                  "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                  }
                },
                "size": {
                  "value": 5,
                  "random": true,
                  "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                  }
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#2ac1de",
                  "opacity": 0.4,
                  "width": 3
                },
                "move": {
                  "enable": true,
                  "speed": 6,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                  }
                }
              },
              "interactivity": {
                "detect_on": "canvas",
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "grab"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "push"
                  },
                  "resize": true
                },
                "modes": {
                  "grab": {
                    "distance": 400,
                    "line_linked": {
                      "opacity": 1
                    }
                  },
                  "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                  },
                  "repulse": {
                    "distance": 200,
                    "duration": 0.4
                  },
                  "push": {
                    "particles_nb": 4
                  },
                  "remove": {
                    "particles_nb": 2
                  }
                }
              },
              "retina_detect": true
            }
          }
        },

      mounted() {
        particlesJS('loading-screen', this.particlesJSON);
      }
    };

    /* script */
    const __vue_script__$e = script$e;

    /* template */
    var __vue_render__$e = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "loading-screen", attrs: { id: "loading-screen" } },
        [
          _c("div", { staticClass: "loading-message" }, [
            _vm._v("\n    " + _vm._s(_vm.LoadingMessage) + "\n  ")
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$e = [];
    __vue_render__$e._withStripped = true;

      /* style */
      const __vue_inject_styles__$e = function (inject) {
        if (!inject) return
        inject("data-v-1ac5b186_0", { source: ".loading-screen {\n    display: flex;\n    align-items: center;\n    flex-direction: column;\n    background-color: black;\n}\n.loading-message {\n    font-size: 24px;\n    color: #aeaeae;\n}", map: undefined, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$e = undefined;
      /* module identifier */
      const __vue_module_identifier__$e = undefined;
      /* functional template */
      const __vue_is_functional_template__$e = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$e = normalizeComponent(
        { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
        __vue_inject_styles__$e,
        __vue_script__$e,
        __vue_scope_id__$e,
        __vue_is_functional_template__$e,
        __vue_module_identifier__$e,
        false,
        createInjector,
        undefined,
        undefined
      );

    //
    // import hud from './components/hud/hud.vue';

    var script$f = {

        props: {
          apptype: { default: 'xr' }
        },

        components: {
            aframeScene: __vue_component__$d,
            LoadingScreen: __vue_component__$e,
            // hud
        },

        computed: {
          ...vuex.mapState('xr',
          [
            'inVR',
            'sceneLoaded',
            'isMobile',
          ])
        },

        beforeMount () {
          const type = this.apptype == 'xr' ? 'XR' : 'APP';
          const connectOnLoad = this.apptype == 'xr' ? true : false;
          this.$store.commit('xr/SET_APPTYPE', type);
          this.$store.commit('xr/naf/SET_CONNECT_ON_LOAD', connectOnLoad);
        }
    };

    /* script */
    const __vue_script__$f = script$f;

    /* template */
    var __vue_render__$f = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { attrs: { id: "xrapp" } },
        [
          _c("aframe-scene"),
          _vm._v(" "),
          !_vm.sceneLoaded ? _c("loading-screen") : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$f = [];
    __vue_render__$f._withStripped = true;

      /* style */
      const __vue_inject_styles__$f = function (inject) {
        if (!inject) return
        inject("data-v-00b7d9fa_0", { source: "body {\n    background-color: black;\n}", map: undefined, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$f = undefined;
      /* module identifier */
      const __vue_module_identifier__$f = undefined;
      /* functional template */
      const __vue_is_functional_template__$f = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$f = normalizeComponent(
        { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
        __vue_inject_styles__$f,
        __vue_script__$f,
        __vue_scope_id__$f,
        __vue_is_functional_template__$f,
        __vue_module_identifier__$f,
        false,
        createInjector,
        undefined,
        undefined
      );

    function arrowComp () {

    AFRAME.registerComponent('arrow', {
        dependencies: ['highlight'],

        schema: {
            x: { type: 'number', default: 0},
            y: { type: 'number', default: 0},
            z: { type: 'number', default: 0},

            direction: { default: 'up', oneOf: ['left', 'right', 'up', 'down', 'angle']},
            angle: { type: 'number', default: 0 },

            width: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
            depth: { type: 'number', default: 0.01 },

            color: { default: 0xe8f1ff }, 
            opacity: { type: 'number', default: 1 },
            disabledopacity: { type: 'number', default: 0.2 },

        },
      

        init: function() {
            this._createArrow();
        },

        update: function(oldData) {
            var self = this;
            var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
            if (changedData.includes('disabled') && !!self.el.getAttribute('highlight')) {
                self.el.setAttribute('highlight', { 
                    disabled: this.data.disabled
                } );
            }
        },

        remove: function () {
            if (this.el.object3DMap.hasOwnProperty('mesh')) {
                this.el.removeObject3D('mesh');
            }
        },


        _createArrow() {
            var self = this;
            var data = self.data;

            var mat, geom, mesh;

            data.offset = {
                x: 0 + data.x,
                y: 0 + data.y,
                z: 0 + data.z,
            };

            var shape = new THREE.Shape();
            var width = data.width;
            var height = data.height;

            shape.moveTo( 0, height/2 );
            shape.lineTo( width/2, -height/2 );
            shape.lineTo( -width/2, -height/2 );
            shape.lineTo( 0, height/2 );
        
            geom = new THREE.ShapeBufferGeometry( shape );

            var rotationZ = data.angle;
            switch (data.direction) {
                case 'up':
                    break;
                case 'left':
                    rotationZ = 90;
                    break;
                case 'down':
                    rotationZ = 180;
                    break;
                case 'right':
                    rotationZ = -90;
                    break;
            }
            geom.rotateZ(2 * Math.PI * rotationZ / 360);

            geom.translate(data.offset.x, data.offset.y, data.offset.z);
        
            var color = data.color;
            var opacity = data.disabled ? data.disabledopacity : data.opacity;
            var transparent = data.disabled ? true : false;
            mat = new THREE.MeshBasicMaterial( {
                color: new THREE.Color( color ),
                transparent: transparent,
                opacity: opacity,
                side: THREE.DoubleSide,
            } );
        
            mesh = new THREE.Mesh(geom, mat);
            mesh.name = 'arrow';

            self.el.setObject3D('mesh', mesh);  
        },
    });


    AFRAME.registerPrimitive( 'a-arrow', {
        defaultComponents: {
            'arrow': {
            },
            'highlight': {
                type: 'color',
                borderbaseopacity: 0.7,
                disabledopacity: 0.2,
                color: 0xe8f1ff,
            }
        },
        mappings: {
            'direction': 'arrow.direction',
            'color': 'arrow.color',
            'width': 'arrow.width',
            'height': 'arrow.height',
            'hover': 'highlight.hover',
            'active': 'highlight.active',
            'disabled': 'highlight.disabled',
            'hovercolor': 'highlight.hoverColor',
            'activecolor': 'highlight.activeColor',
        }
    });

    }

    function _clickHandler(evt) {
        if (this.intersectingRaycaster) {
            const intersection = this.intersectingRaycaster.getIntersection(this.el);
            if (intersection){
                var clickEvent = new Event( this.data.clickevent, {bubbles: true});
                this.el.dispatchEvent(clickEvent);
            }
        }
    }

    function _raycasterIntersectedHandler(evt) {
        this.intersectingRaycaster = evt.detail.el.components.raycaster;
    }

    function _raycasterIntersectedClearedHandler(evt) {
        if (this.intersectingRaycaster != null) {
            const intersection = this.intersectingRaycaster.getIntersection(this.el);
            if (intersection == undefined) {
                this.intersectingRaycaster = null;
            }
        }
    }

    function clickableComp () {

    AFRAME.registerComponent('clickable', {

        schema: {
            id: { type: 'string', default: '' },
            enabled: { type: 'boolean', default: true },
            clickevent: { type: 'string', default: 'cellclicked' },
            enableevent: { type: 'string', default: 'enable-clickable' },
            disableevent: { type: 'string', default: 'disable-clickable' }
        },

        init() {
            this.clickHandler = _clickHandler.bind(this);
            this.raycasterIntersectedHandler = _raycasterIntersectedHandler.bind(this);
            this.raycasterIntersectedClearedHandler = _raycasterIntersectedClearedHandler.bind(this);

            this.firstUpdate = true;
        },

        tick: function() {
            if (!this.intersectingRaycaster) {
                return;
            }
        
            const intersection = this.intersectingRaycaster.getIntersection(this.el);
            this.intersection = intersection;
        },

        update(oldData) {
            var self = this;
            var data = self.data;
            var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

            if (this.firstUpdate) {
                this.firstUpdate = false;
                return;
            }
            if (changedData.includes('enabled')) {
                if (data.enabled) {
                    this.addHandlers();
                }
                else {
                    this.removeHandlers();
                }
            }
        },

        remove() {
            this.removeHandlers();
        },

        play() {
            if (this.data.enabled) {
                this.addHandlers();
            }
        },

        pause() {
            if (this.data.enabled) {
                this.removeHandlers();
            }
        },

        addHandlers: function() {
            this.el.addEventListener("click", this.clickHandler );
            this.el.addEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
            this.el.addEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
        },

        removeHandlers: function() {
            this.el.removeEventListener("click", this.clickHandler );
            this.el.removeEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
            this.el.removeEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
        },


    });

    }

    class TextureLoaderHelper {
        constructor() {
            this.baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/';
            this.brassUrl = this.baseUrl + 'brass/';
            this.bronzeUrl = this.baseUrl + 'bronze/';
            this.woodUrl = this.baseUrl + 'wood/floor/';
            this.woodPanelUrl = this.baseUrl + 'wood/panel/';

            this.materialUrls = {
                'brass': this.brassUrl,
                'bronze': this.bronzeUrl,
                'wood': this.woodUrl,
                'wood-panel': this.woodPanelUrl
              };
        }

        loadTexture(material, type='base', quality='l', ext='jpg', onLoad, onProgress, onError) {
            const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
            // console.log(`loadTexture: ${url}`);
            return new THREE.TextureLoader().load( url, onLoad, onProgress, onError );
        }

        getOrLoadTexture(material, type='base', quality='l', ext='jpg', onLoad, onProgress, onError) {
            const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
            
            var texture =  THREE.Cache.files[url];
            if (texture !== undefined) {
                onLoad(texture);
            }
            return texture !== undefined ?
                texture : new THREE.TextureLoader().load( url, onLoad, onProgress, onError );
        }

        getVideoTexture(url, onLoad, onProgress, onError) {
            var id = this.videoIdFromUrl(url);
            var videoEl = document.querySelector('#' + id);
            if  (videoEl != undefined) {
                onLoad(new THREE.VideoTexture( videoEl ));
                return;
            }
            var assets = AFRAME.scenes[0].querySelector('a-assets');
            try {
                videoEl = document.createElement('video');
                videoEl.setAttribute('id', id);
                videoEl.setAttribute('crossorigin', 'anonymous');
                videoEl.setAttribute('src', url);
                videoEl.addEventListener('loadedmetadata', (event) => {
                    onLoad(new THREE.VideoTexture( videoEl ));
                });
                assets.appendChild(videoEl);
            }
            catch (error) {
                console.log(`getVideoTexture(${url}) error`);
                console.log(error);
                onError(error);
            }
        }

        videoIdFromUrl(url) {
            return url.match(/\/*(\w+\.\w+)$/)[1];
        }
    }

    // wood texture author: Brandon Funk https://gumroad.com/l/wood_floor

    function _buildMediaMesh(url, type, width, height, depth, offset, srcFit, aspectratio=0) {
        return new Promise((resolveMesh, rejectMesh) => {
            var mediaMaterial, geom, mesh;

            var textureLoader = new THREE.TextureLoader();
            var loadFunction;
            if(type == 'video') {
                var textureLoaderHelper = new TextureLoaderHelper();
                loadFunction = textureLoaderHelper.getVideoTexture.bind(textureLoaderHelper);
            }
            else {
                loadFunction = textureLoader.load.bind(textureLoader);
            }

            var textureLoaderPromise = new Promise ( function(resolve, reject) {
                loadFunction( url,
                    // onLoad
                    function (texture) {
                        resolve(texture);
                    },
                    // onProgress
                    function (xhr) {
                        // //  console.log(xhr);
                    },
                    // onError
                    function (xhr) {
                        if (CONFIG.DEBUG) {console.log(`failed to load ${url}`);}
                        textureLoader.load( '../../../static/images/LifeScope.png',
                            // onLoad
                            function (texture) {
                                resolve(texture);
                            },
                            // onProgress
                            function (xhr) {
                                // console.log(xhr);
                            },
                            // onError
                            function (xhr) {
                                reject(xhr);
                            }
                        );
                    },
                );
            });

            textureLoaderPromise.then( function(texture) {
                var srcWidth = texture.image.videoWidth || texture.image.width;
                var srcHeight = texture.image.videoHeight || texture.image.height;
                var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);

                var geomWidth, geomHeight;
                if (srcFit == 'bothmax') {
                    geomWidth = width;
                    geomHeight = width / aspectRatio;
                    if (geomHeight > height) {
                        geomHeight = height;
                        geomWidth = height * aspectRatio;
                    }
                }
                else if (srcFit == 'width') {
                    geomWidth = width;
                    geomHeight = width / aspectRatio;
                }
                else {
                    geomWidth = height * aspectRatio;
                    geomHeight = height;
                }
                
                geom = new THREE.PlaneBufferGeometry( geomWidth, geomHeight );
                if(offset.roty) geom.rotateY(THREE.Math.degToRad(offset.roty));
                if(offset.rotx) geom.rotateX(THREE.Math.degToRad(offset.rotx));
                if(offset.rotz) geom.rotateZ(THREE.Math.degToRad(offset.rotz));
                geom.translate(offset.x, offset.y, offset.z);

                mediaMaterial = new THREE.MeshBasicMaterial( { map: texture } );
                mediaMaterial.name = type == 'video' ? 'mVideo' : "mImage";

                mesh = new THREE.Mesh(geom, mediaMaterial);
                mesh.name = type == 'video' ? 'video' : "image";
                resolveMesh(mesh);
            })
            .catch(function(error) {
                console.error(error);
                rejectMesh(error);
            });
        });
    }


    function _createMedia(offset = { x: 0, y: 0, z: 0, rotx: 0, roty: 0, rotz: 0 }) {
        var self = this;
        var data = self.data;
        
        var Type = data.type.charAt(0).toUpperCase() + data.type.slice(1);

        _buildMediaMesh(data.url, data.type, data.width, data.height, data.depth, offset, data.srcFit,
            data.aspectratio)
        .then( (mesh) => {
            self.media = mesh.material.map.image;

            switch (data.type) {
                case 'video':
                    self.video = self.media;
                    self._setVideoProgressListener();
                    break;
                case 'image':
                    self.image = self.media;
                    break;
            }

            self._updateAspectRatio();
            if (data.animateLoad) {
                AFRAME.ANIME({
                    targets: self.el.object3D.scale,
                    easing: 'linear',
                    x: [0, 1],
                    y: [0, 1],
                    z: [0, 1],
                    duration: 1000*(data.animateInSeconds)
                });
            }
            self.el.setObject3D(data.type, mesh);
            self.el.emit('media-mesh-set', {id: self.el.getAttribute('id')});
        })
        .catch(function(error) {
            console.log('_createMedia error');
            console.error(error);
        });
    }

    function _updateAspectRatio() {
        var self = this;
        var data = self.data;
        var media = self.media;
        var srcWidth = media.videoWidth || media.width;
        var srcHeight = media.videoHeight || media.height;
        var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);
        if (!data.aspectratio || data.aspectratio != aspectRatio) {
            self.el.setAttribute('aspectratio', aspectRatio);
        }
        var geomWidth, geomHeight;
        if (data.srcFit == 'width') {
            geomHeight = data.width / aspectRatio;
            if (data.height != geomHeight) {
                self.el.setAttribute('height', geomHeight);
            }
        }
        else {
            geomWidth = data.height * aspectRatio;
            if (data.width != geomWidth) {
                self.el.setAttribute('width', geomWidth);
            }
        }
    }

    function getCenterPoint(mesh) {
        var geometry = mesh.geometry;
        geometry.computeBoundingBox();   
        var center = geometry.boundingBox.getCenter();
        mesh.localToWorld( center );
        return center;
    }



    function mediaCellComp () {

    AFRAME.registerComponent('media-cell', {
        schema: {
            id: { type: 'string', default: '' },
            x: { type: 'number', default: 0},
            y: { type: 'number', default: 0},
            z: { type: 'number', default: 0},
            scale: { type: 'number', default: 1 },

            type: { type: 'string', default: 'image' },

            url: {type: 'string', default: ''},
            srcFit: { type: 'string', default: 'width' },

            width: { type: 'number', default: 0.6 },
            height: { type: 'number', default: 0.6 },
            depth: { type: 'number', default: 0.01 },

            hoverPlayButton: { type: 'boolean', default: false },
            activePlayButton: { type: 'boolean', default: false },
            isplaying: { type: 'boolean', default: false },

            hoverSeeking: { type: 'boolean', default: false },
            activeSeeking: { type: 'boolean', default: false },

            color: { default: 0xe8f1ff},
            opacity: { type: 'number', default: 0.2 },
            metalness: { type: 'number', default: 0.0 },
            reflectivity: { type: 'number', default: 0.5 },
            roughness: { type: 'number', default: 0.2 },

            repeatU: { type: 'number', default: 4},
            repeatV: { type: 'number', default: 1},

            selected: { type: 'boolean', default: false },
            borderwidth: { type: 'number', default: 0.02 },
            aspectratio: { type: 'number', default: 0 },

            animateLoad: { type: 'boolean', default: true },
            animateInSeconds: { type: 'number', default: 0.5 },
            animateOutSeconds: { type: 'number', default: 0.2 },

            disabled: { type: 'boolean', default: false },

        },
      
        multiple: true,

        init: function() {
            var self = this;

            self.originalHeight = self.data.height;
            self.originalWidth = self.data.width;

            self.seekingPoint = null;

            this.el.addEventListener("mousedown", evt => {
                if(!self.data.selected) {
                    self._animateActive();
                }
                if (self.intersectingRaycaster != null) {
                     const intersection = this.intersectingRaycaster.getIntersection(this.el);
                     self.intersection = intersection;
                     if (intersection) {
                        switch (intersection.object.name) {
                            case 'videolength':
                            case 'videoprogress':
                            case 'videoseekingpoint':
                                self.el.setAttribute('activeseeking', true);
                                break;
                            case 'playPauseButton':
                                self.el.setAttribute('activeplaybutton', true);
                        }
                        if (intersection.object.name.startsWith('videobuffered')) {
                            self.el.setAttribute('activeseeking', true);
                        }
                    }
                }
            });
            this.el.addEventListener("mouseup", evt => {
                self.el.setAttribute('activeseeking', false);
                self.el.setAttribute('activePlayButton', false);
            });
            this.el.addEventListener("raycaster-intersected", evt => {
                self.intersectingRaycaster = evt.detail.el.components.raycaster;
                // console.log("raycaster-intersected");
            });
            this.el.addEventListener("raycaster-intersected-cleared", evt => {
                // console.log('raycaster-intersected-cleared');
                if (self.intersectingRaycaster != null) {
                    const intersection = self.intersectingRaycaster.getIntersection(self.el);
                    if (intersection == undefined) {
                        self.intersectingRaycaster = null;
                    }
                }
                
                if (self.data.hoverPlayButton) {
                    self.el.setAttribute('hoverplaybutton', false);
                }
                if (self.data.hoverSeeking) {
                    self.el.setAttribute('hoverseeking', false);
                }
            });

            this._createMedia = _createMedia.bind(this);
            this._updateAspectRatio = _updateAspectRatio.bind(this);

            if (self.data.url != '' && self.data.type=="image") {
                self._createMedia();
            }

            if (self.data.url != '' && self.data.type=="video") {
                self._createMedia();
                if (self.data.selected && !!self.video) {
                    self._createVideoControls();
                }
                else if (self.data.selected) {
                    self.el.addEventListener('media-mesh-set', (evt) => {
                        //  console.log('media-mesh-set received');
                        self._createVideoControls();
                    });
                }
            }


            if (self.data.selected) {
                self.el.setAttribute('text__videoprogress', {transparent: false});
                self.el.setAttribute('text__videoprogress', {opacity: 1});
            }
            else {
                self.el.setAttribute('text__videoprogress', {transparent: true});
                self.el.setAttribute('text__videoprogress', {opacity: 0});
            }
        },

        tick: function() {
            var self = this;
            if (self.video && self.data.isplaying) {
                self._updateProgressBar();
            }

            if (!this.intersectingRaycaster) {
               return;
            }
       
            const intersection = this.intersectingRaycaster.getIntersection(this.el);
            self.intersection = intersection;
            if (intersection) {
                switch (intersection.object.name) {
                    case 'playPauseButton':
                        if(!self.data.hoverPlayButton) {
                            self.el.setAttribute('hoverplaybutton', true);
                        }
                        break;
                    case 'videolength':
                    case 'videoprogress':
                    case 'videoseekingpoint':
                        if (!self.data.hoverSeeking) {
                            self.el.setAttribute('hoverseeking', true);
                        }
                        if (self.seekingPoint != intersection.point) {
                            self.seekingPoint = intersection.point;
                            self._updateSeeking(self.seekingPoint);
                        }
                        break;
                }
                if (intersection.object.name.startsWith('videobuffered')) {
                    if (self.seekingPoint != intersection.point) {
                        self.seekingPoint = intersection.point;
                        self._updateSeeking(self.seekingPoint);
                    }
                    if (!self.data.hoverSeeking) {
                        self.el.setAttribute('hoverseeking', true);
                    }
                }
            }
        },

        update: function(oldData) {
            var self = this;
            var data = self.data;
            var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
            if ( changedData.includes('url') ) {
                self.el.setAttribute('aspectratio', 0);
                self.el.setAttribute('height', self.originalHeight);
                self.el.setAttribute('width', self.originalWidth);
            }
            if ( !!self.media && ['srcFit', 'width', 'height', ]
                .some(prop => changedData.includes(prop))) {
                self._updateAspectRatio();
            }

            if ( self.el.object3DMap.hasOwnProperty('image') &&
                ['url', 'srcFit', 'width', 'height', 'depth', 'aspectratio']
                .some(prop => changedData.includes(prop))) {
                self.el.removeObject3D('image');
                if (self.data.url != '' && self.data.type=="image") {
                    self._createMedia();
                }
            }
            if ( self.el.object3DMap.hasOwnProperty('video') &&
                ['url', 'srcFit', 'width', 'height', 'depth', 'aspectratio']
                .some(prop => changedData.includes(prop)) ) {
                self.el.removeObject3D('video');
                if (self.data.url != '' && self.data.type=="video") {
                    self._createMedia();
                }
            }
            if (
                [ 'selected', 'srcFit', 'width', 'height', 'depth', 'aspectratio',]
                .some(prop => changedData.includes(prop))) {
                    if (self.el.object3DMap.hasOwnProperty('videocontrols')) {
                        this.el.removeObject3D('videocontrols');
                    }
                    if (this.el.object3DMap.hasOwnProperty('progressbar')) {
                        this.el.removeObject3D('progressbar');
                    }
                if (!!self.video && self.data.selected && self.data.type == 'video') {
                    self._createVideoControls();
                }
            }
            if (
                [ 'hoverPlayButton', 'activePlayButton', 'selected', ] //'isplaying'
                .some(prop => changedData.includes(prop))) {
                    var colorPlayPauseButton = data.disabled ? 0xA9A9A9 : data.activePlayButton ? 0xFFD704 : data.hoverPlayButton ? 0x04FF5F : data.color;
                    var group = self.el.getObject3D('videocontrols');
                    if (group) {
                        var playPauseButton = group.children.find(function(obj) {
                            return obj.name == 'playPauseButton';
                        });
                        playPauseButton.material.color = new THREE.Color( colorPlayPauseButton );
                    }
            }
            if (
                [ 'isplaying' ]
                .some(prop => changedData.includes(prop))) {
                if (!!self.video && self.data.selected && self.data.type == 'video') {
                    self._updatePausePlayButton();
                }
            }

            if (
                [ 'selected' ]
                .some(prop => changedData.includes(prop))) {
                    if (self.data.selected) {
                        self.el.setAttribute('text__videoprogress', {transparent: false});
                        self.el.setAttribute('text__videoprogress', {opacity: 1});
                    }
                    else {
                        self.el.setAttribute('text__videoprogress', {transparent: true});
                        self.el.setAttribute('text__videoprogress', {opacity: 0});
                    }
            }

            if (
                [ 'hoverSeeking', 'activeSeeking', ] //'isplaying'
                .some(prop => changedData.includes(prop))) {
                    if (!data.hoverSeeking && !data.activeSeeking) {
                        var group = self.el.getObject3D('progressbar') || new THREE.Group();
                        var mesh = group.children.find(function(obj) {
                            return obj.name == 'videoseekingpoint';
                        });
                        if (mesh) {
                            group.remove(mesh);
                        }
                    }
            }
        },

        remove: function () {
            if (this.el.object3DMap.hasOwnProperty(this.id)) {
                this.el.removeObject3D(this.id);
            }
            if (this.el.object3DMap.hasOwnProperty('image')) {
                        this.el.removeObject3D('image');
            }
            if (this.el.object3DMap.hasOwnProperty('video')) {
                this.el.removeObject3D('video');
            }
            if (this.el.object3DMap.hasOwnProperty('border')) {
                this.el.removeObject3D('border');
            }
            if (this.el.object3DMap.hasOwnProperty('videocontrols')) {
                this.el.removeObject3D('videocontrols');
            }
            if (this.el.object3DMap.hasOwnProperty('progressbar')) {
                this.el.removeObject3D('progressbar');
            }
        },



        _createProgressBar() {
            var self = this;

            var progressBarY = -self.data.height/2 - 0.05;

            var group = self.el.getObject3D('progressbar') || new THREE.Group();
            group.name = 'gProgressbar';


            //
            // Video base
            //
            var geomVideoLength = new THREE.CylinderBufferGeometry( 0.01, 0.01, self.data.width, 8, 1 );

            geomVideoLength.rotateZ(Math.PI/2);
            geomVideoLength.translate(0, progressBarY, 0);
            var matVideoLength = new THREE.MeshBasicMaterial( {color: 0xaeaeae} );
            var meshVideoLength = new THREE.Mesh( geomVideoLength, matVideoLength );
            meshVideoLength.name = 'videolength';
            
            group.add(meshVideoLength);


            //
            // Progress
            //
            var minWidthPercent = 0.001;
            var minWidth = self.data.width*minWidthPercent;
            var geo = new THREE.CylinderBufferGeometry( 0.02, 0.02, minWidth, 8, 1 );
            geo.rotateZ(Math.PI/2);
            geo.translate(minWidth/2, progressBarY, 0);

            geo.morphAttributes.position = [];

            var positions = geo.attributes.position.array;
            var morphPositions = [];

            for ( var i = 0; i < positions.length; i += 3 ) {

                var x = positions[ i ];
                var y = positions[ i + 1 ];
                var z = positions[ i + 2 ];

                morphPositions.push(

                    x / minWidthPercent,
                    y ,
                    z

                );

            }

            geo.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( morphPositions, 3 );
            
            var mat = new THREE.MeshBasicMaterial( 
                {
                    color: 0x27BEFF, 
                    morphTargets: true
                }
            );
            var meshVideoProgress = new THREE.Mesh( geo, mat );
            meshVideoProgress.translateX(-self.data.width/2);
            meshVideoProgress.name ='videoprogress';
            group.add(meshVideoProgress);

            //
            // Buffered
            //
            var bufferedMeshes = self._createBuffers();
            if (bufferedMeshes.length != 0) {
                bufferedMeshes.forEach( mesh => group.add(mesh));
            }

            self.el.setObject3D('progressbar', group);   
        },

        _updateProgressBar() {
            var self = this;

            var group = self.el.getObject3D('progressbar') || new THREE.Group();
            var meshVideoProgress;
            if (self.el.object3DMap.hasOwnProperty('progressbar')) {
                meshVideoProgress = group.children.find(function(obj) {
                    return obj.name == 'videoprogress';
                  });
            }
            else {
                return;
            }

            var progressPercent = self.video.currentTime/self.video.duration;
            meshVideoProgress.morphTargetInfluences[ 0 ] = progressPercent;

            if (self.video.buffered && self.video.buffered.length != 0) {
                self._updateBuffered();
            }
        },

        _createBuffers() {
            var self = this;
            var meshes = [];

            var minWidthPercent = 0.001;
            var minWidth = self.data.width*minWidthPercent;
            var progressBarY = -self.data.height/2 - 0.05;

            if (self.video.buffered && self.video.buffered.length != 0) {
                var i = 0;
                const bufferedLengths = self.video.buffered.length;
                const timeRange = self.video.buffered;
                const duration = self.video.duration;
                const width = self.data.width;
                while (i < bufferedLengths) {
                    var start = timeRange.start(i);
                    var end = timeRange.end(i);
                    var meshBuffered = self._createBufferMesh(start, end, duration, width, minWidth, minWidthPercent);
                    meshBuffered.translateY(progressBarY);
                    meshBuffered.name = 'videobuffered-' + i;
                    meshes.push(meshBuffered);
                    i++;
                }
            }
            return meshes;
        },

        _createBufferMesh(start, end, duration, width, minWidth, minWidthPercent) {
            var bufferedStartX = (1/2 - start/duration ) * width;// + minWidth;//+  1/2 - bufferedPercent/2
            var geomBuffered = new THREE.CylinderBufferGeometry( 0.015, 0.015, minWidth, 8, 1 );

            geomBuffered.rotateZ(Math.PI/2);
            geomBuffered.translate(minWidth/2, 0, 0);

            geomBuffered.morphAttributes.position = [];

            var bufferedPositions = geomBuffered.attributes.position.array;
            var bufferedMorphPositions = [];

            for ( var j = 0; j < bufferedPositions.length; j += 3 ) {
                var x = bufferedPositions[ j ];
                var y = bufferedPositions[ j + 1 ];
                var z = bufferedPositions[ j + 2 ];
                bufferedMorphPositions.push(
                    x / minWidthPercent,
                    y ,
                    z
                );
            }

            geomBuffered.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( bufferedMorphPositions, 3 );

            var matBuffered = new THREE.MeshBasicMaterial( 
                {
                    color: 0x29F1FF, 
                    morphTargets: true
                }
            );
            var meshBuffered = new THREE.Mesh( geomBuffered, matBuffered );
            meshBuffered.translateX(-bufferedStartX);
            return meshBuffered;
        },

        _updateBuffered() {
            var self = this;
            var i = 0;
            const bufferedLengths = self.video.buffered.length;
            const timeRange = self.video.buffered;
            const duration = self.video.duration;
            const width = self.data.width;
            var progressBarY = -self.data.height/2 - 0.05;

            var minWidthPercent = 0.001;
            var minWidth = self.data.width*minWidthPercent;

            var group = self.el.getObject3D('progressbar');

            var currentBufferedIndices = [];
            var bufferedMeshes;
            if (this.el.object3DMap.hasOwnProperty('progressbar')) {
                bufferedMeshes = group.children.filter( obj => obj.name.startsWith('videobuffered'));
                if (Array.isArray(bufferedMeshes) && bufferedMeshes.length != 0) {
                    bufferedMeshes.forEach( obj => currentBufferedIndices.push(+obj.name.match(/\d+$/)));
                }
                
            }

            while (i < bufferedLengths) {
                var start = timeRange.start(i);
                var end = timeRange.end(i);
                if (currentBufferedIndices.includes(i)) {
                    var meshBuffered = bufferedMeshes.find(function(obj) {
                        return obj.name == 'videobuffered-' + i;
                      });
                    var bufferedPercent = (end-start)/duration;
                    meshBuffered.morphTargetInfluences[ 0 ] = bufferedPercent;
                }
                else {
                    var meshBuffered = self._createBufferMesh(start, end, duration, width, minWidth, minWidthPercent);
                    meshBuffered.translateY(progressBarY);
                    meshBuffered.name = 'videobuffered-' + i;
                    group.add(meshBuffered);
                }
                i++;
            }
        },

        _createVideoControls() {
            this._createProgressBar();
            this._updatePausePlayButton();
        },

        _updatePausePlayButton() {
            var self = this;
            var data = self.data;

            var group = self.el.getObject3D('videocontrols') || new THREE.Group();

            if (this.el.object3DMap.hasOwnProperty('videocontrols')) {
                var meshPlayPauseButton = group.children.find(function(obj) {
                    return obj.name == 'playPauseButton';
                  });
                group.remove(meshPlayPauseButton);
            }


            // play/pause button
            var playPauseButton = new THREE.Shape();
            var hole = new THREE.Path();
            var playWidth = 0.1;
            var playHeight = 0.1;

            // pause button
            if (self.data.isplaying) {
                playPauseButton.moveTo( -playWidth/2, -playHeight/2 );
                playPauseButton.lineTo( -playWidth/2, playHeight/2 );
                playPauseButton.moveTo( playWidth/2, playHeight/2 );
                playPauseButton.lineTo( playWidth/2, -playHeight/2 );
                
                hole.moveTo( playWidth/4, playHeight/2 );
                hole.lineTo( playWidth/4, -playHeight/2 );
                hole.lineTo( -playWidth/4, -playHeight/2 );
                hole.lineTo( -playWidth/4, playHeight/2 );

                playPauseButton.holes = [hole];
            }
            else { // play button
                playPauseButton.moveTo( playHeight/2, 0 );
                playPauseButton.lineTo( -playHeight/2, playWidth/2 );
                playPauseButton.lineTo( -playHeight/2, -playWidth/2, );
                playPauseButton.lineTo( playHeight/2, 0 );
            }
        
            var geomPlayPauseButton = new THREE.ShapeBufferGeometry( playPauseButton );

            var progressBarY = -self.data.height/2 - 0.05;
            var playPauseButtonOffsetX = self.data.width/2 - 0.1;
            var playPauseButtonOffsetY = progressBarY - 0.2;
            geomPlayPauseButton.translate(-playPauseButtonOffsetX, playPauseButtonOffsetY, 0);

            var colorPlayPauseButton = data.disabled ? 0xA9A9A9 : data.activePlayButton ? 0xFFD704 : data.hoverPlayButton ? 0x04FF5F : data.color;
            var opacity = data.disabled ? 0.2 : data.opacity;
            var transparent = data.disabled ? true : false;
            var matPlayPauseButton = new THREE.MeshBasicMaterial( {color: new THREE.Color( colorPlayPauseButton ),
                transparent: transparent,
                opacity: opacity,
                side: THREE.DoubleSide,},
            );
        
            var meshPlayPauseButton = new THREE.Mesh(geomPlayPauseButton, matPlayPauseButton);
            meshPlayPauseButton.name = 'playPauseButton';
            group.add(meshPlayPauseButton);
            group.name = 'gVideocontrols';

            self.el.setObject3D('videocontrols', group);   
        },

        _playPauseHandler() {
            var self = this;
            try {
                if (self.video.paused) {
                    self.video.play();
                    self.el.setAttribute('isplaying', true);
                }
                else {
                    self.video.pause();
                    self.el.setAttribute('isplaying', false);
                }
            }
            catch (error) {
                console.log('error in _playPauseHandler');
                console.error(error);
            }
        },

        _videoSeekingHandler() {
            var self = this;
            try {
                if (self.video && self.seekingPercantage) {
                    self.video.currentTime = self.video.duration * self.seekingPercantage;
                }
                else {
                }
            }
            catch (error) {
                console.log('error in _videoSeekingHandler');
                console.error(error);
            }
        },

        _setVideoProgressListener() {
            var self = this;
            if (self.video) {
                self.video.addEventListener("progress", evt => {
                    self._updateProgressBar();
                });
            }
        },

        _createSeeking(point) {
            var self = this;
            var data = self.data;

            var group = self.el.getObject3D('progressbar') || new THREE.Group();
            var meshVideoLength = group.children.find(function(obj) {
                return obj.name == 'videolength';
              });

            var center = getCenterPoint(meshVideoLength);

            var b = new THREE.Vector3(1, 0, 0);

            var seekingPoint = new THREE.Vector3();
            seekingPoint.copy(point);
            seekingPoint = seekingPoint.projectOnVector(b);
            self.seekingPercantage = (seekingPoint.x + self.data.width*1.5/2)/(self.data.width*1.5);


            seekingPoint.add(center);

            var geometry = new THREE.CylinderBufferGeometry( 0.025, 0.025, 0.01, 8, 1 );
            geometry.rotateZ(Math.PI/2);
            var color = data.disabled ? 0xA9A9A9 : data.activeSeeking ? 0xFFD704 : 0xFFFF00;
            var material = new THREE.MeshBasicMaterial( {color: new THREE.Color(color)} );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.name = 'videoseekingpoint';
            seekingPoint = group.worldToLocal(seekingPoint);

            mesh.position.set(seekingPoint.x, seekingPoint.y, seekingPoint.z);
            mesh.updateMatrix();
            group.add( mesh );
        },

        _updateSeeking(point) {
            var self = this;
            var data = self.data;
            
            var group = self.el.getObject3D('progressbar') || new THREE.Group();
            var meshVideoLength = group.children.find(function(obj) {
                return obj.name == 'videolength';
              });
            var meshOldSeeking = group.children.find(function(obj) {
                return obj.name == 'videoseekingpoint';
              });

            if (!meshOldSeeking) {
                self._createSeeking(point);
                return
            }

            var center = getCenterPoint(meshVideoLength);

            var b = new THREE.Vector3(1, 0, 0);

            var seekingPoint = new THREE.Vector3();
            seekingPoint.copy(point);
            seekingPoint = seekingPoint.projectOnVector(b);
            self.seekingPercantage = (seekingPoint.x + self.data.width*1.5/2)/(self.data.width*1.5);

            seekingPoint.add(center);

            var color = data.disabled ? 0xA9A9A9 : data.activeSeeking ? 0xFFD704 : data.hoverSeeking ? 0xFFFF00 : data.color;
            meshOldSeeking.material.color = new THREE.Color( color );

            seekingPoint = group.worldToLocal(seekingPoint);
            meshOldSeeking.position.set(seekingPoint.x, seekingPoint.y, seekingPoint.z);
        },

        // TODO : fix anime.js keyframes
        _animateHover(originalValues=null) {
            if (this.animatingHover) {return;} 
            this.animatingHover = true;
            var self = this;
            var scale = originalValues ? originalValues : Object.assign({}, self.el.object3D.scale); //JSON.parse(JSON.stringify(obj))
            var x = scale.x;
            var y = scale.y;
            var xmax = x*1.1;
            var xmin = x*0.9;
            var ymax = y*1.1;
            var ymin = y*0.9;
            var dur = 500;


            AFRAME.ANIME({
                targets: self.el.object3D.scale,
                easing: 'linear',
                x: [x, xmax],
                y: [y, ymax],
                duration: dur/2,
            }).finished.then(() => {
                return AFRAME.ANIME({
                    targets: self.el.object3D.scale,
                    easing: 'linear',
                    x: [xmax, xmin],
                    y: [ymax, ymin],
                    duration: dur,
                }).finished
            }
            ).then( () => {
                return AFRAME.ANIME({
                    targets: self.el.object3D.scale,
                    easing: 'linear',
                    x: [xmin, x],
                    y: [ymin, y],
                    duration: dur/2,
                    complete: function(anim) {
                        self.animatingHover = false;
                    }
                }).finished
            }
            )
            .catch(error =>
                console.log(error)
            );
        },

        _animateActive(originalValues=null) {
            if (this.animatingActive) { return;}
            this.animatingActive = true;
            var self = this;
            var rot = originalValues ? originalValues : Object.assign({}, self.el.object3D.rotation);
            var step = (2*Math.PI/ 100) * 2;
            var x = rot._x;
            var y = rot._y;
            var z = rot._z;
            var zmin = z-step;
            var zmax = z+step;
            var dur = 250;
            AFRAME.ANIME({
                targets: self.el.object3D.rotation,
                easing: 'linear',
                // x: xmin,
                // y: ymin,
                z: zmin,
                duration: dur,
                
            }).finished
            .then(() => {
                return AFRAME.ANIME({
                    targets: self.el.object3D.rotation,
                    easing: 'linear',
                    // x: xmax,
                    // y: ymin,
                    z: zmax,
                    duration: dur,
                    complete: function(anim) {
                        self.animatingActive = false;
                        AFRAME.ANIME({
                            targets: self.el.object3D.rotation,
                            easing: 'linear',
                            x: x,
                            y: y,
                            z: z,
                            duration: dur/2,
                        });
                    }
                }).finished
            });
        }
    });


    AFRAME.registerPrimitive( 'a-media-cell', {
        defaultComponents: {
            'media-cell__cell': {
            },
            'text__videoprogress': { value: '', align: 'center'},
        },
        mappings: {
            'src': 'media-cell__cell.url',
            'srcfit': 'media-cell__cell.srcFit',
            'width': 'media-cell__cell.width',
            'height': 'media-cell__cell.height',
            'scale': 'media-cell__cell.scale',
            'aspectratio': 'media-cell__cell.aspectratio',
            'selected': 'media-cell__cell.selected',
            'hoverplaybutton': 'media-cell__cell.hoverPlayButton',
            'activeplaybutton': 'media-cell__cell.activePlayButton',
            'hoverseeking': 'media-cell__cell.hoverSeeking',
            'activeseeking': 'media-cell__cell.activeSeeking',
            'isplaying': 'media-cell__cell.isplaying',
            'type': 'media-cell__cell.type',
            'id': 'media-cell__cell.id',
            'animateload': 'media-cell__cell.animateLoad',
            'animatein': 'media-cell__cell.animateInSeconds',
            'animateout': 'media-cell__cell.animateOutSeconds',
        }
    });

    }

    var materialColors =  new Map([
        ['brass', 0xDAA520],
        ['bronze', 0xDAA520],
        ['wood', 0xA0522D],
        ['wood-panel', 0xA0522D],
        ['glass', 0xC0C0C0],
    ]);

    function _buildMaterial(shading, type, quality='l', withBump=false, withNormal=false, repeatU=1, repeatV=1, props={}) {
        return new Promise((resolve, reject) => {
        
            var material, baseTexture, bumpTexture, nomralTexture;
            if (type=='glass') {
                material = new THREE.MeshPhysicalMaterial( 
                    {
                        color: props.color,
                        metalness: props.metalness,
                        reflectivity: props.reflectivity,
                        roughness: props.roughness,
                        opacity: props.opacity,
                        side: THREE.DoubleSide,
                        transparent: true,
                        envMapIntensity: 5,
                        premultipliedAlpha: true,
                });
                resolve(material);
            }

            // if (shading=='cel') {
            //     var material = new CelShader(materialColors.get(type), props);
            //     resolve(material);
            // }

            // if (type=='gradient') {
            //     var material = new GradientShader(0xACB6E5, 0x74ebd5);
            //     resolve(material);
            // }
            
            var tlHelper = new TextureLoaderHelper();

            baseTexture = tlHelper.loadTexture( type, 'base', quality, 'jpg',
                // onLoad
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( repeatU, repeatV );

                    material = new THREE.MeshPhongMaterial( { map: texture,//baseTexture,
                        side:THREE.FrontSide,
                        specular: 0x222222,
                        shininess: 25,
                        } );

                    if (withBump) {
                        bumpTexture = tlHelper.loadTexture( type, 'height', quality, 'jpg',
                            function (texture) {
                                material.bumpMap = texture;
                                material.bumpScale = 1;
                            }
                        );
                    }
                    if (withNormal) {
                        nomralTexture = tlHelper.loadTexture( type, 'normal', quality, 'jpg',
                            function (texture) {
                                material.normalMap = texture;
                            }
                        );
                    }
                    material.needsUpdate = true;
                    resolve(material);
                },
                // onProgress
                function (xhr) {
                    // console.log(xhr);
                },
                // onError
                function (error) {
                    console.log('failed to load texture');
                    console.log(error);
                    var material = new CelShader(materialColors.get(type), props);
                    resolve(material);
                }
            );
        
        });
    }

    function _buildGeometry(type, data) {
        var geom, height, width, depth;
        var x, y, z;
        x = data.x;
        y = data.y;
        z = data.z;
        switch (type) {
            case 'column':
                height = data.railheight + 0.01;
                geom =  new THREE.CylinderBufferGeometry( data.columnradius,
                    data.columnradius,
                    height,
                    data.radialsegments, 1, false );

                geom.translate(x,
                    y + height/2,
                    z);
                break;
        
            case 'sphere':
                var radius = data.columnradius * (3/2);
                height = data.railheight + 0.01 + radius;
                geom = new THREE.SphereBufferGeometry( radius,
                    data.radialsegments, data.radialsegments );
            
                geom.translate(x,
                    y + height,
                    z);
                break;
            case 'case':
                height = data.height;
                width = data.width;
                if (data.aspectratio) {
                    if (data.srcFit == 'width') {
                        height = data.imagewidth / data.aspectratio;
                    }
                    else {
                        width = data.imageheight * data.aspectratio;
                    }
                }
                geom = new THREE.BoxBufferGeometry( width, height, data.depth );
                geom.rotateX(2 * Math.PI * data.rotationx / 360);
                geom.translate(x + data.offset.x, y + data.offset.y, z + data.offset.z);
                break;
            case 'base':
            case 'trim':
            case 'glass':
                width = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                if (type == 'glass') { height = data.railheight - (2*data.baseheight); depth = data.basedepth - 0.01; }
                else if (type == 'base') { height = data.baseheight; depth = data.basedepth; }
                else if (type == 'trim') { height = data.trimheight; depth = 0.01;}

                var shape = new THREE.Shape();
                var cr = data.columnradius;

                shape.moveTo( -(width - cr)/2, -height/2 );
                shape.lineTo( -(width - cr)/2, height/2 );
                shape.lineTo( (width + cr)/2, height/2 );
                shape.lineTo( (width + cr)/2, -height/2 );
                shape.lineTo( -(width - cr)/2, -height/2 );
            
                var extrudeSettings = {
                    steps: 2,
                    depth: depth,
                    //amount: self.data.depth, // aframe 8.2 / three.js r92
                    bevelEnabled: type == 'trim' ? false : true,
                    bevelThickness: 0.01,
                    bevelSize: 0.01,
                    bevelSegments: 1
                };
                geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

                if (type == 'base') {
                    if (data.pos == 'top') {
                        y += data.railheight - data.baseheight - 0.01;
                    }
                }
                else if (type == 'trim') {
                    if (data.side == 'front') {
                        z += 0.02;
                    }
                    else if (data.side == 'back') {
                        z -= 0.02;
                    }
                    if (data.pos == 'top') {
                        y += data.railheight - data.baseheight - 0.02;
                    }
                    else {
                        y += data.baseheight;
                    }
                }
                else if (type == 'glass') {
                    y += data.baseheight;
                }
     
                geom.translate(x + ((width + cr/2 + 0.01)/2),
                            y + height/2,
                            z - depth/2);
                break;
        }
        return geom;
    }

    function dioramaComp () {

    AFRAME.registerComponent('diorama-rail', {
        schema: {
            x: { type: 'number', default: 0},
            y: { type: 'number', default: 0},
            z: { type: 'number', default: 0},

            railheight: { type: 'number', default: 1.2 },
            baseheight: { type: 'number', default: 0.075 },
            trimheight: { type: 'number', default: 0.01 },
            basedepth: { type: 'number', default: 0.03 },
            columnradius: { type: 'number', default: 0.05 },

            radialsegments: { type: 'number', default: 36 },
            floorradius: { type: 'number', default: 6},

            color: { default: 0xe8f1ff}, //0xe8f1ff
            opacity: { type: 'number', default: 0.2 },
            metalness: { type: 'number', default: 0.0 },
            reflectivity: { type: 'number', default: 0.5 },
            roughness: { type: 'number', default: 0.2 },

            repeatU: { type: 'number', default: 4},
            repeatV: { type: 'number', default: 1},

            withBump: { default: false },
            withNormal: { default: false },
            quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
            shading: { default: 'default' },
        },

        multiple: true,

        update: function() {
            var self = this;
            if (self.el.object3DMap.hasOwnProperty(self.id)) {
                self.el.removeObject3D(self.id);
            }
            if (self.id != undefined) {
                self._createRail();
            }
        },

        remove: function () {
            if (this.el.object3DMap.hasOwnProperty(this.id)) {
                this.el.removeObject3D(this.id);
            }
        },

        _createRail() {
            var data = this.data;
            this._createDioramaComponent('brass', 'column');
            this._createDioramaComponent('brass', 'sphere');
            this._createDioramaComponent('wood-panel', 'base');
            this._createDioramaComponent('wood-panel', 'base', 'top');
            this._createDioramaComponent('brass', 'trim', '', 'front');
            this._createDioramaComponent('brass', 'trim', '', 'back');
            this._createDioramaComponent('brass', 'trim', 'top', 'front');
            this._createDioramaComponent('brass', 'trim', 'top', 'back');
            this._createDioramaComponent('glass', 'glass', '', '', {
                color: data.color,
                metalness: data.metalness,
                reflectivity: data.reflectivity,
                roughness: data.roughness,
                opacity: data.opacity,
            });
        },

        _createDioramaComponent(type, shape,  pos='', side='front', props={}) {
            var self = this;
            var geom, mesh;
            var data = Object.assign({}, self.data);
            data.pos = pos;
            data.side = side;
        
            _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
            .then( (material) => {
                geom = _buildGeometry(shape, data);
                if (shape == 'base' && material.map != undefined) {
                    var texture = material.map;
                    var offsetx = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                    var offsety = data.baseheight / 2;
                    texture.rotation = Math.PI / 2;
                    texture.offset.set( offsetx, offsety );
                }
                mesh = new THREE.Mesh(geom, material);
            
                var group = self.el.getObject3D(self.id) || new THREE.Group();
                group.add(mesh);
                self.el.setObject3D(self.id, group); 
            });
        },

    });


    AFRAME.registerPrimitive( 'a-rail', {
        defaultComponents: {
            'diorama-rail__rail': { 
                repeatV: 1,
            },

        },
        mappings: {
            'radius': 'diorama-rail__rail.floorradius',
            'bump': 'diorama-rail__rail.withBump',
            'normal': 'diorama-rail__rail.withNormal',
            'quality': 'diorama-rail__rail.quality',
            'radialsegments': 'diorama-rail__rail.radialsegments',
            'railheight': 'diorama-rail__rail.railheight',
            'shading': 'diorama-rail__rail.shading',
        }
    });



    AFRAME.registerComponent('diorama-column', {
        schema: {
            x: { type: 'number', default: 0},
            y: { type: 'number', default: 0},
            z: { type: 'number', default: 0},

            railheight: { type: 'number', default: 1.2 },
            baseheight: { type: 'number', default: 0.075 },
            trimheight: { type: 'number', default: 0.01 },
            basedepth: { type: 'number', default: 0.03 },
            columnradius: { type: 'number', default: 0.05 },

            radialsegments: { type: 'number', default: 36 },
            floorradius: { type: 'number', default: 6},

            color: { default: 0xe8f1ff}, //0xe8f1ff
            opacity: { type: 'number', default: 0.2 },
            metalness: { type: 'number', default: 0.0 },
            reflectivity: { type: 'number', default: 0.5 },
            roughness: { type: 'number', default: 0.2 },

            repeatU: { type: 'number', default: 4},
            repeatV: { type: 'number', default: 1},

            withBump: { default: false },
            withNormal: { default: false },
            quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
            shading: { default: 'default' },

            withTrim: { default: false }
        },

        multiple: true,

        update: function() {
            var self = this;
            if (self.el.object3DMap.hasOwnProperty(self.id)) {
                self.el.removeObject3D(self.id);
            }
            if (self.id != undefined) {
                self._createRail();
            }
        },

        remove: function () {
            if (this.el.object3DMap.hasOwnProperty(this.id)) {
                this.el.removeObject3D(this.id);
            }
        },

        _createRail() {
            var data = this.data;
            this._createDioramaComponent('brass', 'column');
            this._createDioramaComponent('brass', 'sphere');
            if (data.withTrim) {
                this._createDioramaComponent('wood-panel', 'base');
                // this._createDioramaComponent('wood-panel', 'base', 'top');
                this._createDioramaComponent('brass', 'trim', '', 'front');
                this._createDioramaComponent('brass', 'trim', '', 'back');
            }
            // this._createDioramaComponent('brass', 'trim', 'top', 'front');
            // this._createDioramaComponent('brass', 'trim', 'top', 'back');
            // this._createDioramaComponent('glass', 'glass', '', '', {
            //     color: data.color,
            //     metalness: data.metalness,
            //     reflectivity: data.reflectivity,
            //     roughness: data.roughness,
            //     opacity: data.opacity,
            // });
        },

        _createDioramaComponent(type, shape,  pos='', side='front', props={}) {
            var self = this;
            var geom, mesh;
            var data = Object.assign({}, self.data);
            data.pos = pos;
            data.side = side;
        
            _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
            .then( (material) => {
                geom = _buildGeometry(shape, data);
                if (shape == 'base' && material.map != undefined) {
                    var texture = material.map;
                    var offsetx = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                    var offsety = data.baseheight / 2;
                    texture.rotation = Math.PI / 2;
                    texture.offset.set( offsetx, offsety );
                }
                mesh = new THREE.Mesh(geom, material);
            
                var group = self.el.getObject3D(self.id) || new THREE.Group();
                group.add(mesh);
                self.el.setObject3D(self.id, group); 
            });
        },

    });

    AFRAME.registerPrimitive( 'a-diorama-column', {
        defaultComponents: {
            'diorama-column__column': { 
                repeatV: 1,
                withTrim: true
            },

        },
        mappings: {
            'radius': 'diorama-column__column.floorradius',
            'bump': 'diorama-column__column.withBump',
            'normal': 'diorama-column__column.withNormal',
            'quality': 'diorama-column__column.quality',
            'radialsegments': 'diorama-column__column.radialsegments',
            'railheight': 'diorama-column__column.railheight',
            'shading': 'diorama-column__column.shading',
        }
    });

    AFRAME.registerComponent('diorama-case', {
        schema: {
            x: { type: 'number', default: 0},
            y: { type: 'number', default: 0},
            z: { type: 'number', default: 0},
            rotationx: { type: 'number', default: 30 }, // degrees

            type: { type: 'string', default: 'image' },
            url: {type: 'string', default: ''},
            srcFit: { type: 'string', default: 'width' },

            imagewidth: { type: 'number', default: 0.6 },
            imageheight: { type: 'number', default: 0.6 },
            depth: { type: 'number', default: 0.01 },

            casedepth: { type: 'number', default: 0.06 },
            bronzedepth: { type: 'number', default: 0.01 },
            casemargin: { type: 'number', default: 0.05 },

            railheight: { type: 'number', default: 1.2 },

            color: { default: 0xe8f1ff}, //0xe8f1ff
            opacity: { type: 'number', default: 0.2 },
            metalness: { type: 'number', default: 0.0 },
            reflectivity: { type: 'number', default: 0.5 },
            roughness: { type: 'number', default: 0.2 },

            repeatU: { type: 'number', default: 4},
            repeatV: { type: 'number', default: 1},

            withBump: { default: false },
            withNormal: { default: false },
            quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
            shading: { default: 'default' },

            withGlass: { default: true },
            withBronze: { default: true },
            withRail: { default: true },

            aspectratio: { type: 'number', default: 0 },

            animateLoad: { type: 'boolean', default: false },
            animateInSeconds: { type: 'number', default: 0.5 },
            animateOutSeconds: { type: 'number', default: 0.2 },
        },

        multiple: true,

        init: function() {
            var self = this;
            var data = self.data;

            this._createMedia = _createMedia.bind(this);
            this._updateAspectRatio = _updateAspectRatio.bind(this);

            self._createDiorama();

            if (self.data.url != '' && 
                (self.data.type=="image" || self.data.type=="video")) {
                self._createMedia({ x: 0, y: data.railheight + 0.3, z: -.15, rotx: data.rotationx, roty: 180 });
            }

            // if (self.data.url != '' && self.data.type=="video") {
            //     self._createMedia();
            //     // if (self.data.selected) {
            //     //     self._createVideoControls();
            //     // }
            // }

        },

      
        update: function(oldData) {
            var self = this;
            var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

            if (self.el.object3DMap.hasOwnProperty(self.id)) {
                self.el.removeObject3D(self.id);

                if (self.id != undefined) {
                    self._createDiorama();
                }
            }
            
            if ( self.el.object3DMap.hasOwnProperty('image') &&
                ['url', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
                .some(prop => changedData.includes(prop))) {
                    
                    if (self.el.object3DMap.hasOwnProperty('image')) {
                        self.el.removeObject3D('image');
                    }
                if (self.data.url != '' && self.data.type=="image") {
                    self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx, roty: 180 });
                }
            }

            if ( self.el.object3DMap.hasOwnProperty('video') &&
                ['url', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
                .some(prop => changedData.includes(prop)) ) {
                    // console.log('removing video');
                self.el.removeObject3D('video');
                if (self.data.url != '' && self.data.type=="video") {
                    self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx, roty: 180 });
                }
            }

        },

        remove: function () {
            if (this.el.object3DMap.hasOwnProperty(this.id)) {
                this.el.removeObject3D(this.id);
            }
            if (this.el.object3DMap.hasOwnProperty('image')) {
                this.el.removeObject3D('image');
            }
            if (this.el.object3DMap.hasOwnProperty('video')) {
                this.el.removeObject3D('video');
            }
        },

        _createDiorama() {
            var self = this;
            var data = self.data;

            if (data.withGlass) {
                self._createCase(
                    'glass',
                    data.imagewidth + data.casemargin,
                    data.imageheight + data.casemargin,
                    data.casedepth,
                    {
                        x: 0,
                        y: data.railheight + 0.3,
                        z: -.15 + data.casedepth/2 + 2*data.bronzedepth
                    },
                    {
                        color: data.color,
                        metalness: data.metalness,
                        reflectivity: data.reflectivity,
                        roughness: data.roughness,
                        opacity: data.opacity,
                    }
                );
            }
            if (data.withBronze) {
                self._createCase(
                    'brass',
                    data.imagewidth,
                    data.imageheight,
                    data.bronzedepth,
                    {
                        x: 0,
                        y: data.railheight + 0.3,
                        z: -.15 + 1.5*data.bronzedepth
                    }
                );
            }
            self._createCase(
                'wood-panel',
                data.imagewidth + 0.06,
                data.imageheight + 0.07,
                data.bronzedepth*2,
                {
                    x: 0,
                    y: data.railheight + 0.3,
                    z: -.15 + data.casedepth + 3*data.bronzedepth
                }
            );
            // if (data.withRail) {
            //     self._createCase(
            //         'brass',
            //         0.03,
            //         0.03,
            //         0.2,
            //         {
            //             x: 0,
            //             y: data.railheight + 0.3 + Math.cos(2 * Math.PI * data.rotationx / 360) * -0.2 + 0.04,
            //             z: -.05 + data.casedepth + 3*data.bronzedepth + Math.sin(2 * Math.PI * data.rotationx / 360) * -0.2 - 0.04
            //         }
                    
            //     );
            // }
        },

       
        _createCase(type, width, height, depth, offset, props={}) {
            var self = this;
            var geom, mesh;
            var data = Object.assign({}, self.data);

            data.width = width;
            data.height = height;
            data.depth = depth;
            data.offset = offset;
        
            _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
            .then( (material) => {
                geom = _buildGeometry('case', data);
                mesh = new THREE.Mesh(geom, material);
            
                var group = self.el.getObject3D(self.id) || new THREE.Group();
                group.add(mesh);
                self.el.setObject3D(self.id, group); 
            });
        },

    });


    AFRAME.registerPrimitive( 'a-diorama', {
        defaultComponents: {
            'diorama-case__case': {
                withGlass: false,
                withBronze: false
            },
        },
        mappings: {
            'width': 'diorama-case__case.imagewidth',
            'height': 'diorama-case__case.imageheight',
            'aspectratio': 'diorama-case__case.aspectratio',
            'bump': 'diorama-case__case.withBump',
            'normal': 'diorama-case__case.withNormal',
            'rail': 'diorama-case__case.withRail',
            'quality': 'diorama-case__case.quality',
            'src': 'diorama-case__case.url',
            'srcfit': 'diorama-case__case.srcFit',
            'railheight': 'diorama-case__case.railheight',
            'shading': 'diorama-case__case.shading',
            'type': 'diorama-case__case.type',
            'animate-load': 'diorama-case__case__cell.animateLoad',
            'animatein': 'diorama-case__case.animateInSeconds',
            'animateout': 'diorama-case__case.animateOutSeconds',
        }
    });

    }

    function fadeComp () {

    AFRAME.registerComponent('fade', {

        schema: {
            id: { type: 'string', default: '' },
            eventname: { type: 'string', default: 'cellclicked' },
            dur: { type: 'number', default: 1 },
            animate: { type: 'boolean', default: true }
        },

        update() {
            
        },

        gatherMeshes(object3D) {
            var self = this;
            var meshes = [];
            if (object3D.type == 'Mesh') { return object3D; }
        
            if (!!object3D.children) {
                object3D.children.forEach( (obj) => {
                    var result = self.gatherMeshes(obj);
                    if (!!result) {
                        if (result instanceof Array) {
                            result.forEach( (mesh) => meshes.push(mesh));
                        }
                        else {
                            meshes.push(result);
                        }
                    }
                });
            }
            return meshes;
        },

        createOpacityMap(meshes) {
            var map = new Map();
            meshes.forEach(mesh => {
                var opacity = mesh.material.opacity;
                var transparency = mesh.material.transparent;
                map.set(mesh, { opacity: opacity, transparency: transparency });
            });
            this.map = map;
        },

        async animateHideCellPromise() {
            var self = this;
            var el = this.el;

            if (this.hideCellPromise) {
                await this.hideCellPromise;
            }
            if (this.revealCellPromise) {
                await this.revealCellPromise;
            }

            var result = self.gatherMeshes(el.object3D);
            self.meshes = result;
            self.createOpacityMap(self.meshes);

            var promise = new Promise((resolve, reject) => {
                try {
                    result.forEach((mesh) => {

                        if (this.data.animate) {
                            AFRAME.ANIME({
                                targets: mesh.material,
                                easing: 'linear',
                                opacity: 0,
                                duration: self.data.dur*1000,
                                begin: function(anim) {
                                    mesh.material.transparent = true;
                                    // el.classList.remove('clickable');
                                },
                                complete: function(anim) {
                                    mesh.visible = false;
                                    mesh.updateMatrix();
                                    mesh.updateMatrixWorld();
                                    resolve();
                                }
                            });
                        }
                        else {
                            mesh.material.transparent = true;
                            mesh.visible = false;
                            mesh.updateMatrix();
                            mesh.updateMatrixWorld();
                        }
                    });
                    if (this.data.animate) {
                        AFRAME.ANIME({
                            targets: el,
                            easing: 'linear',
                            duration: self.data.dur*1000,
                            begin: function(anim) {
                                el.classList.remove('clickable');
                            },
                            complete: function(anim) {
                                resolve();
                            }
                        });
                    }
                    else {
                        el.classList.remove('clickable');
                        resolve();
                    }
                    
                }
                catch (error) {
                    console.error('animateHideCellPromise error');
                    console.log(error);
                    reject(error);
                }
            });

            this.hideCellPromise = promise;

            return promise;
        },

        async animateRevealCellPromise() {
            var self = this;
            var el = self.el;

            if (this.revealCellPromise) {
                await this.revealCellPromise;
            }
            if (this.hideCellPromise) {
                await this.hideCellPromise;
            }

            var result = self.gatherMeshes(el.object3D);
            
            var promise = new Promise((resolve, reject) => {
                try {
                    result.forEach((mesh) => {
                        if (this.data.animate) {
                            AFRAME.ANIME({
                                targets: mesh.material,
                                easing: 'linear',
                                opacity: !!self.map && self.map.has(mesh) ? self.map.get(mesh)['opacity'] : 1,
                                duration: self.data.dur*1000,
                                begin: function(anim) {
                                    mesh.visible = true;
                                },
                                complete: function(anim) {
                                    mesh.material.transparent = !!self.map && self.map.has(mesh) ?
                                        self.map.get(mesh)['transparency']  : false;
                                    // el.classList.add('clickable');
                                    resolve();
                                }
                            });
                        }
                        else {
                            mesh.visible = true;
                            mesh.material.transparent = !!self.map && self.map.has(mesh) ?
                            self.map.get(mesh)['transparency']  : false;
                        }
                    });
                    if (this.data.animate) {
                        AFRAME.ANIME({
                            targets: el,
                            easing: 'linear',
                            duration: self.data.dur*1000,
                            complete: function(anim) {
                                el.classList.add('clickable');
                                resolve();
                            }
                        });
                    }
                    else {
                        el.classList.add('clickable');
                        resolve();
                    }

                }
                catch (error) {
                    console.error('animateRevealCellPromise error');
                    console.log(error);
                    reject(error);
                }
            });

            this.revealCellPromise = promise;

            return promise;
        },


    });

    }

    function flexComp () {

    AFRAME.registerComponent('flex-item', {
        schema: {
            width: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
            dimtype: { type: 'string', default: 'el', },
            dimattr: { type: 'string', default: '' }
            // x positive, y negative
            // marginx: { type: 'vec2', default: { p: 0, n: 0 } }, 
            // marginy: { type: 'vec2', default: { p: 0, p: 0 } },
            // marginz: { type: 'vec2', default: { p: 0, n: 0 } },

            /* TODO
                margin
                order
                flex-grow
                flex-shrink
                flex-basis
                align-self
            */
        },

        init() {
            this.el.isFlexItem = true;

            switch (this.data.dimtype) {
                case 'el':
                    this.data.width = +this.el.getAttribute('width') || this.data.width;
                    this.data.height = +this.el.getAttribute('height') || this.data.height;
                    break;
                case 'attr':
                case 'attribute':
                    if (!!this.data.dimattr) {
                        this.data.width = +this.el.getAttribute(this.data.dimattr)['width'] || this.data.width;
                        this.data.height = +this.el.getAttribute(this.data.dimattr)['height'] || this.data.height;
                    }
                    else {
                        console.warn('dimtype is attribute but dimattr is undefined');
                    }
                    break;
                case 'flex-container':
                    this.data.width = +this.el.getAttribute('flex-container')['width'] || this.data.width;
                    this.data.height = +this.el.getAttribute('flex-container')['height'] || this.data.height;
                    break;
                case 'sphere':
                    var radius = +this.el.getAttribute('radius');
                    this.data.width = radius * 2 || this.data.width;
                    this.data.height = radius * 2 || this.data.height;
            }
        }
    });


    AFRAME.registerSystem('flex-container', {

        updateLayout(data, children) {
            var offsetX = 0;
            var offsetY = 0;
            var mainAxis = data.flexDirection;
            var crossAxis = mainAxis == 'row' ? 'column' : 'row';
            var mainAxisLength = this._childrenLength(children, mainAxis);
            var crossAxisLength = this._childrenLength(children, crossAxis);
            var mainAxisDimension = mainAxis == 'row' ? 'width' : 'height';
            var space = this._justifySpace(data.justifyContent, data[mainAxisDimension], mainAxisLength, children.length);
            switch (data.flexDirection) {
                case 'row':
                    offsetX += this._justifyContent(data.justifyContent, data.width, mainAxisLength, space);
                    break;
                case 'column':
                    offsetY -= this._justifyContent(data.justifyContent, data.height, mainAxisLength, space);
                    break;
            }
            children.forEach(child => {
                var childFlexItem= child.getAttribute('flex-item');
                var posx, posy;
                switch (data.flexDirection) {
                    case 'row':
                        posx = offsetX + childFlexItem.width/2;
                        posy = offsetY - this._alignItems(data.alignItems, data.height, childFlexItem.height);

                        offsetX += childFlexItem.width + space;
                        break;
                    case 'column':
                        posx = offsetX + this._alignItems(data.alignItems, data.width, childFlexItem.width);
                        
                        posy = offsetY - childFlexItem.height/2;
                        offsetY -= childFlexItem.height + space;
                        break;
                }
                
                child.object3D.position.set(posx, posy, 0.001);
            });
        },

        // defines the alignment along the main axis
        _justifyContent(val, length, contentLength, space) {
            switch(val) {
                case 'flexStart':
                case 'space-between':
                    return -length/2;
                case 'flexEnd':
                    return length/2  - contentLength;
                case 'space-around':
                    return (space - length)/2;
                case 'space-evenly':
                    return space - (length/2);
                case 'center':
                default:
                    return -contentLength/2;
            }

        },

        _justifySpace(val, length, contentLength, numItems) {
            var totalSpace = length - contentLength;

            switch(val) {
                case 'space-between':
                    return totalSpace / (numItems - 1);
                case 'space-around':
                    return totalSpace / numItems;
                case 'space-evenly':
                    return totalSpace / (numItems + 1);
                default:
                    return 0;
            }
        },

        _childrenLength(children, flexDirection='row') {
            var result = 0;

            var dimension = flexDirection == 'row' ? 'width' : 'height';
            children.forEach(child => {
                var flexItem = child.getAttribute('flex-item');
                result += flexItem[dimension];
            });
            return result;
        },

        _margin(flexItem, direction) {
            var margin = flexItem['margin' + direction];
            if (margin.x) { return margin.x + margin.y; }
            else return 0;
        },

        _alignItems(val, containerLength, contentLength) {
            switch(val) {
                case 'flexStart':
                    return (contentLength - containerLength)/2;
                case 'flexEnd':
                    return (containerLength - contentLength)/2;
                case 'center':
                default:
                    return 0;
            }

        },

    });

    AFRAME.registerComponent('flex-container', {
        schema: {
            width: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
            flexDirection: { type: 'string', default: 'row', onOf: ['row', 'column'] },
            justifyContent: { type: 'string', default: 'flexStart',
                onOf: ['flexStart', 'flexStart', 'center', 'space-between', 'space-around', 'space-evenly'] },
            alignItems: { type: 'string', default: 'center',
                onOf: ['flexStart', 'flexStart', 'center']  }, // TODO : stretch
            dimtype: { type: 'string', default: 'el', },
            needsupdate: { type: 'boolean', default: true },
            /* TODO
                flex-wrap
                align-content
            */
        },

        init: function () {
            this.el.isFlexContainer = true;

            switch (this.data.dimtype) {
                case 'el':
                    this.data.width = +this.el.getAttribute('width') || this.data.width;
                    this.data.height = +this.el.getAttribute('height') || this.data.height;
                    break;
            }

            this.updateChildren();
        },

        update(oldData) {
            if (this.data['needsupdate']) {
                this.updateChildren();
                this.system.updateLayout(this.data, this.children);
                this.el.setAttribute('flex-container', {'needsupdate': false});
            }
        },

        updateChildren() {
            this.children = this.el.getChildEntities().filter((el) => {return el.isFlexItem});
        },

        flexItemAppendedHandler(evt) {
            this.system.updateLayout(this.data, this.children);
        }

    });

    AFRAME.registerPrimitive( 'a-flex-container', {
        defaultComponents: {
            'flex-container': { },
            'flex-item': { dimtype: 'flex-container' }
        },
        mappings: {
            'width': 'flex-item.width',
            'height': 'flex-item.height',
            'marginx': 'flex-item.marginx',
            'marginy': 'flex-item.marginy',
            'marginz': 'flex-item.marginz',
            'flex-direction': 'flex-container.flexDirection',
            'justify-content': 'flex-container.justifyContent',
            'align-items': 'flex-container.alignItems',
        }
    });

    }

    function globePointsComp () {

    AFRAME.registerSystem('globe-points', {
        schema: {}, 

        init: function () {
            this.assetId = 0;
        },


        geoObjectToUrl : function (obj) {
            var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(obj));
            return(url)
        },

        coordinatesArray : function(points) {
            var lat = 0;
            var coordinates = points.map((x, index) => {
                if (index % 2 == 0) {
                    lat = x;
                    return null;
                }
                return [lat, x];
            });
            coordinates = coordinates.filter(x => x != null);
            return coordinates;
        },

        latlongToGeojsonPoints : function (coordinates) {
            var gj = {"type": "FeatureCollection",
                    "features": []};
            var nextID = 0;
            for (var coord of coordinates) {
                var feature = {
                    "type": "Feature",
                    "properties": {"name": 'point-' + nextID++},
                    "geometry": {
                    "type": "Point",
                    "coordinates": [
                        coord[0],
                        coord[1]
                    ]
                    }
                };
                gj.features.push(feature);
            }
            return(gj);
        },

        createAsset(url, id=-1) {
            var assetID = id == -1 ? this.assetID++ : id;

            var aAssets = document.getElementsByTagName('a-assets')[0];
            var geoItem = aAssets.querySelector("#geojson-" + assetID);
            if (geoItem) {
                geoItem.setAttribute('src', url);
                return assetID;
            }
            geoItem = document.createElement("a-asset-item");
            geoItem.setAttribute('id', 'geojson-' + assetID);
            geoItem.setAttribute('src', url);

            aAssets.appendChild(geoItem);
            return assetID;
        }
    });
      

    AFRAME.registerComponent('globe-points', {

        schema: {
            id: { type: 'string', default: '' },

            radius: { type: 'number', default: 1 },
            pointscale: { type: 'number', default: 0.01 },

            color:  { default: '#F0A' },

            points: { type: 'array', default: [] },
        },

        init() {
            if (this.data.points.length % 2 != 0) {
                throw new Error("points array must have even length");
            }
            
        },

        update(oldData) {
            const data = this.data;

            if (AFRAME.utils.deepEqual(oldData, data)) {
                return;
            }

            while (this.el.hasChildNodes()) {
                this.el.removeChild(this.el.lastChild);
            }

            var coordinates = this.system.coordinatesArray(this.data.points);
            var json = this.system.latlongToGeojsonPoints(coordinates);
            var url = this.system.geoObjectToUrl(json);
            var assetID = this.system.createAsset(url);
            var geoEl = this.createGeoEntity(assetID);
            this.el.appendChild(geoEl);
        },

        createGeoEntity(assetID) {
            var geoEl = document.createElement('a-entity');
            geoEl.setAttribute('geometry', {
                primitive: 'sphere',
                radius: this.data.radius
            });
            geoEl.setAttribute('material', {
                color: this.data.color
            });
            geoEl.setAttribute('geojson', {
                src: '#geojson-' + assetID,
                featureKey: 'name',
                pointScale: this.data.pointscale
            });
            return geoEl;
        }

    });

    AFRAME.registerPrimitive('a-globe-points', {
    	defaultComponents: {
    		'globe-points': {},
    	},
    	mappings: {
            'id': 'globe-points.id',
            'radius': 'globe-points.radius',
            'pointscale': 'globe-points.pointscale',
            'color': 'globe-points.color',
            'points': 'globe-points.points',
    	}
    });

    }

    function _raycasterIntersectedHandler$1(evt) {
      this.intersectingRaycaster = evt.detail.el.components.raycaster;
    }

    function _raycasterIntersectedClearedHandler$1(evt) {
      if (this.intersectingRaycaster != null) {
          const intersection = this.intersectingRaycaster.getIntersection(this.el);
          if (intersection == undefined) {
              this.intersectingRaycaster = null;
          }
      }

      if(this.data.hover) {
        this.el.setAttribute('highlight', {'hover': false});
      }
    }

    function _mousedownHandler(evt) {
      this._handleIntersection('active');
    }

    function _mouseupHandler(evt) {
      if (this.el.getAttribute('highlight').active) {
        this.el.setAttribute('highlight', {'active': false});
      }
    }

    function highlightComp () {

    AFRAME.registerComponent('highlight', {
      schema: {
        hover: { type: 'boolean', default: false },
        active: { type: 'boolean', default: false },
        disabled: { type: 'boolean', default: false },
        color: { type: 'color', default: 0x484848 },
        hoverColor: { type: 'color', default: 0x04FF5F },
        activeColor: { type: 'color', default: 0xFFD704 },
        disabledColor: { default: 0xA9A9A9 },
        type: { default: 'color', oneOf: ['color', 'border', 'text'] },
        target: { default: '', type: 'string' },

        bordersize: { type: 'number', default: 0.05 },
        borderbaseopacity: { type: 'number', default: 0 },

        disabledopacity:  { type: 'number', default: 0.2 },

        createborder: { type: 'boolean', default: false },
        bordername: { type: 'string', default: 'border' },
      },

      init() {
        this.firstUpdate = true;

        this.raycasterIntersectedHandler = _raycasterIntersectedHandler$1.bind(this);
        this.raycasterIntersectedClearedHandler = _raycasterIntersectedClearedHandler$1.bind(this);
        this.mousedownHandler = _mousedownHandler.bind(this);
        this.mouseupHandler = _mouseupHandler.bind(this);
        
        if ( this.data.createborder ) {
          this._createBorder();
        }
      },

      update: function(oldData) {
        var self = this;
        var data = self.data;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

        if ( changedData.includes('disabled') ) {
          this.el.setAttribute('highlight', { 'hover': false, 'active': false });
        }

        if (['hover', 'active', 'disabled'].some(prop => changedData.includes(prop))) {
            if (data.type == 'color') {
              self._updateColor();
            }
            else if (data.type == 'text') {
              self._updateTextColor();
            }
            else if (data.type == 'border' && self.el.object3DMap.hasOwnProperty(this.data.bordername) ) {
              self._updateColor(this.data.bordername);
            }
        }

        if (this.firstUpdate) {
            this.firstUpdate = false;
            return;
        }
        if (changedData.includes('disabled')) {
            if (!data.disabled) {
                this.addHandlers();
            }
            else {
                this.removeHandlers();
            }
        }
      },

      tick: function() {
        this._handleIntersection();
      },


      remove() {
        this.removeHandlers();
      },

      play() {
          if (!this.data.disabled) { //this.data.enabled && 
              this.addHandlers();
          }
      },

      pause() {
          if (!this.data.disabled) {
              this.removeHandlers();
          }
      },

      addHandlers: function() {
          this.el.addEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
          this.el.addEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
          this.el.addEventListener("mousedown", this.mousedownHandler );
          this.el.addEventListener("mouseup", this.mouseupHandler );

      },

      removeHandlers: function() {
          this.el.removeEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
          this.el.removeEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
          this.el.removeEventListener("mousedown", this.mousedownHandler );
          this.el.removeEventListener("mouseup", this.mouseupHandler );
      },

      _createBorder() {
        var self = this;
        var data = self.data;

        var geomAttribute;

        if (data.target == '') {
          geomAttribute = self.el.getAttribute('geometry');
        }
        else {
          if (self.el.object3DMap.hasOwnProperty(data.target)) {
            var geo = self.el.getObject3D(data.target).geometry;
            geomAttribute = geo.parameters;
            if (geo.type == "PlaneBufferGeometry") {
              geomAttribute.primitive = "plane";
              geomAttribute.buffer = true;
              geomAttribute.skipCache = false;
              geomAttribute.segmentsHeight = geomAttribute.heightSegments || 1;
              geomAttribute.segmentsWidth = geomAttribute.widthSegments || 1;
            }
          }
          else {
            self.el.addEventListener('media-mesh-set', (evt) => {
              self._createBorder();
            });
            return;
          }
        }
        if (geomAttribute) {
          switch (geomAttribute.primitive){
            case 'sphere':
              self._createBorderSphere(geomAttribute);
              break;
            case 'plane':
              self._createBorderPlane(geomAttribute);
              break;
          }
          
        }
      },

      _createBorderSphere(geomAttribute) {
        var self = this;
        var data = self.data;

        var borderGeomAttribute = Object.assign({}, geomAttribute);
        borderGeomAttribute.radius = borderGeomAttribute.radius*(1 + data.bordersize);
        var geom = self.el.sceneEl.systems.geometry.getOrCreateGeometry(borderGeomAttribute);

        var color = data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

        var opacity = data.active || data.hover ? 1 : data.borderbaseopacity;
        var transparent = data.active || data.hover ? false : true;

        var mat = new THREE.MeshBasicMaterial( {
            color: new THREE.Color( color ),
            side: THREE.BackSide,
            opacity: opacity,
            transparent: transparent,
        } );
        var newMesh = new THREE.Mesh(geom, mat);
        newMesh.name = this.data.bordername;
        newMesh.updateMatrix();

        self.el.setObject3D(this.data.bordername, newMesh);  
      },

      _createBorderPlane(geomAttribute) {
        var self = this;
        var data = Object.assign({}, self.data);

        var mat, mesh;

        var borderGeomAttribute = Object.assign({}, geomAttribute);
        borderGeomAttribute.width = borderGeomAttribute.width*(1 + data.bordersize);
        borderGeomAttribute.height = borderGeomAttribute.height*(1 + data.bordersize);
        var cache = self.el.sceneEl.systems.geometry.cache;
        var hash = self.el.sceneEl.systems.geometry.hash(borderGeomAttribute);
        var isCached = !!cache[hash];
        var geom = self.el.sceneEl.systems.geometry.getOrCreateGeometry(borderGeomAttribute);
        if (!isCached) {
          geom.translate(0, 0, -0.001);
        }

        var color = data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

        var opacity = data.active || data.hover ? 1 : data.borderbaseopacity;
        var transparent = data.active || data.hover ? false : true;

        mat = new THREE.MeshBasicMaterial( {
          color: new THREE.Color( color ),
          side: THREE.FrontSide,
          opacity: opacity,
          transparent: transparent,
        } );
        mesh = new THREE.Mesh(geom, mat);
        mesh.name = this.data.bordername;

        self.el.setObject3D(this.data.bordername, mesh);
      },

      _updateColor(meshName='mesh') {
        var self = this;
        var data = self.data;

        var newColor = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

        var opacity = data.disabled ? data.disabledopacity : data.active || data.hover ? 1 : data.borderbaseopacity;
        var transparent = data.disabled ? true : data.active || data.hover ? false : true;

        var mesh = self.el.getObject3D(meshName);
        if (mesh) {
            mesh.material.color = new THREE.Color( newColor );
            mesh.material.opacity = opacity;
            mesh.material.transparent = transparent;
        }
      },

      _updateTextColor() {
        var self = this;
        var data = self.data;

        var newColor = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;
        var txtObj = this.el.getObject3D('text');
        if(txtObj && txtObj.material) {
          txtObj.material.uniforms.color.value = new THREE.Color(newColor);
        }
      },

      _handleIntersection(attribute='hover') {
        var self = this;
        if (!this.intersectingRaycaster) {
            return;
        }

        var value = {};
        value[attribute] = true;
        const intersection = this.intersectingRaycaster.getIntersection(this.el);
        self.intersection = intersection;
        if (intersection && !self.data[attribute]) {
            if (self.data.target != '') {
              switch (intersection.object.name) {
                case self.data.target:
                case this.data.bordername:
                    self.el.setAttribute('highlight', value);
                    break;
              }
            }
            else {
              self.el.setAttribute('highlight', value);
            }
        }
      }
    });

    }

    var loadBMFont = require('load-bmfont');

    var FONT_BASE_URL = 'https://cdn.aframe.io/fonts/';
    var FONTS = {
      aileronsemibold: FONT_BASE_URL + 'Aileron-Semibold.fnt',
      dejavu: FONT_BASE_URL + 'DejaVu-sdf.fnt',
      exo2bold: FONT_BASE_URL + 'Exo2Bold.fnt',
      exo2semibold: FONT_BASE_URL + 'Exo2SemiBold.fnt',
      kelsonsans: FONT_BASE_URL + 'KelsonSans.fnt',
      monoid: FONT_BASE_URL + 'Monoid.fnt',
      mozillavr: FONT_BASE_URL + 'mozillavr.fnt',
      roboto: FONT_BASE_URL + 'Roboto-msdf.json',
      sourcecodepro: FONT_BASE_URL + 'SourceCodePro.fnt'
    };
    var DEFAULT_FONT = 'roboto';

    function loadFont (src, yOffset) {
        return new Promise(function (resolve, reject) {
            loadBMFont(src, function (err, font) {
                if (err) {
                    error('Error loading font', src);
                    reject(err);
                    return;
                }

                // Fix negative Y offsets for Roboto MSDF font from tool. Experimentally determined.
                if (src.indexOf('/Roboto-msdf.json') >= 0) { yOffset = 30; }
                if (yOffset) { font.chars.map(function doOffset (ch) { ch.yoffset += yOffset; }); }

                resolve(font);
            });
        });
    }

    function computeFontWidthFactor (font) {
        var sum = 0;
        var digitsum = 0;
        var digits = 0;
        font.chars.map(function (ch) {
            sum += ch.xadvance;
            if (ch.id >= 48 && ch.id <= 57) {
            digits++;
            digitsum += ch.xadvance;
            }
        });
            return digits ? digitsum / digits : sum / font.chars.length;
        }

    function computeWidth (wrapPixels, wrapCount, widthFactor) {
        return wrapPixels || ((0.5 + wrapCount) * widthFactor);
    }


    function _createText(opts={})  {
        var self = this;
        var data = self.data;
        var id = opts.id || '';
        var textName = id != '' ? `text__${id}` : 'text';

        var fontSize = opts.fontsize || data.fontsize;
        var width = opts.width || data.width;
        var wrapCount = opts.wrapcount || data.wrapcount;
        if (data.wrapfit) {
            wrapCount =  (width / fontSize) * (20/0.3); 
        }
        var wrapSize = (wrapCount) / 20;
        var widthScale = 0.3 / (width);
        var textWidth = width * fontSize * widthScale * wrapSize;
        var xOffset = (textWidth - width) / 2;

        var text = opts.text || data.text;
        var height = opts.height || data.height;
        var color = opts.color || data.color;

        self.el.setAttribute(textName, {
            // id: id,
            value: text,
            width: textWidth,
            height: height,
            wrapCount: wrapCount,
            xOffset: xOffset,
            color: color,
            anchor: data.anchor,
        });

        var textObj = self.el.getObject3D(textName);
        this.textObj = textObj;
    }

    function _setUpTextHandler(id='', offset={}) {
        var self = this;
        var object3DName = id != '' ? `text__${id}` : 'text';
        var textObj = self.el.getObject3D(object3DName);
        var lineHeight = textObj.geometry.layout._lineHeight;
        var linesTotal = textObj.geometry.layout._linesTotal;
        var textScale = textObj.scale.x;
        var halfLines = linesTotal % 2 == 0 ? linesTotal/2 : (linesTotal)/2 - 1;
        var offsetY = self.data.height/2;
        if (linesTotal>1) { offsetY -= halfLines*(lineHeight * textScale); }
        else { offsetY -= (lineHeight * textScale)/2; }

        textObj.translateY(offsetY);
        if (offset.x) textObj.translateX(offset.x);
        if (offset.y) textObj.translateY(offset.y);
        if (offset.z) textObj.translateZ(offset.z);

        self._setUpClipping(id);
    }

    function _setUpFAHandler(id='', offset={}) {
        var obj = this.el.getObject3D('fa-' + id);
        var width = obj.geometry.parameters.width;
        obj.translateX(width/2);
        obj.translateY(-width/2);
        if (offset.x) obj.translateX(offset.x);
        if (offset.y) obj.translateY(offset.y);
        if (offset.z) obj.translateZ(offset.z);
    }

    function _setUpClipping(id='') {
        var self = this;
        var el = self.el;
        if (self.clippingSetUp) {
            return;
        }

        var object3DName = id != '' ? `text__${id}` : 'text';
        var textObj = self.el.getObject3D(object3DName);
        var lineHeight = textObj.geometry.layout._lineHeight;
        var linesTotal = textObj.geometry.layout._linesTotal;
        var textScale = textObj.scale.x;

        var offsetY = 0;

        var renderer = el.sceneEl.renderer;
        renderer.localClippingEnabled = true;

        el.sceneEl.object3D.updateMatrixWorld();
        var pos = new THREE.Vector3();
        el.object3D.getWorldPosition(pos);
        var posy = pos.y; 
        var height = textObj.geometry.layout._opt.height;

        var normalBot = new THREE.Vector3( 0, 1, 0 );
        var constantBot = -(posy + self.data.height/2 + offsetY - height);

        if (self.data.nobr) {
            var lineRemainder = (height) % (lineHeight * textScale);
            constantBot -= lineRemainder;
        }

        var clippingPlaneBot = new THREE.Plane( normalBot, constantBot );
        self.clippingPlaneBot = clippingPlaneBot;

        var normalTop = new THREE.Vector3( 0, -1, 0 );
        var constantTop = posy + self.data.height/2 + offsetY;

        var clippingPlaneTop = new THREE.Plane( normalTop, constantTop );
        self.clippingPlaneTop = clippingPlaneTop;

        var mat = textObj.material;
        mat.clipping = true;
        mat.clippingPlanes = [clippingPlaneBot, clippingPlaneTop];

        mat.vertexShader = 'precision highp float;\n' + 
            '#include  <clipping_planes_pars_vertex>\n' +
            mat.vertexShader.replace(/(void main.*)/, '$1\n  #include <begin_vertex>')
            .replace(/}$/, '  #include <project_vertex>\n  #include <clipping_planes_vertex>\n}');

        mat.fragmentShader = 'precision highp float;\n' + 
            '#include  <clipping_planes_pars_fragment>\n' + 
            mat.fragmentShader.replace(/(void main.*)/, '$1\n  #include <clipping_planes_fragment>');
        
        // set isMeshBasicMaterial so that the WebGLRenderer updates opacity uniform during animations
        mat.isMeshBasicMaterial = true;
        mat.needsUpdate = true;
        self.clippingSetUp = true;
    }


    function _updateClipping(id='') {
        var self = this;
        var el = self.el;
        if (!self.clippingPlaneTop) {return;}


        var object3DName = id != '' ? `text__${id}` : 'text';
        var textObj = self.el.getObject3D(object3DName);
        if (!textObj) {
            return;
        }
        var lineHeight = textObj.geometry.layout._lineHeight;
        var linesTotal = textObj.geometry.layout._linesTotal;
        var textScale = textObj.scale.x;

        var offsetY = 0;

        el.sceneEl.object3D.updateMatrixWorld();
        var pos = new THREE.Vector3();
        el.object3D.getWorldPosition(pos);
        var posy = pos.y; 
        var height = textObj.geometry.layout._opt.height;


        var constantBot = -(posy + self.data.height/2 + offsetY - height);
        self.clippingPlaneBot.constant = constantBot;

        if (self.data.nobr) {
            var lineRemainder = (height) % (lineHeight * textScale);
            constantBot -= lineRemainder;
        }

        var constantTop = posy + self.data.height/2 + offsetY;
        self.clippingPlaneTop.constant = constantTop;
        var mat = textObj.material;

        mat.needsUpdate = true;
    }


    function textCellComp () {

    AFRAME.registerSystem('text-cell', {
        schema: {}, 

        init: function () {
            var oldUpdateLayout = AFRAME.components["text"].Component.prototype.updateLayout;
            AFRAME.components["text"].Component.prototype.updateLayout = function()
                {
                    oldUpdateLayout.call(this);
                    this.el.emit('textlayoutchanged', {name: this.attrName, id: this.id});
                };
        },
      
      });

    AFRAME.registerComponent('text-cell', {

        schema: {
            id: { type: 'string', default: '' },

            width: { type: 'number', default: 0.6 },
            height: { type: 'number', default: 0.6 },

            text: { type: 'string', default: 'text' },

            color:  { default: '#FFF' },

            fontsize: { type: 'number', default: 1 },
            wrapcount: { type: 'number', default: 20 },
            wrappixels: { type: 'number', default: 0 },

            nobr: { type: 'boolean', default: false },

            border: { type: 'boolean', default: true },
            bordersize: { type: 'number', default: 0.05 },
            borderColor: { default: '#484848' },

            wrapfit: { type: 'boolean', default: false },

            // justifycontent: { type: 'string', default: 'flexStart' },
            anchor: { type: 'string', default: 'center' },
        },

        init() {
            var self = this;
            var data = self.data;
            self.clippingSetUp = false;
            this._createText = _createText.bind(this);
            this._setUpTextHandler = _setUpTextHandler.bind(this);
            this._setUpFAHandler = _setUpFAHandler.bind(this);
            this._setUpClipping = _setUpClipping.bind(this);
            this._updateClipping = _updateClipping.bind(this);

            this.worldPosition = this.el.object3D.getWorldPosition();

        },

        update: function(oldData) {
            var self = this;
            var data = self.data;

            var textName = data.id != '' ? `text__${data.id}` : 'text';

            self.el.removeAttribute(textName);

            var font = self.data.font || DEFAULT_FONT;

            loadFont(FONTS[font]).then(
                (result) => {
                    self.lineHeight = result.common.lineHeight;
                    self.widthFactor = computeFontWidthFactor(result);
                    self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                        self.widthFactor);

                    self.textScale = self.data.width / self.textRenderWidth;
                    self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;
                    
                    self.el.addEventListener('textlayoutchanged', self._textLayoutChangedHandler.bind(self),
                        {once: true});
                    self.el.addEventListener('font-awesome.drawn', self._fontAwesomeDrawnHandler.bind(self),
                        {once: true});
                
                    self._createText({ id: data.id, text: data.text, width: data.width, 
                        height: data.height, color: data.color });
                },
            );
        },

        tick() {
            var position = new THREE.Vector3();
            this.el.object3D.getWorldPosition(position);
            if (!!this.worldPosition && !this.comparePositions(this.worldPosition, position)){
                this._updateClipping(this.data.id);
                this.worldPosition = position;
            }
        },

        remove() {
            this.el.removeEventListener('textlayoutchanged', this._textLayoutChangedHandler.bind(this));
            this.el.removeEventListener('font-awesome.drawn', this._fontAwesomeDrawnHandler.bind(this));
        },

        comparePositions(posA, posB) {
            return posA.x == posB.x && posA.y == posB.y && posA.z == posB.z;
        },

        _textLayoutChangedHandler(evt) {
            this._setUpTextHandler(evt.detail.id || '', {});
        },

        _fontAwesomeDrawnHandler(evt) {
            if (!!evt.detail) {
                this._setUpFAHandler(evt.detail.id, {});
            }
        }
    });

    AFRAME.registerPrimitive('a-text-cell', {
    	defaultComponents: {
    		'text-cell': {},
    	},
    	mappings: {
            'id': 'text-cell.id',
            'value': 'text-cell.text',
            'width': 'text-cell.width',
            'height': 'text-cell.height',
            'fontsize': 'text-cell.fontsize',
            'wrapcount': 'text-cell.wrapcount',
            'nobr': 'text-cell.nobr',
            'color': 'text-cell.color',
            'font': 'text-cell.font',
            'wrapfit': 'text-cell.wrapfit',
            'lines': 'text-cell.lines',
            'anchor': 'text-cell.anchor',
    	}
    });
    }

    var FAMap = new Map([
        ['address-book', 'f2b9'],
        ['address-card', 'f2bb'],
        ['adjust', 'f042'],
        ['air-freshener', 'f5d0'],
        ['align-center', 'f037'],
        ['align-justify', 'f039'],
        ['align-left', 'f036'],
        ['align-right', 'f038'],
        ['allergies', 'f461'],
        ['ambulance', 'f0f9'],
        ['american-sign-language-interpreting', 'f2a3'],
        ['anchor', 'f13d'],
        ['angle-double-down', 'f103'],
        ['angle-double-left', 'f100'],
        ['angle-double-right', 'f101'],
        ['angle-double-up', 'f102'],
        ['angle-down', 'f107'],
        ['angle-left', 'f104'],
        ['angle-right', 'f105'],
        ['angle-up', 'f106'],
        ['angry', 'f556'],
        ['apple-alt', 'f5d1'],
        ['archive', 'f187'],
        ['archway', 'f557'],
        ['arrow-alt-circle-down', 'f358'],
        ['arrow-alt-circle-left', 'f359'],
        ['arrow-alt-circle-right', 'f35a'],
        ['arrow-alt-circle-up', 'f35b'],
        ['arrow-circle-down', 'f0ab'],
        ['arrow-circle-left', 'f0a8'],
        ['arrow-circle-right', 'f0a9'],
        ['arrow-circle-up', 'f0aa'],
        ['arrow-down', 'f063'],
        ['arrow-left', 'f060'],
        ['arrow-right', 'f061'],
        ['arrow-up', 'f062'],
        ['arrows-alt', 'f0b2'],
        ['arrows-alt-h', 'f337'],
        ['arrows-alt-v', 'f338'],
        ['assistive-listening-systems', 'f2a2'],
        ['asterisk', 'f069'],
        ['at', 'f1fa'],
        ['atlas', 'f558'],
        ['atom', 'f5d2'],
        ['audio-description', 'f29e'],
        ['award', 'f559'],
        ['backspace', 'f55a'],
        ['backward', 'f04a'],
        ['balance-scale', 'f24e'],
        ['ban', 'f05e'],
        ['band-aid', 'f462'],
        ['barcode', 'f02a'],
        ['bars', 'f0c9'],
        ['baseball-ball', 'f433'],
        ['basketball-ball', 'f434'],
        ['bath', 'f2cd'],
        ['battery-empty', 'f244'],
        ['battery-full', 'f240'],
        ['battery-half', 'f242'],
        ['battery-quarter', 'f243'],
        ['battery-three-quarters', 'f241'],
        ['bed', 'f236'],
        ['beer', 'f0fc'],
        ['bell', 'f0f3'],
        ['bell-slash', 'f1f6'],
        ['bezier-curve', 'f55b'],
        ['bicycle', 'f206'],
        ['binoculars', 'f1e5'],
        ['birthday-cake', 'f1fd'],
        ['blender', 'f517'],
        ['blind', 'f29d'],
        ['bold', 'f032'],
        ['bolt', 'f0e7'],
        ['bomb', 'f1e2'],
        ['bone', 'f5d7'],
        ['bong', 'f55c'],
        ['book', 'f02d'],
        ['book-open', 'f518'],
        ['book-reader', 'f5da'],
        ['bookmark', 'f02e'],
        ['bowling-ball', 'f436'],
        ['box', 'f466'],
        ['box-open', 'f49e'],
        ['boxes', 'f468'],
        ['braille', 'f2a1'],
        ['brain', 'f5dc'],
        ['briefcase', 'f0b1'],
        ['briefcase-medical', 'f469'],
        ['broadcast-tower', 'f519'],
        ['broom', 'f51a'],
        ['brush', 'f55d'],
        ['bug', 'f188'],
        ['building', 'f1ad'],
        ['bullhorn', 'f0a1'],
        ['bullseye', 'f140'],
        ['burn', 'f46a'],
        ['bus', 'f207'],
        ['bus-alt', 'f55e'],
        ['calculator', 'f1ec'],
        ['calendar', 'f133'],
        ['calendar-alt', 'f073'],
        ['calendar-check', 'f274'],
        ['calendar-minus', 'f272'],
        ['calendar-plus', 'f271'],
        ['calendar-times', 'f273'],
        ['camera', 'f030'],
        ['camera-retro', 'f083'],
        ['cannabis', 'f55f'],
        ['capsules', 'f46b'],
        ['car', 'f1b9'],
        ['car-alt', 'f5de'],
        ['car-battery', 'f5df'],
        ['car-crash', 'f5e1'],
        ['car-side', 'f5e4'],
        ['caret-down', 'f0d7'],
        ['caret-left', 'f0d9'],
        ['caret-right', 'f0da'],
        ['caret-square-down', 'f150'],
        ['caret-square-left', 'f191'],
        ['caret-square-right', 'f152'],
        ['caret-square-up', 'f151'],
        ['caret-up', 'f0d8'],
        ['cart-arrow-down', 'f218'],
        ['cart-plus', 'f217'],
        ['certificate', 'f0a3'],
        ['chalkboard', 'f51b'],
        ['chalkboard-teacher', 'f51c'],
        ['charging-station', 'f5e7'],
        ['chart-area', 'f1fe'],
        ['chart-bar', 'f080'],
        ['chart-line', 'f201'],
        ['chart-pie', 'f200'],
        ['check', 'f00c'],
        ['check-circle', 'f058'],
        ['check-double', 'f560'],
        ['check-square', 'f14a'],
        ['chess', 'f439'],
        ['chess-bishop', 'f43a'],
        ['chess-board', 'f43c'],
        ['chess-king', 'f43f'],
        ['chess-knight', 'f441'],
        ['chess-pawn', 'f443'],
        ['chess-queen', 'f445'],
        ['chess-rook', 'f447'],
        ['chevron-circle-down', 'f13a'],
        ['chevron-circle-left', 'f137'],
        ['chevron-circle-right', 'f138'],
        ['chevron-circle-up', 'f139'],
        ['chevron-down', 'f078'],
        ['chevron-left', 'f053'],
        ['chevron-right', 'f054'],
        ['chevron-up', 'f077'],
        ['child', 'f1ae'],
        ['church', 'f51d'],
        ['circle', 'f111'],
        ['circle-notch', 'f1ce'],
        ['clipboard', 'f328'],
        ['clipboard-check', 'f46c'],
        ['clipboard-list', 'f46d'],
        ['clock', 'f017'],
        ['clone', 'f24d'],
        ['closed-captioning', 'f20a'],
        ['cloud', 'f0c2'],
        ['cloud-download-alt', 'f381'],
        ['cloud-upload-alt', 'f382'],
        ['cocktail', 'f561'],
        ['code', 'f121'],
        ['code-branch', 'f126'],
        ['coffee', 'f0f4'],
        ['cog', 'f013'],
        ['cogs', 'f085'],
        ['coins', 'f51e'],
        ['columns', 'f0db'],
        ['comment', 'f075'],
        ['comment-alt', 'f27a'],
        ['comment-dots', 'f4ad'],
        ['comment-slash', 'f4b3'],
        ['comments', 'f086'],
        ['compact-disc', 'f51f'],
        ['compass', 'f14e'],
        ['compress', 'f066'],
        ['concierge-bell', 'f562'],
        ['cookie', 'f563'],
        ['cookie-bite', 'f564'],
        ['copy', 'f0c5'],
        ['copyright', 'f1f9'],
        ['couch', 'f4b8'],
        ['credit-card', 'f09d'],
        ['crop', 'f125'],
        ['crop-alt', 'f565'],
        ['crosshairs', 'f05b'],
        ['crow', 'f520'],
        ['crown', 'f521'],
        ['cube', 'f1b2'],
        ['cubes', 'f1b3'],
        ['cut', 'f0c4'],
        ['database', 'f1c0'],
        ['deaf', 'f2a4'],
        ['desktop', 'f108'],
        ['diagnoses', 'f470'],
        ['dice', 'f522'],
        ['dice-five', 'f523'],
        ['dice-four', 'f524'],
        ['dice-one', 'f525'],
        ['dice-six', 'f526'],
        ['dice-three', 'f527'],
        ['dice-two', 'f528'],
        ['digital-tachograph', 'f566'],
        ['directions', 'f5eb'],
        ['divide', 'f529'],
        ['dizzy', 'f567'],
        ['dna', 'f471'],
        ['dollar-sign', 'f155'],
        ['dolly', 'f472'],
        ['dolly-flatbed', 'f474'],
        ['donate', 'f4b9'],
        ['door-closed', 'f52a'],
        ['door-open', 'f52b'],
        ['dot-circle', 'f192'],
        ['dove', 'f4ba'],
        ['download', 'f019'],
        ['drafting-compass', 'f568'],
        ['draw-polygon', 'f5ee'],
        ['drum', 'f569'],
        ['drum-steelpan', 'f56a'],
        ['dumbbell', 'f44b'],
        ['edit', 'f044'],
        ['eject', 'f052'],
        ['ellipsis-h', 'f141'],
        ['ellipsis-v', 'f142'],
        ['envelope', 'f0e0'],
        ['envelope-open', 'f2b6'],
        ['envelope-square', 'f199'],
        ['equals', 'f52c'],
        ['eraser', 'f12d'],
        ['euro-sign', 'f153'],
        ['exchange-alt', 'f362'],
        ['exclamation', 'f12a'],
        ['exclamation-circle', 'f06a'],
        ['exclamation-triangle', 'f071'],
        ['expand', 'f065'],
        ['expand-arrows-alt', 'f31e'],
        ['external-link-alt', 'f35d'],
        ['external-link-square-alt', 'f360'],
        ['eye', 'f06e'],
        ['eye-dropper', 'f1fb'],
        ['eye-slash', 'f070'],
        ['fast-backward', 'f049'],
        ['fast-forward', 'f050'],
        ['fax', 'f1ac'],
        ['feather', 'f52d'],
        ['feather-alt', 'f56b'],
        ['female', 'f182'],
        ['fighter-jet', 'f0fb'],
        ['file', 'f15b'],
        ['file-alt', 'f15c'],
        ['file-archive', 'f1c6'],
        ['file-audio', 'f1c7'],
        ['file-code', 'f1c9'],
        ['file-contract', 'f56c'],
        ['file-download', 'f56d'],
        ['file-excel', 'f1c3'],
        ['file-export', 'f56e'],
        ['file-image', 'f1c5'],
        ['file-import', 'f56f'],
        ['file-invoice', 'f570'],
        ['file-invoice-dollar', 'f571'],
        ['file-medical', 'f477'],
        ['file-medical-alt', 'f478'],
        ['file-pdf', 'f1c1'],
        ['file-powerpoint', 'f1c4'],
        ['file-prescription', 'f572'],
        ['file-signature', 'f573'],
        ['file-upload', 'f574'],
        ['file-video', 'f1c8'],
        ['file-word', 'f1c2'],
        ['fill', 'f575'],
        ['fill-drip', 'f576'],
        ['film', 'f008'],
        ['filter', 'f0b0'],
        ['fingerprint', 'f577'],
        ['fire', 'f06d'],
        ['fire-extinguisher', 'f134'],
        ['first-aid', 'f479'],
        ['fish', 'f578'],
        ['flag', 'f024'],
        ['flag-checkered', 'f11e'],
        ['flask', 'f0c3'],
        ['flushed', 'f579'],
        ['folder', 'f07b'],
        ['folder-open', 'f07c'],
        ['font', 'f031'],
        ['font-awesome-logo-full', 'f4e6'],
        ['football-ball', 'f44e'],
        ['forward', 'f04e'],
        ['frog', 'f52e'],
        ['frown', 'f119'],
        ['frown-open', 'f57a'],
        ['futbol', 'f1e3'],
        ['gamepad', 'f11b'],
        ['gas-pump', 'f52f'],
        ['gavel', 'f0e3'],
        ['gem', 'f3a5'],
        ['genderless', 'f22d'],
        ['gift', 'f06b'],
        ['glass-martini', 'f000'],
        ['glass-martini-alt', 'f57b'],
        ['glasses', 'f530'],
        ['globe', 'f0ac'],
        ['globe-africa', 'f57c'],
        ['globe-americas', 'f57d'],
        ['globe-asia', 'f57e'],
        ['golf-ball', 'f450'],
        ['graduation-cap', 'f19d'],
        ['greater-than', 'f531'],
        ['greater-than-equal', 'f532'],
        ['grimace', 'f57f'],
        ['grin', 'f580'],
        ['grin-alt', 'f581'],
        ['grin-beam', 'f582'],
        ['grin-beam-sweat', 'f583'],
        ['grin-hearts', 'f584'],
        ['grin-squint', 'f585'],
        ['grin-squint-tears', 'f586'],
        ['grin-stars', 'f587'],
        ['grin-tears', 'f588'],
        ['grin-tongue', 'f589'],
        ['grin-tongue-squint', 'f58a'],
        ['grin-tongue-wink', 'f58b'],
        ['grin-wink', 'f58c'],
        ['grip-horizontal', 'f58d'],
        ['grip-vertical', 'f58e'],
        ['h-square', 'f0fd'],
        ['hand-holding', 'f4bd'],
        ['hand-holding-heart', 'f4be'],
        ['hand-holding-usd', 'f4c0'],
        ['hand-lizard', 'f258'],
        ['hand-paper', 'f256'],
        ['hand-peace', 'f25b'],
        ['hand-point-down', 'f0a7'],
        ['hand-point-left', 'f0a5'],
        ['hand-point-right', 'f0a4'],
        ['hand-point-up', 'f0a6'],
        ['hand-pointer', 'f25a'],
        ['hand-rock', 'f255'],
        ['hand-scissors', 'f257'],
        ['hand-spock', 'f259'],
        ['hands', 'f4c2'],
        ['hands-helping', 'f4c4'],
        ['handshake', 'f2b5'],
        ['hashtag', 'f292'],
        ['hdd', 'f0a0'],
        ['heading', 'f1dc'],
        ['headphones', 'f025'],
        ['headphones-alt', 'f58f'],
        ['headset', 'f590'],
        ['heart', 'f004'],
        ['heartbeat', 'f21e'],
        ['helicopter', 'f533'],
        ['highlighter', 'f591'],
        ['history', 'f1da'],
        ['hockey-puck', 'f453'],
        ['home', 'f015'],
        ['hospital', 'f0f8'],
        ['hospital-alt', 'f47d'],
        ['hospital-symbol', 'f47e'],
        ['hot-tub', 'f593'],
        ['hotel', 'f594'],
        ['hourglass', 'f254'],
        ['hourglass-end', 'f253'],
        ['hourglass-half', 'f252'],
        ['hourglass-start', 'f251'],
        ['i-cursor', 'f246'],
        ['id-badge', 'f2c1'],
        ['id-card', 'f2c2'],
        ['id-card-alt', 'f47f'],
        ['image', 'f03e'],
        ['images', 'f302'],
        ['inbox', 'f01c'],
        ['indent', 'f03c'],
        ['industry', 'f275'],
        ['infinity', 'f534'],
        ['info', 'f129'],
        ['info-circle', 'f05a'],
        ['italic', 'f033'],
        ['joint', 'f595'],
        ['key', 'f084'],
        ['keyboard', 'f11c'],
        ['kiss', 'f596'],
        ['kiss-beam', 'f597'],
        ['kiss-wink-heart', 'f598'],
        ['kiwi-bird', 'f535'],
        ['language', 'f1ab'],
        ['laptop', 'f109'],
        ['laptop-code', 'f5fc'],
        ['laugh', 'f599'],
        ['laugh-beam', 'f59a'],
        ['laugh-squint', 'f59b'],
        ['laugh-wink', 'f59c'],
        ['layer-group', 'f5fd'],
        ['leaf', 'f06c'],
        ['lemon', 'f094'],
        ['less-than', 'f536'],
        ['less-than-equal', 'f537'],
        ['level-down-alt', 'f3be'],
        ['level-up-alt', 'f3bf'],
        ['life-ring', 'f1cd'],
        ['lightbulb', 'f0eb'],
        ['link', 'f0c1'],
        ['lira-sign', 'f195'],
        ['list', 'f03a'],
        ['list-alt', 'f022'],
        ['list-ol', 'f0cb'],
        ['list-ul', 'f0ca'],
        ['location-arrow', 'f124'],
        ['lock', 'f023'],
        ['lock-open', 'f3c1'],
        ['long-arrow-alt-down', 'f309'],
        ['long-arrow-alt-left', 'f30a'],
        ['long-arrow-alt-right', 'f30b'],
        ['long-arrow-alt-up', 'f30c'],
        ['low-vision', 'f2a8'],
        ['luggage-cart', 'f59d'],
        ['magic', 'f0d0'],
        ['magnet', 'f076'],
        ['male', 'f183'],
        ['map', 'f279'],
        ['map-marked', 'f59f'],
        ['map-marked-alt', 'f5a0'],
        ['map-marker', 'f041'],
        ['map-marker-alt', 'f3c5'],
        ['map-pin', 'f276'],
        ['map-signs', 'f277'],
        ['marker', 'f5a1'],
        ['mars', 'f222'],
        ['mars-double', 'f227'],
        ['mars-stroke', 'f229'],
        ['mars-stroke-h', 'f22b'],
        ['mars-stroke-v', 'f22a'],
        ['medal', 'f5a2'],
        ['medkit', 'f0fa'],
        ['meh', 'f11a'],
        ['meh-blank', 'f5a4'],
        ['meh-rolling-eyes', 'f5a5'],
        ['memory', 'f538'],
        ['mercury', 'f223'],
        ['microchip', 'f2db'],
        ['microphone', 'f130'],
        ['microphone-alt', 'f3c9'],
        ['microphone-alt-slash', 'f539'],
        ['microphone-slash', 'f131'],
        ['microscope', 'f610'],
        ['minus', 'f068'],
        ['minus-circle', 'f056'],
        ['minus-square', 'f146'],
        ['mobile', 'f10b'],
        ['mobile-alt', 'f3cd'],
        ['money-bill', 'f0d6'],
        ['money-bill-alt', 'f3d1'],
        ['money-bill-wave', 'f53a'],
        ['money-bill-wave-alt', 'f53b'],
        ['money-check', 'f53c'],
        ['money-check-alt', 'f53d'],
        ['monument', 'f5a6'],
        ['moon', 'f186'],
        ['mortar-pestle', 'f5a7'],
        ['motorcycle', 'f21c'],
        ['mouse-pointer', 'f245'],
        ['music', 'f001'],
        ['neuter', 'f22c'],
        ['newspaper', 'f1ea'],
        ['not-equal', 'f53e'],
        ['notes-medical', 'f481'],
        ['object-group', 'f247'],
        ['object-ungroup', 'f248'],
        ['oil-can', 'f613'],
        ['outdent', 'f03b'],
        ['paint-brush', 'f1fc'],
        ['paint-roller', 'f5aa'],
        ['palette', 'f53f'],
        ['pallet', 'f482'],
        ['paper-plane', 'f1d8'],
        ['paperclip', 'f0c6'],
        ['parachute-box', 'f4cd'],
        ['paragraph', 'f1dd'],
        ['parking', 'f540'],
        ['passport', 'f5ab'],
        ['paste', 'f0ea'],
        ['pause', 'f04c'],
        ['pause-circle', 'f28b'],
        ['paw', 'f1b0'],
        ['pen', 'f304'],
        ['pen-alt', 'f305'],
        ['pen-fancy', 'f5ac'],
        ['pen-nib', 'f5ad'],
        ['pen-square', 'f14b'],
        ['pencil-alt', 'f303'],
        ['pencil-ruler', 'f5ae'],
        ['people-carry', 'f4ce'],
        ['percent', 'f295'],
        ['percentage', 'f541'],
        ['phone', 'f095'],
        ['phone-slash', 'f3dd'],
        ['phone-square', 'f098'],
        ['phone-volume', 'f2a0'],
        ['piggy-bank', 'f4d3'],
        ['pills', 'f484'],
        ['plane', 'f072'],
        ['plane-arrival', 'f5af'],
        ['plane-departure', 'f5b0'],
        ['play', 'f04b'],
        ['play-circle', 'f144'],
        ['plug', 'f1e6'],
        ['plus', 'f067'],
        ['plus-circle', 'f055'],
        ['plus-square', 'f0fe'],
        ['podcast', 'f2ce'],
        ['poo', 'f2fe'],
        ['poop', 'f619'],
        ['portrait', 'f3e0'],
        ['pound-sign', 'f154'],
        ['power-off', 'f011'],
        ['prescription', 'f5b1'],
        ['prescription-bottle', 'f485'],
        ['prescription-bottle-alt', 'f486'],
        ['print', 'f02f'],
        ['procedures', 'f487'],
        ['project-diagram', 'f542'],
        ['puzzle-piece', 'f12e'],
        ['qrcode', 'f029'],
        ['question', 'f128'],
        ['question-circle', 'f059'],
        ['quidditch', 'f458'],
        ['quote-left', 'f10d'],
        ['quote-right', 'f10e'],
        ['random', 'f074'],
        ['receipt', 'f543'],
        ['recycle', 'f1b8'],
        ['redo', 'f01e'],
        ['redo-alt', 'f2f9'],
        ['registered', 'f25d'],
        ['reply', 'f3e5'],
        ['reply-all', 'f122'],
        ['retweet', 'f079'],
        ['ribbon', 'f4d6'],
        ['road', 'f018'],
        ['robot', 'f544'],
        ['rocket', 'f135'],
        ['route', 'f4d7'],
        ['rss', 'f09e'],
        ['rss-square', 'f143'],
        ['ruble-sign', 'f158'],
        ['ruler', 'f545'],
        ['ruler-combined', 'f546'],
        ['ruler-horizontal', 'f547'],
        ['ruler-vertical', 'f548'],
        ['rupee-sign', 'f156'],
        ['sad-cry', 'f5b3'],
        ['sad-tear', 'f5b4'],
        ['save', 'f0c7'],
        ['school', 'f549'],
        ['screwdriver', 'f54a'],
        ['search', 'f002'],
        ['search-minus', 'f010'],
        ['search-plus', 'f00e'],
        ['seedling', 'f4d8'],
        ['server', 'f233'],
        ['shapes', 'f61f'],
        ['share', 'f064'],
        ['share-alt', 'f1e0'],
        ['share-alt-square', 'f1e1'],
        ['share-square', 'f14d'],
        ['shekel-sign', 'f20b'],
        ['shield-alt', 'f3ed'],
        ['ship', 'f21a'],
        ['shipping-fast', 'f48b'],
        ['shoe-prints', 'f54b'],
        ['shopping-bag', 'f290'],
        ['shopping-basket', 'f291'],
        ['shopping-cart', 'f07a'],
        ['shower', 'f2cc'],
        ['shuttle-van', 'f5b6'],
        ['sign', 'f4d9'],
        ['sign-in-alt', 'f2f6'],
        ['sign-language', 'f2a7'],
        ['sign-out-alt', 'f2f5'],
        ['signal', 'f012'],
        ['signature', 'f5b7'],
        ['sitemap', 'f0e8'],
        ['skull', 'f54c'],
        ['sliders-h', 'f1de'],
        ['smile', 'f118'],
        ['smile-beam', 'f5b8'],
        ['smile-wink', 'f4da'],
        ['smoking', 'f48d'],
        ['smoking-ban', 'f54d'],
        ['snowflake', 'f2dc'],
        ['solar-panel', 'f5ba'],
        ['sort', 'f0dc'],
        ['sort-alpha-down', 'f15d'],
        ['sort-alpha-up', 'f15e'],
        ['sort-amount-down', 'f160'],
        ['sort-amount-up', 'f161'],
        ['sort-down', 'f0dd'],
        ['sort-numeric-down', 'f162'],
        ['sort-numeric-up', 'f163'],
        ['sort-up', 'f0de'],
        ['spa', 'f5bb'],
        ['space-shuttle', 'f197'],
        ['spinner', 'f110'],
        ['splotch', 'f5bc'],
        ['spray-can', 'f5bd'],
        ['square', 'f0c8'],
        ['square-full', 'f45c'],
        ['stamp', 'f5bf'],
        ['star', 'f005'],
        ['star-half', 'f089'],
        ['star-half-alt', 'f5c0'],
        ['star-of-life', 'f621'],
        ['step-backward', 'f048'],
        ['step-forward', 'f051'],
        ['stethoscope', 'f0f1'],
        ['sticky-note', 'f249'],
        ['stop', 'f04d'],
        ['stop-circle', 'f28d'],
        ['stopwatch', 'f2f2'],
        ['store', 'f54e'],
        ['store-alt', 'f54f'],
        ['stream', 'f550'],
        ['street-view', 'f21d'],
        ['strikethrough', 'f0cc'],
        ['stroopwafel', 'f551'],
        ['subscript', 'f12c'],
        ['subway', 'f239'],
        ['suitcase', 'f0f2'],
        ['suitcase-rolling', 'f5c1'],
        ['sun', 'f185'],
        ['superscript', 'f12b'],
        ['surprise', 'f5c2'],
        ['swatchbook', 'f5c3'],
        ['swimmer', 'f5c4'],
        ['swimming-pool', 'f5c5'],
        ['sync', 'f021'],
        ['sync-alt', 'f2f1'],
        ['syringe', 'f48e'],
        ['table', 'f0ce'],
        ['table-tennis', 'f45d'],
        ['tablet', 'f10a'],
        ['tablet-alt', 'f3fa'],
        ['tablets', 'f490'],
        ['tachometer-alt', 'f3fd'],
        ['tag', 'f02b'],
        ['tags', 'f02c'],
        ['tape', 'f4db'],
        ['tasks', 'f0ae'],
        ['taxi', 'f1ba'],
        ['teeth', 'f62e'],
        ['teeth-open', 'f62f'],
        ['terminal', 'f120'],
        ['text-height', 'f034'],
        ['text-width', 'f035'],
        ['th', 'f00a'],
        ['th-large', 'f009'],
        ['th-list', 'f00b'],
        ['theater-masks', 'f630'],
        ['thermometer', 'f491'],
        ['thermometer-empty', 'f2cb'],
        ['thermometer-full', 'f2c7'],
        ['thermometer-half', 'f2c9'],
        ['thermometer-quarter', 'f2ca'],
        ['thermometer-three-quarters', 'f2c8'],
        ['thumbs-down', 'f165'],
        ['thumbs-up', 'f164'],
        ['thumbtack', 'f08d'],
        ['ticket-alt', 'f3ff'],
        ['times', 'f00d'],
        ['times-circle', 'f057'],
        ['tint', 'f043'],
        ['tint-slash', 'f5c7'],
        ['tired', 'f5c8'],
        ['toggle-off', 'f204'],
        ['toggle-on', 'f205'],
        ['toolbox', 'f552'],
        ['tooth', 'f5c9'],
        ['trademark', 'f25c'],
        ['traffic-light', 'f637'],
        ['train', 'f238'],
        ['transgender', 'f224'],
        ['transgender-alt', 'f225'],
        ['trash', 'f1f8'],
        ['trash-alt', 'f2ed'],
        ['tree', 'f1bb'],
        ['trophy', 'f091'],
        ['truck', 'f0d1'],
        ['truck-loading', 'f4de'],
        ['truck-monster', 'f63b'],
        ['truck-moving', 'f4df'],
        ['truck-pickup', 'f63c'],
        ['tshirt', 'f553'],
        ['tty', 'f1e4'],
        ['tv', 'f26c'],
        ['umbrella', 'f0e9'],
        ['umbrella-beach', 'f5ca'],
        ['underline', 'f0cd'],
        ['undo', 'f0e2'],
        ['undo-alt', 'f2ea'],
        ['universal-access', 'f29a'],
        ['university', 'f19c'],
        ['unlink', 'f127'],
        ['unlock', 'f09c'],
        ['unlock-alt', 'f13e'],
        ['upload', 'f093'],
        ['user', 'f007'],
        ['user-alt', 'f406'],
        ['user-alt-slash', 'f4fa'],
        ['user-astronaut', 'f4fb'],
        ['user-check', 'f4fc'],
        ['user-circle', 'f2bd'],
        ['user-clock', 'f4fd'],
        ['user-cog', 'f4fe'],
        ['user-edit', 'f4ff'],
        ['user-friends', 'f500'],
        ['user-graduate', 'f501'],
        ['user-lock', 'f502'],
        ['user-md', 'f0f0'],
        ['user-minus', 'f503'],
        ['user-ninja', 'f504'],
        ['user-plus', 'f234'],
        ['user-secret', 'f21b'],
        ['user-shield', 'f505'],
        ['user-slash', 'f506'],
        ['user-tag', 'f507'],
        ['user-tie', 'f508'],
        ['user-times', 'f235'],
        ['users', 'f0c0'],
        ['users-cog', 'f509'],
        ['utensil-spoon', 'f2e5'],
        ['utensils', 'f2e7'],
        ['vector-square', 'f5cb'],
        ['venus', 'f221'],
        ['venus-double', 'f226'],
        ['venus-mars', 'f228'],
        ['vial', 'f492'],
        ['vials', 'f493'],
        ['video', 'f03d'],
        ['video-slash', 'f4e2'],
        ['volleyball-ball', 'f45f'],
        ['volume-down', 'f027'],
        ['volume-off', 'f026'],
        ['volume-up', 'f028'],
        ['walking', 'f554'],
        ['wallet', 'f555'],
        ['warehouse', 'f494'],
        ['weight', 'f496'],
        ['weight-hanging', 'f5cd'],
        ['wheelchair', 'f193'],
        ['wifi', 'f1eb'],
        ['window-close', 'f410'],
        ['window-maximize', 'f2d0'],
        ['window-minimize', 'f2d1'],
        ['window-restore', 'f2d2'],
        ['wine-glass', 'f4e3'],
        ['wine-glass-alt', 'f5ce'],
        ['won-sign', 'f159'],
        ['wrench', 'f0ad'],
        ['x-ray', 'f497'],
        ['yen-sign', 'f157'],
        ['500px', 'f26e'],
        ['accessible-icon', 'f368'],
        ['accusoft', 'f369'],
        ['adn', 'f170'],
        ['adversal', 'f36a'],
        ['affiliatetheme', 'f36b'],
        ['algolia', 'f36c'],
        ['amazon', 'f270'],
        ['amazon-pay', 'f42c'],
        ['amilia', 'f36d'],
        ['android', 'f17b'],
        ['angellist', 'f209'],
        ['angrycreative', 'f36e'],
        ['angular', 'f420'],
        ['app-store', 'f36f'],
        ['app-store-ios', 'f370'],
        ['apper', 'f371'],
        ['apple', 'f179'],
        ['apple-pay', 'f415'],
        ['asymmetrik', 'f372'],
        ['audible', 'f373'],
        ['autoprefixer', 'f41c'],
        ['avianex', 'f374'],
        ['aviato', 'f421'],
        ['aws', 'f375'],
        ['bandcamp', 'f2d5'],
        ['behance', 'f1b4'],
        ['behance-square', 'f1b5'],
        ['bimobject', 'f378'],
        ['bitbucket', 'f171'],
        ['bitcoin', 'f379'],
        ['bity', 'f37a'],
        ['black-tie', 'f27e'],
        ['blackberry', 'f37b'],
        ['blogger', 'f37c'],
        ['blogger-b', 'f37d'],
        ['bluetooth', 'f293'],
        ['bluetooth-b', 'f294'],
        ['btc', 'f15a'],
        ['buromobelexperte', 'f37f'],
        ['cc-amazon-pay', 'f42d'],
        ['cc-amex', 'f1f3'],
        ['cc-apple-pay', 'f416'],
        ['cc-diners-club', 'f24c'],
        ['cc-discover', 'f1f2'],
        ['cc-jcb', 'f24b'],
        ['cc-mastercard', 'f1f1'],
        ['cc-paypal', 'f1f4'],
        ['cc-stripe', 'f1f5'],
        ['cc-visa', 'f1f0'],
        ['centercode', 'f380'],
        ['chrome', 'f268'],
        ['cloudscale', 'f383'],
        ['cloudsmith', 'f384'],
        ['cloudversify', 'f385'],
        ['codepen', 'f1cb'],
        ['codiepie', 'f284'],
        ['connectdevelop', 'f20e'],
        ['contao', 'f26d'],
        ['cpanel', 'f388'],
        ['creative-commons', 'f25e'],
        ['creative-commons-by', 'f4e7'],
        ['creative-commons-nc', 'f4e8'],
        ['creative-commons-nc-eu', 'f4e9'],
        ['creative-commons-nc-jp', 'f4ea'],
        ['creative-commons-nd', 'f4eb'],
        ['creative-commons-pd', 'f4ec'],
        ['creative-commons-pd-alt', 'f4ed'],
        ['creative-commons-remix', 'f4ee'],
        ['creative-commons-sa', 'f4ef'],
        ['creative-commons-sampling', 'f4f0'],
        ['creative-commons-sampling-plus', 'f4f1'],
        ['creative-commons-share', 'f4f2'],
        ['css3', 'f13c'],
        ['css3-alt', 'f38b'],
        ['cuttlefish', 'f38c'],
        ['d-and-d', 'f38d'],
        ['dashcube', 'f210'],
        ['delicious', 'f1a5'],
        ['deploydog', 'f38e'],
        ['deskpro', 'f38f'],
        ['deviantart', 'f1bd'],
        ['digg', 'f1a6'],
        ['digital-ocean', 'f391'],
        ['discord', 'f392'],
        ['discourse', 'f393'],
        ['dochub', 'f394'],
        ['docker', 'f395'],
        ['draft2digital', 'f396'],
        ['dribbble', 'f17d'],
        ['dribbble-square', 'f397'],
        ['dropbox', 'f16b'],
        ['drupal', 'f1a9'],
        ['dyalog', 'f399'],
        ['earlybirds', 'f39a'],
        ['ebay', 'f4f4'],
        ['edge', 'f282'],
        ['elementor', 'f430'],
        ['ello', 'f5f1'],
        ['ember', 'f423'],
        ['empire', 'f1d1'],
        ['envira', 'f299'],
        ['erlang', 'f39d'],
        ['ethereum', 'f42e'],
        ['etsy', 'f2d7'],
        ['expeditedssl', 'f23e'],
        ['facebook', 'f09a'],
        ['facebook-f', 'f39e'],
        ['facebook-messenger', 'f39f'],
        ['facebook-square', 'f082'],
        ['firefox', 'f269'],
        ['first-order', 'f2b0'],
        ['first-order-alt', 'f50a'],
        ['firstdraft', 'f3a1'],
        ['flickr', 'f16e'],
        ['flipboard', 'f44d'],
        ['fly', 'f417'],
        ['font-awesome', 'f2b4'],
        ['font-awesome-alt', 'f35c'],
        ['font-awesome-flag', 'f425'],
        ['font-awesome-logo-full', 'f4e6'],
        ['fonticons', 'f280'],
        ['fonticons-fi', 'f3a2'],
        ['fort-awesome', 'f286'],
        ['fort-awesome-alt', 'f3a3'],
        ['forumbee', 'f211'],
        ['foursquare', 'f180'],
        ['free-code-camp', 'f2c5'],
        ['freebsd', 'f3a4'],
        ['fulcrum', 'f50b'],
        ['galactic-republic', 'f50c'],
        ['galactic-senate', 'f50d'],
        ['get-pocket', 'f265'],
        ['gg', 'f260'],
        ['gg-circle', 'f261'],
        ['git', 'f1d3'],
        ['git-square', 'f1d2'],
        ['github', 'f09b'],
        ['github-alt', 'f113'],
        ['github-square', 'f092'],
        ['gitkraken', 'f3a6'],
        ['gitlab', 'f296'],
        ['gitter', 'f426'],
        ['glide', 'f2a5'],
        ['glide-g', 'f2a6'],
        ['gofore', 'f3a7'],
        ['goodreads', 'f3a8'],
        ['goodreads-g', 'f3a9'],
        ['google', 'f1a0'],
        ['google-drive', 'f3aa'],
        ['google-play', 'f3ab'],
        ['google-plus', 'f2b3'],
        ['google-plus-g', 'f0d5'],
        ['google-plus-square', 'f0d4'],
        ['google-wallet', 'f1ee'],
        ['gratipay', 'f184'],
        ['grav', 'f2d6'],
        ['gripfire', 'f3ac'],
        ['grunt', 'f3ad'],
        ['gulp', 'f3ae'],
        ['hacker-news', 'f1d4'],
        ['hacker-news-square', 'f3af'],
        ['hackerrank', 'f5f7'],
        ['hips', 'f452'],
        ['hire-a-helper', 'f3b0'],
        ['hooli', 'f427'],
        ['hornbill', 'f592'],
        ['hotjar', 'f3b1'],
        ['houzz', 'f27c'],
        ['html5', 'f13b'],
        ['hubspot', 'f3b2'],
        ['imdb', 'f2d8'],
        ['instagram', 'f16d'],
        ['internet-explorer', 'f26b'],
        ['ioxhost', 'f208'],
        ['itunes', 'f3b4'],
        ['itunes-note', 'f3b5'],
        ['java', 'f4e4'],
        ['jedi-order', 'f50e'],
        ['jenkins', 'f3b6'],
        ['joget', 'f3b7'],
        ['joomla', 'f1aa'],
        ['js', 'f3b8'],
        ['js-square', 'f3b9'],
        ['jsfiddle', 'f1cc'],
        ['kaggle', 'f5fa'],
        ['keybase', 'f4f5'],
        ['keycdn', 'f3ba'],
        ['kickstarter', 'f3bb'],
        ['kickstarter-k', 'f3bc'],
        ['korvue', 'f42f'],
        ['laravel', 'f3bd'],
        ['lastfm', 'f202'],
        ['lastfm-square', 'f203'],
        ['leanpub', 'f212'],
        ['less', 'f41d'],
        ['line', 'f3c0'],
        ['linkedin', 'f08c'],
        ['linkedin-in', 'f0e1'],
        ['linode', 'f2b8'],
        ['linux', 'f17c'],
        ['lyft', 'f3c3'],
        ['magento', 'f3c4'],
        ['mailchimp', 'f59e'],
        ['mandalorian', 'f50f'],
        ['markdown', 'f60f'],
        ['mastodon', 'f4f6'],
        ['maxcdn', 'f136'],
        ['medapps', 'f3c6'],
        ['medium', 'f23a'],
        ['medium-m', 'f3c7'],
        ['medrt', 'f3c8'],
        ['meetup', 'f2e0'],
        ['megaport', 'f5a3'],
        ['microsoft', 'f3ca'],
        ['mix', 'f3cb'],
        ['mixcloud', 'f289'],
        ['mizuni', 'f3cc'],
        ['modx', 'f285'],
        ['monero', 'f3d0'],
        ['napster', 'f3d2'],
        ['neos', 'f612'],
        ['nimblr', 'f5a8'],
        ['nintendo-switch', 'f418'],
        ['node', 'f419'],
        ['node-js', 'f3d3'],
        ['npm', 'f3d4'],
        ['ns8', 'f3d5'],
        ['nutritionix', 'f3d6'],
        ['odnoklassniki', 'f263'],
        ['odnoklassniki-square', 'f264'],
        ['old-republic', 'f510'],
        ['opencart', 'f23d'],
        ['openid', 'f19b'],
        ['opera', 'f26a'],
        ['optin-monster', 'f23c'],
        ['osi', 'f41a'],
        ['page4', 'f3d7'],
        ['pagelines', 'f18c'],
        ['palfed', 'f3d8'],
        ['patreon', 'f3d9'],
        ['paypal', 'f1ed'],
        ['periscope', 'f3da'],
        ['phabricator', 'f3db'],
        ['phoenix-framework', 'f3dc'],
        ['phoenix-squadron', 'f511'],
        ['php', 'f457'],
        ['pied-piper', 'f2ae'],
        ['pied-piper-alt', 'f1a8'],
        ['pied-piper-hat', 'f4e5'],
        ['pied-piper-pp', 'f1a7'],
        ['pinterest', 'f0d2'],
        ['pinterest-p', 'f231'],
        ['pinterest-square', 'f0d3'],
        ['playstation', 'f3df'],
        ['product-hunt', 'f288'],
        ['pushed', 'f3e1'],
        ['python', 'f3e2'],
        ['qq', 'f1d6'],
        ['quinscape', 'f459'],
        ['quora', 'f2c4'],
        ['r-project', 'f4f7'],
        ['ravelry', 'f2d9'],
        ['react', 'f41b'],
        ['readme', 'f4d5'],
        ['rebel', 'f1d0'],
        ['red-river', 'f3e3'],
        ['reddit', 'f1a1'],
        ['reddit-alien', 'f281'],
        ['reddit-square', 'f1a2'],
        ['rendact', 'f3e4'],
        ['renren', 'f18b'],
        ['replyd', 'f3e6'],
        ['researchgate', 'f4f8'],
        ['resolving', 'f3e7'],
        ['rev', 'f5b2'],
        ['rocketchat', 'f3e8'],
        ['rockrms', 'f3e9'],
        ['safari', 'f267'],
        ['sass', 'f41e'],
        ['schlix', 'f3ea'],
        ['scribd', 'f28a'],
        ['searchengin', 'f3eb'],
        ['sellcast', 'f2da'],
        ['sellsy', 'f213'],
        ['servicestack', 'f3ec'],
        ['shirtsinbulk', 'f214'],
        ['shopware', 'f5b5'],
        ['simplybuilt', 'f215'],
        ['sistrix', 'f3ee'],
        ['sith', 'f512'],
        ['skyatlas', 'f216'],
        ['skype', 'f17e'],
        ['slack', 'f198'],
        ['slack-hash', 'f3ef'],
        ['slideshare', 'f1e7'],
        ['snapchat', 'f2ab'],
        ['snapchat-ghost', 'f2ac'],
        ['snapchat-square', 'f2ad'],
        ['soundcloud', 'f1be'],
        ['speakap', 'f3f3'],
        ['spotify', 'f1bc'],
        ['squarespace', 'f5be'],
        ['stack-exchange', 'f18d'],
        ['stack-overflow', 'f16c'],
        ['staylinked', 'f3f5'],
        ['steam', 'f1b6'],
        ['steam-square', 'f1b7'],
        ['steam-symbol', 'f3f6'],
        ['sticker-mule', 'f3f7'],
        ['strava', 'f428'],
        ['stripe', 'f429'],
        ['stripe-s', 'f42a'],
        ['studiovinari', 'f3f8'],
        ['stumbleupon', 'f1a4'],
        ['stumbleupon-circle', 'f1a3'],
        ['superpowers', 'f2dd'],
        ['supple', 'f3f9'],
        ['teamspeak', 'f4f9'],
        ['telegram', 'f2c6'],
        ['telegram-plane', 'f3fe'],
        ['tencent-weibo', 'f1d5'],
        ['themeco', 'f5c6'],
        ['themeisle', 'f2b2'],
        ['trade-federation', 'f513'],
        ['trello', 'f181'],
        ['tripadvisor', 'f262'],
        ['tumblr', 'f173'],
        ['tumblr-square', 'f174'],
        ['twitch', 'f1e8'],
        ['twitter', 'f099'],
        ['twitter-square', 'f081'],
        ['typo3', 'f42b'],
        ['uber', 'f402'],
        ['uikit', 'f403'],
        ['uniregistry', 'f404'],
        ['untappd', 'f405'],
        ['usb', 'f287'],
        ['ussunnah', 'f407'],
        ['vaadin', 'f408'],
        ['viacoin', 'f237'],
        ['viadeo', 'f2a9'],
        ['viadeo-square', 'f2aa'],
        ['viber', 'f409'],
        ['vimeo', 'f40a'],
        ['vimeo-square', 'f194'],
        ['vimeo-v', 'f27d'],
        ['vine', 'f1ca'],
        ['vk', 'f189'],
        ['vnv', 'f40b'],
        ['vuejs', 'f41f'],
        ['weebly', 'f5cc'],
        ['weibo', 'f18a'],
        ['weixin', 'f1d7'],
        ['whatsapp', 'f232'],
        ['whatsapp-square', 'f40c'],
        ['whmcs', 'f40d'],
        ['wikipedia-w', 'f266'],
        ['windows', 'f17a'],
        ['wix', 'f5cf'],
        ['wolf-pack-battalion', 'f514'],
        ['wordpress', 'f19a'],
        ['wordpress-simple', 'f411'],
        ['wpbeginner', 'f297'],
        ['wpexplorer', 'f2de'],
        ['wpforms', 'f298'],
        ['xbox', 'f412'],
        ['xing', 'f168'],
        ['xing-square', 'f169'],
        ['y-combinator', 'f23b'],
        ['yahoo', 'f19e'],
        ['yandex', 'f413'],
        ['yandex-international', 'f414'],
        ['yelp', 'f1e9'],
        ['yoast', 'f2b1'],
        ['youtube', 'f167'],
        ['youtube-square', 'f431'],
        ['zhihu', 'f63f'],
    ]);

    var translation = {
    	FontAwesome: {
    		default: 'far fa-circle',

    		contact: {
    			default: 'fal fa-user'
    		},

    		content: {
    			default: 'fal fa-map-marker',

    			achievement: 'fal fa-trophy',
    			audio: 'fal fa-headphones',
    			code: 'fal fa-code',
    			file: 'far fa-file',
    			game: 'fal fa-gamepad',
    			image: 'far fa-image',
    			invite: 'far fa-envelope',
    			receipt: 'fal fa-receipt',
    			software: 'far fa-save',
    			text: 'far fa-file-alt',
    			video: 'fal fa-video',
    			'web-page': 'fal fa-desktop'
    		},

    		event: {
    			default: 'fal fa-exclamation',

    			attended: 'fal fa-at',
    			called: 'fal fa-phone',
    			commented: 'fal fa-comment',
    			created: 'fal fa-pencil-ruler',
    			ate: 'fal fa-utensils',
    			edited: 'fal fa-pen-square',
    			exercised: 'fal fa-heartbeat',
    			messaged: 'fal fa-comments',
    			played: 'fal fa-play',
    			purchased: 'far fa-credit-card',
    			slept: 'fal fa-bed',
    			traveled: 'fal fa-car',
    			viewed: 'far fa-eye',
    			visited: 'fal fa-map-pin'
    		},

    		location: {
    			default: 'fal fa-map-marker-alt'
    		},

    		organization: {
    			default: 'far fa-building'
    		},

    		person: {
    			default: 'fal fa-user'
    		},

    		place: {
    			default: 'fal fa-map-pin'
    		},

    		thing: {
    			default: 'fal fa-cube',

    			'apparel_&_accessories': 'fal fa-tshirt',
    			appliances: 'fal fa-cube',
    			automotive: 'fal fa-car',
    			baby: 'fal fa-child',
    			'books_&_magazines': 'fal fa-book',
    			electronics: 'fal fa-bolt',
    			food: 'fal fa-utensils',
    			gifts: 'fal fa-gift',
    			'health_&_beauty': 'fal fa-plus-circle',
    			'home_&_kitchen': 'fal fa-home',
    			'movies_&_tv': 'fal fa-television',
    			music: 'fal fa-music',
    			office: 'fal fa-briefcase',
    			pet: 'fal fa-paw',
    			products: 'fal fa-shopping-bag',
    			shoes: 'fal fa-show-prints',
    			'sports_&_outdoors': 'fal fa-futbol',
    			'tools_&_home_improvement': 'fal fa-hammer',
    			'toys_&_games': 'fal fa-gamepad',
    			other: 'fal fa-pen-square'
    		},

    		provider: {
    			default: 'fal fa-plug',

    			'chrome extension': 'fab fa-chrome',
    			dropbox: 'fab fa-dropbox',
    			'firefox extension': 'fab fa-firefox',
    			facebook: 'fab fa-facebook-f',
    			'financial files': 'fal fa-file-invoice-dollar',
    			github: 'fab fa-github',
    			google: 'fab fa-google',
    			instagram: 'fab fa-instagram',
    			lyft: 'fab fa-lyft',
    			microsoft: 'fab fa-windows',
    			reddit: 'fab fa-reddit-alien',
    			pinterest: 'fab fa-pinterest-p',
    			slack: 'fab fa-slack',
    			slice: 'far fa-credit-card',
    			spotify: 'fab fa-spotify',
    			steam: 'fab fa-steam-symbol',
    			twitter: 'fab fa-twitter',
    			uber: 'fab fa-uber'
    		},

    		browser: {
    			default: 'fal fa-plug',

    			chrome: 'fab fa-chrome',
    			firefox: 'fab fa-firefox',
    			safari: 'fab fa-safari',
    			edge: 'fab fa-edge'
    		}
    	}
    };


    function getIcon(library, type, name) {
    	if (arguments.length <= 2) {
    		name = type;
    		type = library;
    		library = 'FontAwesome';

    		if (arguments.length == 1) {
    			return translation[library][type].default;
    		}
    	}

    	type = type.toLowerCase();

    	if (name) {
    		name = name.toLowerCase();
    	}

    	if (!translation[library]) {
    		throw new Error('Invalid font library.');
    	}

    	if (!translation[library][type]) {
    		return translation[library].default;
    	}

    	if (!translation[library][type][name]) {
    		return translation[library][type].default;
    	}

    	return translation[library][type][name];
    }

    function getContentTypeIcon (type) {
        return getIcon('content', type.toLowerCase())
    }

    function getProviderIcon (provider) {
        return getIcon('provider', provider.toLowerCase());
    }

    function getEventTypeIcon (type) {
        return getIcon('event', type.toLowerCase())
    }

    /*
    returns the name of a font awesome character
    from its css class

    ex:
    far fa-clock -> clock
    */
    function stripFAName (icon) {
        var match = icon.match(/(?:fa[rlb] fa-)(.*)/);
        return match[1];
    }

    function getContentTypeIconUnicode (type) {
        var result = FAMap.get(stripFAName(getContentTypeIcon(type)));
        return result;
    }

    function getEventTypeIconUnicode (type) {
        var result = FAMap.get(stripFAName(getEventTypeIcon(type)));
        return result;
    }

    function getProviderTypeIconUnicode (type) {
        var result = FAMap.get(stripFAName(getProviderIcon(type)));
        return result;
    }

    function lsCellComp () {

    AFRAME.registerComponent('ls-cell', {

        schema: {
            id: { type: 'string', default: '' },

            width: { type: 'number', default: 0.6 },
            height: { type: 'number', default: 0.6 },

            background: { type: 'boolean', default: true },
            bgColor: { default: 0x22252a },
            bgOpacity: { type: 'number', default: 0.7 },

            facet: { type: 'string', default: 'content',
                onOf: ['content', 'events', 'contacts', 'people'] },

            contenttype: { type: 'string', default: '' },
            provider: { type: 'string', default: '' },
            connectionname: { type: 'string', default: '' },
            mediatype: { type: 'string', default: '' },
            mediaurl: { type: 'string', default: '' },

            embedthumbnail: { type: 'string', default: '' },
            title: { type: 'string', default: '' },
            price: { type: 'number', default: 0 },

            text: { type: 'string', default: '' },
            tags: { type: 'array', default: [] },
            url: { type: 'string', default: '' },

            avatarurl: { type: 'string', default: '' },
            contactname: { type: 'string', default: '' },
            contacthandle: { type: 'string', default: '' },

            eventtype: { type: 'string', default: '' },
            datetime: { type: 'string', default: '' },
            first_name: { type: 'string', default: '' },
            middle_name: { type: 'string', default: '' },
            last_name: { type: 'string', default: '' },

            color:  { default: '#FFF' },
            fontsize: { type: 'number', default: 1 },
            wrapcount: { type: 'number', default: 20 },
            wrappixels: { type: 'number', default: 0 },
            nobr: { type: 'boolean', default: false },

            border: { type: 'boolean', default: true },
            bordersize: { type: 'number', default: 0.05 },
            borderColor: { default: '#484848' },

            wrapfit: { type: 'boolean', default: false },

            animateLoad: { type: 'boolean', default: true },
            animateInSeconds: { type: 'number', default: 0.5 },
            animateOutSeconds: { type: 'number', default: 0.2 },
        },

        init: function() {
            var self = this;
            self.firstUpdate = true;

            self.headerScale = 2;
            self.headerFontSize = self.data.fontsize * self.headerScale;

            var font = self.data.font || DEFAULT_FONT;


            loadFont(FONTS[font]).then(
                (result) => {
                    self.lineHeight = result.common.lineHeight;
                    self.widthFactor = computeFontWidthFactor(result);

                    self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                        self.widthFactor);
                    self.textScale = self.data.width / self.textRenderWidth;
                    self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;
                    var headerWrapCount = self.data.wrapcount/self.headerScale;
                    if (self.data.wrapfit) {
                        headerWrapCount =  (self.data.width / (self.headerFontSize)) * (20/0.3); 
                    }
                    self.headerHeight = self.lineHeight * self.data.width / computeWidth(self.data.wrappixels, headerWrapCount,
                        self.widthFactor);
                    this._createCell();
                },
            );
            
        },

        remove: function() {
            var root = this.el.querySelector('.ls-cell-root');
            if (root) this.el.removeChild(root);
            if (this.el.object3DMap.hasOwnProperty('background')) this.el.removeObject3D('background');
            if (this.el.object3DMap.hasOwnProperty('border')) this.el.removeObject3D('border');

        },

        updateCell: function() {
            this._createCell();
        },

        _createCell: function() {
            var self = this;
            var data = self.data;

            var root = this.el.querySelector('.ls-cell-root');
            if (root) {
                this.el.removeChild(root);
                if (this.el.object3DMap.hasOwnProperty('background')) this.el.removeObject3D('background');
                if (this.el.object3DMap.hasOwnProperty('border')) this.el.removeObject3D('border');
            }

            if (self.data.background) {
                this._createBackground();
            }


            switch (data.facet) {
                case 'content':
                    var contentEls = this._createContentCell();
                    var flexEl = contentEls[0];
                    flexEl.classList.add('ls-cell-root');
                    var headerFlexEl = contentEls[1];
                    self.el.appendChild(flexEl);
                    headerFlexEl.setAttribute('needsupdate', true);
                    flexEl.setAttribute('needsupdate', true);
                    break;
                case 'events':
                    var flexEl = document.createElement('a-entity');
                    flexEl.classList.add('ls-cell-root');
                    flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
                        flexDirection: 'row',
                        justifyContent: 'flexStart',
                        alignItems: 'flexStart' });

                    var eventEls = this._createEventsCell({width: data.width/4});
                    var eventsFlexEl = eventEls[0];
                    var typeFlexEl = eventEls[1];
                    var providerFlexEl = eventEls[2];
                    if (!!data.datetime) {
                        var calFlexEl = eventEls[3];
                        var timeFlexEl  = eventEls[4];
                    }

                    var contentEls = this._createContentCell({width: data.width*3/4, height: data.height});
                    var contentFlexEl = contentEls[0];
                    var headerFlexEl = contentEls[1];

                    flexEl.appendChild(eventsFlexEl);
                    flexEl.appendChild(contentFlexEl);

                    self.el.appendChild(flexEl);
                    typeFlexEl.setAttribute('needsupdate', true);
                    providerFlexEl.setAttribute('needsupdate', true);
                    if (!!data.datetime) {
                        calFlexEl.setAttribute('needsupdate', true);
                        timeFlexEl.setAttribute('needsupdate', true);
                    }
                    headerFlexEl.setAttribute('needsupdate', true);
                    contentFlexEl.setAttribute('needsupdate', true);
                    eventsFlexEl.setAttribute('needsupdate', true);
                    flexEl.setAttribute('needsupdate', true);
                    break;
                case 'contacts':
                    var flexEl = this._createContactsCell();
                    flexEl.classList.add('ls-cell-root');
                    self.el.appendChild(flexEl);
                    flexEl.setAttribute('needsupdate', true);
                    break;
                case 'people':
                    var flexEl = this._createPeopleCell();
                    flexEl.classList.add('ls-cell-root');
                    self.el.appendChild(flexEl);
                    flexEl.setAttribute('needsupdate', true);
                    break;
            }
        },

        _createContentCell: function(opts={}) {
            var self = this;
            var data = self.data;
            var width = opts.width || data.width;
            var height = opts.height || data.height;
            /* Header
                TypeIcon Type Provider ProviderIcon
            */
            var flexEl = document.createElement('a-entity');
            flexEl.setAttribute('flex-container', { width: width, height: height, flexDirection: 'column',
                justifyContent: 'flexStart', alignItems: 'flexStart' });
            flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });


            var headerFlexEl = document.createElement('a-entity');
            headerFlexEl.setAttribute('flex-container', { width: width, height: self.headerHeight, flexDirection: 'row',
                justifyContent: 'space-evenly', alignItems: 'center' });
            headerFlexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

            var typeFAEl = document.createElement('a-entity');
            typeFAEl.setAttribute('width', self.headerHeight);
            typeFAEl.setAttribute('height', self.headerHeight);
            typeFAEl.setAttribute('font-awesome__type', { id: 'type',
            charcode: getContentTypeIconUnicode(data.contenttype),//'f121',
                fontSize: self.headerFontSize,
                size: 256, color: self.data.color,
                mesh: true,
                version: '"Font Awesome 5 Pro"' });
            typeFAEl.setAttribute('flex-item', { dimtype: 'el' });
            
            var typeEl = document.createElement('a-entity');
            typeEl.setAttribute('text-cell', { id: 'type', text: data.contenttype, width: width/2 - self.headerHeight,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                nobr: data.nobr } );
            typeEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

            var providerEl = document.createElement('a-entity');
            providerEl.setAttribute('text-cell', { id: 'provider', text: data.provider,
                width: width/2 - self.headerHeight,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                nobr: data.nobr,
                anchor: 'left' } );
            providerEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

            var providerFAEl = document.createElement('a-entity');
            providerFAEl.setAttribute('width', self.headerHeight);
            providerFAEl.setAttribute('height', self.headerHeight);
            providerFAEl.setAttribute('font-awesome__provider', { id: 'provider',
            charcode: getProviderTypeIconUnicode(data.provider),//'f09b',
                fontSize: self.headerFontSize,
                size: 256, color: self.data.color,
                mesh: true,
                version: '"Font Awesome 5 Brands"' });
            providerFAEl.setAttribute('flex-item', { dimtype: 'el' });


            headerFlexEl.appendChild(typeFAEl);
            headerFlexEl.appendChild(typeEl);
            headerFlexEl.appendChild(providerEl);
            headerFlexEl.appendChild(providerFAEl);
            flexEl.appendChild(headerFlexEl);


            /*
                embed content
            */
            if (data.mediatype == 'video' || data.mediatype == 'image') {
                var mediaEl = document.createElement('a-entity');
                var mediaHeight = self._contentHeight();
                mediaEl.setAttribute('media-cell', { id: 'content',
                    width: width,
                    height: mediaHeight,
                    url: data.mediaurl,
                    type: data.mediatype,
                    srcFit: 'bothmax',
                    animateLoad: false,
                    selected: true,
                } );
                mediaEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
                flexEl.appendChild(mediaEl);
            }

            /* text
                title
                price
                text
                url
            */
            if (!!data.title) {
                var titleEl = document.createElement('a-entity');
                titleEl.setAttribute('text-cell', { id: 'title', text: data.title, width: width,
                    height: self.headerHeight,
                    fontsize: self.headerFontSize,
                    wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                    color: '#2ac1de',
                    nobr: data.nobr } );
                titleEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(titleEl);
            }

            if (!!data.price && data.price > 0) {
                var priceEl = document.createElement('a-entity');
                priceEl.setAttribute('text-cell', { id: 'price', text: '$' + data.price, width: width,
                    height: self.textHeight,
                    fontsize: self.fontSize,
                    wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                    nobr: data.nobr } );
                priceEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(priceEl);
            }
            
            if (!!data.text && data.mediatype != 'video' && data.mediatype != 'image') {
                var textEl = document.createElement('a-entity');
                var contentHeight = self._contentHeight();
                textEl.setAttribute('text-cell', { id: 'content', text: data.text, width: width,
                    height: contentHeight,
                    fontsize: self.headerFontSize,
                    wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                    nobr: data.nobr } );
                textEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(textEl);
            }

            if ( data.url && !data.title && !data.text ) {
                var urlEl = document.createElement('a-entity');
                urlEl.setAttribute('text-cell', { id: 'url', text: data.url, width: width,
                    height: self.textHeight,
                    fontsize: self.fontSize,
                    wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                    nobr: data.nobr } );
                urlEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(urlEl);
            }
            

            /*
                Tags
            */
            var tagsEl = document.createElement('a-entity');
            var tagText = '#TAGS: ' + data.tags.join(', ');
            tagsEl.setAttribute('text-cell', { id: 'tags', text: tagText, width: width,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                color: '#2ac1de',
                nobr: data.nobr } );
            tagsEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

            flexEl.appendChild(tagsEl);
            return [flexEl, headerFlexEl];
        },

        _createContactsCell: function() {
            var self = this;
            var data = self.data;

            var flexEl = document.createElement('a-entity');
            flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
                flexDirection: 'column',
                justifyContent: 'flexStart', alignItems: 'flexStart' });
            flexEl.setAttribute('flex-item', { dimtype: 'el' });

            if (!!data.avatarurl) {
                var avatarEl = document.createElement('a-entity');
                var avatarHeight = data.height - 2*self.headerHeight;
                avatarEl.setAttribute('media-cell', { id: 'avatar',
                    width: data.width,
                    height: avatarHeight,
                    url: data.avatarurl,
                    type: 'image',
                    srcFit: 'bothmax',
                    animateLoad: false,
                    selected: true,
                } );
                avatarEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
                flexEl.appendChild(avatarEl);
            }
            else {
                var userFAEl = document.createElement('a-entity');
                userFAEl.setAttribute('width', self.headerHeight);
                userFAEl.setAttribute('height', self.headerHeight);
                userFAEl.setAttribute('font-awesome__user', { id: 'type', charcode: 'f007',
                    fontSize: 10*self.headerFontSize,
                    size: 256, color: self.data.color, mesh: true,
                    visibleWhenDrawn: false });
                userFAEl.setAttribute('flex-item', { dimtype: 'el' });
                flexEl.appendChild(userFAEl);
            }

            if (!!data.contactname) {
                var nameEl = document.createElement('a-entity');
                nameEl.setAttribute('text-cell', { id: 'contactname', text: data.contactname, width: self.data.width,
                    height: self.headerHeight,
                    fontsize: self.headerFontSize,
                    wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                    color: '#2ac1de',
                    nobr: data.nobr } );
                nameEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(nameEl);
            }

            if (!!data.contacthandle) {
                var handleEl = document.createElement('a-entity');
                handleEl.setAttribute('text-cell', { id: 'contacthandle', text: data.contacthandle, width: self.data.width,
                    height: self.headerHeight,
                    fontsize: self.headerFontSize,
                    wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                    color: '#2ac1de',
                    nobr: data.nobr } );
                    handleEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(handleEl);
            }

            return flexEl;
        },

        _createPeopleCell: function() {
            var self = this;
            var data = self.data;

            var flexEl = document.createElement('a-entity');
            flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
                flexDirection: 'column',
                justifyContent: 'flexStart', alignItems: 'flexStart' });
            flexEl.setAttribute('flex-item', { dimtype: 'el' });

            if (!!data.avatarurl) {
                var avatarEl = document.createElement('a-entity');
                var avatarHeight = data.height - 2*self.headerHeight;
                avatarEl.setAttribute('media-cell', { id: 'avatar',
                    width: data.width,
                    height: avatarHeight,
                    url: data.avatarurl,
                    type: 'image',
                    srcFit: 'bothmax',
                    animateLoad: false,
                    selected: true,
                } );
                avatarEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
                flexEl.appendChild(avatarEl);
            }
            else {
                var userFAEl = document.createElement('a-entity');
                userFAEl.setAttribute('width', self.headerHeight);
                userFAEl.setAttribute('height', self.headerHeight);
                userFAEl.setAttribute('font-awesome__user', { id: 'type', charcode: 'f007',
                    fontSize: 10*self.headerFontSize,
                    size: 256, color: self.data.color, mesh: true,
                    visibleWhenDrawn: false });
                userFAEl.setAttribute('flex-item', { dimtype: 'el' });
                flexEl.appendChild(userFAEl);
            }

            if (data.first_name || data.middle_name || data.last_name) {
                var nameEl = document.createElement('a-entity');
                var name = self.concatNames(data.first_name, data.middle_name, data.last_name);
                nameEl.setAttribute('text-cell', { id: 'contactname', text: name, width: self.data.width,
                    height: self.headerHeight,
                    fontsize: self.headerFontSize,
                    wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                    color: '#2ac1de',
                    nobr: data.nobr } );
                nameEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
                flexEl.appendChild(nameEl);
            }

            return flexEl;
        },


        _createEventsCell: function(opts={}) {
            var self = this;
            var data = self.data;
            var width = opts.width || data.width;
            var height = opts.height || data.height;

            /* Detials
                EventTypeIcon Type
                ProviderIcon  Provider
                calIcon date
                clockIcon time
            */
            var flexEl = document.createElement('a-entity');
            flexEl.setAttribute('flex-container', { width: width, height: height, flexDirection: 'column',
                justifyContent: 'flexStart', alignItems: 'flexStart' });
            flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

            // type
            var typeFlexEl = self._createEventsDetailsRow(opts, 'type',
                getEventTypeIconUnicode(data.eventtype),
                data.eventtype);
            flexEl.appendChild(typeFlexEl);

            // provider
            var providerFlexEl = self._createEventsDetailsRow(opts, 'provider',
                getProviderTypeIconUnicode(data.provider),
                data.provider,
                '"Font Awesome 5 Brands"');
            flexEl.appendChild(providerFlexEl);

            if (!!data.datetime) {
                // date
                var calFlexEl = self._createEventsDetailsRow(opts, 'date', 'f073', this.dateShort(data.datetime));
                flexEl.appendChild(calFlexEl);
                // time
                var timeFlexEl = self._createEventsDetailsRow(opts, 'time', 'f017', this.dateTime(data.datetime));
                flexEl.appendChild(timeFlexEl);
            }

            var els = [flexEl, typeFlexEl, providerFlexEl];
            if (!!data.datetime) {
                els.push(calFlexEl);
                els.push(timeFlexEl);
            }
            return els;
        },

        _createEventsDetailsRow(opts, id, charcode, text, version='') {
            var self = this;
            var data = self.data;
            var width = opts.width || data.width;
            var height = opts.height || data.height;

            var flexRowProps = { width: width, height: self.headerHeight, flexDirection: 'row',
                justifyContent: 'flexStart', alignItems: 'center' };
            var textProps = { width: width - self.headerHeight,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                nobr: data.nobr };
            var FAprops = {fontSize: self.headerFontSize,
                size: 256, color: self.data.color, mesh: true,
                visibleWhenDrawn: false };
            if (!!version) {
                FAprops.version = version;
            }
            else {
                FAprops.version ='"Font Awesome 5 Pro"';
            }

            var flexEl = document.createElement('a-entity');
            flexEl.setAttribute('flex-container', flexRowProps);
            flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

            var typeFAEl = document.createElement('a-entity');
            typeFAEl.setAttribute('width', self.headerHeight);
            typeFAEl.setAttribute('height', self.headerHeight);
            typeFAEl.setAttribute('font-awesome__' + id,  { id: id, charcode: charcode, ...FAprops });
            typeFAEl.setAttribute('flex-item', { dimtype: 'el' });
           
            var typeEl = document.createElement('a-entity');
            typeEl.setAttribute('text-cell', { id: 'type', text: text, ...textProps } );
            typeEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

            flexEl.appendChild(typeFAEl);
            flexEl.appendChild(typeEl);
            return flexEl;
        },

        _createBackground() {
            var self = this;
            var bgGeom = new THREE.PlaneBufferGeometry(self.data.width, self.data.height);
            var bgMat = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: self.data.bgOpacity,
                side: THREE.DoubleSide,
                color: new THREE.Color(self.data.bgColor),
            });
            var bgMesh = new THREE.Mesh(bgGeom, bgMat);
            bgMesh.name = 'mBackground';

            self.el.setObject3D('background', bgMesh);
            if (self.data.border) {
                self._createBorder();
            }

            if (self.data.animateLoad) {
                AFRAME.ANIME({
                    targets: self.el.object3D.scale,
                    easing: 'linear',
                    x: [0, 1],
                    y: [0, 1],
                    z: [0, 1],
                    duration: 1000*self.data.animateInSeconds,
                });
            }
        },

        _createBorder() {
            var self = this;
            var geom = new THREE.PlaneBufferGeometry(self.data.width + self.data.bordersize,
                self.data.height + self.data.bordersize);
            geom.translate(0, 0, -0.001);
            var mat = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: self.data.bgOpacity,
                side: THREE.DoubleSide,
                color: new THREE.Color(self.data.borderColor),
            });
            var mesh = new THREE.Mesh(geom, mat);
            mesh.name = 'mBorder';

            self.el.setObject3D('border', mesh);
        },

        _contentHeight() {
            var data = this.data;
            // height - (header and tags)
            var result = this.data.height - (2 * this.headerHeight);
            if (!!data.title) { result -= this.headerHeight; }
            if (!!data.price && data.price > 0) { result -= this.textHeight; }
            if ( data.url && !data.title && !data.text ) { result -= this.textHeight; }

            return result > 0 ? result : 0;
        },

        dateShort: function(date) {
            return moment.utc(date).local().format('YYYY/MM/DD');
        },

        dateTiny: function(date) {
            return moment.utc(date).local().format('M/D/YY');
        },

        dateTime: function(date) {
            return moment.utc(date).local().format('hh:mm A');
        },

        concatNames: function(first_name='', middle_name='', last_name='') {
            let returned = '';

            if (first_name || middle_name || last_name) {
                if (first_name) {
                    returned += first_name + ' ';
                }

                if (middle_name) {
                    returned += middle_name + ' ';
                }

                if (last_name) {
                    returned += last_name + ' ';
                }
            }

            return returned;
        },

    });

    AFRAME.registerPrimitive('a-ls-cell', {
    	defaultComponents: {
    		'ls-cell': {},
    	},
    	mappings: {
            'value': 'ls-cell.text',
            'mediaurl': 'ls-cell.mediaurl',
            'mediatype': 'ls-cell.mediatype',
            'width': 'ls-cell.width',
            'height': 'ls-cell.height',
            'fontsize': 'ls-cell.fontsize',
            'wrapcount': 'ls-cell.wrapcount',
            'background': 'ls-cell.background',
            'nobr': 'ls-cell.nobr',
            'color': 'ls-cell.color',
            'contenttype': 'ls-cell.contenttype',
            'provider': 'ls-cell.provider',
            'connectionname': 'ls-cell.connectionname',
            'title': 'ls-cell.title',
            'font': 'ls-cell.font',
            'wrapfit': 'ls-cell.wrapfit',

            'facet': 'ls-cell.facet',
            'embedthumbnail': 'ls-cell.embedthumbnail',
            'price': 'ls-cell.price',
            'tags': 'ls-cell.tags',
            'url': 'ls-cell.url',

            'avatarurl': 'ls-cell.avatarurl',
            'contactname': 'ls-cell.contactname',
            'contacthandle': 'ls-cell.contacthandle',

            'firstname': 'ls-cell.first_name',
            'middlename': 'ls-cell.middle_name',
            'lastname': 'ls-cell.last_name',

            'eventtype': 'ls-cell.eventtype',
            'datetime':'ls-cell.datetime',

            'animate-load': 'ls-cell.animateLoad',
            'animatein': 'ls-cell.animateInSeconds',
            'animateout': 'ls-cell.animateOutSeconds',
    	}
    });

    }

    //////////////////////////////////////////////////////////////////////////////
    //		arjs-hit-testing
    //////////////////////////////////////////////////////////////////////////////

    function mapboxComp () {

    AFRAME.registerComponent('mapbox-terrain', {
    	schema: {
    		latitude: {
    			type: 'number',
    			default: 0,
    		},
    		longitude: {
    			type: 'number',
    			default: 0,
    		},
    		'zoom-level': {	// http://wiki.openstreetmap.org/wiki/Zoom_levels
    			type: 'number',
    			default: 0,
    		},
    		type:  { // https://www.mapbox.com/api-documentation/#maps
    			type: 'string',
    			default: 'satellite',
    		},
    		shape:  { 
    			oneOf: ['square', 'circle'],
    			default: 'square',
    		},
    		rows: {
    			type: 'number',
    			default: 3
    		},
    		innerrow: {
    			type: 'number',
    			default: 0
    		},
    		highdpi: {
    			type: 'boolean',
    			default: true
    		},
    		heightmap: {
    			type: 'boolean',
    			default: false
    		},
    		heightmapscale: {
    			type: 'number',
    			default: 1
    		},
    		offsetx: {
    			type: 'number',
    			default: 0
    		},
    		offsety: {
    			type: 'number',
    			default: 0
    		},
    	},

    	update: function() {
    		if(this.el.object3DMap['mapmesh'] !== undefined) {
    			this.el.removeObject3D('mapmesh');
    		}
    		this._createMapBox();
    	},

    	_createMapBox: function() {
    		var self = this;
    		// https://www.mapbox.com/studio/account/tokens/
    		var access_token = CONFIG.mapboxAcessToken;

    		var mapLatitude = this.data.latitude;
    		var mapLongitude = this.data.longitude;
    		var mapZoomLevel = this.data['zoom-level'];
    		var tileX = this._long2tile(mapLongitude, mapZoomLevel) + this.data.offsetx;
    		var tileY = this._lat2tile(mapLatitude, mapZoomLevel) + this.data.offsety;

    		var tilesPerRow = self.data.shape == 'circle' ? 1 : this.data.rows;
    		var innerRow = this.data.innerrow;
    		var highDpi = this.data.highdpi;

    		var leftX = (tilesPerRow % 2) ? parseInt((tilesPerRow-1)/2) : parseInt((tilesPerRow)/2);
    		var rightX = (tilesPerRow % 2) ? parseInt((tilesPerRow-1)/2) : parseInt((tilesPerRow)/2 - 1);
    		var innerLeftX = (innerRow % 2) ? parseInt((innerRow-1)/2) : parseInt((innerRow)/2);
    		var innerRightX = (innerRow % 2) ? parseInt((innerRow-1)/2) : parseInt((innerRow)/2 - 1);

    		var geo = self.data.shape == 'circle' ? self._buildCircularGeometry() : self._buildPlaneGeometry();

    		for (var dx = -leftX; dx<=rightX; dx++) {
    			for (var dy = -leftX; dy<=rightX; dy++) {
    					if (dy >= -innerLeftX && dy <= innerRightX && dx >= -innerLeftX && dx <= innerRightX) {
    					continue;
    				}
    				this._callbackClosureDebug(dx, dy, 0, function (dx, dy) {
    					// console.log("_callbackClosureDebug callback");

    					var texture = self._buildTerrainTexture(tileX+dx, tileY+dy, highDpi, function(image) {
    						if (CONFIG.DEBUG) {console.log('texture loaded');}
    					});

    					
    					var mat = new THREE.MeshPhongMaterial({ map: texture });
    					if (self.data.heightmap) {
    						geo = self._buildElevationPlaneGeometry(tileX+dx, tileY+dy);
    					}
    					var mesh = new THREE.Mesh(geo, mat);
    					mesh.translateX(dx);//, 0, dy);
    					mesh.translateZ(dy);
    					mesh.matrixAutoUpdate = false;
    					mesh.updateMatrix();
    					
    					
    					var group = self.el.getObject3D('mapmesh') || new THREE.Group();
    					group.add(mesh);
    					self.el.setObject3D('mapmesh', group);
    				})();
    			}
    		}
    	},

    	_callbackClosureDebug: function(dx, dy, ctr, callback) {
    		return function() {
    			return callback(dx, dy, ctr);
    		}
    	},

    	// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
    	_long2tile: function(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); },

    	_lat2tile: function(lat,zoom) { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); },

    	_buildTerrainTexture: function(tileX, tileY, highDpi, cb) {
    		var dpi = highDpi ? '@2x' : '';
    		var restURL = `https://api.mapbox.com/v4/mapbox.${this.data.type}/${this.data['zoom-level']}/${tileX}/${tileY}${dpi}.png?access_token=${CONFIG.mapboxAcessToken}`;
    		
    		var texture = new THREE.TextureLoader()
    		.load(
    			restURL,
    			cb
    		);
    		return texture;
    	},

    	_buildTerrainMesh: function(texture, geo) {
    		var mat = new THREE.MeshPhongMaterial({ map: texture });
    		var mesh = new THREE.Mesh(geo, mat);
    		return mesh;
    	},

    	_buildPlaneGeometry: function(tileX, tileY){
    		// console.log("_buildPlaneGeometry");
    		var geometry	= new THREE.PlaneBufferGeometry( 1, 1, 512-1, 512-1 );
    		geometry.rotateX(2 * Math.PI * -90 / 360);
    		return geometry;
    	},
    	_buildCircularGeometry: function(tileX, tileY){
    		// console.log("_buildCircularGeometry");
    		var geometry	= new THREE.CircleBufferGeometry( 0.5, 100 );
    		geometry.rotateX(2 * Math.PI * -90 / 360);
    		return geometry;
    	},

    	_buildElevationPlane: function(tileX, tileY, highDpi, callback) {
    		// console.log(`_buildElevationPlaneGeometry(${tileX}, ${tileY})`);
    		// https://blog.mapbox.com/global-elevation-data-6689f1d0ba65
    		var dpi = highDpi ? '@2x' : '';
    		var restURL = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${this.data['zoom-level']}/${tileX}/${tileY}${dpi}.pngraw?access_token=${CONFIG.mapboxAcessToken}`;

    		this._loadImage(restURL, function (image) {
    			// console.log(`_loadImage(${restURL})`);
    			callback(image);
    		});
    	},

    	_loadImage: function(imageURL, onLoad) {
    		var request = new XMLHttpRequest();
    		request.addEventListener('load', function() {
    			// console.log(`${imageURL} loaded`);
    			var fileReader = new FileReader();
    			fileReader.addEventListener('loadend', function(){
    				// console.log(fileReader);
    				var dataUrl = fileReader.result;
    				// console.log(`${imageURL} loaded`);
    				var image = document.createElement('img');
    				image.src = dataUrl;
    				image.addEventListener('load', function(){			
    					// console.log(`${dataUrl} image loaded`);
    					onLoad(image);
    				}, {once: true});
    			}, {once: true});
    			fileReader.readAsDataURL(request.response);
    		}, {once: true});
    		request.open('GET', imageURL);
    		request.responseType = 'blob';
    		request.send();
    	},

    	_drawTile: function(tileX, tileY, dx, dy, meshOffset) {
    		// console.log(`_drawTile(${tileX}, ${tileY}, ${dx}, ${dy}, ${meshOffset})`);
    		// var geometry = this._buildElevationPlaneGeometry(tileX + dx, tileY + dy);
    		var geometry = this._buildPlaneGeometry(tileX + dx, tileY + dy);

    		geometry.rotateX(-Math.PI / 2);
    		geometry.scale(4,4,4);
    		geometry.translate(meshOffset*dx, 0, meshOffset*dy);
    		return geometry;
    	},

    	_buildElevationPlaneGeometry: function(tileX, tileY){
    		// console.log(`_buildElevationPlaneGeometry(${tileX}, ${tileY})`);
    		// https://blog.mapbox.com/global-elevation-data-6689f1d0ba65
    		var restURL = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${this.data['zoom-level']}/${tileX}/${tileY}@2x.pngraw?access_token=${CONFIG.mapboxAcessToken}`;
    		// debugger
    		var geometry	= new THREE.PlaneBufferGeometry( 1, 1, 512-1, 512-1 );
    		this._loadImage(restURL, function(image){
    			
    			var canvas = document.createElement('canvas');
    			canvas.width = 512;
    			canvas.height = 512;
    			var context = canvas.getContext('2d');
    			context.drawImage(image, 0, 0);
    			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    			var elevationArray = imageData.data;
    			
    			var positions = geometry.attributes.position.array;
    			for(var y = 0; y < canvas.height; y++ ){
    				for(var x = 0; x < canvas.width; x++ ){
    					var offset2 = (y*canvas.width + x)*4;
    					var height = -10000 + (elevationArray[offset2+0] *256*256 + elevationArray[offset2+1]*256 + elevationArray[offset2+2]) * 0.1;

    					height /= 10000;
    					height /= 3;

    					var offsetPosition = (y*canvas.width + x)*3;
    					positions[offsetPosition+2] = height;
    				}
    			}
    			geometry.attributes.position.needsUpdate = true;
    			geometry.computeVertexNormals();
    			geometry.rotateX(2 * Math.PI * -90 / 360);
    		});

    		return geometry
    	}
    });


    AFRAME.registerPrimitive('a-mapbox-terrain', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    	defaultComponents: {
    		'mapbox-terrain': {},
    	},
    	mappings: {
    		'latitude': 'mapbox-terrain.latitude',
    		'longitude': 'mapbox-terrain.longitude',
    		'zoom-level': 'mapbox-terrain.zoom-level',
    		'rows': 'mapbox-terrain.rows',
    		'innerrow': 'mapbox-terrain.innerrow',
    		'highdpi': 'mapbox-terrain.highdpi',
    		'heightmap': 'mapbox-terrain.heightmap',
    		'heightmapscale': 'mapbox-terrain.heightmapscale',
    		'offsetx': 'mapbox-terrain.offsetx',
    		'offsety': 'mapbox-terrain.offsety',
    		'type': 'mapbox-terrain.type',
    		'shape': 'mapbox-terrain.shape',
    	}
    }));

    }

    function searchingComp () {

    AFRAME.registerSystem('searching', {
        schema: {}, 

        init: function () {
        },
      
      });

    AFRAME.registerComponent('searching', {

        schema: {
            id: { type: 'string', default: '' },

            radius: { type: 'number', default: 1 },
            tube: { type: 'number', default: 0.1 },
            color:  { default: '#2ac1de' },

            altcolor: { default: '#f93' },

            arc: { type: 'number', default: 2*Math.PI }, //radians

            animate: { type: 'boolean', default: true},
        },

        init() {
            var self = this;
            var data = self.data;

            var geometry = new THREE.TorusBufferGeometry( data.radius, data.tube, 16, 64, data.arc );
            var material = new THREE.MeshBasicMaterial( { color: data.color,
                opacity: 0.7,
                transparent: true
            } );
            var torus = new THREE.Mesh( geometry, material );
            this.el.object3D.add( torus );

            var geoIndicator = new THREE.TorusBufferGeometry( data.radius, 1.1*data.tube, 16, 64, Math.PI/16 );
            var matIndicator = new THREE.MeshBasicMaterial( { color: data.altcolor } );
            var indicator = new THREE.Mesh( geoIndicator, matIndicator );
            this.el.object3D.add( indicator );

            var textEl = document.createElement('a-entity');
            textEl.setAttribute('text-cell', { id: 'searchingtext', text: 'Searching',
                    width: 2*data.radius,
                    height: 0.3,});
            self.el.appendChild(textEl);

            if (data.animate) {
                AFRAME.ANIME({
                    targets: self.el.object3D.rotation,
                    easing: 'linear',
                    z: [0, 2*Math.PI],
                    duration: 1000*(1),
                    loop: true,
                    easing: 'cubicBezier(.5, .05, .1, .3)',
                });
            }
        },

    });

    AFRAME.registerPrimitive('a-searching', {
    	defaultComponents: {
    		'searching': {},
    	},
    	mappings: {
            'id': 'searching.id',
            'radius': 'searching.radius',
            'tube': 'searching.tube',
            'color': 'searching.color',
            'arc': 'searching.arc',
            'animate': 'searching.animate',
    	}
    });

    }

    function sunSkyPositionComp () {

    AFRAME.registerComponent('sun-sky-position', {
        schema: {
            starttime: {type: 'number', default: 10},
            updaterate: {type: 'number', default: 1},
            duration: {type: 'number', default: 1},
        },

        init: function () {
            this.clocktime = this.data.starttime;
            this.lastUpdate = 0;
            this.animating = false;
            this.updateSunPosition();
        },

        update: function (oldData) {
            var self = this;

            if (this.data.starttime != oldData.starttime) {
                this.animateSun(self.clocktime, self.data.starttime);
            }
        },

        tick: function (time, timeDelta) {
            if (this.animating) {
                this.updateSunPosition();
                return;
            }

            var updateInterval = 1000 * (60) / this.data.updaterate;
            if (time - this.lastUpdate >= updateInterval) {
                var newTime = this.clocktime + TimeUtils.millisecondsToHours(updateInterval);

                this.clocktime = newTime;
                this.lastUpdate = time;

                this.updateSunPosition();
            }
        },

        timeToSkyPos: function(time) {
            var hoursToRad = 2 * Math.PI / 24;
            // subtract Pi/2 so noon is Pi/2
            var theta = hoursToRad * time - (Math.PI/2);
            var y = Math.sin(theta);
            var z = Math.cos(theta);
            var pos = new THREE.Vector3( 0, y, z );
        
            return pos;
        },

        updateSunPosition: function() {
            var sunPositon = this.timeToSkyPos(this.clocktime);
            this.el.setAttribute('material', 'sunPosition', sunPositon);
        },

        async animateSun(oldtime, newtime) {
            var self = this;

            if (this.sunAnimationPromise) {
                await this.sunAnimationPromise;
            }
            var promise = new Promise((resolve, reject) => {
                try {
                    AFRAME.ANIME({
                        targets: self,
                        easing: 'linear',
                        clocktime: [oldtime, newtime],
                        duration: self.data.duration*1000,
                        begin: function(anim) {
                            self.animating = true;
                        },
                        complete: function(anim) {
                            self.animating = false;
                            self.clocktime = self.data.starttime;
                            self.lastUpdate = 0;
                            resolve();
                        },
                    });
                }
                catch (error) {
                    console.error('animateSun error');
                    console.log(error);
                    reject(error);
                }
            });
            this.sunAnimationPromise = promise;
            return promise;
        },
     
    });

    }

    function textLinkComp () {

    AFRAME.registerComponent('text-link', {
        dependencies: ['text'],

        schema: {
          hover: { type: 'boolean', default: false },
          active: { type: 'boolean', default: false },
          color: { default: 0xe8f1ff },
          hoverColor: { default: 0x04FF5F },
          activeColor: { default: 0xFFD704 },
          disabledColor: { default: 0xA9A9A9 },
        },
      
        init() {
            var self = this;
            var textAttribute = self.el.getAttribute('text');
            self.originalColor = textAttribute.color;

            this.el.addEventListener("click", evt => {
                if (self.intersectingRaycaster) {
                    var clickEvent = new Event('textclicked', {bubbles: true});
                    self.el.dispatchEvent(clickEvent);
                }
            });
            this.el.addEventListener("raycaster-intersected", evt => {
                self.intersectingRaycaster = evt.detail.el.components.raycaster;
                // console.log("raycaster-intersected");
            });
            this.el.addEventListener("raycaster-intersected-cleared", evt => {
                // console.log('raycaster-intersected-cleared');
                if (self.justHighlighted) {
                    self.justHighlighted = false;
                    return;
                }
                if (self.intersectingRaycaster != null) {
                    const intersection = self.intersectingRaycaster.getIntersection(self.el);
                    if (intersection == undefined) {
                        // console.log('intersection == undefined');
                        self.intersectingRaycaster = null;
                    }
                }
                
                if(self.data.hover) {
                    self.el.setAttribute('text-link', {'hover': false});
                }
            });
        
            this.el.addEventListener("mousedown", evt => {
                self.el.setAttribute('text-link', {'active': true});
            });
            this.el.addEventListener("mouseup", evt => {
                self.el.setAttribute('text-link', {'active': false});
            });
        },
      
        update: function(oldData) {
            var self = this;
            var data = self.data;
            var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
            if (['hover', 'active'].some(prop => changedData.includes(prop))) {
                var color = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;
                self.el.setAttribute('text', {'color': color});
            }
        },
      
        tick: function() {
          var self = this;
          if (!this.intersectingRaycaster) {
              return;
          }
      
          const intersection = this.intersectingRaycaster.getIntersection(this.el);
          self.intersection = intersection;
          if (intersection) {
              switch (intersection.object.name) {
                  default:
                      if(!self.data.hover) {
                        self.el.setAttribute('text-link', {'hover': true});
                      }
                      break;
              }
          }
        },
      });
    }

    // import CelShader from '../../shaders/CelShader';

    function woodenFloorComp () {

    AFRAME.registerComponent('wooden-floor', {
        schema: {
          uiScale: { type: 'number', default: 0.4},
          angle: { type: 'number', default: 0},
          radius: { type: 'number', default: 10},
          height: { type: 'number', default: 1},
          radialsegments: { type: 'number', default: 36 },
          rotaion: { type: 'number', default: Math.PI / 2 }, //rads
          x: { type: 'number', default: 0},
          y: { type: 'number', default: 0},
          z: { type: 'number', default: 0},
          repeatU: { type: 'number', default: 10},
          repeatV: { type: 'number', default: 40},
          reflectivity: { type: 'number', default: 0.5 },
          withBump: { type: 'boolean', default: false },
          withNormal: { type: 'boolean', default: false },
          quality: { default: 'l' },
          shading: { default: 'default' },
          helper: { default: false }
        },

        update: function() {
            if (this.el.object3DMap.hasOwnProperty('mesh')) {
                this.el.removeObject3D('mesh');
            }
            this._createWoodenFloor();
        },

        _createWoodenFloor: function() {
            if (CONFIG.DEBUG) {console.log("_createWoodenFloor");}
            var self = this;
           
            self._buildMaterial()
            .then((material) => {
                var floorGeometry = new THREE.CircleBufferGeometry(self.data.radius, self.data.radialsegments);
                floorGeometry.rotateX(-Math.PI / 2);
                
                var floor = new THREE.Mesh(floorGeometry, material);
        
                floor.position.set(this.data.x, this.data.y, this.data.z);
        
                // var mesh = self.el.getObject3D('mesh') || new THREE.Group();
                //if (this.data.helper) {mesh.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
                // mesh.add(floor);
                self.el.setObject3D('mesh', floor);
            });
        },

        _buildMaterial: function() {
            var self = this;
            return new Promise((resolve, reject) => {
                // if (self.data.shading == 'cel') {
                //     var material = new CelShader(0xA0522D);
                //     resolve(material);
                // }

                var tlHelper = new TextureLoaderHelper();

                var baseTexture = tlHelper.loadTexture( 'wood', 'base', self.data.quality, 'jpg',
                    // onLoad
                    function (texture) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.offset.set( 0, 0 );
                        texture.repeat.set( self.data.repeatU, self.data.repeatV );

                        var floorMaterial = new THREE.MeshPhongMaterial( { map: baseTexture,
                            side:THREE.DoubleSide,
                            // reflectivity: self.data.reflectivity,
                            // color: 0x552811,
                            specular: 0x222222,
                            shininess: 25,
                        } );
            
                        if (self.data.withBump) {
                            var bumpTexture = tlHelper.loadTexture( 'wood-panel', 'height', self.data.quality, 'jpg',
                                function (texture) {
                                    floorMaterial.bumpMap = texture;
                                    floorMaterial.bumpScale = 1;
                                }
                            );
                            
                        }
                        if (self.data.withNormal) {
                            var normalTexture = tlHelper.loadTexture( 'wood-panel', 'normal', self.data.quality, 'jpg',
                                function (texture) {
                                    floorMaterial.normalMap = texture;
                                } );
                        }
            
                        resolve(floorMaterial);
                    },
                    // onProgress
                    function (xhr) {
                        // console.log(xhr);
                    },
                    // onError
                    function (error) {
                        console.log('failed to load texture');
                        // var material = new CelShader(0xA0522D);
                        // resolve(material);
                    }
                );
            });
        }
    });

    AFRAME.registerPrimitive( 'a-wooden-floor', {
        defaultComponents: {
            'wooden-floor': { },
        },
        mappings: {
            'radius': 'wooden-floor.radius',
            'x': 'wooden-floor.x',
            'y': 'wooden-floor.y',
            'z': 'wooden-floor.z',
            'bump': 'wooden-floor.withBump',
            'normal': 'wooden-floor.withNormal',
            'quality': 'wooden.quality',
            'radialsegments': 'wooden-floor.radialsegments',
            'shading': 'wooden-floor.shading',
        }
    });

    }

    // import hubComps from './hubs/index.js';

    var comps = {
        arrowComp,
        clickableComp,
        dioramaComp,
        fadeComp,
        flexComp,
        globePointsComp,
        highlightComp,
        lsCellComp,
        mapboxComp,
        mediaCellComp,
        searchingComp,
        sunSkyPositionComp,
        textCellComp,
        textLinkComp,
        woodenFloorComp
    };

    var registerAframeComponents = function() {
        Object.keys(comps).forEach(function(k, i) {
            comps[k]();
        });
        // Object.keys(hubComps).forEach(function(k, i) {
        //     hubComps[k]();
        // });
    };

    // import WebFont from 'webfontloader';

    function setupFontAwesome () {
    document.addEventListener('font-awesome-system-initialized', (evt) => {
        var scene = evt.detail.scene;
        var behavior = {
          el: scene,
          get tick() {
            return function() {
              scene.systems['font-awesome'].setVersion(CONFIG.FontAwesomeVersion);
              LoadWebFonts();
              scene.removeBehavior(this);
            }
          }
        };
        scene.addBehavior(behavior);
    });

    function LoadWebFonts() {
      var WebFontConfig = {
        custom: {
          families: ['FontAwesome', '"Font Awesome 5 Pro"',
          '"Font Awesome 5 Free"', '"Font Awesome 5 Brands"']
        }
      };
      window.WebFont.load(WebFontConfig);
    }

    }

    var mappings = {
        mappings: {
            default: {
                common: {
                    trackpaddown: 'teleportstart',
                    trackpadup: 'teleportend',
                    // triggerdown: 'teleportstart',
                    // triggerup: 'teleportend'
                },
                'daydream-controls': {
                    trackpaddown: 'teleportstart',
                    trackpadup: 'teleportend'
                },
                'vive-controls': {
                    'trackpad.down': 'teleportstart',
                    'trackpad.up': 'teleportend'
                },
                'oculus-touch-controls': {
                    // triggerdown: 'teleportstart',
                    // triggerup: 'teleportend',
                    'bbuttonup': 'cyclehud',
                    'abuttonup': 'cyclehud',
                },
                'windows-motion-controls': {
                    'grip.down': 'teleportstart',
                    'grip.up': 'teleportend',
                    'menu.up': 'cyclehud'
                },
                "gearvr-controls": {
                    trackpaddown: "teleportstart",
                    trackpadup: "teleportend"
                },
                "oculus-go-controls": {
                    trackpaddown: "teleportstart",
                    trackpadup: "teleportend"
                }
            }
        }
    };

     // To be exposed by the application
     var inputActions = {
         default: {
          teleportstart: { label: 'Start teleport' },
          teleportend: { label: 'End teleport' }
         }
      };

    function registerAframeInput () {
        AFRAME.registerInputActions(inputActions, 'default');
        AFRAME.registerInputMappings(mappings);
    }

    exports.AppTypeEnum = AppTypeEnum;
    exports.XRApp = __vue_component__$f;
    exports.registerAframeComponents = registerAframeComponents;
    exports.registerAframeInput = registerAframeInput;
    exports.setupFontAwesome = setupFontAwesome;
    exports.xrModule = xrModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
