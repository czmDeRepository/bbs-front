<template>
    <div>
        <el-container>
            <el-main>
                <router-view @articleDetail="articleDetail"></router-view>
                <el-backtop target=".el-main" :bottom="100" :right="350"></el-backtop>
            </el-main>
            <el-aside>
                <div>
                    <el-calendar v-model="value"></el-calendar>
                </div>
                 <div style="padding: 20px 15px;">
                    <el-card class="information_statistics" shadow="hover"> 
                        
                        <div slot="header" class="clearfix">
                            <el-tooltip class="item" effect="dark" content="最近浏览的至多10篇论贴" placement="top">
                                <em><i class="el-icon-time"></i><b>最近浏览</b></em>
                            </el-tooltip>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="clearRecentBrowsing">清空</el-button>
                        </div>
                        <div v-for="(item,index) in RecentBrowsing" :key="index" class="recent_browsing">
                            <el-link type="primary" @click="readArticle(item)"><em>{{index+1}}: {{item.title}}</em></el-link>
                        </div>
                    </el-card>
                </div>
                <div style="padding: 0px 15px 10px 15px;">
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
                            <em><b><i class="el-icon-s-custom"></i>日活量：</b>
                            <span class="value">{{information.activeVisitorNum}}</span>
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

import store from '@/services/store.js'
import { intAt } from 'jsencrypt/lib/lib/jsbn/jsbn'
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
            activeVisitorNum: 9999,
        },
        RecentBrowsing: [],

      }
    },
    methods: {
        refreshInformation() {
            this.$axios.get('/information').then((e)=>{
                this.information = e.data.Data
            })
        },
        readArticle(article) {
            this.$router.push({name:'mainArticleDetail', params:{id: article.id}})
            this.articleDetail(article)
        },
        articleDetail(article) {
            for (let i = 0; i < this.RecentBrowsing.length; i++) {
                if(article.id == this.RecentBrowsing[i].id) {
                    // 删除下标为i开始的一个元素
                    this.RecentBrowsing.splice(i, 1)
                }
            }
            let len = this.RecentBrowsing.unshift(
                {
                    id:article.id,
                    title:article.title,
                }
            )
            if(len > 10) {
                this.RecentBrowsing.pop()   
            }
            store.setRecentBrowsing(this.RecentBrowsing)
        },
        clearRecentBrowsing() {
            store.clearRecentBrowsing()
            this.RecentBrowsing = []
        }
    },
    created() {
        this.refreshInformation()
        this.RecentBrowsing = store.getRecentBrowsing()
        // 防止无数据空异常
        if(this.RecentBrowsing == null) {
            this.RecentBrowsing = []
        }
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
.recent_browsing {
    border-radius: 4px;
    padding: 2px;
}
</style>