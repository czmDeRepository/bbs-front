<template>
    <el-container>
        <el-header>
            <AppHeader></AppHeader>
        </el-header>
        <AppMain class="content"></AppMain>
        <el-footer>
            <AppFooter></AppFooter>
        </el-footer>
    </el-container>
</template>

<script>
  import AppHeader from "./Layout/AppHeader.vue"
  import AppMain   from "./Layout/AppMain.vue"
  import AppFooter from "./Layout/AppFooter.vue"

  // 导入子组件，缩写格式 AppHeader: AppHeader
  export default {
    components: { 
        AppHeader, 
        AppMain, 
        AppFooter,
    },
  };
</script>
<style lang="scss" scoped>
.el-header,.el-footer  {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.content {
  height: calc(100vh - 120px);
}
</style>