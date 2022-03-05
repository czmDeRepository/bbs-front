<template>
    <div >
        <el-row :gutter="10">
            <el-col v-if="isAdmin" :span="3">
                <el-select v-model="params.status"  placeholder="请选择论贴状态">
                    <el-option label="已发布" value="2"></el-option>
                    <el-option label="已删除" value="-1"></el-option>
                </el-select>
            </el-col>
            <el-col v-else-if="userId != '0' && !followingFlag" :span="3">
                <el-select v-model="params.status"  placeholder="请选择论贴状态">
                    <el-option label="未发布" value="1"></el-option>
                    <el-option label="已发布" value="2"></el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="params.selectLabel" :multiple="true" collapse-tags filterable  placeholder="请选择标签" >
                    <el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="params.selectCategory" :clearable="true" filterable  placeholder="请选择分类">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                    <el-date-picker
                        v-model="params.rangeTime"
                        type="datetimerange"
                        align="right"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        >
                    </el-date-picker>
            </el-col>
            <el-col  :span="isAdmin || userId != '0' && !followingFlag ? 7 : 10">
                <div class="filter">
                <el-input v-model="params.title" placeholder="请输入论贴标题" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
                </div>
            </el-col>
        </el-row>
        <div class="content">
            <div v-if="content_list.length == 0" >
                <el-empty description="空空如也" ></el-empty>
            </div>
            <div v-else >
                <div>
                    <el-table :data="content_list" style="width: 100%" @sort-change="sort" v-loading="loading" 
                    :default-sort = "{prop: 'updateTime', order: 'descending'}"
                    >
                        <el-table-column type="index"  width="80">
                            
                        </el-table-column>
                        <el-table-column prop="title" label="论贴标题">
                            <template slot-scope="scope">
                               <el-button type="primary" plain @click="artilceDetial(scope.row)">{{scope.row.title}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="readCount" label="阅读数量" width="100" sortable="custom" :sort-orders="['ascending', 'descending']">
                        </el-table-column>
                        <el-table-column prop="followCount" label="关注数" width="100">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                        </el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                        </el-table-column>
                        <el-table-column label="标签">
                            <template slot-scope="scope">
                               <el-tag v-for="(item,index) in scope.row.labelList" :type="colors[index % colors.length]" :key="item.id">
                                    {{item.name}}
                               </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="isAdmin" label="操作" width="80">
                             <template slot-scope="scope">
                               <el-button size="small" type="success" v-if="scope.row.status == -1" @click="modifyArticle(scope.row.id, 2)">还原</el-button>
                               <el-button size="small" type="danger" v-else @click="modifyArticle(scope.row.id, -1)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="params.pageNum"
                    :page-sizes="[5, 10, 30, 50, 100]"
                    :page-size="params.pageSize"
                    layout="sizes, prev, pager, next"
                    :total="params.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-if="isAdmin || followingFlag" class="articleDetail">
            <el-dialog
                :visible.sync="dialogVisible"
                width="90%" :destroy-on-close="false" top="2vh">
                <ArticleDetail :id="articleId" :isDialog="true"></ArticleDetail>
            </el-dialog>
        </div>
    </div>
</template>

<script >
import tools from '../../services/tools.js'
import ArticleDetail from '../article/ArticleDetail.vue'
import store from '../../services/store'
export default {
    name: 'Forum',
    components: {
        ArticleDetail,
    },
    props: {
        userId: {
            type: String,
            required: false,
            default: "0",
        },
        // 我的关注列表专用
        followingFlag: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 管理帖子
        isAdmin: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            // 排序
            sortParam: {
                updateTime: 0,
                createTime: 1,
                readCount: 2
            },
            params : {
                // 筛选
                selectLabel: [],
                selectCategory: '',
                rangeTime: null,
                title: '',
                total: 0,
                pageNum: 1,
                pageSize: 5,
                status: '2',
            },
            content_list:[
                // {
                //     id: 0,
                //     title: '论贴标题',
                //     categoryId: 5, // 分类id
                //     content: "内容",
                //     createTime: '2016-05-02', //创建时间
                //     labelList: [
                //         {
                //             id: 1,
                //             name: "java",
                //         }
                //     ], // 关联标签
                //     readCount: 12, // 阅读数量
                //     supportCount: 10, // 点赞数量
                //     userId: 1, // 创建者用户id
                // }
            ],
            // 标签列表
            labelList: [
                {
                    id: 1,
                    name: "java",
                    createTime: "2021-10-15 15:45:23",
                    status: 1,
                    updateTime: "2021-10-15 18:29:23"
                },
            ],
            // 分类列表
            categoryList: [
                {
                    id: 1, 
                    name: "生活", 
                    createTime: "2021-10-14 02:59:13", 
                    updateTime: "2021-10-14 02:59:13"
                },
            ],

            // 帖子弹出框
            dialogVisible: false,
            articleId: 0,
        }
    },
    methods: {
        search() {
            this.params.pageNum = 1
            this.getArticle()
        },
        handleSizeChange(val) {
            this.params.pageSize = val
            this.getArticle()
        },
        handleCurrentChange(val) {
            this.params.pageNum = val
            this.getArticle()
        },
        sort(e) {
            this.params.orderIndex = this.sortParam[e.prop]
            if ("ascending" === e.order) {
                this.params.isAsc = true
            } else {
                this.params.isAsc = false
            }
            this.getArticle()
        },
        getArticle() {
            this.loading = true
            if(!this.followingFlag && !this.isAdmin) {
                // 主页和我的论贴列表每次获取论贴都保存查询数据
                store.setArticleParams(this.params)
            }
            let params = new Object()
            params.status = this.params.status
            params.pageNum = this.params.pageNum
            params.pageSize = this.params.pageSize
            if (this.params.rangeTime != null) {
                params.startTime = tools.dateFormat(this.params.rangeTime[0])
                params.endTime = tools.dateFormat(this.params.rangeTime[1])
            }
            if (this.params.selectLabel.length > 0) {
                params.labelIdList = this.params.selectLabel.join()
            }
            if (this.params.selectCategory != '') {
                params.categoryId = this.params.selectCategory
            }
            if (this.params.title != '') {
                params.title = this.params.title
            }
            var headers = {}
            params.followingFlag = this.followingFlag
            if(this.followingFlag) {
                headers.token = store.getToken()
            } else {
                // 我的论贴
                if (this.userId != "0") {
                    params.userId = this.userId
                }
            }
            // 论坛获取
            this.$axios.get("/article",{params:params,headers}).then((data)=>{
                if(data.data.success) {
                    let page = data.data.Data
                    if (page.data != null) {
                        this.content_list = page.data
                    } else {
                        this.content_list = []
                    }
                    this.params.total = page.total
                } else {
                    this.$message.error(`论坛列表获取失败${data.data.message}`)
                }         
                this.loading = false
            }).catch((e)=>{
                this.$message.error(`论坛列表获取失败${e.message}`)
                this.loading = false
            })
        },
         // 论坛详情
        artilceDetial(article) {
            if(this.followingFlag || this.isAdmin) {
                // this.$router.push({name:'ArticleDetail', path: `/articleDetail/${id}/margin: 0px 15%`})
                // this.$router.push({name:'articleDetail', params:{id: id, marginStyle: 'padding: 0px 15%'}})
                this.articleId = article.id
                this.dialogVisible = true
            } else if(this.userId != '0') {
                // 修改页面
                this.$router.push(`/article/write/${article.id}`)
            } else {
                store.setArticleParams(this.params)
                this.$emit('articleDetail', article)
                this.$router.push({name:'mainArticleDetail', params:{id: article.id}})
            }
        },
        modifyArticle(id, status) {
            this.$axios.put('/article',{
                id,
                status,
            },{headers: {'token': store.getToken(),}}).then((e)=>{
                if(e.data.success) {
                    this.$message.success('操作成功')
                    this.getArticle()
                } else {
                    this.$message.error(`操作失败：${e.data.message}`)
                }
            })
        }
    },
    // 组件注入后调用
    async created() {
        // 获取标签
        this.$axios.get("/label",{
            params: {
                pageSize: -1,
                pageNum: -1,
            }
        }).then((e)=>{
            this.labelList = e.data.Data.data
        })
        // 获取分类
        this.$axios.get("/category",{
            pageSize: -1,
            pageNum: -1,
        }).then((e)=>{
            this.categoryList = e.data.Data.data
        })
        // 关注列表和管理列表不需要获取保留参数
        if(!this.followingFlag && !this.isAdmin) {
            let params = store.getArticleParams()
            if(params != null) {
                this.params = params
                // 字符串转对象
                if(this.params.rangeTime != null) {
                    this.params.rangeTime[0] = new Date(Date.parse(this.params.rangeTime[0]))
                    this.params.rangeTime[1] = new Date(Date.parse(this.params.rangeTime[1]))
                }
            }
        }
        this.getArticle()
    }
}
</script>
<style lang="css">
/* .el-dialog .el-dialog__body {
    padding: 0;
} */
.articleDetail .el-dialog {
    background-color: #d7e2ea;
}

</style>
<style lang="scss" scoped>
.filter {
    padding-left: 6%;
}
.el-select .el-input {
width: 130px;
}
.input-with-select .el-input-group__prepend {
background-color: #fff;
}
.content {
    text-align: center;
}
</style>