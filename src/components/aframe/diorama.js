import TextureLoaderHelper from '../../util/TextureLoaderHelper.js';
import GradientShader from '../../shaders/GradientShader';
import CelShader from '../../shaders/CelShader';

var materialColors =  new Map([
    ['brass', 0xDAA520],
    ['bronze', 0xDAA520],
    ['wood', 0xA0522D],
    ['wood-panel', 0xA0522D],
    ['glass', 0xC0C0C0],
])

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

        if (shading=='cel') {
            var material = new CelShader(materialColors.get(type), props);
            resolve(material);
        }

        if (type=='gradient') {
            var material = new GradientShader(0xACB6E5, 0x74ebd5);
            resolve(material);
        }
        
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
            geom.translate(x + data.offset.x, y + data.offset.y, z + data.offset.z)
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
        default:
            break;
    }
    return geom;
}


function _buildMediaMesh(url, type, imagewidth, imageheight, depth, offset, srcFit, aspectratio=0) {
    return new Promise((resolveMesh, rejectMesh) => {
        var mediaMaterial, colorMaterial, geom, mesh;

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
                    // console.log(xhr);
                },
                // onError
                function (xhr) {
                    if (CONFIG.DEBUG) {console.log(`failed to load ${url}`)}
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
                geomWidth = imagewidth;
                geomHeight = imagewidth / aspectRatio;
                if (geomHeight > imageheight) {
                    geomHeight = imageheight;
                    geomWidth = imageheight * aspectRatio;
                }
            }
            else if (srcFit == 'width') {
                geomWidth = imagewidth;
                geomHeight = imagewidth / aspectRatio;
            }
            else {
                geomWidth = imageheight * aspectRatio;
                geomHeight = imageheight;
            }
            
            geom = new THREE.BoxBufferGeometry(geomWidth, geomHeight, depth );
            geom.rotateX(2 * Math.PI * offset.rotx / 360);
            geom.translate(offset.x, offset.y, offset.z);

            mediaMaterial = new THREE.MeshBasicMaterial( { map: texture } );
            mediaMaterial.name = type == 'video' ? 'mVideo' : "mImage";
            colorMaterial = new THREE.MeshBasicMaterial( {color: new THREE.Color( 0xffffff )} );
            colorMaterial.name = "mColor";

            var materials = [
                colorMaterial,        // Left side
                colorMaterial,       // Right side
                colorMaterial,         // Top side
                colorMaterial,      // Bottom side
                colorMaterial,       // Front side
                mediaMaterial         // Back side
            ];
            mesh = new THREE.Mesh(geom, materials);
            mesh.name = type == 'video' ? 'video' : "image";
            resolveMesh(mesh);
        })
        .catch(function(error) {
            console.error(error);
            rejectMesh(error);
        });
    });
}


function _createMedia(offset = { x: 0, y: 0, z: 0, rotx: 0 }) {
    var self = this;
    var data = self.data;

    var Type = data.type.charAt(0).toUpperCase() + data.type.slice(1);

    _buildMediaMesh(data.imageURL, data.type, data.imagewidth, data.imageheight, data.depth, offset, data.srcFit,
        data.aspectratio)
    .then( (mesh) => {
        self.media = mesh.material.find(function(mat) {
            return mat.name == 'm' + Type;
        }).map.image;
        
        switch (data.type) {
            case 'video':
                self.video = self.media;
                self._setVideoProgressListener()
                break;
            case 'image':
                self.image = self.media;
                break;
            default:
                break;
        }

        self._updateAspectRatio();
        var group = self.el.getObject3D(data.type) || new THREE.Group();
        group.add(mesh);
        group.name = 'g' + Type;
        self.el.setObject3D(data.type, group);
        if (data.animateLoad) {
            AFRAME.ANIME({
                targets: group.scale,
                easing: 'linear',
                x: [0, 1],
                y: [0, 1],
                z: [0, 1],
                duration: 1000*(0.5)
            });
        }
    })
    .catch(function(error) {
        console.log('_createMedia error')
        console.error(error);
    });
}

function _updateAspectRatio() {
    var self = this;
    var data = self.data
    var media = self.media;
    var srcWidth = media.videoWidth || media.width;
    var srcHeight = media.videoHeight || media.height;
    var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);
    if (!data.aspectratio || data.aspectratio != aspectRatio) {
        self.el.setAttribute('aspectratio', aspectRatio);
    }
    var geomWidth, geomHeight;
    if (data.srcFit == 'width') {
        geomHeight = data.imagewidth / aspectRatio;
        if (data.imageheight != geomHeight) {
            self.el.setAttribute('height', geomHeight);
        }
    }
    else {
        geomWidth = data.imageheight * aspectRatio;
        if (data.imagewidth != geomWidth) {
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
                var offsety = data.baseheight / 2
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
                var offsety = data.baseheight / 2
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
        imageURL: {type: 'string', default: ''},
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
    },

    multiple: true,

    init: function() {
        var self = this;
        var data = self.data;

        this._createMedia = _createMedia.bind(this);
        this._updateAspectRatio = _updateAspectRatio.bind(this);

        self._createDiorama();

        if (self.data.imageURL != '' && 
            (self.data.type=="image" || self.data.type=="video")) {
            self._createMedia({ x: 0, y: data.railheight + 0.3, z: -.15, rotx: data.rotationx });
        }

        // if (self.data.imageURL != '' && self.data.type=="video") {
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
            ['imageURL', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
            .some(prop => changedData.includes(prop))) {
                
                if (self.el.object3DMap.hasOwnProperty('image')) {
                    self.el.removeObject3D('image');
                }
            if (self.data.imageURL != '' && self.data.type=="image") {
                self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx });
            }
        }

        if ( self.el.object3DMap.hasOwnProperty('video') &&
            ['imageURL', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
            .some(prop => changedData.includes(prop)) ) {
                // console.log('removing video');
            self.el.removeObject3D('video');
            if (self.data.imageURL != '' && self.data.type=="video") {
                self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx });
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
        'src': 'diorama-case__case.imageURL',
        'srcfit': 'diorama-case__case.srcFit',
        'railheight': 'diorama-case__case.railheight',
        'shading': 'diorama-case__case.shading',
        'type': 'diorama-case__case.type',
    }
});


AFRAME.registerComponent('diorama-grid-cell', {
    schema: {
        id: { type: 'string', default: '' },
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        scale: { type: 'number', default: 1 },
        // rotationx: { type: 'number', default: 30 }, // degrees

        type: { type: 'string', default: 'image' },

        imageURL: {type: 'string', default: ''},
        srcFit: { type: 'string', default: 'width' },

        imagewidth: { type: 'number', default: 0.6 },
        imageheight: { type: 'number', default: 0.6 },
        depth: { type: 'number', default: 0.01 },

        hoverPlayButton: { type: 'boolean', default: false },
        activePlayButton: { type: 'boolean', default: false },
        isplaying: { type: 'boolean', default: false },

        hoverSeeking: { type: 'boolean', default: false },
        activeSeeking: { type: 'boolean', default: false },

        color: { default: 0xe8f1ff}, //0xe8f1ff
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },

        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},

        selected: { type: 'boolean', default: false },
        hover: { type: 'boolean', default: false },
        active: { type: 'boolean', default: false },
        borderwidth: { type: 'number', default: 0.02 },
        aspectratio: { type: 'number', default: 0 },

        animateLoad: { type: 'boolean', default: true },

        disabled: { type: 'boolean', default: false },

    },
  
    multiple: true,

    init: function() {
        var self = this;

        self.originalHeight = self.data.imageheight;
        self.originalWidth = self.data.imagewidth;

        self.seekingPoint = null;

        this.el.addEventListener("click", evt => {
            if (self.intersectingRaycaster) {
                const intersection = self.intersectingRaycaster.getIntersection(self.el);
                if (intersection && ['video', 'image', 'border'].includes(intersection.object.name)) {
                    var clickEvent = new Event('cellclicked', {bubbles: true});
                    self.el.dispatchEvent(clickEvent);
                }
                else if (intersection && intersection.object.name == 'playPauseButton') {
                    self._playPauseHandler();
                }
                else if (intersection && ['videoseekingpoint', 'videoprogress', 'videolength', 'videolength'].includes(intersection.object.name) || intersection.object.name.startsWith('videobuffered')) {
                    self._videoSeekingHandler();
                }
            }
        });
        this.el.addEventListener("mousedown", evt => {
            if(!self.data.selected) {
                self._animateActive();
            }
            if (self.intersectingRaycaster != null) {
                 const intersection = this.intersectingRaycaster.getIntersection(this.el);
                 self.intersection = intersection;
                 if (intersection) {
                    switch (intersection.object.name) {
                        case 'image':
                        case 'video':
                            self.el.setAttribute('active', true);
                            break;
                        case 'videolength':
                        case 'videoprogress':
                        case 'videoseekingpoint':
                            self.el.setAttribute('activeseeking', true);
                            break;
                        case 'playPauseButton':
                            self.el.setAttribute('activeplaybutton', true);
                        default:
                            break;
                    }
                    if (intersection.object.name.startsWith('videobuffered')) {
                        self.el.setAttribute('activeseeking', true);
                    }
                }
            }
        });
        this.el.addEventListener("mouseup", evt => {
            self.el.setAttribute('active', false);
            self.el.setAttribute('activeSeeking', false);
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
                else {
                    // console.log('intersecting:')
                    // console.log(intersection.object.name);
                }
            }
            else {
                // console.log('self.intersectingRaycaster is null')
            }
            
            if(self.data.hover) {
                self.el.setAttribute('hover', false);
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

        if (self.data.imageURL != '' && self.data.type=="image") {
            self._createMedia();
        }

        if (self.data.imageURL != '' && self.data.type=="video") {
            self._createMedia();
            if (self.data.selected) {
                self._createVideoControls();
            }
        }

        if (self.data.hover || self.data.active) {
            self._createBorder();
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
            // console.log(intersection.object.name);
            switch (intersection.object.name) {
                case 'image':
                case 'video':
                    if(!self.data.hover) {
                        self.el.setAttribute('hover', true);
                        self.el.setAttribute('hoverplaybutton', false);
                    }
                    break;
                case 'playPauseButton':
                    if(!self.data.hoverPlayButton) {
                        self.el.setAttribute('hoverplaybutton', true);
                        self.el.setAttribute('hover', false);
                    }
                    break;
                case 'videolength':
                case 'videoprogress':
                    // debugger;
                    if (self.seekingPoint != intersection.point) {
                        self.seekingPoint = intersection.point;
                        self._updateSeeking(self.seekingPoint);
                    }
                    if (!self.data.hoverSeeking) {
                        self.el.setAttribute('hoverseeking', true);
                    }
                    break;
                default:
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
        // console.log(`update ${this.data.id}`)
        var self = this;
        var data = self.data;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
        // console.log(changedData);
        if ( changedData.includes('imageURL') ) {
            self.el.setAttribute('aspectratio', 0);
            self.el.setAttribute('height', self.originalHeight);
            self.el.setAttribute('width', self.originalWidth);
        }
        if ( self.el.object3DMap.hasOwnProperty('image') &&
            ['imageURL', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio']
            .some(prop => changedData.includes(prop))) {
                // console.log('removing image');
            self.el.removeObject3D('image');
            if (self.data.imageURL != '' && self.data.type=="image") {
                self._createMedia();
            }
        }
        if ( self.el.object3DMap.hasOwnProperty('video') &&
            ['imageURL', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio']
            .some(prop => changedData.includes(prop)) ) {
                // console.log('removing video');
            self.el.removeObject3D('video');
            if (self.data.imageURL != '' && self.data.type=="video") {
                self._createMedia();
            }
        }
        if (
            [ 'hover', 'active', 'imageURL', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio']
            .some(prop => changedData.includes(prop))
            ) {
                // console.log('updating border');
            if (this.el.object3DMap.hasOwnProperty('border') ) {
                // console.log('removing border');
                this.el.removeObject3D('border');
            }
            if (self.data.hover || self.data.active) {
                self._createBorder();
                if (!self.data.selected) {
                    self._animateHover();
                }
            }
        }
        if (
            [ 'selected', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio',]
            .some(prop => changedData.includes(prop))) {
                if (self.el.object3DMap.hasOwnProperty('videocontrols')) {
                    this.el.removeObject3D('videocontrols');
                }
                if (this.el.object3DMap.hasOwnProperty('progressbar')) {
                    this.el.removeObject3D('progressbar');
                }
            if (self.data.selected && self.data.type == 'video') {
                self._createVideoControls();
            }
        }
        if (
            [ 'hoverPlayButton', 'activePlayButton', 'selected', ] //'isplaying'
            .some(prop => changedData.includes(prop))) {
                // update button color
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
            if (self.data.selected && self.data.type == 'video') {
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
                    // console.log('removing ')
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

    _createBorder() {
        var self = this;
        var data = Object.assign({}, self.data);

        var geom, mat, mesh;

        data.offset = {
            x: 0 + data.x,
            y: 0 + data.y,
            z: 0.001 + data.z,
        }
    
        var geomWidth, geomHeight;
        geomWidth = data.imagewidth;
        geomHeight = data.imageheight;

        if (data.aspectratio) {
            if (data.srcFit == 'width') {
                geomHeight = data.imagewidth / data.aspectratio;
            }
            else {
                geomWidth = data.imageheight * data.aspectratio;
            }
        }
        
        geom = new THREE.PlaneBufferGeometry( geomWidth + data.borderwidth, geomHeight + data.borderwidth);
        geom.translate(data.offset.x, data.offset.y, data.offset.z);

        var color = data.active ? 0xFFD704 : data.hover ? 0x04FF5F : 0xe8f1ff;
        mat = new THREE.MeshBasicMaterial( {color: new THREE.Color( color ), side: THREE.DoubleSide} );
        mesh = new THREE.Mesh(geom, mat);
        mesh.name = 'border';

        var group = self.el.getObject3D('border') || new THREE.Group();
        group.add(mesh);
        group.name="gBorder";
        self.el.setObject3D('border', group);
    },

    _createProgressBar() {
        var self = this;
        var data = self.data;

        var progressBarY = -self.data.imageheight/2 - 0.05;

        var group = self.el.getObject3D('progressbar') || new THREE.Group();
        group.name = 'gProgressbar'

        var geomVideoLength = new THREE.CylinderGeometry( 0.01, 0.01, self.data.imagewidth, 64 );

        geomVideoLength.rotateZ(Math.PI/2);
        geomVideoLength.translate(0, progressBarY, 0);
        var matVideoLength = new THREE.MeshBasicMaterial( {color: 0xaeaeae} );
        var meshVideoLength = new THREE.Mesh( geomVideoLength, matVideoLength );
        meshVideoLength.name = 'videolength';
        
        group.add(meshVideoLength);
        self.el.setObject3D('progressbar', group);   
        self._updateProgressBar();
    },

    _updateProgressBar() {
        var self = this;
        var group = self.el.getObject3D('progressbar') || new THREE.Group();

        var progressText = `${Math.floor(self.video.currentTime)} / ${Math.floor(self.video.duration)}`;
        self.el.setAttribute('text__videoprogress', {value: progressText});

        var videoProgressObj = self.el.getObject3D('text__videoprogress');
        var progressBarY = -self.data.imageheight/2 - 0.05;
        videoProgressObj.rotation.set(0, Math.PI, 0);
        videoProgressObj.position.set(self.data.imagewidth/2, progressBarY - 0.1, 0);
        videoProgressObj.updateMatrix();

        if (this.el.object3DMap.hasOwnProperty('progressbar')) {
            var meshVideoProgress = group.children.find(function(obj) {
                return obj.name == 'videoprogress';
              });
            group.remove(meshVideoProgress);
            var bufferedMeshes = group.children.filter( obj => obj.name.startsWith('videobuffered'));
            if (Array.isArray(bufferedMeshes) && bufferedMeshes.length != 0) {
                bufferedMeshes.forEach( obj => group.remove(obj));
            }
            
        }

        if (self.video.buffered && self.video.buffered.length != 0) {
            var i = 0;
            const bufferedLengths = self.video.buffered.length;
            const timeRange = self.video.buffered;
            const duration = self.video.duration;
            const imagewidth = self.data.imagewidth;
            while (i < bufferedLengths) {
                var start = timeRange.start(i);
                var end = timeRange.end(i);
                var bufferedPercent = (end-start)/duration;
                var bufferedStartX = (1/2 - start/duration - bufferedPercent/2) * imagewidth;//+  1/2 
                var geomBuffered = new THREE.CylinderGeometry( 0.015, 0.015, imagewidth*bufferedPercent, 64 );

                geomBuffered.rotateZ(Math.PI/2);
                geomBuffered.translate(bufferedStartX, progressBarY, 0);

                var matBuffered = new THREE.MeshBasicMaterial( { color: 0x29F1FF } );
                var meshBuffered = new THREE.Mesh( geomBuffered, matBuffered );
                meshBuffered.name = 'videobuffered-' + i;
                group.add(meshBuffered);
                i++;
            }
        }

        var progressPercent = self.video.currentTime/self.video.duration;
        var progressWidth = self.data.imagewidth * progressPercent + 0.001;//self.data.imagewidth/2;
        var geomVideoProgress= new THREE.CylinderGeometry( 0.02, 0.02, progressWidth, 64 );
        geomVideoProgress.rotateZ(Math.PI/2);

        var progressX = (self.data.imagewidth - progressWidth)/2;
        var progressY = -self.data.imageheight/2 - 0.05;
        geomVideoProgress.translate(progressX, progressY, 0);

        var matVideoProgress = new THREE.MeshBasicMaterial( {color: 0x27BEFF} );
        var meshVideoProgress = new THREE.Mesh( geomVideoProgress, matVideoProgress );
        meshVideoProgress.name ='videoprogress';
        group.add(meshVideoProgress);
        
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
        // var hole = new THREE.Shape();
        var playWidth = 0.1;
        var playHeight = 0.1;
        var playDepth = 0.01;

        // pause button
        if (self.data.isplaying) {
            playPauseButton.moveTo( -playWidth/2, -playHeight/2 );
            playPauseButton.lineTo( -playWidth/2, playHeight/2 );
            playPauseButton.moveTo( playWidth/2, playHeight/2 );
            playPauseButton.lineTo( playWidth/2, -playHeight/2 );
            // hole.moveTo( 0, -playHeight/2 );
            // hole.lineTo( 0, playHeight/2 );
            // playPauseButton.holes = [hole];
        }
        else { // play button
            playPauseButton.moveTo( 0, playHeight/2 );
            playPauseButton.lineTo( playWidth/2, -playHeight/2 );
            playPauseButton.lineTo( -playWidth/2, -playHeight/2 );
            playPauseButton.lineTo( 0, playHeight/2 );
        }
    
        var extrudeSettings = {
            steps: 2,
            depth: playDepth,
            //amount: self.data.depth, // aframe 8.2 / three.js r92
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 1
        };
        var geomPlayPauseButton = new THREE.ExtrudeBufferGeometry( playPauseButton, extrudeSettings );

        var progressBarY = -self.data.imageheight/2 - 0.05;
        var playPauseButtonOffsetX = self.data.imagewidth/2 - 0.1;
        var playPauseButtonOffsetY = progressBarY - 0.2;
        geomPlayPauseButton.rotateZ(Math.PI / 2);
        geomPlayPauseButton.translate(playPauseButtonOffsetX, playPauseButtonOffsetY, 0);

        var colorPlayPauseButton = data.disabled ? 0xA9A9A9 : data.activePlayButton ? 0xFFD704 : data.hoverPlayButton ? 0x04FF5F : data.color;
        var opacity = data.disabled ? 0.2 : data.opacity;
        var transparent = data.disabled ? true : false;
        var matPlayPauseButton = new THREE.MeshBasicMaterial( {color: new THREE.Color( colorPlayPauseButton ),
            transparent: transparent,
            opacity: opacity} );
    
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
        console.log('_videoSeekingHandler');
        debugger;
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
        if (meshOldSeeking) {
            group.remove(meshOldSeeking);
        }
        var center = getCenterPoint(meshVideoLength);
        var rotation = new THREE.Euler();
        rotation = rotation.copy(meshVideoLength.rotation);
        
        rotation.set(rotation.x, rotation.y + 180, rotation.z);

        var b = new THREE.Vector3(1, 0, 0);

        var seekingPoint = new THREE.Vector3();
        seekingPoint.copy(point);
        seekingPoint = seekingPoint.projectOnVector(b)
        self.seekingPercantage = (seekingPoint.x + self.data.imagewidth*1.5/2)/(self.data.imagewidth*1.5);


        seekingPoint.add(center);

        var geometry = new THREE.CylinderGeometry( 0.025, 0.025, 0.01, 64 );
        geometry.rotateZ(Math.PI/2);
        var color = data.disabled ? 0xA9A9A9 : data.activeSeeking ? 0xFFD704 : data.hoverSeeking ? 0xFFFF00 : data.color;
        var material = new THREE.MeshBasicMaterial( {color: new THREE.Color(color)} );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'videoseekingpoint';
        seekingPoint = group.worldToLocal(seekingPoint);

        mesh.position.set(seekingPoint.x, seekingPoint.y, seekingPoint.z);
        mesh.updateMatrix();
        group.add( mesh );
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
                    if(self.data.hover && !self.data.selected) {
                        self._animateHover(scale);
                    }
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
        var xmin = x-step;
        var xmax = x+step;
        var ymin = y-step;
        var ymax = y+step;
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
                    if(self.data.active && !self.data.selected) {
                        self._animateActive(rot);//scale;
                    }
                    else {
                        AFRAME.ANIME({
                            targets: self.el.object3D.rotation,
                            easing: 'linear',
                            x: x,
                            y: y,
                            z: z,
                            duration: dur/2,
                        })
                    }
                }
            }).finished
        })
    }
});


AFRAME.registerPrimitive( 'a-diorama-grid-cell', {
    defaultComponents: {
        'diorama-grid-cell__cell': {
        },
        'text__videoprogress': { value: 'initial value', align: 'center'},
    },
    mappings: {
        'src': 'diorama-grid-cell__cell.imageURL',
        'srcfit': 'diorama-grid-cell__cell.srcFit',
        'width': 'diorama-grid-cell__cell.imagewidth',
        'height': 'diorama-grid-cell__cell.imageheight',
        'scale': 'diorama-grid-cell__cell.scale',
        'aspectratio': 'diorama-grid-cell__cell.aspectratio',
        'hover': 'diorama-grid-cell__cell.hover',
        'active': 'diorama-grid-cell__cell.active',
        'selected': 'diorama-grid-cell__cell.selected',
        'hoverplaybutton': 'diorama-grid-cell__cell.hoverPlayButton',
        'activeplaybutton': 'diorama-grid-cell__cell.activePlayButton',
        'hoverseeking': 'diorama-grid-cell__cell.hoverSeeking',
        'activeseeking': 'diorama-grid-cell__cell.activeSeeking',
        'isplaying': 'diorama-grid-cell__cell.isplaying',
        'type': 'diorama-grid-cell__cell.type',
        'id': 'diorama-grid-cell__cell.id',
        'animate-load': 'diorama-grid-cell__cell.animateLoad'
    }
});