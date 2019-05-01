<template>
  <a-entity class="landing">

      <!-- landing -->
      <a-entity v-if="this.roomName == 'landing'">
        <!-- Floor -->
        <a-entity id="floor" class="boundry"
                    :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + hallDepth + ''"
                    :material="'src:#floor; repeat: ' + hallWidth + ' ' + -hallDepth"
                    rotation="-90 0 0"
                    :position="'0 0 ' + -hallWidth/2">
        </a-entity>

        <!-- portals -->
        <a-entity  class="portals"
                    layout="type: line; margin: 3"
                    rotation="0 0 0"
                    position="-1 1 -8">

                <a-entity class="clickable" :link="this.link('theater360')"
                        />

                <a-entity class="clickable" :link="this.link('ls-room')"
                        />
        </a-entity>

        <!-- <a-sky src="#sky" rotation="90 0 90">
        </a-sky> -->

      </a-entity>

    <!-- theater360 -->
     <a-entity v-else-if="this.roomName == 'theater360'">
        <theater/>
	</a-entity>

    <!-- gallery -->
    <a-entity v-else>
        <gallery :LSObjs='LSObjs' :rooms='rooms' :roomConfig='roomConfig'/>
    </a-entity>

  </a-entity>
</template>

<script>

import Vue from 'vue';

import gallery from './gallery.vue';
import theater from './theater360.vue';

if (CONFIG.DEBUG) {console.log("from gallery.vue <script>")}
export default {
    data () {
        return {
            name: "LifeScope",
            roomName: "landing",
            wallHeight: 1.1,
            hallWidth: 10,
            hallDepth: 10,
        }
    },

    props: ['LSObjs', 'rooms', 'roomConfig'],
    
    components: {
        gallery,
        theater,
    },

    methods: {
        link: function (room) {
            return "href: ?room=" + room + '; ' +  'title: ' + room + '; ' + 'image: #sky' + ';';
        },
    },
    
    computed: {
        
        href: function () {
            return '?room=' + this.room;
        }
    },

    created () {
        this.roomName = this.$route.query.room || 'landing';
        console.log(this.roomName);
        //console.log(this.data.roomName);
    }

    // mount () {
    //     this.roomName = this.$route.query.room || 'landing';
    //     console.log(this.roomName);
    //     console.log(this.data.roomName);
    // }
}
</script>
