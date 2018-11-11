AFRAME.registerComponent('magic', {
    init: function () {
      var textrArray=["https://s3.amazonaws.com/magic.lifescope.io/assets/map/Cable+Car+Museum.png","https://s3.amazonaws.com/magic.lifescope.io/assets/map/Golden+Gate+Bridge.png","https://s3.amazonaws.com/magic.lifescope.io/assets/map/Golden+Gate+Park+Dog+Training+Area.png","https://s3.amazonaws.com/magic.lifescope.io/assets/map/Robin+Williams+Tunnel.png","https://s3.amazonaws.com/magic.lifescope.io/assets/map/Sightglass+Coffee.png","https://s3.amazonaws.com/magic.lifescope.io/assets/map/Union+Square.png"];
      this.txtrs=[];
      for(var i = 0 ; i< textrArray.length;i++){
      var texture = new THREE.TextureLoader().load( textrArray[i] );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 1, 1 );
      this.txtrs.push(texture);

    }
      var sphrG = new THREE.SphereGeometry(8,32,32);
      var cyldrG = new THREE.CylinderGeometry(8,8,.5,32,  1);
      var cyldrMt = new THREE.MeshBasicMaterial({ side:THREE.FrontSide, map:this.txtrs[2]});
      var cyldrMh = new THREE.Mesh(cyldrG,cyldrMt);
      var sphrMt = new THREE.MeshBasicMaterial({ side:THREE.BackSide, map:this.txtrs[0]});
      var sphrMh = new THREE.Mesh(sphrG, sphrMt);
      cyldrMh.position.set(0,-4,0);
      this.el.setObject3D("mesh", sphrMh);
      this.el.setObject3D("mesh2", cyldrMh);
      this.el.object3D.position.set(0,0,-30);
      console.log(this.el.object3D.children[0].material.map);
      this.count=0;
      this.timer=0;
    },
    tick: function(){this.el.object3D.rotateY(.01);
    }
  
  });