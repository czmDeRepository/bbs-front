<template>
  <div class="footer">
    <em>@Created By czm</em>
    <el-tooltip class="item" effect="dark" content="Author's Git" placement="right">
      <a class="git" href="https://github.com/czmDeRepository" target="_blank" ><i class="iconfont icon-github-fill"></i></a>
    </el-tooltip>
    
  </div>
</template>

<script>
export default {
    name: "AppFooter"
}
</script>

<style lang="css" scoped>
.git {
  margin-left: 10px;
}
</style>