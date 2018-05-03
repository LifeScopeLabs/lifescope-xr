<template>
    <a-entity class="carousel-item carousel-association-session-item">

        <a-entity scale="2 2 1"
                  :text="this.textString('connection_id: ' + image.connection_id)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('connection_id_string: ' + image.connection_id_string)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('ttl: ' + image.ttl)"
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
