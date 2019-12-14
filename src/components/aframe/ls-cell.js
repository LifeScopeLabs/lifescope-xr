import { FONTS, DEFAULT_FONT, loadFont, computeWidth, computeFontWidthFactor } from './text-cell.js';

AFRAME.registerComponent('ls-cell', {

    schema: {
        id: { type: 'string', default: '' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },

        background: { type: 'boolean', default: true },
        bgColor: { default: 0x22252a },
        bgOpacity: { type: 'number', default: 0.7 },

        text: { type: 'string', default: 'text' },
        url: { type: 'string', default: '' },
        contenttype: { type: 'string', default: 'Type' },
        provider: { type: 'string', default: 'Provider' },
        title: { type: 'string', default: 'Title' },
        mediatype: { type: 'string', default: '' },

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
        typeEl.setAttribute('text-cell', { id: 'type', text: data.contenttype, width: data.width/2 - self.headerHeight,
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
        if (data.mediatype == '') {
            var contentHeight = self.data.height - (self.headerHeight * 3 );
            contentEl.setAttribute('text-cell', { id: 'content', text: data.text, width: data.width,
                height: contentHeight,
                fontsize: self.fontSize,
                wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                nobr: data.nobr } );
            contentEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        }
        else if (data.mediatype == 'video' || data.mediatype == 'image') {
            var mediaHeight = self.data.height - (self.headerHeight * 3 );
            contentEl.setAttribute('media-cell', { id: 'content',
                width: data.width,
                height: mediaHeight,
                url: data.url,
                type: data.mediatype,
                srcFit: 'bothmax',
                animateLoad: false,
                selected: true,
            } );
            contentEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
        }
        

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
        'src': 'ls-cell.url',
        'mediatype': 'ls-cell.mediatype',
        'width': 'ls-cell.width',
        'height': 'ls-cell.height',
        'fontsize': 'ls-cell.fontsize',
        'wrapcount': 'ls-cell.wrapcount',
        'background': 'ls-cell.background',
        'nobr': 'ls-cell.nobr',
        'color': 'ls-cell.color',
        'contenttype': 'ls-cell.contenttype',
        'provider': 'ls-cell.provider',
        'title': 'ls-cell.title',
        'font': 'ls-cell.font',
        'wrapfit': 'ls-cell.wrapfit',
	}
});
