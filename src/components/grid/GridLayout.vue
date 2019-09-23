<template>
    <a-entity class="xr-grid" :position="'0 0 ' + offsetz">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
        <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8;" position="-1 -1 0"></a-entity>
        <a-light type='point' color='#FFF' intensity='0.8' position="10 10 0" ></a-light>
        <!-- <a-light type='hemisphere' color='#FFF' groundColor='#00F' intensity='0.8' ></a-light> -->
    

        <a-entity v-for="(item, n) in items"
            :key="'grid-cell-' + n"
            :rotation="dioramaRotation(n)"
            :position="dioramaPosition(n)">
            
            <a-diorama-grid-cell
                class="clickable gridcell"
                :id="'grid-cell-' + n"
                :type="item.type"
                :src="imageSrc(item)"
                :width="cellWidth"
                @mousedown="activeListener"
                @mouseup="activeEndListener"
                />
        </a-entity>

        <a-arrow class="grid-arrow-left clickable" direction="left" :position="leftArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageLeft"
            @raycaster-intersected="hoverListener"
            @raycaster-intersected-cleared="hoverEndListener"
            @mousedown="activeListener"
            @mouseup="activeEndListener"
            @click="handlePageLeft"
            />

        <a-arrow class="grid-arrow-right clickable" direction="right" :position="rightArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageRight"
            @raycaster-intersected="hoverListener"
            @raycaster-intersected-cleared="hoverEndListener"
            @mousedown="activeListener"
            @mouseup="activeEndListener"
            @click="handlePageRight"
            />

        <a-entity v-if="focusedCell != ''"
            class="focused-cell-controls"
            :position="-0.3 + ' ' + 0.1 + ' ' + (-offsetz - 0.5)">

            <a-arrow
                :disabled="focusedCellIndex==0 && !canPageLeft"
                class="cell-arrow-left clickable" direction="left"
                :position="-(cellWidth/2 + 0.05)+ ' 0 0'"
                :width="0.3"
                :height="0.04"
                @raycaster-intersected="hoverListener"
                @raycaster-intersected-cleared="hoverEndListener"
                @mousedown="activeListener"
                @mouseup="activeEndListener"
                @click="previousCell"
            />
            <a-arrow 
                :disabled="focusedCellIndex==(numberOfItemsToDisplay - 1) && !canPageRight"
                class="cell-arrow-right clickable" direction="right"
                :position="(cellWidth/2 + 0.05)+ ' 0 0'"
                :width="0.3"
                :height="0.04"
                @raycaster-intersected="hoverListener"
                @raycaster-intersected-cleared="hoverEndListener"
                @mousedown="activeListener"
                @mouseup="activeEndListener"
                @click="nextCell"
                />
        </a-entity>

    <!-- Demo Map -->
    <!-- Floor -->
    <a-mapbox-terrain v-if="floorMapActive == true"
        position="0 0.1 0" :scale="floorScale + ' 1 ' + floorScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="floorZoom" :rows="floorRows"
        :highdpi="floorHighDPI"
        :heightmap="floorMapHeightmap"
        :heightmapheight="floorMapHeight"
        :type="mapboxType"></a-mapbox-terrain>
    <!-- World -->
    <a-mapbox-terrain v-if="worldMapActive == true"
        position="0 -4 0" :scale="worldScale + ' 1 ' + worldScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="worldZoom" :rows="worldRows"
        :highdpi="worldHighDPI"
        :heightmap="worldMapHeightmap"
        :heightmapheight="worldMapHeight"></a-mapbox-terrain>

  </a-entity>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {


    data () {
        return {
            focusedCell: '',
            dur: 0.5, //seconds
        }
    },

    props: ['offsetz'],

    computed: {
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },

        items() {
            return this.sortedLSObjs.slice(this.page * this.itemsPerPage, (this.page+1) * this.itemsPerPage);
        },
        numberOfItemsToDisplay() {
            return Math.min(this.itemsPerPage, this.items.length);
        },

        focusedCellIndex() {
            if (this.focusedCell == '') {
                return -1;
            }
            return +(this.focusedCell.match(/\d+$/)[0]);
        },

        ...mapState('xr',
            [
                'LSObjs',
                'roomConfig'
            ]
        ),

        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading',
            ]
        ),
        
        ...mapState('xr/map',
            [
                // 'globeActive',
                'floorMapActive',
                'worldMapActive',
                'mapLatitude',
                'mapLongitude',
                'mapboxType',

                'floorRows',
                'floorZoom',
                'floorHighDPI',
                'floorScale',
                'floorMapHeightmap',
                'floorMapHeight',

                'worldRows',
                'worldZoom',
                'worldHighDPI',
                'worldScale',
                'worldMapHeightmap',
                'worldMapHeight',

            ]
        ),

        ...mapState('xr/grid',
            [
                'page',
                'columns',
                'rows',
                'radius',
                'top',
                'bottom',
                'cellWidth',
                'arrowWidth',
                'arrowHeight',
            ]
        ),

        ...mapGetters('xr/grid',
            [
                'itemsPerPage',
                'canPageLeft',
                'canPageRight'
            ]
        ),

        leftArrowPosition() {
            return `-0.5 ${this.bottom} ${-this.offsetz - 1.4}`;
        },

        rightArrowPosition() {
            return `0.5 ${this.bottom} ${-this.offsetz - 1.4}`;
        }
    },

    mounted() {
        var self = this;
        this.$el.addEventListener("cellclicked", self.cellClickedHandler);
    },

    beforeDestroy() {
        this.$el.removeEventListener("cellclicked", self.cellClickedHandler);
    },

    methods: {

        ...mapActions('xr/grid/',
        [
            'pageRight',
            'pageLeft'
        ]),

        imageSrc: function (image) {
            if(!image)
                return '';
            else
                return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
        },

        dioramaRotation: function(itemNum) {
            var column = itemNum % this.columns;
            var columnOneTheta = Math.PI + Math.PI/8;
            var percentOfFOV = 0.8;
            var FOV = (80/360) * (2*Math.PI); // active camera component's object3D.fov
            var offsetPerColumn = percentOfFOV*FOV/this.columns;
            var centerImageOffset = Math.atan((this.cellWidth/2)/this.radius);// aprox
            var theta = ( columnOneTheta) - (column *  offsetPerColumn) + centerImageOffset;

            var roty = theta * (180/Math.PI);
            var rotx = 0;

            return `${rotx} ${roty} 0`;
        },

        // itemNum 0-indexed
        dioramaPosition: function(itemNum) {
            var column = itemNum % this.columns;
            
            var row = 0;
            var n = itemNum;
            while ( n >= this.columns) {
                row += 1;
                n -= this.columns;
            }

            var columnOneTheta = Math.PI + Math.PI/8;
            var percentOfFOV = 0.8;
            var FOV = (80/360) * (2*Math.PI); // active camera component's object3D.fov
            var offsetPerColumn = percentOfFOV*FOV/this.columns;
            var centerImageOffset = Math.atan((this.cellWidth/2)/this.radius);// aprox
            var theta = ( columnOneTheta) - (column *  offsetPerColumn) + centerImageOffset;

            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            var x = (this.radius) * sinTheta;
            var z = (this.radius) * cosTheta;

            var offsetPerRow = (this.top - this.bottom) / this.rows;
            var y = this.top - row * (offsetPerRow);

            return `${x} ${y} ${z}`;
        },

        hoverListener(evt) {
            evt.target.setAttribute('hover', true);
        },
        hoverEndListener(evt) {
            evt.target.setAttribute('hover', false);
        },

        activeListener(evt) {
            evt.target.setAttribute('active', true);
        },
        activeEndListener(evt) {
            evt.target.setAttribute('active', false);
        },

        nextCell(evt) {
            var n = this.focusedCellIndex;
            if (n == this.numberOfItemsToDisplay - 1 && this.canPageRight) {
                this.pageRight();
            }
            var m = (n + 1) % this.numberOfItemsToDisplay;
            var nextCellId = this.focusedCell.replace(/\d+$/, m);
            var focusedCellEl = document.querySelector('#' + this.focusedCell);
            var nextCellEl =  document.querySelector('#' + nextCellId);
            this.unFocusCell(focusedCellEl);
            this.focusCell(nextCellEl);
        },

        previousCell(evt) {
            var n = this.focusedCellIndex;

            if (n == 0 && this.canPageLeft) {
                this.pageLeft();
            }
            var m = n == 0 ? this.numberOfItemsToDisplay - 1 : n - 1;

            var previousCellId = this.focusedCell.replace(/\d+$/, m);
            var focusedCellEl = document.querySelector('#' + this.focusedCell);
            var previousCellEl =  document.querySelector('#' + previousCellId);
            this.unFocusCell(focusedCellEl);
            this.focusCell(previousCellEl);
        },

        cellClickedHandler(evt) {
            var self = this;
            var el = evt.target;
            var id = el.id;

            switch (self.focusedCell) {
                case '':
                    self.focusedCell = id;
                    self.focusCell(el);
                    break;
                case id:
                    self.unFocusCell(el);
                    self.focusedCell = '';
                    break;
                default:
                    var focusedCellEl = document.querySelector('#' + self.focusedCell);
                    self.unFocusCell(focusedCellEl);
                    self.focusCell(el);
                    break;
            }
        },

        focusCell(el) {
            var self = this;
            if (CONFIG.DEBUG) {console.log('focusCell');}   
            AFRAME.ANIME({
                targets: el.parentEl.object3D.position,
                easing: 'linear',
                x: -0.3,
                y: 0.1,
                z: (-self.offsetz - 0.5),
                duration: self.dur*1000,
                begin: function(anim) {
                    self.focusedCell = el.id;
                },
                complete: function(anim) {
                    el.setAttribute('selected', true);
                }
            });
            AFRAME.ANIME({
                targets: el.parentEl.object3D.rotation,
                easing: 'linear',
                x: 0,
                y: Math.PI,
                z: 0,
                duration: self.dur*1000
            });
        },

        unFocusCell(el) {
            var self = this;
            if (CONFIG.DEBUG) {console.log('unFocusCell');}      
            var posx, posy, posz, rotx, roty, rotz;
            var id = el.id;
            var n = id.match(/\d+$/);
            var position = self.dioramaPosition(+n);
            var positionArray = position.split(' ');
            posx = +positionArray[0];
            posy = +positionArray[1];
            posz = +positionArray[2];
            var rotation = self.dioramaRotation(+n);
            var rotationArray = rotation.split(' ');
            rotx = +rotationArray[0] * (Math.PI/180) ;
            roty = +rotationArray[1] * (Math.PI/180);
            rotz = +rotationArray[2] * (Math.PI/180);
            AFRAME.ANIME({
                targets: el.parentEl.object3D.position,
                easing: 'linear',
                x: posx,
                y: posy,
                z: posz,
                duration: self.dur*1000,
                begin: function(anim) {
                    el.setAttribute('selected', false);
                }
            });
            AFRAME.ANIME({
                targets: el.parentEl.object3D.rotation,
                easing: 'linear',
                x: rotx,
                y: roty,
                z: rotz,
                duration: self.dur*1000
            });
        },
        unFocusFoscusedCell() {
            if (this.focusedCell) {
                var focusedCellEl = document.querySelector('#' + this.focusedCell);
                this.focusedCell = '';
                this.unFocusCell(focusedCellEl);
            }
        },

        handlePageLeft() {
            this.unFocusFoscusedCell();
            this.pageLeft();
        },

        handlePageRight() {
            this.unFocusFoscusedCell();
            this.pageRight();
        },

    }
}
</script>
