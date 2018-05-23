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

    methods: {
        imageSrc: function (route)  {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + route;
        }
    }
}
</script>
