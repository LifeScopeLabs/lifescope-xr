<template>

    <a-assets>
        <img :key="this.workaround()"
            :id="this.workaround()"
            :src="this.imageSrc()">
    </a-assets>
    
</template>

<script>
import lifescopeObjects from "../../plugins/lifescopeObjects.js"

export default {
    props: ['image'],

    methods: {
        workaround: function () {
            if (lifescopeObjects == null) {
                console.log('badID')
                return "badID";
            }
            else {return this.image.id;}
        },
        imageSrc: function () {
            // prepend url with /photos
            // ex: /iris.jpg returns /photos/iris.jpg
            //console.log("image loader imgSrc this: " + this)
            //console.log(this.image instanceof lifescopeObjects.Content)

            var x = ''
            var y = this.image  // is there a better solution?
            //console.log(lifescopeObjects.Content)
            console.log('lifescopeObjects == null: ' + (lifescopeObjects == null).toString());
            console.log('lifescopeObjects: ' + lifescopeObjects)
            console.log('this.image.constructor.name: ' + y.constructor.name)
            //console.log('lifescopeObjects.Content.constructor.name: ' + lifescopeObjects.Content.constructor.name)
            console.log('this.image: ' + y)
            console.log('this.image instanceof lifescopeObjects.Content: ' + (y instanceof lifescopeObjects.Content).toString());
            if (y instanceof lifescopeObjects.Content) {x = y.embed_thumbnail; console.log(x);}
            else if (this.image instanceof lifescopeObjects.Contacts) {x = this.image.avatar_url}
            else {x = '/iris.jpg'; console.log("not a lifescopeObject")}
            //console.log('x: ' + x)
            x = "/photos" + x
            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            return x
        }
    }
  }
</script>
