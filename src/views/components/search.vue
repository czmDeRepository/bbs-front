<template>
    <el-tabs type="border-card" :stretch="true" style="overflow:auto" :before-leave="beforeLeave" >
        <el-tab-pane label="贴子" :lazy="true">
            <Forum></Forum>
        </el-tab-pane>
        <el-tab-pane label="即时群聊" :lazy="true">
            <Chat></Chat>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import Forum from '../components/forum.vue'
import store from '@/services/store.js'
import Chat from '@/views/chat/chat.vue'
export default {
    name: 'search',
    components:{
        Forum,
        Chat,
    },
    data() {
        return {
            isNotLogin: {
                type: Boolean,
                default: true,
            }
        }
    },
    methods: {
        beforeLeave(activeName, oldActiveName) {
            if(activeName == 1) {
                if(store.getUserId() == null) {
                    this.$message.info('登陆后享用群聊功能')
                    return false
                } 
            }
        }
    },
    created() {
        this.isNotLogin = store.getUserId() == null
    }
}
</script>
<style scoped>
.el-tabs {
    min-height: calc(100vh - 162px);
}
</style>