<template>
  <section class="bcontainer">
    <a-scene>

      <!-- Load assets -->
      <a-assets>
        <img id="floor" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/floor.jpg">
        <img id="sky" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/nightsky.jpg">
        <img id="earth" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/earth/Albedo.jpg">
        <img id="clouds" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/Clouds.png">
        <img id="eye" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/iris.jpg">
      </a-assets>
      
      <!-- Travel Photos from https://www.pexels.com/search/travel/
           loaded via v-for and nuxt data -->
      <a-assets>
        <img v-for="photo of photos"
             :key="photo.id"
             :id="photo.id"
             crossorigin="anonymous"
             :src="photo.src"
             >
      </a-assets>
      

      <!-- Create scene -->
      <!-- Floor -->
      <a-entity geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      


      <!-- Wall left -->
      <a-entity geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 90 0"
                position="-4 2 4">
      </a-entity>
      
      <!-- Wall right -->
      <a-entity geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="180 90 0"
                position="4 2 4">
      </a-entity>
      
      <!-- Wall back -->
      <a-entity geometry="primitive: plane; width: 8; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 180 0"
                position="0 2 8">
      </a-entity>
      <!-- Canvas back  <wall-image/> <xrtext/>-->
      <a-entity layout="type: line; margin: 4"
                rotation="0 180 0"
                position="-.1 1.9 3.9">
        <a-entity text="Hello, XR!"></a-entity>
      </a-entity>


      <a-entity position="-2.5 1 0"
                      text="anchor: left; width: 1.5; color: white; value: [LEFT ANCHOR] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam">
            </a-entity>



      <!-- Canvas left -->
      <a-entity layout="type: line; margin: 4"
                rotation="0 90 0"
                position="-3.8 2 0">
        <a-entity v-for="photo of photos.slice(0, photos.length/2)"
                  :key="photo.id"
                  geometry="primitive: plane; width: 3; height: 2"
                  :material="'src: #' + photo.id"
                  rotation="0 0 0">
        </a-entity>
      </a-entity>
      

      <!-- Canvas right -->
      <a-entity layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 2 0">
        <a-entity v-for="photo of photos.slice(photos.length/2, photos.length)"
                  :key="photo.id"
                  geometry="primitive: plane; width: 3; height: 2"
                  :material="'src: #' + photo.id + '; side: double;'"
                  rotation="0 0 0">
        </a-entity>
      </a-entity>
      
     
      
      <!-- Earth -->
      <a-sphere position="0 1 -4" radius="1" material="src:#earth; metalness: ; roughness: 1;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>

      </a-sphere>
      
      <!-- Sky -->
      <a-sky src="#sky" rotation="90 0 90">
      </a-sky>
      
    </a-scene>
  </section>
</template>


<script>
  console.log("from index.vue <script>");

  export default {

    data () {
      return {
        name: "Lifescope",
        description: "The Internet of You",
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
                  src:"/static/photos/action-adventure-alps.jpg"
                },
                ]
      }
    },
    computed: {
      numberOfPhotos: function () {
        return photos.length
      }
    }
  }
</script>