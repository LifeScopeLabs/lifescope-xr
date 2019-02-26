var brassBaseTexture, brassBumpTexture, brassNormalTexture;
var woodBaseTexture, woodBumpTexture, woodNormalTexture;

function getOrLoadTexture(type) {
    const brassBaseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/BronzeBare/TexturesCom_Metal_BronzeBare_1K_'
    const woodBaseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/WoodenFloor/WoodenFloor_';

    // brass
    if (type == 'brassBase') {
        return brassBaseTexture !== undefined ?
         brassBaseTexture : new THREE.TextureLoader().load( brassBaseUrl + 'albedo.jpg');
    }
    else if (type == 'brassBump') {
        return brassBumpTexture !== undefined ?
        brassBumpTexture : new THREE.TextureLoader().load( brassBaseUrl + 'height.jpg');
    }
    else if (type == 'brassNormal') {
        return brassNormalTexture !== undefined ?
        brassNormalTexture : new THREE.TextureLoader().load( brassBaseUrl + 'normal.jpg');
    }
    // wood
    // texture author: Brandon Funk https://gumroad.com/l/wood_floor
    else if (type == 'woodBase') {
        return woodBaseTexture !== undefined ?
        woodBaseTexture : new THREE.TextureLoader().load( woodBaseUrl + 'basecolor.png');
    }
    else if (type == 'woodBump') {
        return woodBumpTexture !== undefined ?
        woodBumpTexture : new THREE.TextureLoader().load( woodBaseUrl + 'height.png');
    }
    else if (type == 'woodNormal') {
        return woodNormalTexture !== undefined ?
        woodNormalTexture : new THREE.TextureLoader().load( woodBaseUrl + 'normal.png');
    }
}

function createDioramaComponent(self, theta) {
    var material, geom, mesh;

    var sinTheta = Math.sin( theta );
    var cosTheta = Math.cos( theta );

    var segx = self.data.cylradius * sinTheta;
    var segz = self.data.cylradius * cosTheta;
    if (self.data.mat == 'brass') {
        brassBaseTexture = getOrLoadTexture('brassBase');
        brassBumpTexture = getOrLoadTexture('brassBump');
        brassNormalTexture = getOrLoadTexture('brassNormal');


        brassBaseTexture.wrapS = brassBaseTexture.wrapT = THREE.RepeatWrapping;
        brassBaseTexture.offset.set( 0, 0 );
        brassBaseTexture.repeat.set( self.data.repeatU, self.data.repeatV );
        
        material = new THREE.MeshPhongMaterial( { map: brassBaseTexture,
            side:THREE.FrontSide,
            bumpMap: brassBumpTexture,
            normalMap: brassNormalTexture,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );
    }

    else if (self.data.mat == 'wood') {

        woodBaseTexture = getOrLoadTexture('woodBase');
        woodBumpTexture = getOrLoadTexture('woodBump');
        woodNormalTexture = getOrLoadTexture('woodNormal');

        woodBaseTexture.wrapS = woodBaseTexture.wrapT = THREE.RepeatWrapping;
        woodBaseTexture.offset.set( 0, 0 );
        woodBaseTexture.repeat.set( self.data.repeatU, self.data.repeatV );
        
        var material = new THREE.MeshPhongMaterial( { map: woodBaseTexture,
            side:THREE.DoubleSide,// } );
            bumpMap: woodBumpTexture,
            normalMap: woodNormalTexture,
            needsUpdate: true,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );

    }

    else if (self.data.mat == 'glass') {
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
            }
            )
    }
        
        
    if (self.data.geo == 'column') {
        geom =  new THREE.CylinderBufferGeometry( self.data.radius,
            self.data.radius,
            self.data.height,
            self.data.radialsegments, 1, false );
    }
    else if (self.data.geo == 'sphere') {
        geom = new THREE.SphereBufferGeometry( self.data.radius,
            self.data.radialsegments, self.data.radialsegments );
    }
    else if (self.data.geo == 'box' || self.data.geo == 'ex-box') {
        var width = self.data.width;
        width = self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
        var height = self.data.height;

        var shape = new THREE.Shape();

        shape.moveTo( -width/2, -height/2 );
        shape.lineTo( -width/2, height/2 );
        shape.lineTo( width/2, height/2 );
        shape.lineTo( width/2, -height/2 );
        shape.lineTo( -width/2, -height/2 );

        var extrudeSettings = {
            steps: 2,
            depth: self.data.depth,
            //amount: self.data.depth,
            bevelEnabled: self.data.geo == 'ex-box' ? true : false,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 1
        };
        geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

    }
        

    if (self.data.geo == 'column' || self.data.geo == 'sphere') {
        geom.translate(self.data.x + (self.data.width/2),
                self.data.y + self.data.height/2,
                self.data.z + self.data.depth/2);
        geom.rotateY(theta);
        geom.translate(segx - (self.data.width/2), 0, segz);
    }
    else {
        geom.rotateY(theta);
        geom.translate(self.data.x + (self.data.width/2),
                self.data.y + self.data.height/2,
                self.data.z - self.data.depth/2);

        geom.translate(segx - (self.data.width/2), 0, segz);
    }

    mesh = new THREE.Mesh(geom, material);


    var group = self.el.getObject3D('group') || new THREE.Group();
    //if (self.data.helper) {group.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
    group.add(mesh);
    self.el.setObject3D('group', group);        
}

AFRAME.registerComponent('diorama-component', {
    schema: {
        geo: { type: 'string', default: 'column' },
        mat: { type: 'string', default: 'brass' },
        uiScale: { type: 'number', default: 0.4},
        angle: { type: 'number', default: 0},
        radius: { type: 'number', default: 0},
        height: { type: 'number', default: 0},
        width: { type: 'number', default: 0 },
        depth: { type: 'number', default: 0.0},
        cylradius: { type: 'number', default: 6 },
        radialsegments: { type: 'number', default: 36 },
        rotaion: { type: 'number', default: Math.PI / 2 }, //rads
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        repeatU: { type: 'number', default: 10},
        repeatV: { type: 'number', default: 10},
        color: { default: 0xe8f1ff},
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },
        withBump: { default: true },
        cyl: { default: false },
        helper: { default: false }
    },

    multiple: true,
  
    init: function () {

        var self = this;

        if (self.data.cyl) {
            for ( var i = 0; i <= self.data.radialsegments; i ++ ) {

                var u = i / self.data.radialsegments;
    
                var theta = u * Math.PI * 2 + 0;

                createDioramaComponent(self, theta);
            }
        }
        createDioramaComponent(self, 0);    
    }
});

var railHeight = 1.2

var floorRad = 6;
var columnRadius = 0.05;
var columnHeight = railHeight + 0.01;

var sphereRadius = columnRadius * (3/2);

// self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
var baseWidth = (floorRad) * Math.sin(2 * Math.PI / 36);
var baseHeight = 0.2;
var baseDepth = 0.03;

var glassHeight = railHeight - (2*baseHeight);
var glassWidth = baseWidth;
var glassDepth = baseDepth - 0.01; // 0.02

var trimHeight = 0.01;
var trimDepth = glassDepth/2 // 0.01

var bevelThickness = 0.01

AFRAME.registerPrimitive( 'a-diorama', {
    defaultComponents: {
        'diorama-component__left_column': { 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'x': -(glassWidth/2) },
        'diorama-component__right_column': { 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'x': (glassWidth/2) },
        'diorama-component__base': { 'geo': 'ex-box', 'mat': 'wood',
            'width': baseWidth, 'height': baseHeight, 'depth': baseDepth },
        'diorama-component__trim_base_front': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': glassDepth
        },
        'diorama-component__trim_base_back': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': -glassDepth
        },
        'diorama-component__trim_top_front': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': glassDepth
        },
        'diorama-component__trim_top_back': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': -glassDepth
        },
        'diorama-component__top': { 'geo': 'ex-box', 'mat': 'wood',
            'width': glassWidth, 'height': baseHeight, 'depth': baseDepth,
            'y': baseHeight + glassHeight - bevelThickness//'0.99'
        },
        'diorama-component__glass': { 'geo': 'ex-box', 'mat': 'glass',
            'width': glassWidth, 'height': glassHeight, 'depth': glassDepth,
            'y': baseHeight },
        'diorama-component__left_sphere': { 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius,
            'x': -(glassWidth/2), 'y': columnHeight + sphereRadius },
        'diorama-component__right_sphere': { 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius,
            'x': (glassWidth/2), 'y': columnHeight + sphereRadius }
    },
    mappings: {
        'radius': 'brass.radius'
    }
});

AFRAME.registerPrimitive( 'a-diorama-cyl', {
    defaultComponents: {
        'diorama-component__left_column': { 'cyl': true, 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'depth': columnRadius,
            'x': -(glassWidth/2), },
        'diorama-component__base': { 'cyl': true, 'geo': 'ex-box', 'mat': 'wood',
            'width': baseWidth, 'height': baseHeight, 'depth': baseDepth },
        'diorama-component__trim_base_front': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': glassDepth
        },
        'diorama-component__trim_base_back': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': -glassDepth
        },
        'diorama-component__trim_top_front': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': glassDepth
        },
        'diorama-component__trim_top_back': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': -glassDepth
        },
        'diorama-component__top': { 'cyl': true, 'geo': 'ex-box', 'mat': 'wood',
            'width': glassWidth, 'height': baseHeight, 'depth': baseDepth,
            'y': baseHeight + glassHeight - bevelThickness//'0.99'
        },
        'diorama-component__glass': { 'cyl': true, 'geo': 'ex-box', 'mat': 'glass',
            'width': glassWidth, 'height': glassHeight, 'depth': glassDepth,
            'y': baseHeight },
        'diorama-component__left_sphere': { 'cyl': true, 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius, 'depth': columnRadius,
            'x': -(glassWidth/2), 'y': columnHeight + sphereRadius }
    },
    mappings: {
        'radius': 'diorama-component.cylradius'
    }
});