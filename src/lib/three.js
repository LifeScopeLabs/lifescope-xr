var THREE = global.THREE = require('super-three');

// Allow cross-origin images to be loaded.

// This should not be on `THREE.Loader` nor `THREE.ImageUtils`.
// Must be on `THREE.TextureLoader`.
if (THREE.TextureLoader) {
  THREE.TextureLoader.prototype.crossOrigin = 'anonymous';
}

// This is for images loaded from the model loaders.
if (THREE.ImageLoader) {
  THREE.ImageLoader.prototype.crossOrigin = 'anonymous';
}

// In-memory caching for XHRs (for images, audio files, textures, etc.).
if (THREE.Cache) {
  THREE.Cache.enabled = true;
}
module.exports = THREE;
