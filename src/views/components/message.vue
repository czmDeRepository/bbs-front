<template>
    <div>

        <el-button size="mini" type="danger" style="float:right;" @click="confirm(-1)" :disabled="confirmsDisable">一键确认</el-button>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" style="padding:20px;">
        <el-row class="message" v-for="(message,index) in messageList" :key="index" style="padding:5px 0px;" >
            <el-col :span="1">
                <el-badge is-dot :hidden="message.type != 1">
                    <el-avatar size="medium" :src="message.comment.userImageUrl" @error="handleError(this)"></el-avatar>
                </el-badge>
            </el-col>
            <el-col :span="23">
                <span>
                    {{message.comment.userName}}
                </span>    
                <i class="iconfont" :class="message.comment.userGender == '男' ? 'icon-man' : 'icon-woman'"></i>
                <em class="time">
                    {{message.createTime}}
                </em>
                <el-card class="box-card"  shadow="hover" :body-style="{padding: '15px'}" style="margin-bottom: 10px;">
                <span v-html="commentTool.analyzeEmoji(message.comment.content)">
                </span>
                <el-button size="mini" type="success" style="float:right;" @click="articleDetail(message.comment.articleId)"><em>详情</em></el-button>
                <el-button v-if="message.type == 1" size="mini" type="primary" style="float:right;" @click="confirm(index)">确认</el-button>
                </el-card>
            </el-col>
        </el-row>
        <p v-if="loading" class="center">
            <em>加载中...</em>
        </p>
        <div v-if="total == 0" >
            <el-empty description="空空如也" ></el-empty>
        </div>
        <p  v-else-if="noMore" class="center">
        <em>
            <em>到底了！！！</em>
        </em>
        </p>
        <div class="articleDetail">
        <el-dialog
                :visible.sync="articleVisible"
                width="90%" :destroy-on-close="false" top="2vh" >
                <ArticleDetail :id="articleId" :isDialog="true"></ArticleDetail>
            </el-dialog>
        </div>
    </div>
    </div>
</template>
<script>
import store from '@/services/store.js'
import commentTool from '@/services/comment.js'
import ArticleDetail from '../article/ArticleDetail.vue'
export default {
    name: 'Message',
    components: {
        ArticleDetail
    },
    props: {
        // 1 评论，2回复
        kind: {
            require: true,
            type: Number,
        }
    },
    data() {
        return{
            commentTool: commentTool,
            messageList:[],
            noMore: false,
            disabled: false,
            loading: false,
            params: {
                kind: this.kind,
                status: 1,
                pageNum: 0,
                pageSize: 10,
                targetId: store.getUserId(),
            },
            total: 11,
            curPageSize: 10,
            // 消息详情
            articleVisible: false,
            articleId: 0,
            // 跳转评论位置
            commentId: 0,
            confirmsDisable: false,
        }
    },
    methods: {
      load () {
        if(this.total <= (this.params.pageNum - 1) * this.params.pageSize + this.curPageSize) {
            this.noMore = true
            this.disabled = true
            return
        }
        this.loading = true
        this.getMessage()
        this.loading = false
      },
      getMessage() {
        this.params.pageNum += 1
        this.$axios.get("/message", {
            params: this.params,
            headers: {
                'token': store.getToken()
            }
        }).then((e)=>{
            if(e.data.success) {
                let msgList = e.data.Data.data
                for(let i = 0; i < msgList.length; i++) {
                    if(msgList[i].comment.userImageUrl == "") {
                        msgList[i].comment.userImageUrl = require('@/static/defaultHeader.png')
                    } else {
                        msgList[i].comment.userImageUrl = this.$axios.defaults.baseURL +  msgList[i].comment.userImageUrl
                    }
                    this.messageList.push(msgList[i])
                }
                this.total = e.data.Data.total
            } else {
                this.$message.error(`获取消息失败: ${e.data.message}`)
            }
        })
      },
      // 消息详情，打开评论论坛
      articleDetail(articleId) {
        this.articleId = articleId
        this.articleVisible = true
      },
      //  确认消息
      confirm(index) {
        //   确认消息id列表
        let ids = []
        let indexs = []
        if(index == -1) {
            for(let i =0, len = this.messageList.length; i < len; i++) {
                if (this.messageList[i].type == 1) {
                    ids.push(this.messageList[i].id)
                    indexs.push(i)
                }
            }
        } else {
            ids.push(this.messageList[index].id)
            indexs.push(index)
        }
        if (ids.length == 0) {
            this.confirmsDisable = true
            return
        }
        this.$axios.put('/message',
            {
                ids: JSON.stringify(ids),
                type: 2,
            },
            {
                headers: {'token': store.getToken()},
            }).then((e)=>{
                if (e.data.success) {
                    this.$message.success('确认成功')
                    for(let i =0, len = indexs.length; i < len; i++) {
                        this.messageList[indexs[i]].type = 2
                    }
                    let message = store.getUnReadMessage()
                    if(message != null) {
                        if(this.kind == 1) {
                            message.commentCount -= ids.length
                        } else {
                            message.replyCount -= ids.length
                        }
                        message.noMessage = message.commentCount + message.replyCount == 0
                    }
                    store.setUnReadMessage(message)
                    this.$emit('messageConfirm')
                    this.confirmsDisable = true
                } else {
                    this.$message.error('确认失败')
                }
            })
      }
    },
    created() {
    }
}
</script>
<style lang="css" scoped>
.center {
    text-align: center;
}
.message .time {
    color:#aaa;
}
</style>