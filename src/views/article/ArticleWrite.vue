<template>
    <div>
        <el-form id="writer" class="content_form" ref="artilceForm" :model="artilceForm" label-width="80px" :rules="articleRules">
            <div>
                <el-row>
                <el-col :span="7">        
                    <em><b style="font-size:30px">编辑论贴</b></em>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="title" >
                        <el-input size="medium" :maxlength="20" v-model="artilceForm.title" placeholder="请输入论贴标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item prop="labelList">
                        <el-select size="medium" style="margin-left:-80px;" v-model="artilceForm.labelList" :multiple="true" collapse-tags filterable placeholder="请选择标签" >
                            <el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-form-item prop="categoryId">
                        <el-select size="medium" style="margin-left:-80px;" v-model="artilceForm.categoryId" :clearable="true" filterable placeholder="请选择分类">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" align="right">
                    <el-button size="medium" v-if="id == 0 || artilceForm.status == 1" type="success" @click="post('artilceForm', 2, '发布')">发布</el-button>
                    <el-popover v-if="artilceForm.id == 0"
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="保存草稿可在个人中心查看。">
                        <el-button size="medium" slot="reference" type="warning" @click="post('artilceForm', 1, '保存')">保存</el-button>
                    </el-popover>
                    <el-button size="medium" style="margin-left: 0px;" v-else type="warning" @click="post('artilceForm', artilceForm.status, '修改')">修改</el-button>
                    <el-popconfirm v-if="id != 0"
                        title="确定返回？请确保已经保存保存编辑！！！"
                        @confirm="deleteArticle"
                        >
                        <el-button size="medium" slot="reference" type="danger" >删除</el-button>
                    </el-popconfirm>
                    <el-popconfirm
                        title="确定返回？请确保已经保存保存编辑！！！"
                        @confirm="back"
                        >
                        <el-button size="medium" slot="reference" type="info">返回</el-button>
                    </el-popconfirm>
                </el-col>
                </el-row>
            </div>
            <div class="editor">
               <MavonEditor
                    :toolbars="toolbars"
                    v-model="artilceForm.content" 
                    ref="md"
                    style="min-height: 600px"
                    @imgAdd="imgeAdd"
                    :ishljs = "true"
                ></MavonEditor>
            </div>
        </el-form>
    </div>
</template>

<script>
// 组件地址 https://gitee.com/dsnull/mavonEditor/
import  { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import tools from '@/services/tools.js' 
import store from '@/services/store.js'
export default {
    name: "ArticleWrite",
    props: {
        id: {
            required: false,
            default: 0,
        },
    },
    components: {
        MavonEditor: mavonEditor,
    },
    data() {
        var checkTitle = (rule, value, callback) => {
            if (tools.isBlank(value)) {
                this.artilceForm.title = ''
                return callback(new Error(rule.message))
            }
            callback()
        }
        var checkLabelList =  (rule, value, callback) => {
            if (value.length == 0) {
                return callback(new Error(rule.message))
            }
            callback()
        }
        return {
            artilceForm: {
                id: 0,
                title: '',
                categoryId: '',
                // 筛选
                labelList: [],
                content: '',
                status: '',
            },
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
            articleRules: {
                title: { required: true,  validator: checkTitle, message: '标题不能为空白', trigger: 'blur'},
                categoryId: [{required: true, message: '分类不能为空', trigger: 'change'},],
                labelList: [{ required: true,  validator: checkLabelList, message: '标签不能为空', trigger: 'change'},]
            },
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: false, // 保存（触发events中的save事件）
                navigation: true, // 导航目录
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                subfield: true, // 单双栏模式
                preview: true // 预览
            },
        }
    },
    methods: {
        // 提交
        post(formName,status,opt){
            if (tools.isNotLogin(this)) {
                 return
            }
            this.$refs[formName].validate((valid) => {
                 if (valid) {
                     if (tools.isBlank(this.artilceForm.content)) {
                         this.$message.error('论贴内容不可为空白！！！')
                         return false
                     }
                    let param =  new Object({
                        title: this.artilceForm.title,
                        categoryId: this.artilceForm.categoryId,
                        // 筛选
                        labelList: this.artilceForm.labelList.join(','),
                        status: status,
                        content: this.artilceForm.content,
                    })
                    //  新增
                    if (this.artilceForm.id == 0) {
                        this.$axios.post('article',param,{
                            headers: {'token': store.getToken(),},
                        }).then((e)=> {
                            if(e.data.success) {
                                this.artilceForm.status = status
                                if (status == 2) {
                                    this.$alert('发布成功', '', {
                                        type: 'success',
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        callback: action => {
                                            this.$router.push('/main/index')
                                        }
                                    })
                                } else if (status == 1) {
                                    this.artilceForm.id = e.data.Data.id
                                    this.id = e.data.Data.id
                                    this.$message.success('保存成功。')
                                }
                            } else {
                                this.$message.error(`论贴${status == 2 ? '发布':'保存'}失败${e.data.message}`)
                            }
                        })
                    //  更新
                    } else {
                        param.id = this.artilceForm.id
                        this.$axios.put('article',param,{
                            headers: {'token': store.getToken(),},
                        }).then((e)=> {
                            if(e.data.success) {
                                this.artilceForm.status = status
                                this.$message.success(`${opt}成功。`)
                            } else {
                                this.$message.error(`论贴${opt}失败！！！${e.data.message}`)
                            }
                        })
                    }
                 } else {
                     return false
                 }
             })
        },
        back() {
            this.$router.go(-1)
        },
        // 文章添加图片
        imgeAdd(pos, $file) {
            console.log($file)
            tools.uploadImage(this, $file, (url) => {
                if(url != undefined) {
                    //将返回的url替换到文本原位置
                    this.$refs.md.$img2Url(pos, this.$axios.defaults.baseURL + url);
                    this.$message.success('图片上传成功')
                }
            })
        },
        deleteArticle() {
            this.$axios.delete('/article',{
                params: {
                    id: this.id
                },
                headers: {
                    token: store.getToken()
                }
            }).then((e)=>{
                if(e.data.success) {
                    this.$message.success('删除成功')
                    this.back()
                } else {
                    this.$message.error(`删除失败, message:${e.message}`)
                }
            })
        }
    },
    // 组件注入后调用
    created() {
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
            params: {
                pageSize: -1,
                pageNum: -1,
            }
        }).then((e)=>{
            this.categoryList = e.data.Data.data
        })
        
        if(this.id != 0) {
            this.artilceForm.id = this.id
            this.$axios.get(`/article/${this.id}`).then((e)=>{
                // console.log(e.data.Data)
                if(e.data.success) {
                    let article = e.data.Data
                    this.artilceForm.title = article.title
                    this.artilceForm.categoryId = article.categoryId
                    this.artilceForm.labelList.length = 0
                    if (article.labelList != null) {
                        article.labelList.forEach(label => {
                            this.artilceForm.labelList.push(label.id)
                        });
                    }
                    this.artilceForm.status =  article.status
                    this.artilceForm.content = article.content
                
                } else {
                    this.$message.error('文本内容加载失败')
                }
            })
        }
    }
}
</script>
<style scoped>
.content_form {
    background-color: #d7e2ea;
    padding: 20px;
}
.editor {
    padding: 20px;
}
</style>
