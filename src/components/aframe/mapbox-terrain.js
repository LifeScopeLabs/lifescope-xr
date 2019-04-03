//////////////////////////////////////////////////////////////////////////////
//		arjs-hit-testing
//////////////////////////////////////////////////////////////////////////////

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering mapbox-terrain...");}
}

AFRAME.registerComponent('mapbox-terrain', {
	schema: {
		latitude: {
			type: 'number',
			default: 0,
		},
		longitude: {
			type: 'number',
			default: 0,
		},
		'zoom-level': {	// http://wiki.openstreetmap.org/wiki/Zoom_levels
			type: 'number',
			default: 0,
		},
		type:  { // https://www.mapbox.com/api-documentation/#maps
			type: 'string',
			default: 'satellite',
		},
	},
	init: function () {
		// https://www.mapbox.com/studio/account/tokens/
		var access_token = 'pk.eyJ1IjoiamV0aWVubmUiLCJhIjoiY2o1eWFxaHFqMDBlcTJxbnBlNTVlOGkwZiJ9.-gTP-Ef27RRamJP7iF7W9g'

		var mapLatitude = this.data.latitude;
		var mapLongitude = this.data.longitude;
		var mapZoomLevel = this.data['zoom-level'];
		var type = this.data.type;
		var tileX = long2tile(mapLongitude, mapZoomLevel);
		var tileY = lat2tile(mapLatitude, mapZoomLevel);

		var meshOffset = 4;
		var scale = 4;

		var ctr = 1;
		var dx = 0;
		var dy = 0;
		var addX = 1;
		var addY = -1;
		var N = 1;
		var tileGeom;
		var geometries = [];

		var tilesPerRow = parseInt(Math.sqrt(this.data.tiles));
		
		var canvas = document.createElement('canvas');
			canvas.width  = 512*scale*tilesPerRow;
		canvas.height = 512*scale*tilesPerRow;
		console.log(canvas.width + " | " + canvas.height);
		var context = canvas.getContext('2d');
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;

		var middleX = parseInt((tilesPerRow-1)/2);
		var middleY = parseInt((tilesPerRow)/2);


		function callbackClosureDebug(dx, dy, ctr, callback) {
			return function() {
				return callback(dx, dy, ctr);
			}
		}

		callbackClosureDebug(dx, dy, 0, function (dx, dy, ctr) {
			buildTerrainTexture(tileX+dx, tileY+dy, function (image) {
				context.drawImage(image, (middleX+dx)*512*scale,(middleY+dy)*512*scale,512*scale,512*scale); // (image, x, y, width, height)
				texture.needsUpdate = true;
			});
		})();
		tileGeom = drawTile(tileX + dx, tileY + dy, meshOffset);
		geometries.push(tileGeom);

		while (ctr < this.data.tiles) {
			for (var i = 0; i < N && ctr < this.data.tiles; i++) {
				dx += addX;
				callbackClosureDebug(dx, dy, ctr, function (dx, dy, ctr) {
					buildTerrainTexture(tileX+dx, tileY+dy, function (image) {
						context.drawImage(image, (middleX+dx)*512*scale,(middleY+dy)*512*scale,512*scale,512*scale); // (image, x, y, width, height)
						texture.needsUpdate = true;
					});
				})();
				tileGeom = drawTile(tileX + dx, tileY + dy, meshOffset);
				geometries.push(tileGeom);
				ctr += 1;
			}
			for (var i = 0; i < N && ctr < this.data.tiles; i++) {
				dy += addY;
				callbackClosureDebug(dx, dy, ctr, function (dx, dy, ctr) {
					buildTerrainTexture(tileX+dx, tileY+dy, function (image) {
						context.drawImage(image, (middleX+dx)*512*scale,(middleY+dy)*512*scale,512*scale,512*scale); // (image, x, y, width, height)
						texture.needsUpdate = true;
					});
				})();
				tileGeom = drawTile(tileX + dx, tileY + dy, meshOffset);
				geometries.push(tileGeom);
				ctr += 1;
			}
			N += 1;
			addX *= -1;
			addY *= -1;
		}

		var material = new THREE.MeshPhongMaterial({
			map: texture,
			// wireframe: true
		});
		
		var mergedMapGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false); //new THREE.PlaneBufferGeometry
		mergedMapGeometry = new THREE.PlaneBufferGeometry(tilesPerRow,tilesPerRow);
		mergedMapGeometry.rotateX(2 * Math.PI * -90 / 360);

		var mapMesh = new THREE.Mesh(mergedMapGeometry, material);

		mapMesh.receiveShadow = true;
		mapMesh.castShadow = true;
		this.el.setObject3D("meshMain", mapMesh);
		

		function drawTile(tileX, tileY, dx, dy, meshOffset) {
			var geometry = buildElevationPlaneGeometry(tileX + dx, tileY + dy);

			geometry.rotateX(-Math.PI / 2);
			geometry.scale(4,4,4);
			geometry.translate(meshOffset*dx, 0, meshOffset*dy);

			return geometry;
		}

		
		// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
		function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
 	 	function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
 
		function buildElevationPlaneGeometry(){
			// https://blog.mapbox.com/global-elevation-data-6689f1d0ba65
			var restURL = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${mapZoomLevel}/${tileX}/${tileY}@2x.pngraw?access_token=${access_token}`
			// debugger
			var geometry	= new THREE.PlaneBufferGeometry( 1, 1, 512-1, 512-1 );
			loadImage(restURL, function(image){
				
				var canvas = document.createElement('canvas')
				canvas.width = 512
				canvas.height = 512
				var context = canvas.getContext('2d')
				context.drawImage(image, 0, 0)
				var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
				var elevationArray = imageData.data
				
				var positions = geometry.attributes.position.array
				for(var y = 0; y < canvas.height; y++ ){
					for(var x = 0; x < canvas.width; x++ ){
						var offset2 = (y*canvas.width + x)*4
						var height = -10000 + (elevationArray[offset2+0] *256*256 + elevationArray[offset2+1]*256 + elevationArray[offset2+2]) * 0.1
	
						height /= 10000
						height /= 3

						var offsetPosition = (y*canvas.width + x)*3
						positions[offsetPosition+2] = height
					}
				}
				geometry.attributes.position.needsUpdate = true
				geometry.computeVertexNormals()
			})

			return geometry
		}
		function buildTerrainTexture(tileX, tileY, callback) {
			var restURL = `https://api.mapbox.com/v4/mapbox.${type}/${mapZoomLevel}/${tileX}/${tileY}@2x.png?access_token=${access_token}`
			
			loadImage(restURL, function (image) {
				callback(image);
			});
		}
		function loadImage(imageURL, onLoad) {
			var image = document.createElement('img')

			var request = new XMLHttpRequest();
			request.addEventListener('load', function() {
				var fileReader = new FileReader();
				fileReader.addEventListener('loadend', function(){
					var dataUrl = fileReader.result
					var image = document.createElement('img')
					image.src = dataUrl
					image.addEventListener('load', function(){						
						onLoad(image)
					})
				})
				fileReader.readAsDataURL(request.response);
			})
			request.open('GET', imageURL);
			request.responseType = 'blob';
			request.send();
		}
	},
	tick: function(){
		// this._portalDoor.update()
	}
})


AFRAME.registerPrimitive('a-mapbox-terrain', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
	defaultComponents: {
		'mapbox-terrain': {},
	},
	mappings: {
		'latitude': 'mapbox-terrain.latitude',
		'longitude': 'mapbox-terrain.longitude',
		'zoom-level': 'mapbox-terrain.zoom-level',
	}
}))
