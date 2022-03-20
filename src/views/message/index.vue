<template>
    <el-container>
        <el-header>
            <AppHeader></AppHeader>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                :default-active="index"
                class="el-menu-vertical-demo content"
                @select="handleSelect"
                >
                <el-menu-item index="1" class="message_menu">
                    <el-badge slot="title" :value="message.commentCount" :max="99" :hidden="message.noMessage">
                        <i class="iconfont icon-huifu"></i>
                        <span>评论我的</span>
                    </el-badge>
                </el-menu-item>
                <el-menu-item index="2" class="message_menu">
                    <el-badge slot="title" :value="message.replyCount" :max="99" :hidden="message.noMessage">
                        <i class="iconfont icon-pinglun1"></i>
                        <span>回复我的</span>
                    </el-badge>
                </el-menu-item>
                <!-- <el-menu-item index="3">
                    <i class="iconfont icon-tongzhi"></i>
                    <span slot="title">系统消息</span>
                </el-menu-item> -->
                </el-menu>
            </el-aside>
            <el-main>
                <router-view @messageConfirm="messageConfirm"/>
                <el-backtop target=".el-main" :bottom="100" ></el-backtop>
            </el-main>
        </el-container>

        <el-footer>
            <AppFooter></AppFooter>
        </el-footer>
    </el-container>
</template>

<script>
import AppHeader from "@/views/Layout/AppHeader.vue"
import AppFooter from "@/views/Layout/AppFooter.vue"
import store from '@/services/store.js'

// 导入子组件，缩写格式 AppHeader: AppHeader
export default {
    components: { 
        AppHeader, 
        AppFooter,
    },
    data() {
        return {
            store,
            index: '1',
            message: {
                noMessage: true,
                commentCount: 0,
                replyCount: 0,
            },
        }
    },
    methods:{
        handleSelect(index) {
            this.index = index
            switch(index) {
            case '1':
                this.$router.push('comment')
                break
            case '2':
                this.$router.push('reply_comment')
                break
            }
        },
        messageConfirm() {
            this.refreshMessageCount()
            this.$EventBus.$emit('messageConfirm')
        },
        refreshMessageCount() {
            let message = store.getUnReadMessage()
            if (message != null ) {
                this.message = message
            } 
        }
    },
    created() {
        this.refreshMessageCount()
    },
    mounted: function() {
        this.$EventBus.$on('messageRefresh',()=>{
            this.refreshMessageCount()
        })
    }
};
</script>
<style lang="scss" scoped>
.el-header, .el-footer  {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.content {
  height: calc(100vh - 120px);
}
.iconfont {
    padding: 0 10px;
}

</style>
<style lang="css" >
.message_menu .el-badge__content.is-fixed {
    transform: translateY(30%) translateX(150%);
}
</style>