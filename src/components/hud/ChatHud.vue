<template>
    <div class="chat-hud" :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">
        <div class="chat-messages">
            <div v-for="(msg, n) of messages"
                :key="'chat-message-' + n"
                v-scroll-on-insert
                class="chat-message" >
                <span class="messenger-name">{{ playerNames.get(msg.playerName) }}:</span> {{msg.msg}}
            </div>
        </div>
        <div class="chat-input" >
            <input type="text" id="chat-input" name="chat-input" v-model="pendingText" placeholder="chat"
            @keyup.enter="sendMessage">
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            pendingText: ''
        }
    },

    computed: {
        ...mapState('xr',
        [
            'isMobile',
        ]),
        ...mapState('xr/chat',
        [
            'messages'
        ]),
        ...mapState('xr/naf', [
            'playerNames'
        ])
    },

    methods: {
        sendMessage() {
            NAF.connection.broadcastData('chat', this.pendingText);
            this.$store.commit('xr/chat/MESSAGE_SENT', {clientId: NAF.clientId, data: this.pendingText});
            this.pendingText = '';
        }
    },
}
</script>

<style src="./ChatHud.scss"></style>
