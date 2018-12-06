if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}
else {
    if (CONFIG.DEBUG) {console.log("Registering hud...");}
}
  
AFRAME.registerComponent('hud', {
    schema: {
        x: {type: 'number', default: 0},
        y: {type: 'number', default: 0.5},
        z: {type: 'number', default: -1}, 
        tilt: {type: 'number', default: 32},
        planeX: {type: 'number', default: 0},
        planeY: {type: 'number', default: -0.5},
        planeZ: {type: 'number', default: -1}
    },
    init: function () {

        var group=new THREE.Group();
        // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var cube = new THREE.Mesh( geometry, material );

        var geoPlane = new THREE.PlaneGeometry( 2.8, 0.5, 1 );  // (w/h/ wseg/hseg)
        var matPlane = new THREE.MeshBasicMaterial( {color: 0x3B3B3B, side: THREE.DoubleSide, transparent: true, opacity: 0.4} );
        var plane = new THREE.Mesh( geoPlane, matPlane );
        plane.position.set(this.data.planeX, this.data.planeY, this.data.planeZ);
        group.add(plane);

        group.position.set(this.data.x, this.data.y, this.data.z);  // x/y/z (+right-left/+up-down/+front-back)
        group.rotateX(-Math.PI/4);
        this.el.setObject3D("group", group);
    }


});

AFRAME.registerPrimitive( 'a-hud', {
    defaultComponents: {
        'hud': { }
    },
    mappings: {
        'width': 'ionicon.width',
        'height': 'ionicon.height',
        'font-color': 'ionicon.fontColor',
        'background-color': 'ionicon.backgroudColor',
        'icon': 'ionicon.icon',
    }
});

/*
<a-hud class="hud"
                position="0.2 0.5 0.1"
                text="value: Hello VR;"
                ></a-entity>
              <a-plane class="hud-plane" color="#cee1ff" transparent=true opacity=0.4;
               height="0.5" width="2.8" position="0 -0.5 -1>
               
               </a-plane>
*/