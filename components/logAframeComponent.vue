<template>
</template>

<script>
export default {
    methods : {
        createLogAFRAMEcomponent: function () {
            console.log("createLogAFRAMEcomponent")
            // create AFRAME component log
            // logs a message to console
            // ex: <a-scene log="Hello, a-scene!">
            // TODO : check that component DNE before creating
            if (process.browser) {
                console.log("AFRAME = require('aframe')")
                AFRAME = require('aframe')
            
                AFRAME.registerComponent('mylog', {
                schema: {type: 'string'},

                init: function () {
                    var stringToLog = this.data;
                    console.log(stringToLog);
                }
                });
            }
        }
    },

    mounted () {
        this.createLogAFRAMEcomponent()
    }
}
</script>