<template>
</template>

<script>
export default {
    methods: {
        highlight: function () {
            console.log("highlight")
            console.log(this)
        },

        createHighlightOnClickListenerAframeComponent: function () {
            // create an aframe component that adds an onClick event listener  
            // that highlights the content on the carousel and globe
            // TODO : Decide if this belongs in somewhere else like carousel-item.vue
            
            console.log("createHighlightOnClickListenerAframeComponent")
            if (process.browser) {
                AFRAME = require('aframe')

                // TODO : there has got to be a better way to do this
                var highlight = this.highlight

                AFRAME.registerComponent('cursor-listener-highlight', {
                // regisers an Aframe component that highlights content
                // when the a-entity is clicked
                // ex: <a-entity cursor-listener-highlight="dummy data">

                schema: {
                    type: 'string'
                },

                init: function () {
                    //console.log("registerComponent cursor-listener-highlight init")

                    // TODO : refactor?
                    var data = this.data

                    this.el.addEventListener('click', function (evt) {
                        //console.log('I was clicked at: ', evt.detail.intersection.point);
                        console.log("evt: " + evt)
                        console.log(data)
                        highlight()// "https://www.duckduckgo.com")
                    });
                }
                });
            }
        }

    
    },

    mounted () {
        this.createHighlightOnClickListenerAframeComponent()
    }
}
</script>