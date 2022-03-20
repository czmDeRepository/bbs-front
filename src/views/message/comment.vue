<template>
    <message :kind="1" :unReadCount="unReadCount" @messageConfirm="$emit('messageConfirm')"></message>
</template>
<script>
import store from '@/services/store.js'
import message from '@/views/components/message.vue'
export default {
    name: 'Comment',
    components: {
        message,
    },
    data() {
        return{
            unReadCount: 0,
        }
    },
    methods: {
    },
    beforeMount() {
        let message = store.getUnReadMessage()
        if (message != null ) {
            this.unReadCount = message.commentCount
        } 
    }
}
</script>
<style lang="css" scoped>

</style>