<template>
    <img v-if="obj.type == 'image'"
        :id="'image-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"/>
    <video v-else-if="obj.type == 'video'"
        :id="'video-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"
    />
    <a-gltf-model v-else-if="obj.type == '3d'"
        :id="'gltf-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"
    />
    <a-asset v-else
        :id="'failed-' + obj.id"
        :src="objSrc(obj.route)"
    />
</template>

<script>
export default {
    props:  ['obj', 'roomConfig'],

    methods: {
        objSrc: function (route)  {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + route;
        }
    },

}
</script>
