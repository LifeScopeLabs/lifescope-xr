<template>
    <img
        :id="'image-' + lsobj.id"
        :src="imageSrc(lsobj.route)"
        crossorigin="anonymous">
</template>

<script>
export default {
    props:  ['lsobj', 'roomConfig'],

    data () {
        return {
            width: 0,
            height: 0
        }
    },

    methods: {
        imageSrc: function (route)  {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + route;
        }
    },

    created() {
        //console.log("image-loader: created");
    },

    mounted() {

    }

}
</script>
