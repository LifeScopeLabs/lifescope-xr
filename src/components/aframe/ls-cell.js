function _createText(opts={})  {
    var self = this;

    var id = opts.id || '';
    var textName = id != '' ? `text__${id}` : 'text';

    var width = opts.width || self.data.width;
    var wrapCount = opts.wrapcount || self.data.wrapcount;
    var wrapSize = (wrapCount) / 20;
    var widthScale = 0.3 / (width);
    var fontSize = opts.fontsize || self.data.fontsize;
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
    var halfLines = linesTotal % 2 == 0 ? linesTotal/2 - 1 : linesTotal/2;
    var offsetY = textObj.geometry.layout._opt.height/2 - halfLines*(lineHeight * textScale);

    self.lineHeight = lineHeight;
    self.linesTotal = linesTotal;
    self.textScale = textScale;

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

    var renderer = el.sceneEl.renderer;
    renderer.localClippingEnabled = true;

    el.sceneEl.object3D.updateMatrixWorld();
    var posy = el.object3D.getWorldPosition().y;
    var height = textObj.geometry.layout._opt.height;

    var normalBot = new THREE.Vector3( 0, 1, 0 );
    var constantBot = -posy + self.data.height/2;
    if (!self.data.breaklines) {

        var lineRemainder = (height) % (lineHeight * textScale);
        constantBot -= lineRemainder;
    }
    var clippingPlaneBot = new THREE.Plane( normalBot, constantBot );
    self.clippingPlaneBot = clippingPlaneBot;

    var normalTop = new THREE.Vector3( 0, -1, 0 );
    var constantTop = posy + self.data.height/2;
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

        breaklines: { type: 'boolean', default: true },

        datgui: { type: 'boolean', default: false }
    },

    init: function() {
        var self = this;
        this._createText = _createText.bind(this);
        this._setUpTextHandler = _setUpTextHandler.bind(this);
        this._setUpClipping = _setUpClipping.bind(this);

        self.el.addEventListener('textlayoutchanged', self._textLayoutChangedHandler.bind(self));
        this._createCell();
    },


    _createCell: function() {
        var self = this;
        var data = self.data;

        if (self.data.background) {
            self._createBackground();
        }
        
        self._createText({ id: 'type', text: data.type, width: self.data.width/2 });
        self._createText({ id: 'provider', text: data.provider, width: self.data.width/2 });
        self._createText({ id: 'title', text: data.title, width: self.data.width, color: '#2ac1de' });
        self._createText({ id: 'content', text: data.text, width: self.data.width, color: '#aeaeae' });
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
    },


    _textLayoutChangedHandler(evt) {
        var self = this;
        var width = self.data.width;
        var height = self.data.height;
        switch (evt.detail.name) {
            case 'text__type':
                this._setUpTextHandler('type', {x:-width/4});
            break;
            case 'text__provider':
                this._setUpTextHandler('provider', {x:width/4});
                break;
            case 'text__title':
                this._setUpTextHandler('title', {y:-0.1});
                break;
            case 'text__content':
                this._setUpTextHandler('content', {y:-0.2});
                break;
            default:
                if (evt.detail.name.startsWith('text')) {
                    this._setUpTextHandler();
                }
                break;
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
        'datgui': 'ls-cell.datgui',
        'fontsize': 'ls-cell.fontsize',
        'wrapcount': 'ls-cell.wrapcount',
        'breaklines': 'ls-cell.breaklines',
        'color': 'ls-cell.color',
        'type': 'ls-cell.type',
        'provider': 'ls-cell.provider',
        'title': 'ls-cell.title',
	}
});