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
                <el-menu-item index="1">
                    <i class="iconfont icon-menu_flgl"></i>
                    <span slot="title">分类管理</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="iconfont icon-24gf-tags3"></i>
                    <span slot="title">标签管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="iconfont icon-tieziguanli"></i>
                    <span slot="title">论贴管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="iconfont icon-yonghuguanli"></i>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
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
        }
    },
    methods:{
        handleSelect(index) {
            this.index = index
            switch(index) {
            case '1':
                this.$router.push('category')
                break
            case '2':
                this.$router.push('label')
                break
            case '3':
                this.$router.push('article')
                break
            case '4':
                this.$router.push('user')
            }
        }
    },
    created() {
        let url = this.$route.path
        let start = url.lastIndexOf('/')
        if (start == url.length - 1) {
            url = url.substring(0, url.length-1)
            start = url.lastIndexOf('/')
        }
        let selected = url.substring(start + 1)
        console.log(selected)
        switch(selected) {
        case 'category':
            this.index = '1'
            break
        case 'label':
            this.index = '2'
            break
        case 'article':
            this.index = '3'
            break
        case 'user':
            this.index = '4'
        }
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