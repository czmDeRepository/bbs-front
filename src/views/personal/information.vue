<template>
    <div class="information">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户名" prop="name" >
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="账号" >
                        <el-input disabled :value="userForm.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="userForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="telephoneNumber">
                        <el-input v-model="userForm.telephoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="userForm.age" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="region">
                        <el-radio-group v-model="userForm.gender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="头像" prop="imageUrl">
                        <!-- <el-upload
                        class="avatar-uploader"
                        :action="action"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="upLoadError"
                        :name="uploadFileName"
                        :http-request="uploadImages"
                        >
                        <img v-if="userForm.imageUrl" :src="userForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->
                        <el-tooltip content="上传成功后记得点击确认修改更新头像！！！" effect="dark" placement="left-start">
                            <el-upload ref="upload"
                                class="upload-demo"
                                drag
                                :action="action"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :name="uploadFileName"
                                :http-request="uploadImages">
                                <img v-if="imageUrl" :src="$axios.defaults.baseURL+imageUrl" class="avatar">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5MB</div>
                            </el-upload>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('userForm')">确认修改</el-button>
                </el-form-item>
            </el-row>
        </el-form> 
    </div>
</template>

<script>
import store from '@/services/store.js'
import tools from '@/services/tools.js'
export default {
    name: 'information',
    data() {
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'));
            }
            setTimeout(() => {
            if (!Number.isInteger(1 * value)) {
                callback(new Error('请输入整数数值'));
            } else {
                if (value < 1 || value >130) {
                callback(new Error('请输入合理年龄1~130'));
                } else {
                callback();
                }
            }
            }, 1000);
        }
        var checkEmail = (rule, value, callback) => {
            const mailReg =/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
                if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            if (mailReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱格式'))
            }
        }
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if (!value || phoneReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的手机号格式'))
            }
        }
        return {
            imageUrl: '',
            userForm: {
                id: 0,
                name: '',
                account: '',
                password: '',
                email: '',
                telephoneNumber: '',
                age: '',
                gender: '男',
                imageUrl: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'change' }
                ],
                email: [
                    { required: true, validator:checkEmail, trigger: 'blur' }
                ],
                telephoneNumber: [
                    {  required: false, validator: checkPhone, trigger: 'blur' }
                ],
                age: [
                    { required: true, validator: checkAge, trigger: 'change' }
                ],
            },
            // 头像
            action: `${this.$axios.defaults.baseURL}/upload`,
            uploadFileName: 'image',
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$axios.put('user',this.userForm,{
                  headers: {
                      'token': store.getToken()
                  },
              }).then((e)=>{
                    if (e.data.success) {
                        store.setUserHeader(this.imageUrl)
                        this.$message.success('用户信息更新成功')
                    } else {
                        this.$message.error('用户信息更新失败，请尝试刷新或重新登陆！！！')
                    }
              })
          } else {
            return false;
          }
        });
      },
      beforeAvatarUpload(file) {
          console.log(file.type)
        const isJPG = file.type === 'image/png' || file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 jpg/png 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt5M;
      }, 
      uploadImages(file) {
          if(store.getUserId() == null) {
            this.$message.error(`请先登陆！！！`)
            return
          }
          let param = new FormData();
          param.append('image', file.file)
          this.$axios.post('upload', param, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'token': store.getToken(),
              }}).then((e)=> {
                  if(e.data.success) {
                      this.userForm.imageUrl = e.data.Data
                      this.$refs.upload.clearFiles()
                    //   this.imageUrl = this.$axios.defaults.baseURL+`${e.data.Data}`+'?time='+new Date()
                      this.imageUrl = e.data.Data
                      this.$message.success('头像上传成功')
                  }
          })
      },
    },
    beforeCreate() {
        if (tools.isNotLogin(this)) {
            return
        }
        this.$axios.get(`/user/${store.getUserId()}`, {
            headers: {
                'token': store.getToken()
            }
        }).then((e)=>{
            if (e.data.success) {
                let user = e.data.Data
                this.userForm.id = user.id
                this.userForm.account = user.account
                this.userForm.name = user.name
                this.userForm.email = user.email
                this.userForm.telephoneNumber = user.telephoneNumber
                this.userForm.age = user.age
                this.userForm.gender = user.gender
                this.userForm.imageUrl = user.imageUrl
                this.imageUrl = user.imageUrl
            }
        })
    },
}
</script>

<style>
/* .information {
    max-width: 600px
} */
/* .avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409EFF;
}
.avatar-uploader-icon {
font-size: 28px;
color: #8c939d;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
}
*/
.avatar {
    width: 210px;
    height: 180px;
    display: block;
}
.el-upload-dragger {
    width: 210px;
    height: 180px;
}
.el-upload__tip {
    line-height: 10px !important;
    margin-top: 0;
}
</style>