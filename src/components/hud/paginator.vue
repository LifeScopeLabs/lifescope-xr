<template>
    <div class="paginator" >
        <div class="pageLeft" @click="pageLeft">
        </div>
        <div class="paginatorFill">
        </div>
        <div class="pageRight" @click="pageRight">
        </div>
    </div>
</template>

<script>

export default {
    methods: {
        pageLeft() {
            if(CONFIG.DEBUG) {console.log("hud pageLeft");}
            this.$store.dispatch('xr/carousel/pageLeft');
        },
        pageRight() {
            if(CONFIG.DEBUG) {console.log("hud pageRight");}
            this.$store.dispatch('xr/carousel/pageRight');
        }
    },
}
</script>

<style src="./paginator.css"></style>
