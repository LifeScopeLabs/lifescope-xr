<template>
    <a-entity class="carousel-item carousel-session-item">

        <a-entity scale="2 2 1"
                  :text="this.textString(image.user_id)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('ip: ' + image.connection)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('expires: ' + image.expires)"
                   position="0 -.6 0"/>
    </a-entity>
    
</template>

<script>

export default {
    props: ['image'],

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.image.id)
    }
  }
</script>
