import arrowComp from './arrow.js';
import avatarComp from './avatar.js';
import clickableComp from './clickable.js';
import dioramaComp from './diorama.js';
import fadeComp from './fade.js';
import flexComp from './flex.js';
import globePointsComp from './globepoints.js';
import highlightComp from './highlight.js';
import lsCellComp from './ls-cell.js';
import mapboxComp from './mapbox-terrain.js';
import mediaCellComp from './media-cell.js';
import searchingComp from './searching.js';
import sunSkyPositionComp from './sun-sky-position.js';
import textCellComp from './text-cell.js';
import textLinkComp from './text-link.js';
import woodenFloorComp from './woodenfloor.js';

// import hubComps from './hubs/index.js';

var comps = {
    arrowComp,
    avatarComp,
    clickableComp,
    dioramaComp,
    fadeComp,
    flexComp,
    globePointsComp,
    highlightComp,
    lsCellComp,
    mapboxComp,
    mediaCellComp,
    searchingComp,
    sunSkyPositionComp,
    textCellComp,
    textLinkComp,
    woodenFloorComp
}

var registerAframeComponents = function() {
    Object.keys(comps).forEach(function(k, i) {
        comps[k]();
    });
    // Object.keys(hubComps).forEach(function(k, i) {
    //     hubComps[k]();
    // });
}

export default comps;
export { registerAframeComponents };