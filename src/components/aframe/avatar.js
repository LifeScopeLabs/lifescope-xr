import ModifiedGLTFLoader from '../../util/loaders/ModifiedGLTFLoader.js';


export default function () {

    AFRAME.registerSystem('avatar', {
        schema: {}, 
    
        init: function () {
            this.baseURI = 'https://s3.amazonaws.com/lifescope-static/static/xr/avatars/';
            this.cache = new Map();
        },

        loadAvatar: function(model, colorArray) {
            var self = this;
            return new Promise((resolve, reject) => {
                var manager = THREE.DefaultLoadingManager;

                var loader = new ModifiedGLTFLoader(manager);
                var cachePath = self.avatarURL(model, colorArray);
                loader.setCachePath(cachePath);
                loader.setColorArray(colorArray);

                loader.load(`${self.baseURI}${model}/scene.gltf` ,
                    function(gltf) {
                        self.cache.set(cachePath, gltf);
                        resolve(gltf);
                    },
                    function() { console.log("onProgress") },
                    function(e) {
                        console.log("onError");
                        console.log(e);
                        reject();
                    },
                );
            });
        },

        getGLTF(model, colorArray) {
            var self = this;
            return new Promise((resolve, reject) => {
                var cachePath = self.avatarURL(model, colorArray);
                if (self.cache.has(cachePath)) {
                    resolve(self.cache.get(cachePath));
                }
                self.loadAvatar(model, colorArray)
                .then( (gltf) => {
                    resolve(gltf);
                });

            });
        },

        avatarURL(model, colorArray) {
            var colorString = 'r' + colorArray[0] + '-g' + colorArray[1] + '-b' + colorArray[2] + '-a';
            return model + '-' + colorString + '/scene.gltf';
        }


      
      });
    
    AFRAME.registerComponent('avatar', {
    
        schema: {
            id: { type: 'string', default: '' },
            model: { type: 'string', default: 'head_female_-_low_poly' },
            color: { type: 'array', default: [0.165, 0.757, 0.871, 1] },
        },

        init() {
            this.model = null;
        },
        update(oldData) {
            this.remove();
            this.createAvatar();
        },

        remove: function () {
            if (!this.model) { return; }
            this.el.removeObject3D('avatar');
        },

        createAvatar() {
            var self = this;
            this.system.getGLTF(this.data.model, this.data.color)
            .then( (gltf) => {
                self.model = gltf.scene || gltf.scenes[0];
                self.model.animations = gltf.animations;
                this.el.setObject3D('avatar', self.model);
            });
        }

    });

    AFRAME.registerPrimitive( 'a-avatar', {
        defaultComponents: {
            'avatar': {
            },
        },
        mappings: {
            'model': 'avatar.model',
            'color': 'avatar.color',
        }
    });
}    