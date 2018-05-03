<template>
    <a-entity class="carousel-item carousel-provider-item">

        <a-entity scale="2 2 1"
                  :text="this.textString('sources: ' + image.sources)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('remote_map_id: ' + image.remote_map_id)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('remote_map_id_string: ' + image.remote_map_id_string)"
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
