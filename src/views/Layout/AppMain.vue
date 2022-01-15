<template>
    <div>
        <el-container>
            <el-main>
                <router-view/>
                <el-backtop target=".el-main" :bottom="100" :right="350"></el-backtop>
            </el-main>
            <el-aside>
                <div>
                    <el-calendar v-model="value"></el-calendar>
                </div>
                <div style="padding: 25px 10px;">
                    <el-card class="information_statistics" shadow="hover">
                        <div slot="header" class="clearfix">
                            <i class="iconfont  icon-tongji"></i>
                            <em><b>网站资讯</b></em>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="refreshInformation">刷新</el-button>
                        </div>
                        <div class="content-list">
                            <em><b><i class="iconfont icon-yuedu"></i>本站总阅读量：</b>
                            <span class="value">{{information.totalReadNum}}</span>
                            </em>
                        </div>
                        <div class="content-list">
                            <em><b><i class="el-icon-s-custom"></i>用户量：</b>
                            <span class="value">{{information.totalUserNum}}</span>
                            </em>
                        </div>
                        <div class="content-list">
                            <em><b><i class="el-icon-user-solid"></i>群聊活跃人数：</b>
                            <span class="value">{{information.totalChatPersonNum}}</span>
                            </em>
                        </div>
                        <div class="content-list">
                            <em><b><i class="el-icon-reading"></i>帖子数量：</b>
                            <span class="value">{{information.totalArticleNum}}</span>
                            </em>
                        </div>
                    </el-card>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script>


export default {
    name: "AppMain",
    components: {
       
    },
    data() {
      return {
        value: new Date(),
        information: {
            totalArticleNum: 9999,
            totalChatPersonNum: 9999,
            totalReadNum: 9999,
            totalUserNum: 9999,
        }
      }
    },
    methods: {
        refreshInformation() {
            this.$axios.get('/information').then((e)=>{
                console.log(e.data.Data)
                this.information = e.data.Data
            })
        }
    },
    created() {
        this.refreshInformation()
    }
}
</script>
<style>
.el-main {
  background-color: #E9EEF3;
  color: #333;
  /* text-align: center; */
  max-height: calc(100vh - 120px);
}
.el-aside {
  max-height: calc(100vh - 120px);
}
.el-calendar{
    height: 100%;
}
.el-calendar-table thead th {
    padding: 6px 0;
}
.el-calendar-table .el-calendar-day{
    height: 35px;
    text-align: center;
}
.el-calendar__body {
    padding: 0;
}
.el-button--mini, .el-button--mini.is-round {
    padding: 5px 7px;
}
</style>
<style lang="scss" scoped>
.information_statistics {
    .content-list {
        margin-top: 10px;
        .value {
            float: right;
        }
    }
    b {
        margin-right: 5px;
    }
}
</style>