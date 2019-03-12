import textureLoaderHelper from '../../util/textureLoaderHelper.js';

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
      withBump: { default: false },
      withNormal: { default: false },
      helper: { default: false }
    },
  
    init: function () {

        var self = this;
        var tlHelper = new textureLoaderHelper();
        const baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/WoodenFloor/wood_';

        var baseTexture = tlHelper.getOrLoadTexture( 'wood', 'base', 'jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( self.data.repeatU, self.data.repeatV );
        });
        
        var floorMaterial = new THREE.MeshPhongMaterial( { map: baseTexture,
            side:THREE.DoubleSide,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            } );
        var floorGeometry = new THREE.CircleBufferGeometry(self.data.radius, self.data.radialsegments);

        if (self.data.withBump) {
            var bumpTexture = tlHelper.getOrLoadTexture( 'wood-panel', 'height' );
            material.bumpMap = bumpTexture;
            material.bumpScale = 1;
        }
        if (self.data.withNormal) {
            var normalTexture = tlHelper.getOrLoadTexture( 'wood-panel', 'normal' );
            material.normalMap = normalTexture;
        }
            
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        // floor.rotation.z = Math.PI / 2;
        floor.rotation.z = 1 * Math.PI / 36;

        floor.position.set(this.data.x, this.data.y, this.data.z);

        var group = self.el.getObject3D('group') || new THREE.Group();
        //if (this.data.helper) {group.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
        group.add(floor);
        self.el.setObject3D('group', group);
        
    }
});

AFRAME.registerPrimitive( 'a-wooden-floor', {
    defaultComponents: {
        'wooden-floor': { },
    },
    mappings: {
        'radius': 'wooden-floor.radius',
        'x': 'envmap-sphere.x',
        'y': 'envmap-sphere.y',
        'z': 'envmap-sphere.z',
    }
});