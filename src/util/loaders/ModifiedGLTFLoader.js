/**
 * @author mohrtw
 */

function ModifiedGLTFLoader( manager ) {
    //console.loglog("ModifiedGLTFLoader constructor")

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    
    this.colorArray = [];
    this.cachePath = '';

    this.binLoader = new THREE.FileLoader( this.manager );
    this.transformLoader = new THREE.FileLoader( this.manager );
    this.gltfLoader = new THREE.GLTFLoader( this.manager );

    this.url = '';
    this.baseURL = '';
    this.onLoad = undefined;
    this.onProgress = undefined;
    this.onError = undefined;
}

Object.assign( ModifiedGLTFLoader.prototype, {

	load: function ( url, onLoad, onProgress, onError ) {
        //console.loglog("ModifiedGLTFLoader load");

        var scope = this;
        scope.url = url;
        scope.baseURL = scope.extractUrlName( url );

        scope.onLoad = onLoad;
        scope.onProgress = onProgress;
        scope.onError = onError;
        
        scope.binLoader.setResponseType( 'arraybuffer' );
		scope.binLoader.setPath( scope.path );
        scope.binLoader.load( scope.baseURL + '.bin', scope.binOnLoad.bind(scope),
            onProgress.bind(scope), onError.bind(scope) );

	},


	setPath: function ( value ) {
        //console.loglog("ModifiedGLTFLoader setPath");

		this.path = value;
		return this;

    },

    setCachePath: function ( value ) {
        //console.loglog("ModifiedGLTFLoader setCachePath");

		this.cachePath = value;
		return this;

    },

    setColorArray: function ( value ) {
        //console.loglog("ModifiedGLTFLoader setColorArray");

		this.colorArray = value;
		return this;

    },

    extractUrlName: function ( url ) {
        //console.loglog("ModifiedGLTFLoader extractUrlName");

		var index = url.lastIndexOf( '.' );

        if ( index === - 1 ) return url;
        //console.loglog(url.substr( 0, index ));

        // substr to index will not include .
		return url.substr( 0, index );

    },
    
    binOnLoad: function ( bin ) {
        //console.loglog('bin onLoad');
        var scope = this;
        //console.loglog(scope);
        THREE.Cache.add( scope.cachePath + '/scene.bin', bin);

        scope.transformLoader.load( scope.baseURL + '.gltf', scope.transformOnLoad.bind(scope),
            scope.onProgress.bind(scope), scope.onError.bind(scope) );
    },

    transformOnLoad: function ( gltf ) {
        //console.loglog('transform onLoad');
        var scope = this;
        var data = JSON.parse(gltf);

        scope.transformGltf( data );
        // data.materials[0].pbrMetallicRoughness.baseColorFactor = [.1, 1, 1, 1];
        // data.materials[0].pbrMetallicRoughness.baseColorFactor = [0.5, 0.5, 0.5, 1];
        //console.loglog(data.materials[0].pbrMetallicRoughness.baseColorFactor);
        // THREE.Cache.remove(uri);
        THREE.Cache.add( scope.cachePath + '/scene.gltf', JSON.stringify(data));

        scope.gltfLoader.load( scope.cachePath + '/scene.gltf', scope.gltfOnLoad.bind(scope),
            scope.onProgress.bind(scope), this.onError.bind(scope) );
    },

    transformGltf: function( data ) {
        //console.loglog('transformGltf');
        if (this.colorArray != false) {
            data.materials[0].pbrMetallicRoughness.baseColorFactor = this.colorArray;
        }
    },

    gltfOnLoad: function ( gltf ) {
        //console.loglog("gltfOnLoad");
        //console.loglog(gltf);
        this.onLoad();
    },
    

} );


export { ModifiedGLTFLoader };
