<template>

    <a-assets>
        <img :key="this.workaround()"
            :id="this.workaround()"
            :src="this.imageSrc()">
    </a-assets>
    
</template>

<script>
import Vue from 'vue'

export default {
    props:  {image: Vue.LSObj.LSObj},
    
    asyncData (context) {
      console.log("image-loader: asyncData");
      //debugger; //eslint-disable-line
      return {acontext: context}
    },
    methods: {
        workaround: function () {
            return this.image.id;
        },
        imageSrc: function () {
            var x = '';
            var y = this.image;  // is there a better solution?
            //debugger; // eslint-disable-line

            //console.log(Vue.LSObj.Content)
            
            if (y instanceof Vue.LSObj.Content) {
                x = y.embed_thumbnail; 
                //console.log(x);
            } else if (this.image instanceof Vue.LSObj.Contacts) {
                x = this.image.avatar_url;
            } else {
                x = '/iris.jpg';
                 console.log("not a lifescopeObject");
            }
            
           //x = y.embed_thumbnail;
            x = "/photos" + x;

            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            
            // console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            
            return x;
        }
    }
}
/*
        {image: {
            type: Vue.LSObj.Content,
            required: true
        }
    },
    
    {
  id: '52',
  connection: 'asdfa',
  connection_id_string: '53',
  created: '2018-04-17T18:25:43.511Z',
  embed_content: 'aContent',
  embed_format: 'email',
  embed_thumbnail: '/adventure-ball-shaped-blur.jpg',
  identifier: '54',
  mimetype: 'text/plain',
  owner: 'me',
  provider_name: 'Google',
  remote_id: '10',
  tagMasks:
   { added: [ 'adsfs', 'ewaf' ],
     removed: [ 'adsfs', 'ewaf' ],
     source: [ 'adsfs', 'ewaf' ] },
  text: 'words',
  title: 'aTitle',
  type: 'someType',
  updated: '2018-04-17T18:25:43.511Z',
  url: 'https://duckduckgo.com/?q=tor',
  user_id: '345',
  user_id_string: '234' }*/
</script>
