<template>
    <a-entity class="xr-grid" :position="'0 0 ' + offsetz">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
        <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8;" position="-1 -1 0"></a-entity>
        <a-light type='point' color='#FFF' intensity='0.8' position="10 10 0" ></a-light>
        <a-light type='hemisphere' color='#FFF' groundColor='#00F' intensity='0.8' ></a-light>
    
        
        <a-entity class="grid-cylinder"
            :rotation="'0 ' + gridRotation + ' 0'"
            :position="'0 ' + gridOffsetY + ' 0'">

            <a-entity v-for="(item, n) in items"
                :key="'grid-cell-' + n"
                :position="gridCellPosition(n)"
                :rotation="gridCellRotation(n)">
                
                <a-diorama-grid-cell
                    class="clickable gridcell"
                    :id="'grid-cell-' + n"
                    :type="item.type"
                    :src="imageSrc(item)"
                    :width="cellWidth"
                    :height="cellContentHeight"
                    srcFit="bothmax"
                    :animatein="animateInSeconds"
                    highlight="type: border; target: image;"
                    />
            </a-entity>

            <a-entity class="skybox-selector"
                :position="gridCellPosition(-3)">
                <a-entity  v-if="skybox==SkyboxEnum.STARS"
                    id="sun-selector"
                    class="clickable"
                    geometry="primitive: sphere; radius: 0.05;"
                    material="shader: sunSky"
                    highlight="type: border;">
                </a-entity>
                <a-entity  v-else-if="skybox==SkyboxEnum.SUN"
                    id="stars-selector"
                    class="clickable"
                    geometry="primitive: sphere; radius: 0.05;"
                    material="shader: standard; src: #sky"
                    highlight="type: border;"
                    rotation="90 0 90">
                </a-entity>
            </a-entity>

            <a-entity class="floor-map-selector"
                :position="gridCellPosition(-4)">
                <a-entity
                    id="floor-map-selector"
                    class="clickable"
                    geometry="primitive: sphere; radius: 0.05;"
                    material="shader: standard; src: #earth"
                    highlight="type: border;">
                </a-entity>
            </a-entity>

        </a-entity>

        <a-arrow class="grid-arrow-left clickable" direction="left" :position="leftArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageLeft"
            @click="handlePageLeft"
            />

        <a-arrow class="grid-arrow-right clickable" direction="right" :position="rightArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageRight"
            @click="handlePageRight"
            />

        <a-entity v-if="focusedCell != ''"
            class="focused-cell-controls"
            :position="focusedCellPosititon.x + ' ' +focusedCellPosititon.y + ' ' + (focusedCellPosititon.z - offsetz)">
            <a-arrow
                :disabled="focusedCellIndex==0 && !canPageLeft"
                class="cell-arrow-left clickable"
                direction="left"
                :position="-((cellWidth * focusedCellScale.x)/2 + 0.05)+ ' 0 0'"
                :width="0.3"
                :height="0.04"
                @click="previousCell"
            />
            <a-arrow 
                :disabled="focusedCellIndex==(numberOfItemsToDisplay - 1) && !canPageRight"
                class="cell-arrow-right clickable"
                direction="right"
                :position="((cellWidth * focusedCellScale.x)/2 + 0.05)+ ' 0 0'"
                :width="0.3"
                :height="0.04"
                @click="nextCell"
                />
        </a-entity>

    <!-- Demo Map -->
    <!-- Floor -->
    <a-mapbox-terrain v-if="floorMapActive == true"
        :position="'0 -1.6 ' + -offsetz"
        :scale="floorScale + ' 1 ' + floorScale"
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

    <!-- Room Selector -->
    <room-display 
        :position="'0.1 0.03 ' + (-offsetz)"
        rotation="0 -90 0"
    />

    <!-- Carousel Selector -->

    <!-- Earth -->
        <a-sphere 
                id="Earth" class="boundry clickable"
                @click="toggleLayout"
                :position="'0 0 0' " 
                radius=".99" 
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;"
                animation="property: rotation; easing: linear; to: 0 360; dur: 150000; loop: true;">
        </a-sphere>

        <!-- Logo  -->
        <a-entity 
                id="Logo" :position="'0 1.1 0'"
                rotation="0 0 0"
                animation="property: rotation; easing: linear; to: 0 -360; dur: 42000; loop: true;">
            <a-gltf-model 
                class="clickable"
                @click="toggleLayout"
                src="#logo"
                scale="0.075 0.075 0.075">
            </a-gltf-model>
        </a-entity>
  </a-entity>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import { Cylinder, CylindricalGrid } from '../../util/GridUtils';

import RoomDisplay from '../hud/vr/vrRoomDisplay.vue';

import { SceneLayoutEnum } from '../../store/modules/xr';
import { SkyboxEnum } from '../../store/modules/xr/modules/graphics';

export default {

    components: {
        RoomDisplay
    },

    data () {
        return {
            focusedCell: '',
            dur: 0.5, //seconds
            cylinder: null,
            cylindricalGrid: null,
            cellsPerRow: 28,
            SkyboxEnum: SkyboxEnum,
            focusedCellPosititon: { x:0, y:0.1, z:-1 },
            focusedCellScale: { x:1.5, y:1.5, z:1 },
            gridOffsetY: -0.3,
            paginatorOffsetZ: 1.4,
        }
    },

    props: ['offsetz'],

    computed: {
        gridRotation() {
            return (180-(360/this.cellsPerRow)*2);
        },

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
                'roomConfig',
                'sceneLayout',
            ]
        ),

        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading',
                'skybox',
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
                'cellHeight',
                'cellContentHeight',
                'arrowWidth',
                'arrowHeight',
                'animateInSeconds',
                'animateOutSeconds',
            ]
        ),

        ...mapGetters('xr/grid',
            [
                'itemsPerPage',
                'canPageLeft',
                'canPageRight',
            ]
        ),

        leftArrowPosition() {
            return `${-this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.paginatorOffsetZ}`;
        },

        rightArrowPosition() {
            return `${this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.paginatorOffsetZ}`;
        },

    },

    created() {
        this.cylinder = new Cylinder(this.cellsPerRow, this.cellHeight, this.radius);
        this.cylindricalGrid = new CylindricalGrid(this.cellsPerRow, this.cellHeight,
            this.radius, this.rows, this.columns);
    },

    mounted() {
        var self = this;
        this.$el.addEventListener("cellclicked", self.cellClickedHandler);
        this.$el.addEventListener("objectclicked", self.objectClickedHandler);
    },

    beforeDestroy() {
        var self = this;
        this.$el.removeEventListener("cellclicked", self.cellClickedHandler);
        this.$el.removeEventListener("objectclicked", self.objectClickedHandler);
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

        gridCellRotation: function(itemNum) {
            var rot = this.cylindricalGrid.cellRotation(itemNum);
            return `${rot.x} ${rot.y + 180} ${rot.z}`;
        },

        gridCellPosition: function(itemNum) {
            var pos = this.cylindricalGrid.cellPosition(itemNum);
            return `${pos.x} ${pos.y} ${pos.z}`;
        },

        cylinderRotation: function(column, row) {
            var rot = this.cylinder.cellRotation(column, row);
            return `${rot.x} ${rot.y} ${rot.z}`;
        },

        cylinderPosition: function(column, row) {
            var pos = this.cylinder.cellPosition(column, row);
            return `${pos.x} ${pos.y} ${pos.z}`;
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

            if (id == 'grid-cell-carousel') {
                self.toggleLayout();
                return;
            }

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

        objectClickedHandler(evt) {
            var self = this;
            var el = evt.target;
            var id = el.id;

            switch (id) {
                case 'stars-selector':
                    this.$store.commit('xr/graphics/SET_SKYBOX', 'STARS');
                    break;
                case 'sun-selector':
                    this.$store.commit('xr/graphics/SET_SKYBOX', 'SUN');
                    break;
                case 'floor-map-selector':
                    this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', !this.floorMapActive);
                    break;
                default:
                    break;
            }
        },

        focusCell(el) {
            var self = this;
            if (CONFIG.DEBUG) {console.log('focusCell');}

            var cylinderEl = this.$el.querySelector(".grid-cylinder");
            var fcp = self.focusedCellPosititon;
            var position = new THREE.Vector3( fcp.x, fcp.y, fcp.z );
            position = cylinderEl.object3D.worldToLocal(position);

            AFRAME.ANIME({
                targets: el.parentEl.object3D.position,
                easing: 'linear',
                x: position.x,
                y: position.y,
                z: position.z,
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
                y: THREE.Math.degToRad(360-self.gridRotation),
                z: 0,
                duration: self.dur*1000
            });
            AFRAME.ANIME({
                targets: el.parentEl.object3D.scale,
                easing: 'linear',
                x: self.focusedCellScale.x,
                y: self.focusedCellScale.y,
                z: self.focusedCellScale.z,
                duration: self.dur*1000
            });
        },

        unFocusCell(el) {
            var self = this;
            if (CONFIG.DEBUG) {console.log('unFocusCell');}      
            var posx, posy, posz, rotx, roty, rotz;
            var id = el.id;
            var n = id.match(/\d+$/);
            var position = self.gridCellPosition(+n);
            var positionArray = position.split(' ');
            posx = +positionArray[0];
            posy = +positionArray[1];
            posz = +positionArray[2];
            var rotation = self.gridCellRotation(+n);
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
            AFRAME.ANIME({
                targets: el.parentEl.object3D.scale,
                easing: 'linear',
                x: 1,
                y: 1,
                z: 1,
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
            this.pageAnimation(this.pageLeft);
        },

        handlePageRight() {
            this.unFocusFoscusedCell();
            this.pageAnimation(this.pageRight);
        },

        pageAnimation(pageCallback) {
            var self = this;
            var cellObjs = [];
            var animationPromises = [];
            for (var n=0; n < this.numberOfItemsToDisplay; n++) {
                var cell = document.querySelector(`#grid-cell-${n}`);
                animationPromises.push(this.animateCellRemovalPromise(cell.object3D));
                cellObjs.push(cell.object3D);
            }
            Promise.all(animationPromises)
            .then((results) => {
                pageCallback();
                cellObjs.forEach((obj) => self.resetCellScale(obj))
            });
        },

        animateCellRemovalPromise(obj) {
            var self = this;
            return new Promise((resolve, reject) => {
                try {
                    AFRAME.ANIME({
                        targets: obj.scale,
                        easing: 'linear',
                        x: [1, 0],
                        y: [1, 0],
                        z: [1, 0],
                        duration: 1000*(self.animateOutSeconds),
                        complete: function(anim) {
                            resolve();
                        }
                    });
                }
                catch (error) {
                    console.error('animateCellRemovalPromise error');
                    console.log(error);
                    reject(error);
                }
            });
        },

        resetCellScale(obj) {
            obj.scale.set(1,1,1);
        },

        toggleLayout() {
            if (CONFIG.DEBUG) {console.log("toggleLayout");}
            var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
            this.$store.commit('xr/SET_LAYOUT', newVal);
        },
    }
}
</script>
