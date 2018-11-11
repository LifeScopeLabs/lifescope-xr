AFRAME.registerComponent('magic', {
  init: function () {
    var textrArray=["https://s3.amazonaws.com/magic.lifescope.io/assets/map/Cable+Car+Museum.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Golden+Gate+Bridge.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Golden+Gate+Park+Dog+Training+Area.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Robin+Williams+Tunnel.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Sightglass+Coffee.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Union+Square.png"];
    var groundPlanes=["https://s3.amazonaws.com/magic.lifescope.io/assets/sphere/california_ave_trolly.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Crossing_Golden_Gate_for_TL_FIXED.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/sphere/Dog_Park_stable.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/sphere/protesters.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/sphere/hux_pillar.png",
    "https://s3.amazonaws.com/magic.lifescope.io/assets/map/Union_square_nightFIXED.png"

  ];
    this.txtrs=[];
    this.txtrsG=[];
    for(var i = 0 ; i< textrArray.length;i++){
    var texture = new THREE.TextureLoader().load( textrArray[i] );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    this.txtrs.push(texture);
  }
  for(var i = 0 ; i< groundPlanes.length;i++){
    var texture = new THREE.TextureLoader().load( groundPlanes[i] );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    this.txtrsG.push(texture);

  }
  this.groups=[];
  for(var j=0;j<6;j++){
    var group=new THREE.Group();
    var sphrG = new THREE.SphereGeometry(8,32,32);
    var cyldrG = new THREE.CylinderGeometry(6,6,.5,32,  1);
    var cyldrMt = new THREE.MeshBasicMaterial({ side:THREE.FrontSide, map:this.txtrs[j]});
    var cyldrMh = new THREE.Mesh(cyldrG,cyldrMt);
    var sphrMt = new THREE.MeshBasicMaterial({ side:THREE.BackSide, map:this.txtrsG[j]});
    var sphrMh = new THREE.Mesh(sphrG,  sphrMt);
    cyldrMh.position.set(0,-4,-20);
    sphrMh.position.set(0,0,-20);   
    group.add(cyldrMh);
    group.add(sphrMh);
    group.rotateY(j*((Math.PI*2)/6));
    this.el.setObject3D("group"+j,group);
  this.groups.push(group);}
    /*this.el.setObject3D("meshj+j, sphrMh);
    this.el.setObject3D("mesh420"+j, cyldrMh);*/
   // var matrix= new THREE.Matrix4();
  //  matrix.makeRotationY((Math.PI*2)/8);
   // this.el.object3D.applyMatrix(matrix);
    //this.el.object3D.matrix.makeRotationY((Math.PI*2)/8);
//  }
    //this.el.object3D.position.set(0,0,-30);

    //console.log(this.el.object3D.children[0].material.map);
  
    this.count=0;
    this.timer=0;
  },
  tick: function(){
    for(var i=0;i<this.groups.length;i++){

      this.groups[i].children[1].rotateY(.01);

    }
    /*
    for(var i=0;i<this.el.object3D.children.length;i++){
    this.el.object3D.children[i].rotateY(.01);}*/
    if(this.timer>30){
      for(var i=0;i<this.groups.length;i++){
      this.groups[i].children[0].material.map=this.txtrs[(i+this.count)%this.txtrs.length];
      this.groups[i].children[1].material.map=this.txtrsG[(i+this.count)%this.txtrsG.length];
    }
    this.count= (this.count+1)%(this.txtrs.length);
    this.timer=0;
    }
    else{
      this.timer = this.timer+1;
    }
  }

});