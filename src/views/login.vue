<template>
  <div id="login" >
    <el-row>
    <!-- justify 对齐方式 -->
          <el-col>
                <!-- form表单 -->
                    <el-tabs :stretch="true" tab-position="bottom">
                        <el-tab-pane label="账号密码登录">
                            <el-form label-position="left" :rules="loginRules" :model="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
                            <h1 style="text-align: center;">欢迎登陆</h1>
                            <el-divider></el-divider>
                            <el-form-item
                                label="账号"
                                prop="account">
                                <!-- :rules="[
                                { required: true, message: '账号不能为空'},
                                ]"> -->
                                <el-input prefix-icon="el-icon-user-solid" placeholder="请输入账号" type="text" v-model="loginForm.account"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="密码"
                                prop="password">
                                <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
                            </el-form-item>
                            <el-form-item
                                label="验证码"
                                prop="captcha">
                                <el-row >
                                    <el-col :span="16">
                                        <el-input prefix-icon="el-icon-lock" placeholder="请输入验证码" v-model="loginForm.captcha">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-image style="width:100%;height:40px; cursor:pointer;" :src="captchaBase64" @click="getCaptcha(loginForm.captchaKey)">
                                            <div slot="error" class="image-slot">
                                                <i class="el-icon-picture-outline"></i>
                                            </div>
                                        </el-image>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                                <el-button type="primary" @click="submitForm('loginForm')" :loading="loading">登陆</el-button>
                                <el-button @click="resetForm('loginForm')">清空</el-button>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="注册">
                            <el-form label-position="left" :rules="registerRules" :model="registerForm" ref="registerForm" label-width="100px" class="demo-ruleForm">
                            <h1 style="text-align: center;">注册</h1>
                            <el-divider></el-divider>
                            <el-form-item
                                label="用户名"
                                prop="name">
                                <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" type="text" v-model="registerForm.name"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="账号"
                                prop="account">
                                <el-input prefix-icon="el-icon-user-solid" placeholder="请输入账号" type="text" v-model="registerForm.account"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="邮箱"
                                prop="mail">
                                <el-input prefix-icon="el-icon-message" placeholder="请输入邮箱" type="text" v-model="registerForm.mail"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" prop="captcha">
                                    <el-input prefix-icon="el-icon-lock" placeholder="请输入验证码" v-model="registerForm.captcha">
                                        <template slot="append">
                                             <el-link :type="registerForm.getEmailType" :disabled="registerForm.getEmailDisabled"  @click="getEmailCaptcha('registerForm', registerForm)">
                                                <span>
                                                    {{registerForm.emailText}}
                                                </span>
                                                <i class="iconfont icon-fasongyoujian"></i>
                                             </el-link>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            <el-form-item
                                label="密码"
                                prop="password"
                                >
                                <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="registerForm.password" show-password></el-input>
                            </el-form-item>
                                <el-button type="primary" @click="submitForm('registerForm')" :loading="loading">注册</el-button>
                                <el-button @click="resetForm('registerForm')">清空</el-button>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="验证码登录" >
                            <h1 style="text-align: center;">欢迎登陆</h1>
                            <el-divider></el-divider>
                            <el-form label-position="left" label-width="100px" :model="captchaForm" :rules="captchaRules" ref="captchaForm" class="demo-ruleForm">
                                <el-form-item
                                    label="邮箱"
                                    prop="mail">
                                    <el-input prefix-icon="el-icon-message" placeholder="请输入邮箱" type="text" v-model="captchaForm.mail"></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" prop="captcha">
                                    <el-input prefix-icon="el-icon-lock" placeholder="请输入验证码" v-model="captchaForm.captcha">
                                        <template slot="append">
                                            <el-link :type="captchaForm.getEmailType" :disabled="captchaForm.getEmailDisabled"  @click="getEmailCaptcha('captchaForm', captchaForm)">
                                                <span>
                                                    {{captchaForm.emailText}}
                                                </span>
                                                <i class="iconfont icon-fasongyoujian"></i>
                                            </el-link>
                                        </template>
                                    </el-input>
                                </el-form-item>
                                <el-button type="primary" @click="submitForm('captchaForm')" :loading="loading">登陆</el-button>
                                <el-button @click="resetForm('captchaForm')">清空</el-button>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
          </el-col>
    </el-row>


  </div>

</template>

<script>
import store from '@/services/store.js'
import tool from '@/services/tools.js'
import { Base64 } from 'js-base64';
    export default {
        data() 
        {
            var checkEmail = (rule, value, callback) => {
                // const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                const mailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                if (mailReg.test(value)) {
                    if(this.emailExisted) {
                        this.emailExisted = false
                        return callback(new Error('邮箱已被注册'))
                    }
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }
            
            var checkAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'))
                }
                if (this.accountExisted) {
                    this.accountExisted = false
                    return callback(new Error('账号已存在'))
                } else {
                    callback()
                }
            }
            return {
                accountExisted: false,
                emailExisted: false,
                loginRules: {
                    account: [
                        { required: true, validator: checkAccount},
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空'},
                        { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'change' }
                    ],
                    captcha: {required: true, message: '验证码不能为空'},
                },
                registerRules: {
                    account: [
                        { required: true, validator: checkAccount},
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'change' }
                    ],
                    name: { required: true, message: '用户名不为空'},
                    password: [
                        { required: true, message: '密码不能为空'},
                        { min: 6, max: 12, message: '长度在 6 到 32 个字符', trigger: 'change' }
                    ],
                    mail: { required: true, validator: checkEmail},
                    captcha: {required: true, message: '验证码不能为空'},
                },
                captchaRules: {
                    mail: { required: true, validator: checkEmail},
                    captcha: { required: true, message: '验证码不能为空'},
                },
                loginForm: {
                    account: '',
                    password: '',
                    captcha: '',
                    captchaKey: '',
                },
                registerForm: {
                    name: '',
                    account: '',
                    password: '',
                    mail: '',
                    captcha: '',
                    isExisted: false,
                    // 邮箱验证
                    emailText: '获取验证码',
                    getEmailDisabled: false,
                    getEmailType: "success",
                },
                captchaForm: {
                    mail: '',
                    captcha: '',
                    isExisted: true,
                    // 邮箱验证
                    emailText: '获取验证码',
                    getEmailDisabled: false,
                    getEmailType: "success",
                },
                loading: false,
                // 登录验证码
                captchaBase64: '',
            };
        },
        methods: {
            submitForm(formName) 
            {
                this.$refs[formName].validate((valid) => 
                    {
                        if (valid) 
                        {
                            if(formName === 'registerForm') {
                                this.$axios.post('/user',{
                                    name: this.registerForm.name,
                                    account: this.registerForm.account,
                                    password: tool.encrypt(this.registerForm.password),
                                    email: this.registerForm.mail,
                                    captcha: this.registerForm.captcha,
                                }).then((e)=>{
                                    if(e.data.success) {
                                        let splits = e.data.Data.split('.')
                                        let payload = JSON.parse(Base64.decode(splits[1]))
                                        console.log(payload)
                                        store.setToken(e.data.Data)
                                        store.setUserId(payload.id)
                                        store.setUserRole(payload.role)
                                        store.setUserHeader(payload.imageUrl)
                                        store.set('name', payload.name)
                                        store.set('gender', payload.gender)
                                        this.$notify({
                                            title: '成功',
                                            message: '注册成功',
                                            type: 'success'
                                        });
                                        this.$emit("success")
                                    } else {
                                        switch(e.data.code) {
                                            case 3000:
                                                this.$notify.error({
                                                    title: '错误',
                                                    message: '账号已存在'
                                                });
                                                this.accountExisted = true
                                                this.$refs['registerForm'].validate((v)=>false);
                                                break
                                            case 3030:
                                                this.$notify.error({
                                                    title: '错误',
                                                    message: '邮箱已被注册'
                                                });
                                                this.emailExisted = true
                                                this.$refs['registerForm'].validate((v)=>false);
                                                break
                                            default:
                                                this.$message.error(`注册失败: ${e.data.message}`)
                                        }
                                        
                                    } 
                                })
                            } else {
                                var params
                                // 验证码登录
                                if(formName == 'captchaForm') {
                                    params = {
                                        email: this.captchaForm.mail,
                                        captcha: this.captchaForm.captcha,
                                    }
                                } else {
                                    params = {
                                        account: this.loginForm.account,
                                        password: tool.encrypt(this.loginForm.password),
                                        captcha: this.loginForm.captcha,
                                        captchaKey: this.loginForm.captchaKey,
                                    }
                                }
                                this.$axios.get('/user/login', {
                                    params
                                }).then((e)=>{
                                    if(e.data.success) {
                                        let splits = e.data.Data.split('.')
                                        let payload = JSON.parse(Base64.decode(splits[1]))
                                        console.log(payload)
                                        store.setToken(e.data.Data)
                                        store.setUserId(payload.id)
                                        store.setUserRole(payload.role)
                                        store.setUserHeader(payload.imageUrl)
                                        store.set('name', payload.name)
                                        store.set('gender', payload.gender)
                                        this.$notify({
                                            title: '成功',
                                            message: '登陆成功',
                                            type: 'success'
                                        });
                                        this.$emit("success")
                                    } else {
                                        this.$message.error(`登陆失败: ${e.data.message}`)
                                    }
                                })
                            }
                        }
                    }
                );
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCaptcha(captchaKey) {
                if(captchaKey != undefined && captchaKey != "") {
                    this.$axios.put('/captcha', {captchaKey:captchaKey}).then((e)=>{
                        if(e.data.success) {
                            this.captchaBase64 = e.data.Data.image
                            this.loginForm.captchaKey = e.data.Data.captchaKey
                        } else {
                            this.$message.error('获取验证码失败')
                        }
                    })
                    return
                }
                this.$axios.get('/captcha').then((e)=>{
                    if(e.data.success) {
                        this.captchaBase64 = e.data.Data.image
                        this.loginForm.captchaKey = e.data.Data.captchaKey
                    } else {
                        this.$message.error('获取验证码失败')
                    }
                })
            },
            // 获取邮箱验证码
            getEmailCaptcha(name, form) {
                this.$refs[name].validateField(['mail'], (err) => 
                {
                    if(!err) {
                        this.$axios.post('/email',{
                            email: form.mail,
                            isExisted: form.isExisted,
                        }).then((e)=>{
                            if (!e.data.success) {
                                if (e.data.code == 3030) {
                                    this.$notify.error({
                                        title: '错误',
                                        message: '邮箱已被注册'
                                    });
                                    this.emailExisted = true
                                    this.$refs['registerForm'].validate((v)=>false);
                                    return
                                } else {
                                    this.$message.error('获取验证码失败：'+e.data.message)
                                }
                                return
                            }
                            this.$message.success("验证码已成功发送")
                            form.getEmailDisabled = true
                            form.getEmailType = "info"
                            let time = 60
                            let itel = setInterval(function(){
                                form.emailText = time + "s后重试"
                                time--
                                if (time == 0) {
                                    clearInterval(itel)
                                    form.getEmailDisabled = false
                                    form.getEmailType = "success"
                                    form.emailText = "获取验证码"
                                }
                            }, 1000)
                            
                        })
                    }
                })
                
                
            }
        },
        created() {
            this.getCaptcha()
        },
    }
</script>

<style>
h1 {
    line-height: 0%;
}
</style>
