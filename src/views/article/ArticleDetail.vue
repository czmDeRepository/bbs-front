<template>
    <div :class="!isDialog ? 'main' : ''" align="left">
        <el-row>
            <el-col :span="8" >
                <div class="owner">
                    <el-avatar size="medium" :src="owner.imageUrl" >
                    </el-avatar>
                    <b style="padding: 0 10px;">{{owner.name}}</b>
                    <i class="iconfont" :class="owner.gender == '男' ? 'icon-man' : 'icon-woman'"></i>
                </div>
            </el-col>
            <el-col :span="14">
                <b class="title">
                    《{{article.title}}》
                </b>
            </el-col>
            <el-col v-if="!isDialog" :span="2">
                <div class="title">
                    <el-button size="small" type="info" @click="back">返回</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="7">
                <b>所属分类：</b>
                <el-tag><b>{{category.name}}</b></el-tag>
            </el-col>
            <el-col :span="17">
                <b>相关标签：</b>
                <el-tag  v-for="(item, index) in article.labelList" :key="item.id" :type="colors[index % colors.length]" effect="dark">{{item.name}}</el-tag>
            </el-col>
        </el-row>
        <div class="content">
            <MavonEditor
                class="md"
                :value="article.content"
                :subfield = "false"
                :defaultOpen = "'preview'"
                :editable="false"
                :scrollStyle="true"
                :ishljs = "true"
                :navigation = "false"
                :toolbars = "toolbars"
                >
                </MavonEditor>
                <!-- :value="detailContent.content"：引入要转换的内容
                    :subfield = "false"：开启单栏模式
                    :defaultOpen = "'preview'"：默认展示预览区域
                    :toolbarsFlag = "false"：关闭工具栏
                    :editable="false"：不允许编辑
                    scrollStyle="true"：开启滚动条样式(暂时仅支持chrome)
                    :ishljs = "true"：开启代码高亮 -->
        </div>
        <div>
            <el-row>
                <el-col :span="3" class="badge">
                    <el-badge :value="commentCount">
                        <el-tag  effect="dark" icon="el-icon-chat-dot-round" type="success">
                            <i class="el-icon-chat-dot-round"></i>
                            <span>  评论</span>
                        </el-tag>
                    </el-badge>
                </el-col>
                <el-col :span="3" class="badge">
                    <el-badge :value="article.readCount">
                        <el-tag effect="dark"  type="primary">
                            <i class="el-icon-view"></i>
                            <span>  阅读</span>
                        </el-tag>
                    </el-badge>
                </el-col>
                <el-col :span="3" class="badge">
                     <el-badge :value="article.followCount">
                        <el-button v-if="article.followingFlag" size="small" icon="el-icon-star-on" type="warning" @click="unFollow">
                            <span>取消关注  </span>
                        </el-button>
                        <el-button v-else  size="small" icon="el-icon-star-off" type="warning" @click="follow">
                            <span>关注  </span>
                        </el-button>
                     </el-badge>
                </el-col>
            </el-row>
        </div>
        <div class="comment">
            <div>
                <Comment :commentList="commentList" 
                :avatar="require('@/static/default.png')"
                @doSend="doSend" @doChidSend="doChidSend" :authorId="article.userId" :commentNum="commentCount">
                    <!-- avatar	String	头像	空
                    placeholder	String	文本框提示内容	在此输入评论内容…
                    minRows	Number	文本框最小行数	4
                    maxRows	Number	文本框最大行数	8
                    commentNum	Number	评论条数	2
                    authorId	Number	当前登录用户id	1
                    label	String	标签名	作者
                    commentWidth	String	文本框宽度	80%
                    commentList	Array	评论列表 -->
                </Comment>
            </div>
        </div>
    </div>
    
</template>

<script>
import  { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import tools from '../../services/tools.js'
import store from '@/services/store.js'

// 评论组件 https://github.com/wanglinyong/hbl-comment
// import Comment from 'hbl-comment'
import Comment from '@/components/comment/Comment.vue'

export default {
    name: "ArticleDetail",
    components: {
        MavonEditor: mavonEditor,
        Comment,
    },
    props: {
        id: {
            required: true,
        },
        isDialog: {
            type: Boolean,
            default: false,
            required: false,
        }
    },
    watch: {
        // 监听 id变化
        id: {
            deep: true,  // 深度监听
            handler(newVal,oldVal) {
                this.initDate()
            }
        }
    },
    data() {
        return {
            article: {
                type: Object,
                // 距离样式
                default: {
                    // 关注图标
                    followingFlag: false,
                },

            }, 
            // 评论
            commentCount: 0,
            commentList: [
                // {
                //     id: 1,
                //     commentUser: {
                //         id: 1,
                //         nickName: "海钊", // 用户昵称
                //         avatar: "http://localhost:8081/v1/resources/images/2_head.png",	//用户头像
                //         gender: '男'
                //     },
                //     targetUser:{
                //         id: 2,
                //         nickName: "锐龙", // 用户昵称
                //         avatar: "http://localhost:8081/v1/resources/images/2_head.png",	//用户头像
                //     },    //	被评论用户
                //     content: "say", //评论内容
                //     createDate: "2021-7-19 12:12:12", //评论时间
                //     childrenList: []
                // },
            ],
            // 所属分类
            category: {
                type: Object
            },
            // 论坛创建者
            owner: {

            },
            toolbars: {
                // bold: true, // 粗体
                // italic: true, // 斜体
                // header: true, // 标题
                // underline: true, // 下划线
                // strikethrough: true, // 中划线
                // mark: true, // 标记
                // superscript: true, // 上角标
                // subscript: true, // 下角标
                // quote: true, // 引用
                // ol: true, // 有序列表
                // ul: true, // 无序列表
                // link: true, // 链接
                // imagelink: true, // 图片链接
                // code: true, // code
                // table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                // help: true, // 帮助
                // /* 1.3.5 */
                // undo: true, // 上一步
                // redo: true, // 下一步
                // trash: true, // 清空
                // save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                // alignleft: true, // 左对齐
                // aligncenter: true, // 居中
                // alignright: true, // 右对齐
                /* 2.2.1 */
                // subfield: true, // 单双栏模式
                // preview: true, // 预览
            }
        }
    },
     methods: {
        back() {
            // if(this.marginStyle == '') {
            //     this.$router.push('/main/index')
            // } else {
            //     this.$router.replace({path:'/personal', query:{tabNum:'follow'}})
            // }
             this.$router.go(-1)
        },
        // 关注
        follow() {
            if (store.getUserId() == null ) {
                this.$message.error(`请先登录！！！`)
                return
            }
            this.$axios.post(`/article/follow`,{
                articleId: this.id,
            },{
                headers: {
                    token: store.getToken(),
                }
            }).then((e)=>{
                 if(e.data.success) {
                     this.article.followingFlag = true
                     this.article.followCount++
                     this.$message.success('关注成功')
                 } else if(e.data.code == 3000) {
                     this.$message.error('请勿重复关注')
                 }
            })
        },
        // 取消关注
        unFollow() {
            if (store.getUserId() == null ) {
                this.$message.error(`请先登录！！！`)
                return
            }
            this.$axios.delete(`/article/unfollow`,{
                params: {
                    articleId: this.id,
                },
                 headers: {
                    'token': store.getToken(),
                }
            }).then((e)=>{
                 if(e.data.success) {
                     this.article.followingFlag = false
                     this.article.followCount--
                     this.$message.success('取消关注成功')
                 }
            })
        },
        // 评论
        doSend(content) {
            if (tools.isBlank(content)) {
                this.$message.error(`评论非空！！！`)
                return
            }
            if (store.getUserId() == null ) {
                this.$message.error(`请先登录！！！`)
                return
            }
            this.$axios.post(`comment`,{
                content: content,
                articleId: this.id,
            },{
                headers: {
                    token: store.getToken(),
                }
            }).then((e)=>{
                this.getComment()
            })

        },
        doChidSend(content,repliedUserId,commentId) { // 评论内容,被评论用户id,父级评论id
            if (tools.isBlank(content)) {
                this.$message.error(`评论非空！！！`)
                return
            }
            if (store.getUserId() == null ) {
                this.$message.error(`请先登录！！！`)
                return
            }
            this.$axios.post(`comment`,{
                content: content,
                articleId: this.id,
                repliedUserId: repliedUserId,
                commentId: commentId,
            },{
                headers: {
                    token: store.getToken(),
                }
            }).then((e)=>{
                 this.getComment()
            })
        },
        // 获取评论
        getComment() {
            this.$axios.get(`/comment`, {
                params: {
                    articleId: this.id,
                    repliedUserId: -1,
                    pageNum: -1,
                    pageSize: -1,
                }
            }).then((e)=>{
                let commentCount = 0
                let res = e.data.Data
                commentCount = res.total
                this.commentList.length = 0
                if (res.data == null) {
                    return
                }
                res.data.forEach(element => {
                    let item  = {
                            id: element.id,
                            commentUser: {
                                id: element.userId,
                                nickName: element.userName, // 用户昵称
                                gender: element.userGender
                            },
                            //	被评论用户
                            targetUser: {
                                id: element.repliedUserId,
                                nickName: element.repliedUserName, // 用户昵称
                            }, 
                            
                            content: element.content, //评论内容
                            createDate: element.createTime, //评论时间
                            
                    }
                    // 头像
                    if (element.repliedUserImageUrl != '') {
                          item.targetUser.avatar = this.$axios.defaults.baseURL + element.repliedUserImageUrl
                    }
                    if (element.userImageUrl != '') {
                        item.commentUser.avatar = this.$axios.defaults.baseURL + element.userImageUrl
                    }
                    if (null != element.childrenList) {
                        let childrenList = new Array()
                        commentCount += element.childrenList.length
                        element.childrenList.forEach((child)=>{
                            let childItem  = {
                                id: child.id,
                                commentUser: {
                                    id: child.userId,
                                    nickName: child.userName, // 用户昵称
                                    gender: child.userGender
                                },
                                targetUser:{
                                    id: child.repliedUserId,
                                    nickName: child.repliedUserName, // 用户昵称
                                },    //	被评论用户
                                content: child.content, //评论内容
                                createDate: child.createTime, //评论时间
                            }
                             // 头像
                            if (child.repliedUserImageUrl != '') {
                                childItem.targetUser.avatar = this.$axios.defaults.baseURL + child.repliedUserImageUrl
                            }
                            if (child.userImageUrl != '') {
                                childItem.commentUser.avatar = this.$axios.defaults.baseURL + child.userImageUrl
                            }
                            childrenList.push(childItem)
                        })
                        item.childrenList = childrenList
                    }
                    this.commentList.push(item)
                })
                this.commentCount = commentCount
            }).catch((e)=>{
                this.$message.error(`评论列表获取失败${e.message}`)
            })
           
        },
        initDate() {
            let that = this
            this.$axios.get(`/article/${this.id}`,{
                params: {
                    userId: store.getUserId(),
                }
            }).then((e)=>{
                that.article = e.data.Data
                return that.article
            }).then((article)=> {
                that.$axios.get(`/category/${article.categoryId}`).then((e)=>{
                    that.category = e.data.Data
                })
                that.$axios.get('/user', {params:{id:article.userId}}).then((e)=>{
                    if(e.data.success && e.data.Data.data.length > 0) {
                        that.owner = e.data.Data.data[0]
                        that.owner.imageUrl = that.$axios.defaults.baseURL + that.owner.imageUrl
                    }
                })
            })
            
            // 获取评论
            this.getComment()
        },
    },
     // 组件注入后调用
    async created() {
        this.initDate()
    },
    
}
</script>
<style scoped>
.main {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* background-color: rgb(251, 251, 251); */
    background-color: #d7e2ea;
    border-radius: 20px;
}
.owner {
    margin-top: 10px;
}
.title {
    padding: 0 30px;
    text-align: center;
    line-height: 60px;
    font-size: x-large
}
.content {
    margin: 10px 0;
}
.el-row {
    padding: 0 20px;
}
.el-tag {
    margin: 0 10px;
}

.badge {
    padding: 10px 20px;
}
.comment {
    padding: 20px;
}
</style>
