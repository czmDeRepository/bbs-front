<template>
    <div class="categoryContent">
        <el-row>
            <el-col :span="6">
                <el-input v-model="name" size="medium" placeholder="请输入分类名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="18" align="right">
                <el-button type="primary" size="small" plain @click="insert">创建</el-button>
            </el-col>
        </el-row>
        <div v-if="content_list.length > 0">
            <el-table :data="content_list" style="width: 100%" @sort-change="sort" v-loading="loading" 
            :default-sort = "{prop: 'updateTime', order: 'ascending'}">
                <el-table-column type="index"  width="80"></el-table-column>
                <el-table-column prop="name" label="分类名">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" plain @click="modify(scope.$index)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
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
        </div>
        <div v-else>
            <el-empty description="空空如也" ></el-empty>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%">
            <el-input v-model="cateGoryContent" placeholder="请输入分类名">
                 <template slot="prepend">分类名</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="commit" size="medium">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import store from '@/services/store.js'
import tools from '@/services/tools.js'

export default {
    data() {
        return {
            // 排序
            sortParam: {
                updateTime: 0,
                createTime: 1,
            },
            name: '',
            orderIndex: 0,
            isDesc: false,
            //  分页
            pageNum: 1,
            pageSize: 5,
            total: 0,
            content_list: [
                {
                    name: '程序员',
                }
            ],
            loading: false,

            // 修改窗口
            title: '修改分类',
            dialogVisible: false,
            cateGoryContent: '',
            cateGoryIndex: -1,
        }
    },
    methods: {
        search() {
            this.pageNum = 1
            this.getCategory()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getCategory()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getCategory()
        },
        sort(e) {
            this.orderIndex = this.sortParam[e.prop]
            if ("ascending" === e.order) {
                this.isDesc = false
            } else {
                this.isDesc = true
            }
            this.getCategory()
        },
        getCategory() {
            this.loading = true
            this.$axios.get("/category",{
                params: {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    name: this.name,
                    isDesc: this.isDesc,
                    orderIndex: this.orderIndex
                }
            }).then((e)=>{
                if(e.data.success) {
                    let page = e.data.Data
                    if (page.data != null) {
                        this.content_list = page.data
                    } else {
                        this.content_list = []
                    }
                    this.total = page.total
                    this.loading = false
                } else {
                    this.$message.error(`获取分类列表失败: ${e.data.message}` )
                }

            })
        },
        modify(index) {
            this.title = '修改分类'
            console.log(index, this.content_list[index])
            this.cateGoryIndex = index
            this.cateGoryContent = this.content_list[index].name
            this.dialogVisible = true
        },
        insert() {
            this.title = '创建分类'
            this.cateGoryIndex = -1
            this.cateGoryContent = ''
            this.dialogVisible = true
        },
        commit() {
            if(tools.isBlank(this.cateGoryContent)) {
                this.$message.error('分类名非空')
                return
            }
            if(this.cateGoryIndex == -1) {
                this.$axios.post('/category',{
                    name: this.cateGoryContent,
                },{headers: {'token': store.getToken(),},
                }).then((res) => {
                    if(res.data.success) {
                        this.$message.success('创建成功')
                        this.dialogVisible = false
                    } else {
                        this.$message.error(`修改失败：${res.data.message}`)
                    }
                    this.getCategory()
                })
            } else {
                this.$axios.put('/category',{
                    id: this.content_list[this.cateGoryIndex].id,
                    name: this.cateGoryContent,
                },{headers: {'token': store.getToken(),}}).then((e)=>{
                    if(e.data.success) {
                        this.dialogVisible = false
                        this.$message.success('修改成功')
                        this.content_list[this.cateGoryIndex].name = this.cateGoryContent
                        this.content_list[this.cateGoryIndex].updateTime = tools.dateFormat(new Date())
                        this.cateGoryIndex = -1
                        this.cateGoryContent = ''
                    } else {
                        this.$message.error(`修改失败：${e.data.message}`)
                    }
                })
            }
        }
    },
    created() {
        this.getCategory()
    }
}
</script>
<style scoped>
.categoryContent {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
}
</style>