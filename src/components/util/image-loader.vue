<template>

    <a-assets>
        <img v-for="image in LSObjs"
            :key="'image-' + image.id"
            :id="'image-' + image.id"
            :src="imageSrc(image.route)"
            crossorigin="anonymous">
    </a-assets>
    
</template>

<script>
export default {
    props:  ['LSObjs', 'roomConfig'],

    data () {
        return {
            width: 0,
            height: 0
        }
    },

    methods: {
        imageSrc: function (route)  {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + route;
        },
        setDim: function(route) {
            var newimage = new Image();
            newimage.src = this.imageSrc(route); 
            newimage.onload = function() {
                this.width = this.naturalWidth;
                this.height = this.naturalHeight;
                console.log(this.width);
                console.log(this.height);
            }
        }
    },

    created() {
        console.log("image-loader: created");
        //this.setDim
    }

}
</script>
