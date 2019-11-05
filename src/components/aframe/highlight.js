AFRAME.registerComponent('highlight', {
  schema: {
    hover: { type: 'boolean', default: false },
    active: { type: 'boolean', default: false },
    disabled: { type: 'boolean', default: false },
    color: { default: 0xe8f1ff},
    hoverColor: { default: 0x04FF5F },
    activeColor: { default: 0xFFD704 },
    disabledColor: { default: 0xA9A9A9 },
    type: { default: 'color', oneOf: ['color', 'border'] },
    target: { default: '', type: 'string' },
    bordersize: { type: 'number', default: 0.05 },
  },

  init() {
    var self = this;
    this.el.addEventListener("click", evt => {
      if (self.intersectingRaycaster) {
              var clickEvent = new Event('objectclicked', {bubbles: true});
              self.el.dispatchEvent(clickEvent);
      }
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
                // console.log('intersection == undefined');
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
        self.el.setAttribute('highlight', {'hover': false});
      }
    });

      this.el.addEventListener("mousedown", evt => {
        self._handleIntersection('active');
      });
      this.el.addEventListener("mouseup", evt => {
          if (self.el.getAttribute('highlight').active) {
            self.el.setAttribute('highlight', {'active': false});
          }
      });
  },

  update: function(oldData) {
    var self = this;
    var data = self.data;
    var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
    if (['hover', 'active', 'disabled'].some(prop => changedData.includes(prop))) {


        if (data.type == 'color') {
          self._updateColor();
        }
        // if hover or active are true, update or create border
        else if (data.hover || data.active) {
          // if border exist, update its color
          if (self.el.object3DMap.hasOwnProperty('border') ) {
              self._updateColor('border');
          }
          // otherwise, create border
          else if (data.type == 'border') {
            self._createBorder();
          }
        }
        // if hover and active are false and border still exists, remove it
        else if (self.el.object3DMap.hasOwnProperty('border')) {
          self.el.removeObject3D('border');
        }
    }
  },

  tick: function() {
    this._handleIntersection();
  },

  _createBorder() {
    var self = this;
    var data = self.data;

    var geomAttribute;

    if (data.target == '') {
      geomAttribute = self.el.getAttribute('geometry');
    }
    else {
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
    if (geomAttribute && (data.hover || data.active)) {
      switch (geomAttribute.primitive){
        case 'sphere':
          self._createBorderSphere(geomAttribute);
          break;
        case 'plane':
          self._createBorderPlane(geomAttribute);
          break;
        default:
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

    var color = data.active ? 0xFFD704 : data.hover ? 0x04FF5F : 0xe8f1ff;
    var mat = new THREE.MeshBasicMaterial( {color: new THREE.Color( color ), side: THREE.BackSide} );
    var newMesh = new THREE.Mesh(geom, mat);
    newMesh.name = 'border';
    newMesh.updateMatrix();

    self.el.setObject3D('border', newMesh);  
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

    var color = data.active ? 0xFFD704 : data.hover ? 0x04FF5F : 0xe8f1ff;
    mat = new THREE.MeshBasicMaterial( {color: new THREE.Color( color ), side: THREE.FrontSide} );
    mesh = new THREE.Mesh(geom, mat);
    mesh.name = 'border';

    self.el.setObject3D('border', mesh);
  },

  _updateColor(meshName='mesh') {
    var self = this;
    var data = self.data;

    var newColor = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

    var opacity = data.disabled ? 0.2 : data.opacity;
    var transparent = data.disabled ? true : false;

    var mesh = self.el.getObject3D(meshName);
    if (mesh) {
        mesh.material.color = new THREE.Color( newColor );
        mesh.material.opacity = opacity;
        mesh.material.transparent = transparent;
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
            case 'border':
                self.el.setAttribute('highlight', value);
                break;
            default:
              break;
          }
        }
        else {
          self.el.setAttribute('highlight', value);
        }
    }
  }
})