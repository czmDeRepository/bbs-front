<template>
  <div>
    <el-row>
      <el-col :span="22"  align="left">
        <em>
          <a href="javascript:void(0);" @click="$router.push('/')">
            <b class="headerTitle">
              在线论坛平台
            </b>
            <i class="el-icon-chat-dot-round" style="font-size: 2.5rem;">
            </i>
          </a>
        </em>
      </el-col>
      <el-col :span="1"> 
        <!---->
        <el-tooltip content="发布贴子" placement="left-end" effect="dark">
         <el-button type="info" icon="el-icon-edit" circle @click="writeArticle"></el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1">
        <el-dropdown @command="handleCommand">
          <div class="demo-basic--circle">
              <el-avatar size="large" :src="circleUrl" @error="errorHandler"></el-avatar>
          </div>
          <el-dropdown-menu v-if="store.getUserId() == null" slot="dropdown">
              <el-dropdown-item command="login">登陆</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else slot="dropdown">
              <el-dropdown-item  command="exit">退出登陆</el-dropdown-item>
              <el-dropdown-item divided command="personal">个人中心</el-dropdown-item>
              <el-dropdown-item v-if="store.getUserRole() > 1 && !$route.path.startsWith('/admin')" divided command="admin">管理平台</el-dropdown-item>
              <el-dropdown-item v-else-if="$route.path.startsWith('/admin')" divided command="">首页</el-dropdown-item>
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
       }
    },
    methods: {
        handleCommand(command) {
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
            this.circleUrl = this.$axios.defaults.baseURL + store.getUserHeader()
            tools.refreshToken(this)
        },
        // 编写论贴
        writeArticle() {
            if(store.getUserId() == null) {
              this.$message.error('请先登陆')
              return
            }
            this.$router.push('/article/write')
        },
    },
    created() {
        if (store.getUserHeader() != null && store.getUserHeader() != 'undefined' && store.getUserHeader() != '') {
            this.circleUrl = this.$axios.defaults.baseURL + store.getUserHeader()
        }
        tools.refreshToken(this)
    },
    
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