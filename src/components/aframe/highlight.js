AFRAME.registerComponent('highlight', {
  schema: {
    hover: { type: 'boolean', default: false },
    active: { type: 'boolean', default: false },
    color: { default: 0xe8f1ff},
    hoverColor: { default: 0x04FF5F},
    activeColor: { default: 0xFFD704},
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
          // self.el.setAttribute('hover', false);
      }
    });

      this.el.addEventListener("mousedown", evt => {
        // self.el.setAttribute('active', true);
        self.el.setAttribute('highlight', {'active': true});
      });
      this.el.addEventListener("mouseup", evt => {
          // self.el.setAttribute('active', false);
          self.el.setAttribute('highlight', {'active': false});
      });
  },

  update: function(oldData) {
    var self = this;
    var data = self.data;
    // debugger;
    var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
    if (['hover', 'active'].some(prop => changedData.includes(prop))) {

        if (data.hover || data.active) {
          if (self.el.object3DMap.hasOwnProperty('border') ) {
              // console.log('removing border');
              self.el.removeObject3D('border');
          }
          self._createBorder();
        }
        else if (self.el.object3DMap.hasOwnProperty('border')) {
          self.el.removeObject3D('border');
        }
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
                  self.el.setAttribute('highlight', {'hover': true});
                }
                break;
        }
    }
  },

  _createBorder() {
    var self = this;
    var data = self.data;

    // console.log('_createBorder');
    var geomAttribute = self.el.getAttribute('geometry');
    if (geomAttribute && (data.hover || data.active)) {
      var borderGeomAttribute = Object.assign({}, geomAttribute);
      borderGeomAttribute.radius = borderGeomAttribute.radius*1.05;
      var geom = self.el.sceneEl.systems.geometry.getOrCreateGeometry(borderGeomAttribute);

      var color = data.active ? 0xFFD704 : data.hover ? 0x04FF5F : 0xe8f1ff;
      var mat = new THREE.MeshBasicMaterial( {color: new THREE.Color( color ), side: THREE.BackSide} );
      var newMesh = new THREE.Mesh(geom, mat);
      newMesh.name = 'border';
      newMesh.updateMatrix();

      var group = self.el.getObject3D('border') || new THREE.Group();
      self.justHighlighted = true;
      group.add(newMesh);
      group.name="gBorder";
      self.el.setObject3D('border', group);  
    }
  }
})