<template>
    <a-entity scale="2 2 1"
              :text="textString">
    </a-entity>
</template>

<script>

console.log("from xrtext.vue <script>")
export default {
    props: [
        "textValue"
    ],

    computed: {
        textString: function () {
            return 'width: 1.5; color: white; value: ' + this.textValue
        }
    }
}
</script>