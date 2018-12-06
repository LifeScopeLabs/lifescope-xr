<template>
    <a-entity class="hud">
        <a-entity
                :position="textPos.x + ' ' + textPos.y + ' ' + textPos.z"
                :text="'value:  ' + text"
        ></a-entity>
        <!-- <a-entity
                :position="textPos.x + ' ' + textPos.y + ' ' + textPos.z"
                :text="'value: ' + playerrig.position"
        ></a-entity> -->
        <a-plane class="hud-panel" color="#cee1ff" transparent=true opacity=0.4;
               :height="panelHeight" :width="panelWidth" :position="x + ' ' + y + ' ' + z">
        </a-plane>
    </a-entity>
</template>

<script>
import Vue from 'vue';

export default {
    data () {
        return {
            text: "Hello VR",
            panelHeight: 0.5,
            panelWidth: 2.8,
            x: 0,
            y: -0.5,
            z: -1,
            textOffsetX: -0.7,
            textOffsetY: 0.2,
            textOffsetZ: 0.1,
            textPos: {x: 0, y: 0, z: 0},
            displayText: ''
        }
    },

    props: ['playerrig'],

    comptued: {
        displayText() {
            console.log(this.playerrig.getAttribute('position'));
            return this.playerrig.getAttribute('position');
        },
        // textPos: function() {
        //     return {'x': this.x + this.textOffsetX,
        //             'y': this.y + this.textOffsetY,
        //             'z': this.z + this.textOffsetZ}
        // },

        textX: function() {
            console.log("computed (textX)");
            console.log("this.data");
            console.log(this.data);
            console.log("this.x");
            console.log(this.x);
            return this.x + this.textOffsetX;
        },
        textY() {
            return this.data.y + this.data.textOffsetY;
        },
        textZ() {
            return this.data.z + this.data.textOffsetZ;
        },
    },

    methods: {
        updateText: function () {
            var playerRig = document.getElementById('playerRig');
            this.data.text = playerRig.getAttribute('position');
            return;
      }
    },

    mounted () {
        // console.log("mounted");
        //updateText();
        Vue.set(this.textPos, 'x', this.x + this.textOffsetX);
        Vue.set(this.textPos, 'y', this.y + this.textOffsetY);
        Vue.set(this.textPos, 'z', this.z + this.textOffsetZ);
        // console.log("this.$props.playerrig");
        // console.log(this.$props.playerrig);
        // Vue.set(this.displayText, this.$prop.playerRig.getAttribute('position'));
    },

    updated () {
        //updateText();
    }


}

</script>
