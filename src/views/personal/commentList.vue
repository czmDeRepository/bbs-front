<template>
    <div class="content">
        <el-dialog
            title="修改评论"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width="40%">
            <el-input   
                type="textarea"
                :rows="2"
                v-model="commentContent"
                ></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifyCommentCommit">确 定</el-button>
            </span>
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
            <el-table-column label="被回复者" width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-avatar v-if="scope.row.repliedUserImageUrl != ''" size="small" :src="$axios.defaults.baseURL+scope.row.repliedUserImageUrl"></el-avatar>
                    {{scope.row.repliedUserName}}
                </template>
            </el-table-column>

            <el-table-column prop="createTime" width="180" label="评论时间" sortable="custom" :sort-orders="['ascending', 'descending']">
            </el-table-column>
            <el-table-column prop="content" label="评论内容" :show-overflow-tooltip="true"></el-table-column>
                
            <el-table-column  label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="modifyComment(scope.row.id, scope.row.content)">修改</el-button>
                    <el-popconfirm
                        title="确定删除评论？"
                        @confirm="deleteComment(scope.row.id)"
                        >
                    <el-button size="small" plain  slot="reference" type="danger">删除</el-button>
                    </el-popconfirm>
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
    </div>
</template>
<script>
import store from '@/services/store.js'
import tools from '@/services/tools.js'
export default {
    name: 'comment',
    data() {
        return {
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
                        this.dialogVisible = false
                        this.$message.success('修改成功')
                        for(let index = 0,len = this.comment_list.length; index < len ; index++) {
                            if(this.comment_list[index].id == this.modifyCommentId) {
                                this.comment_list[index].content = this.commentContent
                                break
                            }
                        }
                        this.modifyCommentId = 0
                        this.commentContent = ''
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
        }
    },
    created() {
        this.loading = true
        this.getComemnt()
        this.loading = false
    }
}
</script>
<style scoped>
.content {
    text-align: center;
}
</style>