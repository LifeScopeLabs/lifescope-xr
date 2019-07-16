export default class textureLoaderHelper {
    constructor() {
        this.baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/';
        this.brassUrl = this.baseUrl + 'brass/';
        this.bronzeUrl = this.baseUrl + 'bronze/';
        this.woodUrl = this.baseUrl + 'wood/floor/';
        this.woodPanelUrl = this.baseUrl + 'wood/panel/';

        this.materialUrls = {
            'brass': this.brassUrl,
            'bronze': this.bronzeUrl,
            'wood': this.woodUrl,
            'wood-panel': this.woodPanelUrl
          };
    }

    loadTexture(material, type='base', quality='l', ext='jpg', success) {
        const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
        // console.log(`loadTexture: ${url}`);
        return new THREE.TextureLoader().load( url, success );
    }

    getOrLoadTexture(material, type='base', quality='l', ext='jpg', success) {
        const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
        
        var texture =  THREE.Cache.files[url];
        if (texture !== undefined) {
            success(texture);
        }
        return texture !== undefined ?
            texture : new THREE.TextureLoader().load( url, success );
    }
}

// wood texture author: Brandon Funk https://gumroad.com/l/wood_floor