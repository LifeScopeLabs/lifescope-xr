<template>
    <div class="naf-hud" :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">
        <div class="naf-player-list" :class="{ hidden: playerNames.size == 0 }"
            :style="playerListStyleObject">
            <div v-for="name of nameArray"
                :key="'naf-player-names-' + name[0]"
                v-scroll-on-insert
                class="naf-player-name" >
                {{ name[1] }}
            </div>
        </div>
        <div class="naf-icons">
            <div id="naf-players-icon"  @click="togglePlayerListVisibility"
                class="fas fa-user-friends" ></div>
            <span class="naf-players-count"> {{ numberOfPlayers }}
            </span>
            <div v-if="playerListStyleObject.visibility != 'hidden'" class="player-name-edit">
                <input type="text" id="player-name-input" name="player-name-input" v-model="nameChangeText" 
                placeholder="Change name" @keyup.enter="changePlayerName">
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import HudUtils from './hudutils';

export default {

    data() {
        return {
            playerListStyleObject: {
                visibility: 'hidden',
                opacity: 0
            },
            nameChangeText: ''
        }
    },

    computed: {
        ...mapState('xr',
        [
            'isMobile',
        ]),
        ...mapState('xr/naf',
        [
            'numberOfPlayers',
            'playerNames',
            'updateNames'
        ]),
        nameArray() {
            // changes to numberOfPlayers triggers Vue reactivity
            return this.updateNames && this.numberOfPlayers && Array.from(this.playerNames);
        },

    },

    methods: {
        togglePlayerListVisibility() {
            this.hudUtils.toggleHud(this.playerListStyleObject);
        },
        changePlayerName() {
            NAF.connection.broadcastData('nameUpdate', this.nameChangeText);
            this.$store.commit('xr/naf/CHANGE_PLAYER_NAME', {clientId: NAF.clientId, name: this.nameChangeText});
            this.nameChangeText = '';
        }
    },

    mounted() {
        var self = this;
        self.hudUtils = new HudUtils();
    }
}
</script>

<style src="./NAFHud.scss"></style>
