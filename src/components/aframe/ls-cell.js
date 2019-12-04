var loadBMFont = require('load-bmfont');

var FONT_BASE_URL = 'https://cdn.aframe.io/fonts/';
var FONTS = {
  aileronsemibold: FONT_BASE_URL + 'Aileron-Semibold.fnt',
  dejavu: FONT_BASE_URL + 'DejaVu-sdf.fnt',
  exo2bold: FONT_BASE_URL + 'Exo2Bold.fnt',
  exo2semibold: FONT_BASE_URL + 'Exo2SemiBold.fnt',
  kelsonsans: FONT_BASE_URL + 'KelsonSans.fnt',
  monoid: FONT_BASE_URL + 'Monoid.fnt',
  mozillavr: FONT_BASE_URL + 'mozillavr.fnt',
  roboto: FONT_BASE_URL + 'Roboto-msdf.json',
  sourcecodepro: FONT_BASE_URL + 'SourceCodePro.fnt'
};
var DEFAULT_FONT = 'roboto';

function loadFont (src, yOffset) {
    return new Promise(function (resolve, reject) {
      loadBMFont(src, function (err, font) {
        if (err) {
          error('Error loading font', src);
          reject(err);
          return;
        }
  
        // Fix negative Y offsets for Roboto MSDF font from tool. Experimentally determined.
        if (src.indexOf('/Roboto-msdf.json') >= 0) { yOffset = 30; }
        if (yOffset) { font.chars.map(function doOffset (ch) { ch.yoffset += yOffset; }); }
  
        resolve(font);
      });
    });
  }

  function computeFontWidthFactor (font) {
    var sum = 0;
    var digitsum = 0;
    var digits = 0;
    font.chars.map(function (ch) {
      sum += ch.xadvance;
      if (ch.id >= 48 && ch.id <= 57) {
        digits++;
        digitsum += ch.xadvance;
      }
    });
    return digits ? digitsum / digits : sum / font.chars.length;
  }

  function computeWidth (wrapPixels, wrapCount, widthFactor) {
    return wrapPixels || ((0.5 + wrapCount) * widthFactor);
  }


function _createText(opts={})  {
    var self = this;

    var id = opts.id || '';
    var textName = id != '' ? `text__${id}` : 'text';

    var fontSize = opts.fontsize || self.data.fontsize;
    var width = opts.width || self.data.width;
    var wrapCount = opts.wrapcount || self.data.wrapcount;
    if (self.data.wrapfit) {
        wrapCount =  (width / fontSize) * (20/0.3);
    }
    var wrapSize = (wrapCount) / 20;
    var widthScale = 0.3 / (width);
    var textWidth = width * fontSize * widthScale * wrapSize;
    var xOffset = (textWidth - width) / 2;

    var text = opts.text || self.data.text;
    var height = opts.height || self.data.height;
    var color = opts.color || self.data.color;

    self.el.setAttribute(textName, {
        value: text,
        width: textWidth,
        height: height,
        wrapCount: wrapCount,
        xOffset: xOffset,
        color: color,
    });

    var textObj = self.el.getObject3D(textName);
    this.textObj = textObj;
}

function _setUpTextHandler(id='', offset={}) {
    var self = this;
    var object3DName = id != '' ? `text__${id}` : 'text';
    var textObj = self.el.getObject3D(object3DName);
    var lineHeight = textObj.geometry.layout._lineHeight;
    var linesTotal = textObj.geometry.layout._linesTotal;
    var textScale = textObj.scale.x;
    var halfLines = linesTotal % 2 == 0 ? linesTotal/2 : (linesTotal)/2 - 1;//linesTotal/2 - 1 : linesTotal/2;
    var offsetY = self.data.height/2;
    if (linesTotal>1) { offsetY -= halfLines*(lineHeight * textScale); }
    else { offsetY -= (lineHeight * textScale)/2 }


    textObj.translateY(offsetY);
    if (offset.x) textObj.translateX(offset.x);
    if (offset.y) textObj.translateY(offset.y);
    if (offset.z) textObj.translateZ(offset.z);

    self._setUpClipping(id);
}

function _setUpClipping(id='') {
    var self = this;
    var el = self.el;

    var object3DName = id != '' ? `text__${id}` : 'text';
    var textObj = self.el.getObject3D(object3DName);
    var lineHeight = textObj.geometry.layout._lineHeight;
    var linesTotal = textObj.geometry.layout._linesTotal;
    var textScale = textObj.scale.x;

    var offsetY = 0;
    if (self.offsetMap.has(id)) {
        var offset = self.offsetMap.get(id);
        offsetY = offset.y != undefined ? offset.y : 0;
    }

    var renderer = el.sceneEl.renderer;
    renderer.localClippingEnabled = true;

    el.sceneEl.object3D.updateMatrixWorld();
    var posy = el.object3D.getWorldPosition().y;
    var height = textObj.geometry.layout._opt.height;

    var normalBot = new THREE.Vector3( 0, 1, 0 );
    var constantBot = -(posy + self.data.height/2 + offsetY - height);

    if (self.data.nobr) {

        var lineRemainder = (height) % (lineHeight * textScale);
        constantBot -= lineRemainder;
    }

    var clippingPlaneBot = new THREE.Plane( normalBot, constantBot );
    self.clippingPlaneBot = clippingPlaneBot;

    var normalTop = new THREE.Vector3( 0, -1, 0 );
    var constantTop = posy + self.data.height/2 + offsetY;
    var clippingPlaneTop = new THREE.Plane( normalTop, constantTop );
    self.clippingPlaneTop = clippingPlaneTop;

    var mat = textObj.material;
    mat.clipping = true;
    mat.clippingPlanes = [clippingPlaneBot, clippingPlaneTop];

    mat.vertexShader = 'precision highp float;\n' + 
        '#include  <clipping_planes_pars_vertex>\n' +
        mat.vertexShader.replace(/(void main.*)/, '$1\n  #include <begin_vertex>')
        .replace(/}$/, '  #include <project_vertex>\n  #include <clipping_planes_vertex>\n}');

    mat.fragmentShader = 'precision highp float;\n' + 
        '#include  <clipping_planes_pars_fragment>\n' + 
        mat.fragmentShader.replace(/(void main.*)/, '$1\n  #include <clipping_planes_fragment>');
    mat.needsUpdate = true;
}

AFRAME.registerSystem('ls-cell', {
    schema: {}, 

    init: function () {
        // add textlayoutchanged event to text component's updateLayout
        var oldUpdateLayout = AFRAME.components["text"].Component.prototype.updateLayout;
        AFRAME.components["text"].Component.prototype.updateLayout = function()
            {
                oldUpdateLayout.call(this);
                this.el.emit('textlayoutchanged', {name: this.attrName, id: this.id});
            };
    },
  
  });

AFRAME.registerComponent('ls-cell', {

    schema: {
        id: { type: 'string', default: '' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },

        background: { type: 'boolean', default: true },
        bgColor: { default: 0x22252a },
        bgOpacity: { type: 'number', default: 0.7 },

        text: { type: 'string', default: 'text' },
        type: { type: 'string', default: 'Type' },
        provider: { type: 'string', default: 'Provider' },
        title: { type: 'string', default: 'Title' },

        color:  { default: '#FFF' },

        fontsize: { type: 'number', default: 1 },
        wrapcount: { type: 'number', default: 20 },
        wrappixels: { type: 'number', default: 0 },

        nobr: { type: 'boolean', default: false },

        border: { type: 'boolean', default: true },
        bordersize: { type: 'number', default: 0.05 },
        borderColor: { default: '#484848' },

        wrapfit: { type: 'boolean', default: false },

    },

    init: function() {
        var self = this;
        this._createText = _createText.bind(this);
        this._setUpTextHandler = _setUpTextHandler.bind(this);
        this._setUpClipping = _setUpClipping.bind(this);

        self.headerScale = 2;
        self.headerFontSize = self.data.fontsize * self.headerScale;

        var font = self.data.font || DEFAULT_FONT;
        loadFont(FONTS[font]).then(
            (result) => {
                self.lineHeight = result.common.lineHeight;
                self.widthFactor = computeFontWidthFactor(result);
                self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                    self.widthFactor);
                self.textScale = self.data.width / self.textRenderWidth;
                self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;

                var headerWrapCount = self.data.wrapcount/self.headerScale;
                if (self.data.wrapfit) {
                    headerWrapCount =  (self.data.width / (self.headerFontSize)) * (20/0.3); // 44/0.675
                }
                self.headerHeight = self.lineHeight * self.data.width / computeWidth(self.data.wrappixels, headerWrapCount,
                    self.widthFactor);

                var offsetMap = new Map();
                self.offsetMap = offsetMap;
                offsetMap.set('type', { x: -self.data.width/4 });
                offsetMap.set('provider', { x: self.data.width/4 });
                offsetMap.set('title', { y: -(self.headerHeight) });
                offsetMap.set('content', { y: -(self.headerHeight) * 2 });
                offsetMap.set('tags', { y: -self.data.height + self.textHeight});

                self.el.addEventListener('textlayoutchanged', self._textLayoutChangedHandler.bind(self));
                this._createCell();
            },
        );
        
    },

    _createCell: function() {
        var self = this;
        var data = self.data;

        if (self.data.background) {
            self._createBackground();
        }
        
        self._createText({ id: 'type', text: data.type, width: self.data.width/2, height: self.headerHeight,
            fontsize: self.headerFontSize, wrapcount: self.data.wrapcount/2 });
        self._createText({ id: 'provider', text: data.provider, width: self.data.width/2, height: self.headerHeight,
            fontsize: self.headerFontSize, wrapcount: self.data.wrapcount/2  });
        self._createText({ id: 'title', text: data.title, width: self.data.width,  height: self.headerHeight,
            color: '#2ac1de', fontsize: self.headerFontSize, wrapcount: self.data.wrapcount/2  });
        self._createText({ id: 'content', text: data.text, width: self.data.width, 
            height: self.data.height - (self.headerHeight * 2 + self.textHeight), color: '#aeaeae' });
        self._createText({ id: 'tags', text: '#TAGS', width: self.data.width,  height: self.textHeight,
            color: '#2ac1de', });

    },

    _createBackground() {
        var self = this;
        var bgGeom = new THREE.PlaneBufferGeometry(self.data.width, self.data.height);
        var bgMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: self.data.bgOpacity,
            side: THREE.DoubleSide,
            color: new THREE.Color(self.data.bgColor),
        })
        var bgMesh = new THREE.Mesh(bgGeom, bgMat);
        bgMesh.name = 'mBackground';

        self.el.setObject3D('background', bgMesh);
        if (self.data.border) {
            self._createBorder();
        }
    },

    _createBorder() {
        var self = this;
        var geom = new THREE.PlaneBufferGeometry(self.data.width + self.data.bordersize,
            self.data.height + self.data.bordersize);
        geom.translate(0, 0, -0.001);
        var mat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: self.data.bgOpacity,
            side: THREE.DoubleSide,
            color: new THREE.Color(self.data.borderColor),
        })
        var mesh = new THREE.Mesh(geom, mat);
        mesh.name = 'mBorder';

        self.el.setObject3D('border', mesh);
    },

    _textLayoutChangedHandler(evt) {
        var self = this;
        if (self.offsetMap.has(evt.detail.id)) {
            self._setUpTextHandler(evt.detail.id, self.offsetMap.get(evt.detail.id));
        }

    },

});

AFRAME.registerPrimitive('a-ls-cell', {// AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
	defaultComponents: {
		'ls-cell': {},
	},
	mappings: {
        'value': 'ls-cell.text',
        'width': 'ls-cell.width',
        'height': 'ls-cell.height',
        'fontsize': 'ls-cell.fontsize',
        'wrapcount': 'ls-cell.wrapcount',
        'background': 'ls-cell.background',
        'nobr': 'ls-cell.nobr',
        'color': 'ls-cell.color',
        'type': 'ls-cell.type',
        'provider': 'ls-cell.provider',
        'title': 'ls-cell.title',
        'font': 'ls-cell.font',
        'wrapfit': 'ls-cell.wrapfit',
	}
});