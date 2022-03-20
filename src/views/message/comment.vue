<template>
    <message :kind="1" @messageConfirm="$emit('messageConfirm')"></message>
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
            
        }
    },
    methods: {
    },
    created() {
    }
}
</script>
<style lang="css" scoped>

</style>