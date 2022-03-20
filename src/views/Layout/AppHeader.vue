<template>
  <div>
    <el-row>
      <el-col :span="22"  align="left">
        <em>
          <a href="javascript:void(0);" @click="store.clearArticleParams();$router.push('/')">
            <b class="headerTitle">
              在线论坛平台
            </b>
            <i class="iconfont icon-taolunqu" style="font-size: 2.5rem;">
            </i>
          </a>
        </em>
      </el-col>
      <el-col :span="1"> 
        <!---->
        <el-tooltip content="发布贴子" placement="left-end" effect="dark">
         <el-button type="info" icon="el-icon-edit" size="medium" circle @click="writeArticle"></el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1">
        <el-dropdown @command="handleCommand">
          <div class="demo-basic--circle">
            <el-badge  is-dot :hidden="message.noMessage">
              <el-avatar size="medium" :src="circleUrl" @error="errorHandler"></el-avatar>
            </el-badge>
          </div>
          <el-dropdown-menu v-if="store.getUserId() == null" slot="dropdown">
              <el-dropdown-item command="login">
                <i class="icon-denglu1 iconfont"></i>
                登陆
              </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else slot="dropdown">
              <el-dropdown-item command="personal">
                <i class="el-icon-user"></i>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item divided command="message" v-if="!$route.path.startsWith('/message')">
                <el-badge :value="messageCount" :max="99" :hidden="message.noMessage">
                  <i class="iconfont icon-xiaoxi1"></i>
                 消息
                </el-badge>
              </el-dropdown-item>
              <el-dropdown-item v-if="store.getUserRole() > 1 && !$route.path.startsWith('/admin')" divided command="admin">
                <i class="iconfont icon-yunyingguanli"></i>
                管理平台
              </el-dropdown-item>
              <el-dropdown-item v-if="!$route.path.startsWith('/main')" divided command="">
                <i class="iconfont icon-zhuye"></i>
                首页
              </el-dropdown-item>
              <el-dropdown-item divided command="exit">
                <i class="iconfont icon-tuichu1"></i>
                退出
              </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%">
      <Login class="login" @success="successLogin"></Login>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/services/store.js'
import tools from '@/services/tools.js'
import Login from '@/views/login'

export default {
    name: "AppHeader",
    components: {
        Login
    },
    data() {
      return {
          store,
          circleUrl: require('@/static/defaultHeader.png'),
          dialogVisible: false,
          message: {
            noMessage: true,
            commentCount: 0,
            replyCount: 0,
          },
          count : 0,
       }
    },
    computed: {
      messageCount: function() {
        return this.message.commentCount + this.message.replyCount
      },
    },
    methods: {
        handleCommand(command) {
          // 清空论贴参数
          store.clearArticleParams()
          switch(command) {
            case 'login':
              this.dialogVisible = true
              break
            case 'exit':
              store.clear()
              tools.stopRefreshToken()
              if(this.$route.path.startsWith('/admin')) {
                this.$router.push('/')
              } else {
                this.$router.go(0)
              }
              break
            case 'personal':
              // this.$router.push({path:'/personal', query:{tabNum:'info'}})
              this.$router.push({path:'/personal'})
              break
            default:
              this.$router.push(`/${command}`)
          }
        },
        errorHandler() {
          console.log("header头像加载出错！！")
          this.circleUrl = require('@/static/defaultHeader.png')
        },
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        successLogin() {
            this.dialogVisible = false
            if(store.getUserHeader() != '') {
              this.circleUrl = this.$axios.defaults.baseURL + store.getUserHeader()
            }
            tools.refreshToken(this)
            this.getMessage()
        },
        // 编写论贴
        writeArticle() {
            if(store.getUserId() == null) {
              this.$message.error('请先登陆')
              return
            }
            this.$router.push('/article/write')
        },
        getMessage() {
          let that = this
          tools.handleMessage = function(commentCount, replyCount) {
              console.log('消息触发', commentCount, replyCount)
              that.message.commentCount = commentCount
              that.message.replyCount = replyCount
              //  有未读消息
              if(commentCount + replyCount > 0) {
                  that.message.noMessage = false
              } else {
                  that.message.noMessage = true
              }
              store.setUnReadMessage(that.message)
              that.$EventBus.$emit('messageRefresh')
          }
          tools.pullMessage(this, false)
        }
    },
    created() {
        if (store.getUserHeader() != null && store.getUserHeader() != 'undefined' && store.getUserHeader() != '') {
            this.circleUrl = this.$axios.defaults.baseURL + store.getUserHeader()
        }
        if(store.getUserId() != null) {
          tools.refreshToken(this)
          let message =  store.getUnReadMessage()
          if(message != null) {
            this.message = message
          }
          this.getMessage()
        }
    },
    mounted() {
      this.$EventBus.$on('messageConfirm',()=>{
          let message = store.getUnReadMessage()
          if (message != null ) {
              this.message = message
          } 
      })
      this.$EventBus.$on('forceMessageRefresh',()=>{
          tools.pullMessage(this, true)
      })
    }
}
</script>

<style>
a{
  text-decoration:none
}
.demo-basic--circle {
  margin: 10px;
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.login {
  padding: 0 50px 30px 50px;
}
.el-dialog {
  border-radius: 20px
}
.headerTitle {
  font-size:35px;
  background-image:-webkit-linear-gradient(45deg,rgb(233, 255, 227),#0dd9df,rgb(73, 0, 255));
  background-clip: text; 
  -webkit-text-fill-color: transparent; 
}
</style>