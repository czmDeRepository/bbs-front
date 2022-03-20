<template>
    <el-tabs type="border-card" :stretch="true" style="overflow:auto" :before-leave="beforeLeave" >
        <el-tab-pane :lazy="true">
            <span slot="label"><i class="el-icon-reading"></i> 贴子</span>
            <Forum @articleDetail="articleDetail"></Forum>
        </el-tab-pane>
        <el-tab-pane :lazy="true">
            <span slot="label"><i class="iconfont icon-jishitaolun"></i> 即时群聊</span>
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
        },
        // 往上传递浏览事件
        articleDetail(article) {
            this.$emit('articleDetail', article)
        }
    },
    created() {
        this.isNotLogin = store.getUserId() == null
    }
}
</script>
<style scoped>
/* .el-tabs {
    min-height: calc(100vh - 162px);
} */
</style>