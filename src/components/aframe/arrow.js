AFRAME.registerComponent('arrow', {
    schema: {
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},

        direction: { default: 'up', oneOf: ['left', 'right', 'up', 'down', 'angle']},
        angle: { type: 'number', default: 0 },

        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        depth: { type: 'number', default: 0.01 },

        color: { default: 0xe8f1ff}, //0xe8f1ff
        opacity: { type: 'number', default: 1 },

        hover: { type: 'boolean', default: false },
        active: { type: 'boolean', default: false },
        disabled: { type: 'boolean', default: false },
    },
  
    multiple: true,

    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty('arrow')) {
            self.el.removeObject3D('arrow');
        }
        self._createArrow();
    },

    remove: function () {
        if (this.el.object3DMap.hasOwnProperty('arrow')) {
            this.el.removeObject3D('arrow');
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
        }

        var shape = new THREE.Shape();
        var width = data.width;
        var height = data.height;

        shape.moveTo( 0, height/2 );
        shape.lineTo( width/2, -height/2 );
        shape.lineTo( -width/2, -height/2 );
        shape.lineTo( 0, height/2 );
    
        var extrudeSettings = {
            steps: 2,
            depth: data.depth,
            //amount: self.data.depth, // aframe 8.2 / three.js r92
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 1
        };
        geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
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
                rotationZ = 270;
                break;
            default:
                break;
        }
        geom.rotateZ(2 * Math.PI * rotationZ / 360);

        geom.translate(data.offset.x, data.offset.y, data.offset.z);
    
        var color = data.disabled ? 0xA9A9A9 : data.active ? 0xFFD704 : data.hover ? 0x04FF5F : data.color;
        var opacity = data.disabled ? 0.2 : data.opacity;
        var transparent = data.disabled ? true : false;
        mat = new THREE.MeshBasicMaterial( {color: new THREE.Color( color ),
            transparent: transparent,
            opacity: opacity} );
    
        mesh = new THREE.Mesh(geom, mat);
    
        var group = self.el.getObject3D('arrow') || new THREE.Group();
        group.add(mesh);
        self.el.setObject3D('arrow', group);   
    },
});


AFRAME.registerPrimitive( 'a-arrow', {
    defaultComponents: {
        'arrow__arrow': {
        },
    },
    mappings: {
        'direction': 'arrow__arrow.direction',
        'color': 'arrow__arrow.color',
        'width': 'arrow__arrow.width',
        'height': 'arrow__arrow.height',
        'hover': 'arrow__arrow.hover',
        'active': 'arrow__arrow.active',
        'disabled': 'arrow__arrow.disabled',
    }
});