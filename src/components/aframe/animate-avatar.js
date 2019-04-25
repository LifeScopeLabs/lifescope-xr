if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering animate-avatar...");}
  }
  
  AFRAME.registerComponent('animate-avatar', {
      schema: {
        xVals: { type: "array", default: [] },
        yVals: { type: "array", default: [] },
        zVals: { type: "array", default: [] },
      },

      init: function () {
        if (CONFIG.DEBUG) {
          console.log('animate-avatar init');
        }
        var self = this;
        this.animations = [
          {x: 0, y: 0, z: 0, dur: 2500},
          {x: 5, y: -15, z: 0, dur: 2500},
          {x: -5, y: -20, z: 0, dur: 2500},
          {x: 7, y: -5, z: 0, dur: 2500},
          {x: -10, y: 5, z: 0, dur: 2500}];

        this.durs = [500, 1000, 1250, 1500, 1750, 2000];

        var dtr = self._degreesToRad;
        for (var x=-20; x<=20; x+=2.5) { self.data.xVals.push(dtr(x)); }
        for (var y=-45; y<=45; y+=2.5) { self.data.yVals.push(dtr(y)); }
        for (var z=-10; z<=10; z+=2.5) { self.data.zVals.push(dtr(z)); }

        var fx = self.el.object3D.rotation.x;
        var fy = self.el.object3D.rotation.y;
        var fz = self.el.object3D.rotation.z;
        self._animate_random(fx, fy, fz);
        // self._animate_sequence(0);
      },

      _animate_sequence: function(seq) {
        console.log(`_animate_sequence(${seq})`);
        var self = this;
        console.log(self.el.object3D.rotation);
        var aniFrom = this.animations[seq % 5];
        var aniTo = this.animations[(seq+1) % 5];

        AFRAME.ANIME({
          targets: self.el.object3D.rotation,   
          easing: 'linear',
          x: [self._degreesToRad(aniFrom.x), self._degreesToRad(aniTo.x)],
          y: [self._degreesToRad(aniFrom.y), self._degreesToRad(aniTo.y)],
          z: [self._degreesToRad(aniFrom.z), self._degreesToRad(aniTo.z)],
          duration: aniTo.dur,
      });

        setTimeout(self._animate_sequence.bind(self, (seq + 1) % 5), aniTo.dur);
      },

      _animate_random: function(fx, fy, fz) {
        var self = this;
        var getRandomInt = self._getRandomInt;
        var tx = self.data.xVals[getRandomInt(self.data.xVals.length)];
        var ty = self.data.yVals[getRandomInt(self.data.yVals.length)];
        var tz = self.data.zVals[getRandomInt(self.data.zVals.length)];
        var dur = self.durs[getRandomInt(self.durs.length)];

        setTimeout(self._animate_random.bind(self, tx, ty, tz), dur);
        AFRAME.ANIME({
            targets: self.el.object3D.rotation,   
            easing: 'linear',
            x: [fx, tx],
            y: [fy, ty],
            z: [fz, tz],
            duration: dur,
        });
      },

      _getRandomInt: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
      },

      _degreesToRad: function(deg) {
        return (deg) * (Math.PI/180);
      }

    });