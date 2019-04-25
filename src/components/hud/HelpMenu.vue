<template>
    <div class="help-menu" :style="helpStyleObject">
        <div class="help-controls">
        <h2> Controls </h2>
        <ul>
            <li> <b>H - </b> toggle help menu </li>

            <li> <b>G - </b> toggle graphics settings menu </li>

            <li> <b> WASD - </b> movement controls </li>

            <li> <b> click and drag </b> to look around </li>

            <li> <b> hover room name </b> to select new room </li>
            </ul>
        </div>

    </div>

</template>

<script>

export default {

    data() {
        return {
            helpStyleObject: {
                visibility: 'visible',
            },
        }
    },

    mounted() {
        var self = this;

        document.body.addEventListener('keypress', function(evt) {
            if (evt.key == 'h') {
                self.toggleHelpVisibility();
            }
        });
    },

    methods: {
        toggleHelpVisibility() {
            if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        },
    },
}
</script>

<style src="./HelpMenu.css"></style>
