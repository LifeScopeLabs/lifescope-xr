<template>
  <section class="bcontainer">
    <a-scene>

      <!-- TODO : Load locally instead of from rawgit-->
      <!-- Load assets -->
      <a-assets>
        <img id="floor" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/floor.jpg">
        <img id="sky" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/nightsky.jpg">
        <img id="earth" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/earth/Albedo.jpg">
        <img id="clouds" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/Clouds.png">
        <img id="eye" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/iris.jpg">
      </a-assets>

      <!-- Load assets with imageLoader -->
      <!-- https://www.pexels.com/search/travel/ -->

      <imageLoader v-for="wimage in wallimages"
                   :key="wimage.id"
                   :image="wimage" />
      

      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor"
                geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      


      <!-- Wall left -->
      <a-entity id="wall-left"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 90 0"
                position="-4 2 4">
      </a-entity>
      
      <!-- Wall right -->
      <a-entity id="wall-right"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="180 90 0"
                position="4 2 4">
      </a-entity>
      
      <!-- Wall back -->
      <a-entity id="wall-back"
                geometry="primitive: plane; width: 8; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 180 0"
                position="0 2 8">
      </a-entity>



      <!-- put stuff on back wall -->
      <a-entity id="Back wall stuff"
                position="0 1 7.9"
                rotation="180 0 180">
                <canvasC 
                        :imageC="singleTestImage"
                        :textValueC="'Hello from canvas!'">
                </canvasC> 
      </a-entity>
      

      <!-- Canvas left -->
      <a-entity id="canvas-left"
                      layout="type: line; margin: 4"
                      rotation="0 90 0"
                      position="-3.8 1 0">
              <canvasC v-for="wimage of wallimages.slice(0, wallimages.length/2)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0">
              </canvasC>
      </a-entity>

      <!-- Canvas right -->
      <!-- TODO : flip text -->
      <a-entity id="canvas-right"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 1 0">
              <canvasC v-for="wimage of wallimages.slice(wallimages.length/2, wallimages.length)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0">
              </canvasC>
      </a-entity>
      

      <!-- Canvas left old 
      <a-entity id="canvas-left"
                      layout="type: line; margin: 4"
                      rotation="0 90 0"
                      position="-3.8 2 0">
              <wallimage v-for="wimage of wallimages.slice(0, wallimages.length/2)"
                        :key="wimage.id"
                        :image="wimage"
                        rotation="0 0 0">
              </wallimage>
      </a-entity>
      -->

      <!-- Canvas right old 
      <a-entity id="canvas-right"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 2 0">
              <wallimage v-for="wimage of wallimages.slice(wallimages.length/2, wallimages.length)"
                        :key="wimage.id"
                        :image="wimage"
                        rotation="0 0 0">
              </wallimage>
      </a-entity>
      -->
      <!-- Canvas left old 
      <a-entity id="canvas-left"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="-3.8 2 0">
        <a-entity v-for="photo of photos.slice(0, photos.length/2)"
                  :key="photo.id"
                  geometry="primitive: plane; width: 3; height: 2"
                  :material="'src: #' + photo.id"
                  rotation="0 0 0">
        </a-entity>
      </a-entity>
      -->

      <!-- Canvas right old 
      <a-entity id="canvas-right"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 2 0">
        <a-entity v-for="photo of photos.slice(photos.length/2, photos.length)"
                  :key="photo.id"
                  geometry="primitive: plane; width: 3; height: 2"
                  :material="'src: #' + photo.id + '; side: double;'"
                  rotation="0 0 0">
        </a-entity>
      </a-entity>
      -->
      
     
      
      <!-- Earth -->
      <a-sphere id="Earth" position="0 1 -4" radius="1" material="src:#earth; metalness: ; roughness: 1;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>

      </a-sphere>
      
      <!-- Sky -->
      <a-sky id="Sky" src="#sky" rotation="90 0 90">
      </a-sky>
      
    </a-scene>
  </section>
</template>





<script>
import xrtext from "../components/xrtext.vue"
import wallimage from "../components/wallimage.vue"
import imageLoader from "../components/imageLoader.vue"
import canvasC from "../components/canvasC.vue"

  console.log("from index.vue <script>");

  export default {

    data () {
      return {
        name: "Lifescope",
        description: "The Internet of You",
        // photos is no longer being used, safe to delete
        photos: [{
                  id: "action-adventure-blur",
                  src: "/photos/action-adventure-blur.jpg"
                },
                {
                  id: "adventure-ball-shaped-blur",
                  src: "/photos/adventure-ball-shaped-blur.jpg"
                },
                {
                  id: "adult-book-business",
                  src: "/photos/adult-book-business.jpg"
                },
                {
                  id:"accomplishment-adult-adventure",
                  src:"photos/accomplishment-adult-adventure.jpg"
                },
                {
                  id:"adventure-backlit-community",
                  src:"photos/adventure-backlit-community.jpg"
                },
                {
                  id:"aerial-aerial-view-aeroplane",
                  src:"/photos/aerial-aerial-view-aeroplane.jpg"
                },
                {
                  id:"aerial-clouds-dawn",
                  src:"/photos/aerial-clouds-dawn.jpg"
                },
                {
                  id:"adventure-boy-couple",
                  src:"/photos/adventure-boy-couple.jpg"
                },
                {
                  id:"architecture-bay-blonde",
                  src:"/photos/architecture-bay-blonde.jpg"
                },
                {
                  id:"cafe-camera-classic",
                  src:"/photos/cafe-camera-classic.jpg"
                },
                {
                  id:"aeroplane-air-air-travel",
                  src:"/photos/aeroplane-air-air-travel.jpg"
                },
                {
                  id:"action-beach-fun",
                  src:"/photos/action-beach-fun.jpg"
                },
                {
                  id:"adventure-albay-clouds",
                  src:"/photos/adventure-albay-clouds.jpg"
                },
                {
                  id:"beach-exotic-holiday",
                  src:"/photos/beach-exotic-holiday.jpg"
                },
                {
                  id:"agriculture-asia-china",
                  src:"/photos/agriculture-asia-china.jpg"
                },
                {
                  id:"asphalt-environment-grass",
                  src:"/photos/asphalt-environment-grass.jpg"
                },
                {
                  id:"architecture-buildings-church",
                  src:"/photos/asphalt-environment-grass.jpg"
                },
                {
                  id:"beautiful-holiday-lake",
                  src:"/photos/beautiful-holiday-lake.jpg"
                },
                {
                  id:"back-view-clouds-cloudy",
                  src:"/photos/back-view-clouds-cloudy.jpg"
                },
                {
                  id:"adventure-ancient-architecture",
                  src:"/photos/adventure-ancient-architecture.jpg"
                },
                {
                  id:"action-adventure-alps",
                  src:"/photos/action-adventure-alps.jpg"
                },
                ],
        singleTestImage: {
          "id": "24",
          "connection": "asdfa",
          "connection_id_string": "25",
          "created": "2018-04-17T18:25:43.511Z",
          "embed_content": "aContent",
          "embed_format": "email",
          "embed_thumbnail": "/iris.jpg",
          "embeded_format": "jpg",
          "identifier": "26",
          "mimetype": "text/plain",
          "owner": "me",
          "provider_name": "Google",
          "remote_id": "1",
          "tagMasks": {
              "added": ["adsfs", "ewaf"],
              "removed": ["adsfs", "ewaf"],
              "source": ["adsfs", "ewaf"]
          }
        },
        // TODO : Load wallimages from test/content.json
        wallimages:
          [

            {
                "id": "24",
                "connection": "asdfa",
                "connection_id_string": "25",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/iris.jpg",
                "embeded_format": "jpg",
                "identifier": "26",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "1",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "27",
                "connection": "asdfa",
                "connection_id_string": "28",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/accomplishment-adult-adventure.jpg",
                "embeded_format": "jpg",
                "identifier": "29",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "2",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "30",
                "connection": "asdfa",
                "connection_id_string": "32",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/action-adventure-alps.jpg",
                "embeded_format": "jpg",
                "identifier": "33",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "3",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "34",
                "connection": "asdfa",
                "connection_id_string": "35",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/action-adventure-blur.jpg",
                "embeded_format": "jpg",
                "identifier": "36",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "4",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "37",
                "connection": "asdfa",
                "connection_id_string": "38",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/action-beach-fun.jpg",
                "embeded_format": "jpg",
                "identifier": "39",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "5",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "40",
                "connection": "asdfa",
                "connection_id_string": "41",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/adult-book-business.jpg",
                "embeded_format": "jpg",
                "identifier": "42",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "6",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "43",
                "connection": "asdfa",
                "connection_id_string": "44",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/adventure-albay-clouds.jpg",
                "embeded_format": "jpg",
                "identifier": "45",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "7",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "46",
                "connection": "asdfa",
                "connection_id_string": "47",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/adventure-ancient-architecture.jpg",
                "embeded_format": "jpg",
                "identifier": "48",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "8",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "49",
                "connection": "asdfa",
                "connection_id_string": "50",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/adventure-backlit-community.jpg",
                "embeded_format": "jpg",
                "identifier": "51",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "9",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            },
            {
                "id": "52",
                "connection": "asdfa",
                "connection_id_string": "53",
                "created": "2018-04-17T18:25:43.511Z",
                "embed_content": "aContent",
                "embed_format": "email",
                "embed_thumbnail": "/adventure-ball-shaped-blur.jpg",
                "embeded_format": "jpg",
                "identifier": "54",
                "mimetype": "text/plain",
                "owner": "me",
                "provider_name": "Google",
                "remote_id": "10",
                "tagMasks": {
                    "added": ["adsfs", "ewaf"],
                    "removed": ["adsfs", "ewaf"],
                    "source": ["adsfs", "ewaf"]
                },
                "text": "words",
                "thumbnail": "thumb",
                "title": "aTitle",
                "type": "someType",
                "updated": "2018-04-17T18:25:43.511Z",
                "url": "https://duckduckgo.com/",
                "user_id": "345",
                "user_id_string": "234"
            }
        ]
        
      }
    },
    computed: {
      numberOfPhotos: function () {
        return wallimages.length
      }
    },
    components: {
      xrtext,
      wallimage,
      imageLoader,
      canvasC
    }
  }
</script>