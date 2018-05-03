<template>
    <a-entity class="carousel-item carousel-location-item">
        <a-entity scale="2 2 1"
                  :text="this.textString('geolocation: ' + image.geolocation)"
                  position="0 0 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('connection: ' + image.connection)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('connection_id_string' + image.connection_id_string)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('updated: ' + image.updated)"
                   position="0 -.6 0"/>
    
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
