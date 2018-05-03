<template>

    <a-assets>
        <img :key="this.workaround()"
            :id="this.workaround()"
            :src="this.imageSrc()">
    </a-assets>
    
</template>

<script>
import Vue from 'vue'

export default {
    props: ['image'],

    methods: {
        workaround: function () {

            debugger; // eslint-disable-line

            console.log('this: ' + this);

            return this.image.id;
        },
        imageSrc: function () {
            var x = '';
            var y = this.image;  // is there a better solution?

            // if (y instanceof Vue.LSObj.Content) {
                x = y.embed_thumbnail; 
                console.log(x);
            // } else if (this.image instanceof Vue.LSObj.Contacts) {
            //     x = this.image.avatar_url;
            // } else {
            //     x = '/iris.jpg';
            //      console.log("not a lifescopeObject");
            // }
            //console.log('x: ' + x)
            // x = "/photos" + x;

            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            
            // console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            
            return x;
        }
    }
}

</script>
