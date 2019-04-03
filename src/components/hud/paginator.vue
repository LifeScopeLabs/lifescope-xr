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
            this.$store.commit('xr/PAGE_LEFT');
        },
        pageRight() {
            if(CONFIG.DEBUG) {console.log("hud pageLeft");}
            this.$store.commit('xr/PAGE_RIGHT');
        }
    },
}
</script>

<style src="./paginator.css"></style>
