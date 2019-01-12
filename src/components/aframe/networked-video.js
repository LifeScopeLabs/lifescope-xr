if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}
else {
    if (CONFIG.DEBUG) {console.log("Registering dynamic-autoplay...");}
}
  
AFRAME.registerComponent('networked-video', {
    schema: {
    // Type will be inferred to be boolean.
    default: true
    },
    init: function () {
    }


});

// async function createVideoEl(src) {
//     const videoEl = document.createElement("video");
//     videoEl.setAttribute("playsinline", "");
//     videoEl.setAttribute("webkit-playsinline", "");
//     videoEl.preload = "auto";
//     videoEl.loop = true;
//     videoEl.crossOrigin = "anonymous";
  
//     if (!src.startsWith("hubs://")) {
//       videoEl.src = src;
//     } else {
//       const streamClientId = src.substring(7).split("/")[1]; // /clients/<client id>/video is only URL for now
//       const stream = await NAF.connection.adapter.getMediaStream(streamClientId, "video");
//       videoEl.srcObject = new MediaStream(stream.getVideoTracks());
//     }
  
//     return videoEl;
//   }