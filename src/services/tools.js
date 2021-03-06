
import store from './store.js'
import { JSEncrypt } from 'jsencrypt'
export default{
    dateFormat(date) {
        if(date == null) {
            return null
        }
        let fmt = "yyyy-MM-dd hh:mm:ss"
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒  
        };
        if(/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    isBlank(str) {
        if ( str == undefined || str == "" ) return true;
        var regu = /^[\s]+$/;
        var re = new RegExp(regu);
        return re.test(str);
    },
    isNotLogin(vue) {
        if (store.getUserId() == null) {
            // store.clear()
            vue.$message({
                showClose: true,
                message: '登陆状态已失效，请重新登陆',
                type: 'error',
                duration: 0,
                onClose: ()=>vue.$router.push('/'),
            })
            return true
        }
        return false
    },
    refreshInterval: null,
    refreshToken(vue) {
        console.log("refreshToken",this.refreshInterval)
        if(store.getUserId() != null) {
            if(this.refreshInterval == null) {
                var that = this
                this.refreshInterval = setInterval(function() {
                    console.log("定时器", that.refreshInterval)
                    vue.$axios.put('user/refresh',{},{
                        headers: {
                            'token': store.getToken()
                        },
                    }).then((e)=>{
                        if (e.data.success) {
                            store.setToken(e.data.Data)
                        } else {
                            clearInterval(that.refreshInterval)
                            that.refreshInterval = null
                            vue.$message({
                                showClose: true,
                                message: '登陆状态已失效，请重新登陆',
                                type: 'error',
                                duration: 0,
                                onClose: ()=>{
                                    store.clear()
                                    vue.$router.push('/')
                                },
                            })
                        }
                    })
                }, 5 * 60 * 60 * 1000)     // 5小时刷新一次
            }
        }
    },
    stopRefreshToken() {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
    },
    // rsa加密
    encrypt(param) {
        let encrypt = new JSEncrypt()
        let PublicKey = "-----BEGIN RSA PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoKjkQK3Km4iVXuzehVUr7dLjRAQ7vQdurVOBa4LrlYL1L4bmdmm8WPsaI5b540E0i/MPBvQbmjXxwlreECIPuMs2ni2yESSeLsfKUwEUipVv1r0X/LhRSFh/G0qVe6uheCIGdgiMXu0g+HlEj5FOjoZwKYUwo7CpQprP4Mi/aRK7hQnZqV7eWTPRj187BqNpecx+0uD4ju6bbePr+r/CQ7s879l+jZk4J40sY1wq6+Xmq2yZd9xT+sZtW8DhbIb8+vgdA6Qn/lydIwW/BphYVdi6/89Ah/Yx975tjJYFZppT3O0Bnzka4LYZaHvypqlPwvGpDfT6cQkEIycWqUn0NwIDAQAB-----END RSA PUBLIC KEY-----"
        encrypt.setPublicKey(PublicKey)
        return encrypt.encrypt(JSON.stringify(param))
    },
    // 获取消息
    messageInterval: null,
    handleMessage(commentCount, replyCount) {
        console.log('默认消息处理', commentCount, replyCount)
    },
    pullMessage(vue, force) {
        let that = this
        function pull() {
            vue.$axios.get("/message/statistics", {
                headers: {
                    'token': store.getToken()
                }
            }).then((e)=>{
                if(e.data.success) {
                    that.handleMessage(e.data.Data.commentCount, e.data.Data.replyCount)
                } else {
                    vue.$message.error(`获取消息失败: ${e.data.message}`)
                }
            })
        }
        // 强制刷新
        if(force) {
            return pull()
        }
        if(this.messageInterval == null) {
            console.log('开始拉取消息')
            pull()
            this.messageInterval = setInterval(pull, 1 * 60 * 1000 + 3000) // 1.3分钟一次
        }
    },
    stopPullMessage() {
        if(this.messageInterval != null) {
            clearInterval(this.messageInterval)
            this.messageInterval = null
        }
    },
    uploadImage(vue, file, callback) {
        if(store.getUserId() == null) {
            vue.$message.error(`请先登陆！！！`)
            return
        }
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);//发起异步请求
        reader.onload = function(){
            let ext = file.name.substr(file.name.indexOf("."), file.name.length);  
            //读取完成后，数据保存在对象的result属性中
            let fileName = vue.$md5(new Uint8Array(this.result)) + ext
            vue.$axios.options('upload', {
                params: {
                    fileName: fileName
                },
                headers: {
                    'token': store.getToken()
                }
            }).then((e)=>{
                if(e.data.success) {
                    return callback(e.data.Data)
                }
                // 不存在，触发文件上传
                let param = new FormData();
                param.append('image', file)
                vue.$axios.post('upload', param, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': store.getToken(),
                    }}).then((e)=> {
                        if(e.data.success) {
                            return callback(e.data.Data)
                        } else {
                            vue.$message.error(`图片上传失败:${e.data.message}, 请稍后重试。。。`)
                        }
                    })
                })
        }
    },
}
