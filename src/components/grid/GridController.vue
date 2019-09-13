<template>
    <a-entity id="gridController" 
            windows-motion-controls="hand: right;"
            oculus-go-controls="hand: right;"
            oculus-touch-controls="hand: right;"
            daydream-controls="hand: right;"
            vive-controls="hand: right;"
            gearvr-controls="hand: right;"
            >
            <a-entity id="gridCursor"
                raycaster="objects: .clickable; showLine: true; "></a-entity>
        </a-entity>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data () {
        return {
            intersected: null
        }
    },

    mounted () {
        document.addEventListener('controllerconnected', this.controllerConnectedListener) 
    },

    beforeDestroy() {
        document.body.removeEventListener('controllerconnected', this.controllerConnectedListener)
    },

    methods: {
        setupControls() {
            if (CONFIG.DEBUG) {console.log('setupControls');}
            var self = this;
            document.addEventListener('raycaster-intersected', self.intersectedListener);
            document.addEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
            document.addEventListener('triggerup', self.triggerUpListener);

        },

        tearDownControls() {
            if (CONFIG.DEBUG) {console.log('tearDownControls');}
            var self = this;
            document.removeEventListener('raycaster-intersected', self.intersectedListener);
            document.removeEventListener('raycaster-intersected-cleared', self.intersectedClearListener);
            document.removeEventListener('triggerup', self.triggerUpListener);
        },

        intersectedListener(evt) {
            this.intersected = evt.target;
        },

        intersectedClearListener(evt) {
            this.intersected = null;
        },

        triggerUpListener(evt) {
            var self = this;
            if (self.intersected) {
                var gridCursor = document.querySelector('#gridCursor');
                var intersectedEl = self.intersected;
                var intersection = gridCursor.components.raycaster.getIntersection(intersectedEl);
                var eventDetail = {};
                eventDetail.intersectedEl = intersectedEl;
                eventDetail.intersection = intersection;
                self.intersected.emit('click', eventDetail);
            }
        },

        controllerConnectedListener(evt) {
            console.log(`controller connected: ${evt.detail.name}`);
            this.fixCursorPosition(evt.detail.name);
        },

        fixCursorPosition(controllerName) {
            var cursor = document.querySelector('#gridCursor');
            switch (controllerName) {
                case 'oculus-touch-controls':
                    cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                    cursor.object3D.position.set(0, -0.01, 0);
                    break;
            case 'windows-motion-controls':
                    cursor.object3D.rotation.set(THREE.Math.degToRad(-45), THREE.Math.degToRad(2.5), 0);
                    cursor.object3D.position.set(0, 0, -0.03);
                    break;
                default:
                    break;
            }
        }
    }
}
</script>