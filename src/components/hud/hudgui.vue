<template>
    <a-entity class="hud-gui">

        <a-gui-flex-container id="helpgui"  :opacity="opacity" :width="width" :height="height"
            flex-direction="column">
            <a-gui-label value="Controls"
                :opacity="opacity"
                :font-size="headerStyle.fontSize" :background-color="headerStyle.backgroundColor" :font-color="textStyle.fontColor"
                :font-weight="headerStyle.weight"
                :height="lineSep" :margin="headerStyle.margin">
            </a-gui-label>
            <a-gui-label v-for="(text, index) in textList" v-bind:key="'hudguilabel-' + index"
                :value="text"
                :opacity="opacity" 
                :font-size="textStyle.fontSize" :background-color="textStyle.backgroundColor" :font-color="textStyle.fontColor"
                :height="lineSep">
            </a-gui-label>
            
    </a-gui-flex-container>

    </a-entity>
</template>


<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            opacity: 0.7,
            width: 1,
            height: 1,
            lineSep: .1,
            headerStyle: {
                fontSize: '50px',
                backgroundColor: '#22252a',
                weight: 'bold',
                margin: ".1 0 0 0"
            },
            textStyle: {
                fontSize: '30px',
                backgroundColor: '#22252a',
                fontColor: '#aeaeae'
            },
            textList: [
                'H - toggle help menu',
                'G - toggle graphics settings menu',
                'WASD - movement controls',
                'click and drag to look around',
                'hover room name to select new room'
            ],
            gui: {},
            guiActive: true
        }
    },


    mounted() {
        var self = this;
        self.gui = document.querySelector('#helpgui');
        console.log(self.gui);

        document.body.addEventListener('togglemenu', function(evt) {
            self.toggleHud();
        });

        // document.body.addEventListener('keypress', function(evt) {
        //     if (evt.key == 'h') {
        //         self.toggleHud();
        //     }
        // });
    },

    beforeUpdate() {
        console.log('hudgui beforeUpdate');
    },

    updated() {
        console.log('hudgui updated');
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
                console.log(self.gui);
            }
            else {
                AFRAME.scenes[0].appendChild(self.gui);
                self.guiActive = true;
            }
        },
    },
}
</script>
