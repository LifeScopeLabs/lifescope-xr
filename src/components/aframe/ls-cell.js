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
        // id: id,
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
    var halfLines = linesTotal % 2 == 0 ? linesTotal/2 : (linesTotal)/2 - 1;
    var offsetY = self.data.height/2;
    if (linesTotal>1) { offsetY -= halfLines*(lineHeight * textScale); }
    else { offsetY -= (lineHeight * textScale)/2 }

    textObj.translateY(offsetY);
    if (offset.x) textObj.translateX(offset.x);
    if (offset.y) textObj.translateY(offset.y);
    if (offset.z) textObj.translateZ(offset.z);

    self._setUpClipping(id);
}

function _setUpFAHandler(id='', offset={}) {
    var obj = this.el.getObject3D('fa-' + id);
    var width = obj.geometry.parameters.width;
    obj.translateX(width/2);
    obj.translateY(-width/2);
    if (offset.x) obj.translateX(offset.x);
    if (offset.y) obj.translateY(offset.y);
    if (offset.z) obj.translateZ(offset.z);
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


AFRAME.registerSystem('text-cell', {
    schema: {}, 

    init: function () {
        var oldUpdateLayout = AFRAME.components["text"].Component.prototype.updateLayout;
        AFRAME.components["text"].Component.prototype.updateLayout = function()
            {
                oldUpdateLayout.call(this);
                this.el.emit('textlayoutchanged', {name: this.attrName, id: this.id});
            };
    },
  
  });

AFRAME.registerComponent('text-cell', {

    schema: {
        id: { type: 'string', default: '' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },

        text: { type: 'string', default: 'text' },

        color:  { default: '#FFF' },

        fontsize: { type: 'number', default: 1 },
        wrapcount: { type: 'number', default: 20 },
        wrappixels: { type: 'number', default: 0 },

        nobr: { type: 'boolean', default: false },

        wrapfit: { type: 'boolean', default: false },
    },

    init() {
        var self = this;
        var data = self.data;
        this._createText = _createText.bind(this);
        this._setUpTextHandler = _setUpTextHandler.bind(this);
        this._setUpFAHandler = _setUpFAHandler.bind(this);
        this._setUpClipping = _setUpClipping.bind(this);

        var font = self.data.font || DEFAULT_FONT;

        var fontPromise = loadFont(FONTS[font]).then(
            (result) => {
                self.lineHeight = result.common.lineHeight;
                self.widthFactor = computeFontWidthFactor(result);
                self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                    self.widthFactor);

                self.textScale = self.data.width / self.textRenderWidth;
                self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;
                
                self.el.addEventListener('textlayoutchanged', self._textLayoutChangedHandler.bind(self));
                self.el.addEventListener('font-awesome.drawn', self._fontAwesomeDrawnHandler.bind(self))
            
                self._createText({ id: data.id, text: data.text, width: data.width, 
                    height: data.height, color: data.color });
            },
        );
    },

    _textLayoutChangedHandler(evt) {
        this._setUpTextHandler(evt.detail.id || '', {});
    },

    _fontAwesomeDrawnHandler(evt) {
        if (!!evt.detail) {
            this._setUpFAHandler(evt.detail.id, {});
        }
    }
});

AFRAME.registerPrimitive('a-text-cell', {
	defaultComponents: {
		'text-cell': {},
	},
	mappings: {
        'id': 'text-cell.id',
        'value': 'text-cell.text',
        'width': 'text-cell.width',
        'height': 'text-cell.height',
        'fontsize': 'text-cell.fontsize',
        'wrapcount': 'text-cell.wrapcount',
        'nobr': 'text-cell.nobr',
        'color': 'text-cell.color',
        'font': 'text-cell.font',
        'wrapfit': 'text-cell.wrapfit',
        'lines': 'text-cell.lines',
	}
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
                    headerWrapCount =  (self.data.width / (self.headerFontSize)) * (20/0.3); 
                }
                self.headerHeight = self.lineHeight * self.data.width / computeWidth(self.data.wrappixels, headerWrapCount,
                    self.widthFactor);
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
        
        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', { width: data.width, height: data.height, flexDirection: 'column',
            justifyContent: 'flexStart', alignItems: 'center' });

        var headerFlexEl = document.createElement('a-entity');
        headerFlexEl.setAttribute('flex-container', { width: data.width, height: self.headerHeight, flexDirection: 'row',
            justifyContent: 'space-evenly', alignItems: 'center' });
        headerFlexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

        var typeFAEl = document.createElement('a-entity');
        typeFAEl.setAttribute('width', self.headerHeight);
        typeFAEl.setAttribute('height', self.headerHeight);
        typeFAEl.setAttribute('font-awesome__type', { id: 'type', charcode: 'f121', fontSize: self.headerFontSize,
            size: 256, color: self.data.color, mesh: true,
            visibleWhenDrawn: false });
        typeFAEl.setAttribute('flex-item', { dimtype: 'el' });
        
        var typeEl = document.createElement('a-entity');
        typeEl.setAttribute('text-cell', { id: 'type', text: data.type, width: data.width/2 - self.headerHeight,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            nobr: data.nobr } );
        typeEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var providerEl = document.createElement('a-entity');
        providerEl.setAttribute('text-cell', { id: 'provider', text: data.provider,
            width: data.width/2 - self.headerHeight,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            nobr: data.nobr } );
        providerEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var providerFAEl = document.createElement('a-entity');
        providerFAEl.setAttribute('width', self.headerHeight);
        providerFAEl.setAttribute('height', self.headerHeight);
        providerFAEl.setAttribute('font-awesome__provider', { id: 'provider', charcode: 'f09b',
            fontSize: self.headerFontSize,
            size: 256, color: self.data.color,
            mesh: true,
            version: '"Font Awesome 5 Brands"' });
        providerFAEl.setAttribute('flex-item', { dimtype: 'el' });

        var titleEl = document.createElement('a-entity');
        titleEl.setAttribute('text-cell', { id: 'title', text: data.title, width: self.data.width,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            color: '#2ac1de',
            nobr: data.nobr } );
        titleEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var contentEl = document.createElement('a-entity');
        var contentHeight = self.data.height - (self.headerHeight * 3 );
        contentEl.setAttribute('text-cell', { id: 'content', text: data.text, width: data.width,
            height: contentHeight,
            fontsize: self.fontSize,
            wrapcount: data.wrapcount, wrapfit: data.wrapfit,
            nobr: data.nobr } );
        contentEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var tagsEl = document.createElement('a-entity');
        tagsEl.setAttribute('text-cell', { id: 'tags', text: '#TAGS', width: data.width,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            color: '#2ac1de',
            nobr: data.nobr } );
        tagsEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        headerFlexEl.appendChild(typeFAEl);
        headerFlexEl.appendChild(typeEl);
        headerFlexEl.appendChild(providerEl);
        headerFlexEl.appendChild(providerFAEl);
        flexEl.appendChild(headerFlexEl);
        flexEl.appendChild(titleEl);
        flexEl.appendChild(contentEl);
        flexEl.appendChild(tagsEl);
        self.el.appendChild(flexEl);
        headerFlexEl.setAttribute('needsUpdate', true);
        flexEl.setAttribute('needsUpdate', true);
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

});

AFRAME.registerPrimitive('a-ls-cell', {
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