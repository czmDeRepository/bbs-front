<template>
    <div>
        <el-dialog
            title="修改评论"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width="40%" center>
            
            <el-input   
                type="textarea"
                :rows="2"
                v-model="commentContent"
                maxlength="255"
                show-word-limit
                ></el-input>
                    <el-button class="emoji" size="small" type="info" plain @click="displayEmoji">Emoji表情</el-button>
                    <el-button size="small" type="primary" @click="modifyCommentCommit">  确 定</el-button>
                    <div class="emoji-body" v-if="emojiDisplay">
                        <ul style="padding-left:20px;">
                            <li class="emoji-item" v-for="(value,key) in OwOMap" :key="key" @click="choseEmoji(key)">
                                <img :src="require('@/static/img/face/'+value)" alt="">
                            </li>
                        </ul>
                    </div>
        </el-dialog>
        <el-table :data="comment_list" style="width: 100%" @sort-change="sort" v-loading="loading" 
        :default-sort = "{prop: 'createTime', order: 'descending'}"
        >
            <el-table-column type="index"  width="80">
            </el-table-column>
            <!-- <el-table-column prop="title" label="评论帖子">
                <template slot-scope="scope">
                    <el-button type="primary" plain @click="artilceDetial(scope.row.id)">{{scope.row.title}}</el-button>
                </template>
            </el-table-column> -->
            <el-table-column label="被回复者" width="110" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-avatar v-if="scope.row.repliedUserImageUrl != ''" size="small" :src="$axios.defaults.baseURL+scope.row.repliedUserImageUrl"></el-avatar>
                    {{scope.row.repliedUserName}}
                </template>
            </el-table-column>

            <el-table-column prop="createTime" width="180" label="评论时间" sortable="custom" :sort-orders="['ascending', 'descending']">
            </el-table-column>
            <el-table-column label="评论内容">
                <template slot-scope="scope">
                    <div v-html="scope.row.content_html">{{scope.row.content}}</div>
                </template>
            </el-table-column>
                
            <el-table-column  label="操作" width="220">
                <template slot-scope="scope">
                    <el-button  type="warning" size="small" plain @click="modifyComment(scope.row.id, scope.row.content)">修改</el-button>
                    <el-popconfirm
                        title="确定删除评论？"
                        @confirm="deleteComment(scope.row.id)"
                        >
                        <el-button size="small" plain  slot="reference" type="danger">删除</el-button>
                    </el-popconfirm>
                    <el-button size="small" type="primary" plain @click="showArticle(scope.row.articleId)" >查看原帖</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-sizes="[5, 10, 30, 50, 100]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="total"> 
        </el-pagination>
        <div class="articleDetail">
        <el-dialog
                :visible.sync="articleVisible"
                width="90%" :destroy-on-close="false" top="2vh" >
                <ArticleDetail :id="articleId" :isDialog="true"></ArticleDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import store from '@/services/store.js'
import tools from '@/services/tools.js'
import comment from '@/services/comment.js'

import ArticleDetail from '../article/ArticleDetail.vue'

export default {
    name: 'comment',
    components: {
        ArticleDetail,
    },
    data() {
        return {
            OwOMap: comment.OwOMap,
            comment_list: [
                // {
                //     articleId: 20,
                //     content: "[可爱][可爱]",
                //     createTime: "2021-11-02 00:32:30",
                //     id: 27,
                //     repliedUserId: 2,
                //     repliedUserImageUrl: "",
                //     repliedUserName: "小明11",
                //     updateTime: "2021-11-02 00:32:30",
                //     userGender: "男",
                //     userId: 2,
                // }
            ],
             //  分页
            pageNum: 1,
            pageSize: 5,
            total: 0,
            loading: false,
            desc: true,
            // 修改评论会话
            dialogVisible: false,
            modifyCommentId: 0,
            commentContent: '', 
            emojiDisplay: false,

            // 帖子
            articleVisible: false,
            articleId: '',
        }
    },
    methods: {
        getComemnt() {
            this.$axios.get('/comment', {
                params: {
                    isDetail: false,
                    userId: store.getUserId(),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    desc: this.desc,
                }
            }).then((e)=> {
                this.comment_list = e.data.Data.data
                for(let i = 0; i < this.comment_list.length; i++) {
                    //  前端页面展示
                    this.comment_list[i].content_html = comment.analyzeEmoji(this.comment_list[i].content)
                }
                this.pageNum = e.data.Data.pageNum
                this.total = e.data.Data.total
            })
        },
        sort(e) {
            if("descending" === e.order) {
                this.desc = true
            } else {
                this.desc = false
            }
            this.getComemnt()
        },
        modifyComment(id, content) {
            this.dialogVisible = true
            this.modifyCommentId = id
            this.commentContent = content
        },
        handleClose(done) {
            this.$confirm('确认放弃修改？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        modifyCommentCommit() {
            if(tools.isBlank(this.commentContent)) {
                this.$message.error('评论非空！！！')
            } else {
                this.$axios.put('/comment',{
                    id: this.modifyCommentId,
                    content: this.commentContent,
                },{headers: {'token': store.getToken(),}}).then((e)=>{
                    if(e.data.success) {
                        for(let index = 0,len = this.comment_list.length; index < len ; index++) {
                            if(this.comment_list[index].id == this.modifyCommentId) {
                                this.comment_list[index].content = this.commentContent
                                //  前端页面展示
                                this.comment_list[index].content_html = comment.analyzeEmoji(this.commentContent)
                                this.dialogVisible = false
                                this.$message.success('修改成功')
                                break
                            }
                        }
                        this.modifyCommentId = 0
                        this.commentContent = ''
                    } else {
                        this.$message.error(e.data.message)
                    }
                })
            }
        },
        deleteComment(id) {
            this.$axios.delete('/comment', {
                params: {
                    id: id,
                },
                 headers: {
                    'token': store.getToken(),
                }
            }).then((e)=> {
                if(e.data.success) {
                    this.$message.success('删除成功')
                    this.getComemnt()
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getComemnt()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getComemnt()
        },
        //  展示/隐藏表情
        displayEmoji() {
            this.emojiDisplay = !this.emojiDisplay
        },
        //  选择表情
        choseEmoji(value) {
            this.commentContent += value
        },
        // 查看评论帖子
        showArticle(articleId) {
            this.articleId = articleId
            this.articleVisible = true
        },
    },
    created() {
        this.loading = true
        this.getComemnt()
        this.loading = false
    }
}
</script>
<style scoped>

.emoji:hover{
    animation:a 5s infinite ease-in-out;
    -webkit-animation:a 5s infinite ease-in-out;
}
.emoji-body .emoji-item {
    background: #f7f7f7;
    padding:5px 10px;
    border-radius: 5px;
    display: inline-block;
    margin: 0 10px 12px 0;
    transition: 0.3s;
    line-height: 19px;
    font-size: 20px;
    cursor: pointer;
}
.emoji-body .emoji-item:hover{
    background: #eee;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),
                0 3px 1px -2px rgba(0,0,0,.2),
                0 1px 5px 0 rgba(0,0,0,.12);
    animation:a 5s infinite ease-in-out;
    -webkit-animation:a 5s infinite ease-in-out;
}
.emoji-body {
    max-height: 170px;
    overflow: scroll;
    font-size: 0;
    padding-left: -10px;
    z-index: 1;
    border: 1px solid #ddd
}
</style>