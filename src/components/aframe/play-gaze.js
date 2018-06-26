AFRAME.registerComponent('play-gaze', {
    init: function () {
  
      this.el.addEventListener('mouseenter', function (evt) {
        this.play();
        console.log('mouseenter: ', evt.detail);
      });
  
      this.el.addEventListener('mouseleave', function (evt) {
        this.pause();
        console.log('mouseleave: ', evt.detail);
      });
    }
  });