<template>

    <a-assets>
        <img v-for="image in LSObjs"
            :key="'image-' + image.id"
            :id="'image-' + image.id"
            :src="image.route">
    </a-assets>
    
</template>

<script>
export default {
    props:  ['LSObjs']
}
</script>
