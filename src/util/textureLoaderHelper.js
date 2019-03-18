export default class textureLoaderHelper {
    constructor() {
        this.baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/';
        this.bronzeUrl = this.baseUrl + 'BronzeBare/bronze_';
        this.woodUrl = this.baseUrl + 'WoodenFloor/wood_';
        this.woodPanelUrl = this.baseUrl + 'WoodenFloor/wood-panel_';

        this.materialUrls = {
            'bronze': this.bronzeUrl,
            'wood': this.woodUrl,
            'wood-panel': this.woodPanelUrl
          };
    }

    getOrLoadTexture(material, type='base', ext='jpg', success) {
        const url = this.materialUrls[material] + type + '.' + ext;
        
        var texture =  THREE.Cache.files[url];
        return texture !== undefined ?
            texture : new THREE.TextureLoader().load( url, success );
    }
}

// wood texture author: Brandon Funk https://gumroad.com/l/wood_floor