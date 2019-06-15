import textureLoaderHelper from '../../util/textureLoaderHelper.js';

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
    },

    multiple: true,
  
    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty(self.id)) {
            self.el.removeObject3D(self.id);
        }
        self._createRail(); 
    },

    _createRail() {
        this._createDioramaColumn();
        this._createDioramaSphere();
        this._createDioramaBase();
        this._createDioramaBase('top');
        this._createDioramaTrim('front');
        this._createDioramaTrim('back');
        this._createDioramaTrim('front', 'top');
        this._createDioramaTrim('back', 'top');
        this._createDioramaGlass();
    },

    _buildMaterial(type, quality='l', withBump=false, withNormal=false, repeatU=1, repeatV=1) {
        var material, baseTexture, bumpTexture, nomralTexture;
        var tlHelper = new textureLoaderHelper();
    
        baseTexture = tlHelper.loadTexture( type, 'base', quality, 'jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( repeatU, repeatV );
        });
        
        // Material
        material = new THREE.MeshPhongMaterial( { map: baseTexture,
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
        return material;
    },

    _buildGeometry(type, data) {
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
            case 'base':
            case 'trim':
            case 'glass':
                width = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                if (type == 'glass') { height = data.railheight - (2*data.baseheight); depth = data.basedepth - 0.01; }
                else if (type == 'base') { height = data.baseheight; depth = data.basedepth; }
                else if (type == 'trim') { height = data.trimheight; depth = 0.01;}
            
                var shape = new THREE.Shape();
            
                shape.moveTo( -width/2, -height/2 );
                shape.lineTo( -width/2, height/2 );
                shape.lineTo( width/2, height/2 );
                shape.lineTo( width/2, -height/2 );
                shape.lineTo( -width/2, -height/2 );
            
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
     
                geom.translate(x + (width/2),
                            y + height/2,
                            z - depth/2);
                break;
            default:
                break;
        }
        return geom;
    },

    _createDioramaColumn() {
        var self = this;
        var material, geom, mesh;
        var data = self.data;
    
        material = self._buildMaterial('bronze', data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV);
        geom = self._buildGeometry('column', data);
        mesh = new THREE.Mesh(geom, material);
    
        var group = self.el.getObject3D(self.id) || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D(self.id, group); 
    },

    _createDioramaSphere() {
        var self = this;
        var material, geom, mesh;
        var data = self.data;
    
        material = self._buildMaterial('bronze', data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV);
        geom = self._buildGeometry('sphere', data);
        mesh = new THREE.Mesh(geom, material);
    
        var group = self.el.getObject3D(self.id) || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D(self.id, group); 
    },

    _createDioramaBase(pos='') {
        var self = this;
        var material, geom, mesh;
        var data = self.data;
        data.pos = pos;
    
        material = self._buildMaterial('wood-panel', data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV);
        geom = self._buildGeometry('base', data);
        mesh = new THREE.Mesh(geom, material);
    
        var group = self.el.getObject3D(self.id) || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D(self.id, group); 
    },

    _createDioramaTrim(side='front', pos='') {
        var self = this;
        var material, geom, mesh;
        var data = self.data;
        data.side = side;
        data.pos = pos;
    
        material = self._buildMaterial('bronze', data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV);
        geom = self._buildGeometry('trim', data);
        mesh = new THREE.Mesh(geom, material);
    
        var group = self.el.getObject3D(self.id) || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D(self.id, group); 
    },

    _createDioramaGlass() {
        var self = this;
        var material, geom, mesh;
        var data = self.data;
    
        material = new THREE.MeshPhysicalMaterial( 
            {
                color: self.data.color,
                metalness: self.data.metalness,
                reflectivity: self.data.reflectivity,
                roughness: self.data.roughness,
                opacity: self.data.opacity,
                side: THREE.DoubleSide,
                transparent: true,
                envMapIntensity: 5,
                premultipliedAlpha: true,
        });
    
        geom = self._buildGeometry('glass', data);
        mesh = new THREE.Mesh(geom, material);
    
        var group = self.el.getObject3D(self.id) || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D(self.id, group); 
    }

});


AFRAME.registerPrimitive( 'a-rail', {
    defaultComponents: {
        'diorama-rail__rail': { 
            'railheight': 1.2
        },

    },
    mappings: {
        'radius': 'diorama-rail.floorradius',
        'bump': 'diorama-rail.withBump',
        'normal': 'diorama-rail.withNormal',
        'quality': 'diorama-rail.quality'
    }
});

