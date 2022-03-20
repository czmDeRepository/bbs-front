<template>
    <div class="userContent">
        <el-row class="firter">
            <el-col :span="3">
                <el-select v-model="status"  placeholder="用户状态" :clearable="true" size="medium">
                    <el-option label="正常" value="1" ></el-option>
                    <el-option label="已注销" value="2"></el-option>
                    <el-option label="黑名单" value="3"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="gender"  placeholder="性别" :clearable="true" size="medium">
                    <el-option label="男" value="男" ></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="role"  placeholder="角色" :clearable="true" size="medium">
                    <el-option label="普通用户" value="1" ></el-option>
                    <el-option label="管理员" value="2"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input v-model="name" placeholder="请输入用户名" class="input-with-select" size="medium">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <div v-if="content_list.length > 0">
            <el-table :data="content_list" style="width: 100%" @sort-change="sort" v-loading="loading" 
            :default-sort = "{prop: 'updateTime', order: 'descending'}">
                <el-table-column type="index"  width="50"></el-table-column>
                <el-table-column prop="name" label="用户名">
                </el-table-column>
                <el-table-column prop="account" label="账号">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column label="性别" width="80">
                    <template slot-scope="scope">
                        <i class="iconfont" v-if="scope.row.gender != ''" :class="scope.row.gender == '男' ? 'icon-man' : 'icon-woman'">
                            {{scope.row.gender}}
                        </i>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <el-tag :type="colors[scope.row.status % colors.length]">
                            {{userStatus(scope.row.status)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="角色" width="90" >
                    <template slot-scope="scope" >
                        <el-button v-if="store.getUserRole() == 3" size="mini" type="warning" @click="modifyRole(scope.$index,scope.row.role)">
                            {{scope.row.role == 2 ? '管理员' : '普通用户'}}
                        </el-button>
                        <el-tag v-else type="warning">
                            {{scope.row.role == 2 ? '管理员' : '普通用户'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" class="operation">
                    <template slot-scope="scope">

                        <el-button size="mini" :disabled="store.getUserRole() != 3 && scope.row.role > 1" type="primary" @click="modifyPassword(scope.$index)">重置密码</el-button>
                        <el-button v-if="scope.row.status == 1" size="mini" :disabled="store.getUserRole() != 3 && scope.row.role > 1" type="danger"  @click="updateStatus(scope.$index, 2)">注销</el-button>
                        <el-button v-if="scope.row.status == 1" size="mini" :disabled="store.getUserRole() != 3 && scope.row.role > 1" type="warning"  @click="updateStatus(scope.$index, 3)">黑名单</el-button>
                        <el-button v-else size="mini" :disabled="store.getUserRole() != 3 && scope.row.role > 1" type="success" @click="updateStatus(scope.$index, 1)">恢复</el-button>
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
            <div v-if="title == '角色权限修改'">
                <el-radio v-model="dialogRole" label="1" border>普通用户</el-radio>
                <el-radio v-model="dialogRole" label="2" border>管理员</el-radio>
            </div>
            <el-input v-else v-model="password" placeholder="请输入新密码">
                 <template slot="prepend">密码</template>
            </el-input>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="commit">确 定</el-button>
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
            store,
            // 排序
            sortParam: {
                updateTime: 0,
                createTime: 1,
            },
            // 用户名
            name: '',
            // 用户状态
            status: '',
            // 用户角色
            role: '',
            // 用户性别
            gender: '',
            orderIndex: 0,
            isDesc: true,
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
            title: '修改标签',
            dialogVisible: false,
            password: '',
            userIndex: -1,
            dialogRole: '',
        }
    },
    methods: {
        search() {
            this.pageNum = 1
            this.getUserList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getUserList()
        },
        sort(e) {
            this.orderIndex = this.sortParam[e.prop]
            if ("ascending" === e.order) {
                this.isDesc = false
            } else {
                this.isDesc = true
            }
            this.getUserList()
        },
        getUserList() {
            this.loading = true
            this.$axios.get("/user",{
                params: {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    name: this.name,
                    status: this.status,
                    gender: this.gender,
                    role: this.role,
                    isDesc: this.isDesc,
                    orderIndex: this.orderIndex
                },
                headers: {
                    'token': store.getToken(),
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
                    this.$message.error(`获取用户列表失败: ${e.data.message}` )
                }

            })
        },
        userStatus(status) {
            switch(status) {
                case 1:
                    return '正常'
                case 2:
                    return '已注销'
                case 3:
                    return '黑名单'
                default:
                    return '未知'
            }
        },
        modifyPassword(index) {
            this.title = '重置密码'
            this.userIndex = index
            this.password = '123456'
            this.dialogVisible = true
        },
        modifyRole(index, role) {
            this.title = '角色权限修改'
            this.userIndex = index
            this.dialogRole = ''+role
            this.dialogVisible = true
        },
        commit() {
            let param = new Object()
            param.id =  this.content_list[this.userIndex].id
            if(this.dialogRole != '') {
                param.role = this.dialogRole
            } else {
                if(tools.isBlank(this.password)) {
                    this.$message.error('密码非空')
                    return
                }
                param.password =  this.password
            }
            this.$axios.put('/user', param, { headers: {'token': store.getToken(),}}
                ).then((e)=>{
                    if(e.data.success) {
                        this.dialogVisible = false
                        this.$message.success('操作成功')
                        this.content_list[this.userIndex].updateTime = tools.dateFormat(new Date())
                        this.password = ''
                        if(this.dialogRole!= '') {
                            this.content_list[this.userIndex].role = this.dialogRole
                            this.dialogRole = ''
                        }
                    } else {
                        this.$message.error(`操作失败：${e.data.message}`)
                    }
                }
            )
        },
        updateStatus(userIndex, status) {
            this.$axios.put('/user',{id: this.content_list[userIndex].id,status,},{   headers: {'token': store.getToken(),}}).then((e)=>{
                    if(e.data.success) {
                        this.dialogVisible = false
                        this.$message.success('操作成功')
                        this.getUserList()
                    } else {
                        this.$message.error(`操作失败：${e.data.message}`)
                    }
                }
            )
        },
        
    },
    created() {
        this.getUserList()
    }
}
</script>
<style scoped>
.userContent {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
}
.firter .el-col {
    padding-right: 10px;
}
</style>
<style lang="css">
.el-button+.el-button {
    margin: 0px;
}
</style>