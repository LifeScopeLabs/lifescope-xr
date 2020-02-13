export default function () {

AFRAME.registerComponent('text-link', {
    dependencies: ['text'],

    schema: {
      hover: { type: 'boolean', default: false },
      active: { type: 'boolean', default: false },
      color: { default: 0xe8f1ff },
      hoverColor: { default: 0x04FF5F },
      activeColor: { default: 0xFFD704 },
      disabledColor: { default: 0xA9A9A9 },
    },
  
    init() {
        var self = this;
        var textAttribute = self.el.getAttribute('text')
        self.originalColor = textAttribute.color;

        this.el.addEventListener("click", evt => {
            if (self.intersectingRaycaster) {
                var clickEvent = new Event('textclicked', {bubbles: true});
                self.el.dispatchEvent(clickEvent);
            }
        });
        this.el.addEventListener("raycaster-intersected", evt => {
            self.intersectingRaycaster = evt.detail.el.components.raycaster;
            // console.log("raycaster-intersected");
        });
        this.el.addEventListener("raycaster-intersected-cleared", evt => {
            // console.log('raycaster-intersected-cleared');
            if (self.justHighlighted) {
                self.justHighlighted = false;
                return;
            }
            if (self.intersectingRaycaster != null) {
                const intersection = self.intersectingRaycaster.getIntersection(self.el);
                if (intersection == undefined) {
                    // console.log('intersection == undefined');
                    self.intersectingRaycaster = null;
                }
                else {
                    // console.log('intersecting:')
                    // console.log(intersection.object.name);
                }
            }
            else {
                // console.log('self.intersectingRaycaster is null')
            }
            
            if(self.data.hover) {
                self.el.setAttribute('text-link', {'hover': false});
            }
        });
    
        this.el.addEventListener("mousedown", evt => {
            self.el.setAttribute('text-link', {'active': true});
        });
        this.el.addEventListener("mouseup", evt => {
            self.el.setAttribute('text-link', {'active': false});
        });
    },
  
    update: function(oldData) {
        var self = this;
        var data = self.data;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
        if (['hover', 'active'].some(prop => changedData.includes(prop))) {
            var color = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;
            self.el.setAttribute('text', {'color': color});
        }
    },
  
    tick: function() {
      var self = this;
      if (!this.intersectingRaycaster) {
          return;
      }
  
      const intersection = this.intersectingRaycaster.getIntersection(this.el);
      self.intersection = intersection;
      if (intersection) {
          switch (intersection.object.name) {
              default:
                  if(!self.data.hover) {
                    self.el.setAttribute('text-link', {'hover': true});
                  }
                  break;
          }
      }
    },
  });
};