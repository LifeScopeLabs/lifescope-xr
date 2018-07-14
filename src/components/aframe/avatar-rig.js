if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    console.log("Registering entangle...");
  }
  
// links the rotation of an avatar to the camera
//
// <avatar-rig>
//   <avatar/>
//   <camera/>
// <avatar-rig/>
  AFRAME.registerComponent('avatar-rig', {
      schema: {
        camera: { type: "selector" }
      },

      init: function () {
        this.avatar = null;
        console.log('avatar-rig init');
        console.log(this);
        console.log(this.el.children);
        for (var i = 0; i < this.el.children.length; i++) {
            console.log("className: " + this.el.children[i].className);
            if (this.el.children[i].className == "avatar") {
              this.avatar = this.el.children[i];
              console.log(this.avatar);
              break;
            }        
        }
      },

      tick: function () {
          if (this.avatar) {
            this.avatar.setAttribute('rotation', this.data.camera.getAttribute('rotation'));
          }
      }

    });