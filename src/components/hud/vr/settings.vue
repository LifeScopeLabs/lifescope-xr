<template>
    <a-entity class="hud-gui">

            <!-- First Column -->
            <a-gui-flex-container flex-direction="column" :width="width/2" :height="height" :position="-width/4 + ' 0 0'"
                is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                <a-gui-label value="Settings"
                    :opacity="opacity"
                    :font-size="headerStyle.fontSize" :background-color="headerStyle.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="headerStyle.weight"
                    :height="lineSep*3">
                </a-gui-label>
                <a-gui-label value="Skybox"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-radio class="clickable"
                        :height="lineSep"
                        :width="width/4"
                        value="Stars"
                        onclickevent="updatesky"
                        radiogroup='skybox'
                        :checked="true"
                        :opacity="opacity" 
                        :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                        :radiosizecoef="radioStyle.radioSizeCoef" lablelzoffset="0">
                    </a-gui-radio>
                    <a-gui-radio class="clickable"
                        :height="lineSep"
                        :width="width/4"
                        value="Sun"
                        onclickevent="updatesky"
                        :opacity="opacity"
                        radiogroup='skybox'
                        :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                        :radiosizecoef="radioStyle.radioSizeCoef" lablelzoffset="0">
                    </a-gui-radio>
                </a-gui-flex-container>

                <a-gui-label value="Time"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    justify-content="center"
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-time-hours-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="timeHours">
                    </a-gui-input>
                    <a-gui-label value=":"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/32">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-time-minutes-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="timeMinutesString">
                    </a-gui-input>
                </a-gui-flex-container>

                <a-gui-label value="Carousel"
                        :opacity="opacity"
                        :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                        :font-weight="header2Style.weight"
                        :height="lineSep">
                </a-gui-label>

                <a-gui-toggle class="clickable"
                        value="Floor"
                        onclickevent="updateflooractive"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/4"
                        lablelzoffset="0">
                </a-gui-toggle>
                

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-carousel-segments-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="inputSegments">
                    </a-gui-input>
                    <a-gui-label value="Segments"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width*3/32">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-carousel-radius-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="inputFloorRadius">
                    </a-gui-input>
                    <a-gui-label value="Radius"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width*3/32">
                    </a-gui-label>

                    <a-gui-button
                        id="vr-setting-carousel-button"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="buttonStyle.fontSize" :background-color="buttonStyle.backgroundColor" :font-color="buttonStyle.fontColor"
                        :font-weight="buttonStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        value="Update Carousel">
                    </a-gui-button>
                </a-gui-flex-container>


                <a-gui-label value="Textures"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>

                 <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-toggle class="clickable"
                        value="bump"
                        onclickevent="updatebump"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/4"
                        lablelzoffset="0">
                    </a-gui-toggle>

                    <a-gui-toggle class="clickable"
                        value="normals"
                        onclickevent="updatenormal"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/4"
                        lablelzoffset="0">
                    </a-gui-toggle>
                </a-gui-flex-container>


                <a-gui-label value="Quality" 
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-radio class="clickable"
                        :height="lineSep"
                        :width="width/6"
                        value="LOW"
                        onclickevent="updatequality"
                        radiogroup='quality'
                        :opacity="opacity" 
                        :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                        :radiosizecoef="radioStyle.radioSizeCoef" lablelzoffset="0">
                    </a-gui-radio>
                    <a-gui-radio class="clickable"
                        :height="lineSep"
                        :width="width/6"
                        value="MEDIUM"
                        onclickevent="updatequality"
                        :opacity="opacity"
                        radiogroup='quality'
                        :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                        :radiosizecoef="radioStyle.radioSizeCoef" lablelzoffset="0">
                    </a-gui-radio>
                    <a-gui-radio class="clickable"
                        :height="lineSep"
                        :width="width/6"
                        :checked="true"
                        value="HIGH"
                        onclickevent="updatequality"
                        :opacity="opacity"
                        radiogroup='quality'
                        :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                        :radiosizecoef="radioStyle.radioSizeCoef" lablelzoffset="0">
                    </a-gui-radio>
                </a-gui-flex-container>


        </a-gui-flex-container>
        <!-- End First Column -->

        <!-- second column -->
        <a-gui-flex-container flex-direction="column" :width="width/2" :height="height" :position="width/4 + ' 0 0'"
            is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                <a-gui-label value="Maps"
                    :opacity="opacity"
                    :font-size="headerStyle.fontSize" :background-color="headerStyle.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="headerStyle.weight"
                    :height="lineSep + 0.2">
                </a-gui-label>

                <a-gui-button
                    id="vr-setting-map-button"
                    :opacity="opacity"
                    class="clickable"
                    :font-size="buttonStyle.fontSize" :background-color="buttonStyle.backgroundColor" :font-color="buttonStyle.fontColor"
                    :font-weight="buttonStyle.weight"
                    :height="lineSep"
                    :width="width/8"
                    value="Update Map">
                </a-gui-button>

                <a-gui-toggle class="clickable"
                        value="Globe"
                        onclickevent="updateglobeactive"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/4"
                        lablelzoffset="0">
                </a-gui-toggle>

                <!-- <a-gui-label value="Coordinates"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label> -->
                 <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-map-lat-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="inputMapLatitude">
                    </a-gui-input>
                    <a-gui-label value="Latitude"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width*3/32">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-map-long-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/16"
                        :value="inputMapLongitude">
                    </a-gui-input>
                    <a-gui-label value="Longitude"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width*3/32">
                    </a-gui-label>

                </a-gui-flex-container>

                <a-gui-label value="Floor"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>


                 <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-toggle class="clickable"
                        value="Active"
                        onclickevent="updatefloormap"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/6"
                        lablelzoffset="0">
                    </a-gui-toggle>
                    <a-gui-toggle class="clickable"
                        value="High DPI"
                        onclickevent="updatefloordpi"
                        :checked="inputMapFloorHighDPI"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/6"
                        lablelzoffset="0">
                    </a-gui-toggle>
                    <a-gui-toggle class="clickable"
                        value="Height Map"
                        onclickevent="updatefloorheightmap"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/6"
                        lablelzoffset="0">
                    </a-gui-toggle>
                </a-gui-flex-container>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-map-floor-scale-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputFloorScale">
                    </a-gui-input>
                    <a-gui-label value="Scale"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-map-floor-rows-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapFloorRows">
                    </a-gui-input>
                    <a-gui-label value="Rows"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                </a-gui-flex-container>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-map-floor-zoom-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapFloorZoom">
                    </a-gui-input>
                    <a-gui-label value="Zoom"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-map-floor-height-scale-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapFloorHeight">
                    </a-gui-input>
                    <a-gui-label value="Height Scale"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                </a-gui-flex-container>

                

                <!-- <a-gui-label value="World"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>


                 <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-toggle class="clickable"
                        value="Active"
                        onclickevent="updateworldmap"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" lablelzoffset="0">
                    </a-gui-toggle>
                    <a-gui-toggle class="clickable"
                        value="High DPI"
                        onclickevent="updateworlddpi"
                        :checked="inputMapWorldHighDPI"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/6"
                        lablelzoffset="0">
                    </a-gui-toggle>
                    <a-gui-toggle class="clickable"
                        value="Height Map"
                        onclickevent="updateworldheightmap"
                        :opacity="opacity"
                        :font-size="toggleStyle.fontSize" :background-color="toggleStyle.backgroundColor" :font-color="toggleStyle.fontColor"
                        :height="lineSep" :width="width/6"
                        lablelzoffset="0">
                    </a-gui-toggle>
                </a-gui-flex-container>

                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-map-world-scale-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputWorldScale">
                    </a-gui-input>
                    <a-gui-label value="Scale"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-map-world-rows-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapWorldRows">
                    </a-gui-input>
                    <a-gui-label value="Rows"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                </a-gui-flex-container>
                
                <a-gui-flex-container flex-direction="row" 
                    :width="width/4" :height="lineSep" 
                    align-items="center"
                    is-top-container="true" :opacity="opacity" :panel-color="panelColor">
                    <a-gui-input
                        id="vr-setting-map-world-zoom-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapWorldZoom">
                    </a-gui-input>
                    <a-gui-label value="Zoom"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                    <a-gui-input
                        id="vr-setting-map-world-height-scale-input"
                        :opacity="opacity"
                        class="clickable"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8"
                        :value="inputMapWorldHeight">
                    </a-gui-input>
                    <a-gui-label value="Height Scale"
                        :opacity="opacity"
                        :font-size="inputStyle.fontSize" :background-color="inputStyle.backgroundColor" :font-color="inputStyle.fontColor"
                        :font-weight="inputStyle.weight"
                        :height="lineSep"
                        :width="width/8">
                    </a-gui-label>
                </a-gui-flex-container> -->

                <!-- Shading -->
                <!-- <a-gui-label value="Shading"
                    :opacity="opacity"
                    :font-size="header2Style.fontSize" :background-color="header2Style.backgroundColor" :font-color="textStyle.fontColor"
                    :font-weight="header2Style.weight"
                    :height="lineSep">
                </a-gui-label>
                <a-gui-radio class="clickable"
                    value="DEFAULT"
                    onclickevent="updateshading"
                    radiogroup='shading'
                    :checked="shading==ShadingEnum.DEFAULT"
                    :opacity="opacity" 
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio>
                <a-gui-radio class="clickable"
                    value="CEL"
                    onclickevent="updateshading"
                    :opacity="opacity"
                    radiogroup='shading'
                    :checked="shading==ShadingEnum.CEL"
                    :font-size="radioStyle.fontSize" :background-color="radioStyle.backgroundColor" :font-color="radioStyle.fontColor"
                    :height="lineSep" radiosizecoef="2" lablelzoffset="0">
                </a-gui-radio> -->
                <!-- /Shading -->
        </a-gui-flex-container>
        <!-- End Second Column -->

    </a-entity>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { GraphicsQualityEnum, ShadingEnum } from '../../../store/modules/xr/modules/graphics/index.js';

var baseFontSize = 15;

export default {

    data() {
        return {
            opacity: 0.7,
            width: 2,
            height: 1,
            lineSep: baseFontSize/300,
            panelColor: '#22252a',
            headerStyle: {
                fontSize:  baseFontSize*5/3 + 'px',
                backgroundColor: '#22252a',
                weight: 'bold'
            },
            header2Style: {
                fontSize:  baseFontSize*4/3 + 'px',
                backgroundColor: '#22252a',
                weight: 'bold'
            },
            textStyle: {
                fontSize: baseFontSize + 'px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            radioStyle: {
                fontSize:  baseFontSize + 'px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae',
                radioSizeCoef: 2,
            },
            toggleStyle: {
                fontSize:  baseFontSize + 'px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            inputStyle: {
                fontSize:  baseFontSize + 'px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae',
                weight: 'bold'
            },
            buttonStyle: {
                fontSize:  baseFontSize + 'px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae',
                weight: 'bold'
            },
            gui: {},
            guiActive: true,
            shadingSetting: {
                DEFAULT: true,
                CEL: false
            },
            ShadingEnum: ShadingEnum,
            carouselDimensions: {
                segments: 24,
                radius: 5
            },
            lat: 0,
            lon: 0,

            globeCheck: true,

            mapFloorCheck: false,
            floorMapTileRows: 1,
            floorMapZoom: 11,
            floorscale: 1,
            floorHighDPI: false,
            floorMapHeightmap: false,
            floorMapHeight: 1,


            mapWorldCheck: false,
            worldMapTileRows: 1,
            worldMapZoom: 11,
            worldscale: 1,
            worldHighDPI: false,
            worldMapHeightmap: false,
            worldMapHeight: 1,
        }
    },

    computed: {
        ...mapState('xr/graphics',
        [
            'shading',
            'skytime'
        ]),

        ...mapState('xr/hud',
        [
            'vrKeyboardTarget',
        ]),

        ...mapGetters('xr/graphics',
        [
            'timeHours',
            'timeMinutes',
            'timeMinutesString'
        ]),

        ...mapState('xr/carousel',
        [
            'numberOfSegments',
            'floorRadius'
        ]),

        ...mapState('xr/map',
        [
            'globeActive'
        ]),

        inputGlobeActive: {
            get () { return this.globeCheck;},
            set (val) { this.globeCheck = val; }
        },

        inputSegments: {
            get () { return this.carouselDimensions.segments },
            set (val) { this.carouselDimensions.segments = val }
        },
        inputFloorRadius: {
            get () { return this.carouselDimensions.radius },
            set (val) { this.carouselDimensions.radius = val }
        },
        inputMapLatitude: {
            get () { return this.lat },
            set (val) { this.lat = val }
        },
        inputMapLongitude: {
            get () { return this.lon },
            set (val) { this.lon = val }
        },
        mapLatitude: {
            get () { return this.$store.state.xr.map.mapLatitude;},
            set (val) { this.$store.commit('xr/map/SET_MAP_LATITUDE', val); }
        },
        mapLongitude: {
            get () { return this.$store.state.xr.map.mapLongitude;},
            set (val) { this.$store.commit('xr/map/SET_MAP_LONGITUDE', val); }
        },


        inputMapFloorRows: {
            get () { return this.floorMapTileRows },
            set (val) { this.floorMapTileRows = val }
        },
        inputFloorScale: {
            get() { return this.floorscale },
            set (val) { this.floorscale = val }
        },
        inputMapFloorZoom: {
            get () { return this.floorMapZoom },
            set (val) { this.floorMapZoom = val }
        },
        inputMapFloorHighDPI: {
            get () { return this.floorHighDPI },
            set (val) { this.floorHighDPI = val }
        },
        inputMapFloorHeightmap: {
            get () { return this.floorMapHeightmap },
            set (val) { this.floorMapHeightmap = val }
        },
        inputMapFloorHeight: {
            get () { return this.floorMapHeight },
            set (val) { this.floorMapHeight= val }
        },

        inputMapWorldRows: {
            get () { return this.worldMapTileRows },
            set (val) { this.worldMapTileRows = val }
        },
        inputWorldScale: {
            get() { return this.worldscale },
            set (val) { this.worldscale = val }
        },
        inputMapWorldZoom: {
            get () { return this.worldMapZoom },
            set (val) { this.worldMapZoom = val }
        },
        inputMapWorldHighDPI: {
            get () { return this.worldHighDPI },
            set (val) { this.worldHighDPI = val }
        },
        inputMapWorldHeightmap: {
            get () { return this.worldMapHeightmap },
            set (val) { this.worldMapHeightmap = val }
        },
        inputMapWorldHeight: {
            get () { return this.worldMapHeight },
            set (val) { this.worldMapHeight= val }
        },
    },

    mounted() {
        var self = this;
        // self.gui = document.querySelector('#vrhudentity');

        // document.body.addEventListener('togglemenu', self.toggleHud());
        self.$el.addEventListener('updatesky', self.updateSkyListener);
        self.$el.addEventListener('updatebump', self.updateBumpListener);
        self.$el.addEventListener('updatenormal', self.updateNormalListener);
        self.$el.addEventListener('updatefloormap', self.updateFloorMapListener);
        self.$el.addEventListener('updatefloordpi', self.updateFloorDPIListener);
        self.$el.addEventListener('updatefloorheightmap', self.updateFloorHeightMapListener);
        self.$el.addEventListener('updateworldmap', self.updateWorldMapListener);
        self.$el.addEventListener('updateshading', self.updateShadingListener);
        self.$el.addEventListener('updateflooractive', self.updateFloorActiveListener);
        self.$el.addEventListener('updateglobeactive', self.updateGlobeActiveListener);
        self.$el.addEventListener('updatequality', self.updateQualityListener);
        self.$el.addEventListener('editTime', self.editTimeHandler);

        document.addEventListener('superkeyboardinput', self.keyboardInputHandler);

        self.$el.addEventListener('click', self.clickHandler);

        self.inputSegments = self.numberOfSegments;
        self.inputFloorRadius = self.floorRadius;
        self.inputMapLatitude = self.mapLatitude;
        self.inputMapLongitude = self.mapLongitude;
        self.inputGlobeActive = self.globeActive;
    },

    beforeDestroy() {
        var self = this;
        // document.body.removeEventListener('togglemenu', self.toggleHud());
        self.$el.removeEventListener('updatesky', self.updateSkyListener);
        self.$el.removeEventListener('updatebump', self.updateBumpListener);
        self.$el.removeEventListener('updatenormal', self.updateNormalListener);
        self.$el.removeEventListener('updatefloormap', self.updateFloorMapListener);
        self.$el.removeEventListener('updateflooractive', self.updateFloorActiveListener);
        self.$el.removeEventListener('updatefloordpi', self.updateFloorDPIListener);
        self.$el.removeEventListener('updateworldmap', self.updateWorldMapListener);
        self.$el.removeEventListener('updateshading', self.updateShadingListener);
        self.$el.removeEventListener('updatefloorheightmap', self.updateFloorHeightMapListener);
        self.$el.removeEventListener('updateglobeactive', self.updateGlobeActiveListener);
        self.$el.removeEventListener('updatequality', self.updateQualityListener);
        self.$el.removeEventListener('editTime', self.editTimeHandler);

        document.removeEventListener('superkeyboardinput', self.keyboardInputHandler);

        self.$el.removeEventListener('click', self.clickHandler);
    },

    methods: {
        toggleHelpVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
        toggleHud() {
            // console.log('toggleHud');
            var self = this;

            if (self.guiActive) {
                self.gui.parentElement.removeChild(self.gui);
                self.guiActive = false;
            }
            else {
                AFRAME.scenes[0].appendChild(self.gui);
                self.guiActive = true;
            }
        },
        updateSkyListener(evt) {
            // console.log('updateSky');
            // var val = evt.detail.value;
            // var newVal = val.toUpperCase();// == SkyboxEnum.STARS ? 'SUN' : 'STARS';
            // this.$store.commit('xr/graphics/SET_SKYBOX', newVal);
        },
        updateBumpListener(evt) {
            var val = evt.detail.value;
            console.log(`updateBump(${val})`)
            this.$store.commit('xr/graphics/SET_BUMP', val);
        },
        updateNormalListener(evt) {
            var val = evt.detail.value;
            console.log(`updateNormal(${val})`)
            this.$store.commit('xr/graphics/SET_NORMAL', val);
        },
        updateFloorMapListener(evt) {
            var val = evt.detail.value;
            console.log(`updateFloorMap(${val})`)
            this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', val);
        },
        updateFloorDPIListener(evt) {
            this.inputMapFloorHighDPI = !this.inputMapFloorHighDPI;
        },
        updateFloorHeightMapListener(evt) {
            this.inputMapFloorHeightmap = !this.inputMapFloorHeightmap;
        },
        updateWorldMapListener(evt) {
            var val = evt.detail.value;
            console.log(`updateWorldMap(${val})`)
            this.$store.commit('xr/map/SET_WORLD_MAP_ACTIVE', val);
        },
        updateShadingListener(evt) {
            var val = evt.detail.value;
            // console.log('updateSky');
            var newVal = val.toUpperCase();
            this.$store.commit('xr/graphics/SET_SHADING', newVal);
        },
        updateFloorActiveListener(evt) {
            var newVal = !this.$store.state.xr.carousel.floorActive;
            this.$store.commit('xr/carousel/SET_FLOOR_ACTIVE', newVal); 
        },

        updateGlobeActiveListener(evt) {
            var newVal = !this.$store.state.xr.map.globeActive;
            this.$store.commit('xr/map/SET_GLOBE_ACTIVE', newVal); 
        },
        updateQualityListener(evt) {
            var val = evt.detail.value;
            console.log(val);
            if (GraphicsQualityEnum.hasOwnProperty(val)) {
                this.$store.commit('xr/graphics/SET_QUALITY', val);
            }
            else {
                console.log(`couldn't change qualitySetting: ${val} is not a GraphicsQualityEnum`);
            }
        },
        clickHandler(evt) {
            console.log('clickHandler');
            switch (evt.target.id) {
                case 'vr-setting-time-hours-input':
                case 'vr-setting-time-minutes-input':
                case 'vr-setting-carousel-segments-input':
                case 'vr-setting-carousel-radius-input':
                case 'vr-setting-map-lat-input':
                case 'vr-setting-map-long-input':
                case 'vr-setting-map-floor-scale-input':
                case 'vr-setting-map-floor-rows-input':
                case 'vr-setting-map-floor-zoom-input':
                case 'vr-setting-map-floor-height-scale-input':
                case 'vr-setting-map-world-scale-input':
                case 'vr-setting-map-world-rows-input':
                case 'vr-setting-map-world-zoom-input':
                case 'vr-setting-map-world-height-scale-input':
                    this.$store.commit('xr/hud/SET_VR_KEYBOARD_MODEL', 'numpad');
                    this.$store.commit('xr/hud/SET_VR_KEYBOARD_ACTIVE', true);
                    this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', evt.target.id);
                    break;
                case 'vr-setting-carousel-button':
                    this.updateCarousel();
                    break;
                case 'vr-setting-map-button':
                    this.setMap();
                    break;
                default:
                    break;
            }
        },
        keyboardInputHandler(evt) {
            console.log('keyboardInputHandler');
            console.log(evt);
            console.log(evt.detail.value);
            console.log(`${this.vrKeyboardTarget} input handler`);
            switch (this.vrKeyboardTarget) {
                case 'vr-setting-time-hours-input':
                    this.$store.dispatch('xr/graphics/updateTimeHours', evt.detail.value);
                    this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', '');
                    break;
                case 'vr-setting-time-minutes-input':
                    this.$store.dispatch('xr/graphics/updateTimeMinutes', evt.detail.value);
                    this.$store.commit('xr/hud/SET_VR_KEYBOARD_TARGET', '');
                    break;
                case 'vr-setting-carousel-segments-input':
                    this.inputSegments = +evt.detail.value;
                    break;
                case 'vr-setting-carousel-radius-input':
                    this.inputFloorRadius = +evt.detail.value;
                    break;
                case 'vr-setting-map-lat-input':
                    this.inputMapLatitude =  +evt.detail.value;
                    break;
                case 'vr-setting-map-long-input':
                    this.inputMapLongitude =  +evt.detail.value;
                    break;
                case 'vr-setting-map-floor-scale-input':
                    this.inputFloorScale = +evt.detail.value;
                    break;
                case 'vr-setting-map-floor-rows-input':
                    this.inputMapFloorRows = +evt.detail.value;
                    break;
                case 'vr-setting-map-floor-zoom-input':
                    this.inputMapFloorZoom = +evt.detail.value;
                    break;
                case 'vr-setting-map-floor-height-scale-input':
                    this.inputMapFloorHeight = +evt.detail.value;
                    break;
                case 'vr-setting-map-world-scale-input':
                    this.inputWorldScale = +evt.detail.value;
                    break;
                case 'vr-setting-map-world-rows-input':
                    this.inputMapWorldRows = +evt.detail.value;
                    break;
                case 'vr-setting-map-world-zoom-input':
                    this.inputMapWorldZoom = +evt.detail.value;
                    break;
                case 'vr-setting-map-world-height-scale-input':
                    this.inputMapWorldHeight = +evt.detail.value;
                default:
                    break;
            }
            this.$store.commit('xr/hud/SET_VR_KEYBOARD_ACTIVE', false);
        },

        updateCarousel() {
            this.$store.commit('xr/carousel/SET_NUMBER_OF_SEGMENTS', this.carouselDimensions.segments);
            this.$store.commit('xr/carousel/SET_FLOOR_RADIUS', this.carouselDimensions.radius);
        },

        setMap() {
            this.$store.commit('xr/map/SET_MAP_LATITUDE', this.lat);
            this.$store.commit('xr/map/SET_MAP_LONGITUDE', this.lon);
            // this.$store.commit('xr/map/SET_MAPTYPE', this.maptype);

            this.$store.commit('xr/map/SET_FLOOR_MAP_ROWS', this.floorMapTileRows);
            this.$store.commit('xr/map/SET_FLOOR_MAP_ZOOM', this.floorMapZoom);
            this.$store.commit('xr/map/SET_FLOOR_SCALE', this.floorscale);
            this.$store.commit('xr/map/SET_FLOOR_DPI', this.floorHighDPI);
            this.$store.commit('xr/map/SET_FLOOR_HEIGHTMAP', this.floorMapHeightmap);
            this.$store.commit('xr/map/SET_FLOOR_HEIGHT', this.floorMapHeight);

            // this.$store.commit('xr/map/SET_WORLD_MAP_ROWS', this.worldMapTileRows);
            // this.$store.commit('xr/map/SET_WORLD_MAP_ZOOM', this.worldMapZoom);
            // this.$store.commit('xr/map/SET_WORLD_SCALE', this.worldscale);
            // this.$store.commit('xr/map/SET_WORLD_DPI', this.worldHighDPI);
            // this.$store.commit('xr/map/SET_WORLD_HEIGHTMAP', this.worldMapHeightmap);
            // this.$store.commit('xr/map/SET_WORLD_HEIGHT', this.worldMapHeight);
        },
    },
}
</script>

<!-- <style src="./settings.css"></style> -->