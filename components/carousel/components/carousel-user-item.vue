<template>
    <a-entity class="carousel-item carousel-user-item">

        <a-entity scale="2 2 1"
                  :text="this.textString(image.name)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('age: ' + image.age)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('joined: ' + image.joined)"
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
