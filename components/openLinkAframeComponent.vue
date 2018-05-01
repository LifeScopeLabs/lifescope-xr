<template>
</template>

<script>
export default {
    methods: {
        openLink: function (link) {
            console.log("openLink: " + link)
            window.open(link, "_self")
        },

        createOpenLinkOnClickListenerAframeComponent: function () {
            // create an aframe component that adds an onClick event listener  
            // that opens a link
            // TODO : Decide if this belongs in carouselContentObject.vue
            
            console.log("createOpenLinkOnClickListenerAframeComponent")
            if (process.browser) {
                //console.log("AFRAME = require('aframe')")
                AFRAME = require('aframe')

                // TODO : there has got to be a better way to do this
                var openLink = this.openLink

                AFRAME.registerComponent('cursor-listener-openlink', {
                // regisers an Aframe component that opens a link
                // when the a-entity is clicked
                // ex: <a-entity cursor-listener-openlink="https://aframe.io/docs/0.8.0/components/cursor.html">

                schema: {
                    type: 'string'
                },

                init: function () {
                    //console.log("registerComponent cursor-listener-openlink init")

                    // TODO : refactor?
                    var link = this.data

                    this.el.addEventListener('click', function (evt) {
                    //console.log('I was clicked at: ', evt.detail.intersection.point);
                    openLink(link)// "https://www.duckduckgo.com")
                    });
                }
                });
            }
        }

    
    },

    mounted () {
        this.createOpenLinkOnClickListenerAframeComponent()
    }
}
</script>