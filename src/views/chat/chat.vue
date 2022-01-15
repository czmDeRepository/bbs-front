<template>
    <div class="chat">
        <el-container>
            <el-aside width="20%">  
                <el-tooltip class="item" effect="dark" content="只接收对应分类消息" placement="top">
                    <div class="subscribe">
                        <b><em>分类订阅</em></b>
                    </div>
                </el-tooltip>
                <el-select  v-model="subscribeCategoryId" collapse-tags  filterable placeholder="请选择你想接收的消息分类" @change="changeSubscribe">
                    <el-option v-for="(item, index) in categoryList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-aside>
            <el-main > 
                <el-row >
                    <el-col :span="5">
                        <el-badge :value="onLineNum">
                            <el-tag>在线人数</el-tag>
                        </el-badge>
                    </el-col>
                    <el-col :span="19" align="right">
                        <el-tooltip content="新消息自动滚动至底部" placement="top" style="height: 30px;margin: 0 14px -12px 0;">
                            <el-switch
                                v-model="autoBottom"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </el-tooltip>
                        <el-button v-if="isOnline" disabled type="success" plain size="small" @click="join">加入</el-button>
                        <el-button v-else size="small" @click="join" type="success" plain>加入</el-button>
                        <el-button v-if="isOnline" size="small" @click="quit">退出</el-button>
                        <el-button v-else size="small" disabled @click="quit">退出</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <div id="chat_content">
                        <div class="message" v-for="(item,index) in messageList" :key="index"> 
                            <div v-if="item.type == 1" class="tips">
                                <span>"{{item.user.name}}" 加入聊天室:{{item.time}}</span>
                            </div>
                            <div v-else-if="item.type == 2" class="tips" >
                                <span>"{{item.user.name}}" 离开聊天室:{{item.time}}</span>
                            </div>
                            <div v-else-if="item.type == 3 && item.isSendByMyself" align="right" >
                                <div class="information">
                                    <span >{{item.time}}</span>
                                    <i class="iconfont" :class="item.user.gender == '男' ? 'icon-man' : 'icon-woman'"></i>
                                    <b>{{item.user.name}}</b>
                                    <el-avatar size="medium" :src="item.user.imageUrl" >
                                        <!-- <img :src="item.user.imageUrl" /> -->
                                    </el-avatar>
                                </div>
                            　  <div class="box">
                                    <span class="right"></span>
                                    <div class="content">
                                       <span>&nbsp;&nbsp;{{item.content}}&nbsp;&nbsp;</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="item.type == 3" >
                                <div class="information">
                                    <el-avatar size="medium" :src="item.user.imageUrl">
                                        <!-- <img :src="item.user.imageUrl" /> -->
                                    </el-avatar>
                                    <b>{{item.user.name}}</b>
                                    <i class="iconfont" :class="item.user.gender == '男' ? 'icon-man' : 'icon-woman'"></i>
                                    <span >{{item.time}}</span>
                                </div>
                            　  <div class="box">
                                    <span class="left"></span>
                                    <div class="content">
                                        <span>&nbsp;&nbsp;{{item.content}}&nbsp;&nbsp;</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                      
                    </div>
                </el-row>
                <el-row>
                    <el-input
                        placeholder="请输入内容"
                        v-model="message"
                        maxlength="1000"
                        show-word-limit
                        @keyup.enter.native="sendMessage"
                        >
                        <el-tooltip class="item" effect="dark" placement="left-end" slot="prepend">
                            <div slot="content">只发送给对应分类订阅者<br/> 和订阅所有的人<br/>默认发送所有分类</div>
                            <el-select style="width: 130px;" v-model="messageCategoryIds" multiple collapse-tags filterable placeholder="消息分类">
                                <el-option v-for="(item,index) in categoryList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-tooltip>
                        <el-tooltip slot="append" effect="dark" content="点击发送消息" placement="right">
                            <el-button  icon="el-icon-s-promotion" @click="sendMessage"></el-button>
                        </el-tooltip>

                    </el-input>
                </el-row>
          </el-main>
          </el-container>   
    </div>
</template>
<script>
import tools from '@/services/tools.js'
import websocket from '@/services/websocket.js'
import store from '@/services/store.js'

export default {
    name: 'Chat',
    data() {
        return {
            onLineNum: 0,
            message: '',
            messageList: [
                // {
                //     type: 0, // 0加入 1离开 2消息
                //     user: {
                //         imageUrl: require('@/static/defaultHeader.png'),
                //         name: '小明',
                //         gender: '男',
                //     },
                //     time: '2021-10-29',
                //     content: '默认消息',
                //     categoryId: 1,
                // },{
                //     type: 2, // 0加入 1离开 2消息
                //     user: {
                //         imageUrl: require('@/static/defaultHeader.png'),
                //         name: '小明',
                //         gender: '男',
                //     },
                //     time: '2021-10-29',
                //     content: '默认消息',
                //     categoryId: 1,
                // }
            ],
            // 断开提示
            showClose: true,
            // websocket 状态
            isOnline: false,
            // 消息分类
            messageCategoryIds: [0],
            // 订阅分类id
            subscribeCategoryId: 0,
            // 分类
            categoryList: [
                {
                    id: 0, 
                    name: "所有",
                },
            ],
            // 消息接收自动置低
            autoBottom: true,
        }
    },
    methods: {
        changeSubscribe() {
            if(!this.isOnline) {
                this.$message.error('请先加入群聊！！！')
                return
            }
            websocket.send({newCategoryId:this.subscribeCategoryId, type: websocket.CHANGE_CATEGORY})
        },
        sendMessage() {
            if(!this.isOnline) {
                this.$message.error('请先加入群聊！！！')
                return
            }
            if(tools.isBlank(this.message)) {
                this.$message.error('不允许发送空白消息！！！')
                return
            }
            if(websocket.send({categoryIdList: this.messageCategoryIds, message:this.message, type: websocket.CHAT_MESSAGE})) {
                let data = {
                    user: {
                        id: store.getUserId(),
                        name: store.get('name'),
                        gender: store.get('gender'),
                        imageUrl: this.$axios.defaults.baseURL + store.getUserHeader()
                    },
                    time: tools.dateFormat(new Date()),
                    categoryId: 1,
                    isSendByMyself: true,
                    content: this.message,
                    type: 3,
                }
                this.messageList.push(data)
                this.message = '';
                if(this.autoBottom) {
                    this.toBottom()
                }
            } else {    
                this.$message.error('消息发送失败，请尝试刷新页面或重新登录！！！')
            }
        },
        join() {
            if(!websocket.isOnline()) {
                this.showClose = false
                websocket.close()
                websocket.init(this)
                this.showClose = true
            } else {
                this.isOnline = true
                this.$message.success('加入群聊成功')
            }
        },
        quit() {
            this.showClose = false
            websocket.close()
            this.$message.success('退出成功')
            console.log(websocket.isOnline())
        },
        close() {
            this.onLineNum = 0
            this.isOnline = false
            console.log('close')
            if(this.showClose) {
                this.$message({
                    showClose: true,
                    message: '群聊连接断开，请尝试加入群聊或刷新页面！！！',
                    type: 'error',
                    duration: 0,
                })
            }
        },
        toBottom() {
            this.$nextTick(() => {
                const chat_content = document.getElementById('chat_content');
                // chat_content.scroll(0, chat_content.scrollHeight);
                chat_content.scrollTop = chat_content.scrollHeight
            })
        }
    },
    created() {
        websocket.onOpen = ()=> {
            this.$message.success('加入群聊成功')
            this.isOnline = true
            console.log('成功加入群聊。')
        }
        websocket.onMessage = (msg)=> {
            let message = JSON.parse(msg.data)
            let data = {}
            if (message.type == 0) {
                this.onLineNum = message.onLineNum
                return
            } else if (message.type == 1) {
                this.onLineNum++
            } else if(message.type == 2) {
                this.onLineNum--
            } else {
                data.content = message.content.message
            }
            data.user = message.user
            if (message.user.imageUrl == '') {
                data.user.imageUrl = require('@/static/defaultHeader.png')
            } else {
                data.user.imageUrl = this.$axios.defaults.baseURL + message.user.imageUrl
            }
            data.time = tools.dateFormat(new Date(message.timestamp * 1000))
            data.isSendByMyself = false
            data.type = message.type
            this.messageList.push(data)

            if(this.autoBottom) {
                this.toBottom()
            }
        }
        websocket.onClose = this.close
        // 获取分类
        this.$axios.get("/category",{
            pageSize: -1,
            pageNum: -1,
        }).then((e)=>{
            this.categoryList = this.categoryList.concat(e.data.Data.data)
        })
        if(websocket.isOnline()) {
            websocket.init()
            this.isOnline = true
            console.log('刷新在线人数')
            // 获取当前在线人数
            websocket.send({type: websocket.ONLINE_NUM})

            this.subscribeCategoryId = JSON.parse(store.get("subscribeCategoryId"))
            this.messageCategoryIds = JSON.parse(store.get("messageCategoryIds"))
            this.messageList = JSON.parse(store.get("messageList"))
            this.toBottom()
        }
        console.log('create')
    },
    beforeDestroy() {
         if(websocket.isOnline()) {
            store.set("subscribeCategoryId", JSON.stringify(this.subscribeCategoryId))
            store.set("messageCategoryIds", JSON.stringify(this.messageCategoryIds))
            if (this.messageList.length > 50) {
                store.set("messageList", JSON.stringify(this.messageList.slice(this.messageList.length - 50, this.messageList.length)))
            } else {
                store.set("messageList", JSON.stringify(this.messageList))
            }
         }
    }
}
</script>
<style  lang="scss" scoped>

.chat {
    .subscribe {
        text-align: center;
        padding: 10px;
    }
    #chat_content {
        height: 330px;
        overflow: auto;
        background-color: #fff;
        padding: 10px;
        .message {
            margin-bottom: 20px;
            .box {
                border-radius: 10px;
                background-color: #b6faba;
                max-width: 45%;
                width: fit-content !important;
                min-width:20px;
                width: auto;
                position: relative;
                top: 10px;
                padding: 10px;
            }
            .content {
                font: 14px/30px arial;
                text-align: left;
            }
            .left {
                position: absolute;
                border: 10px solid transparent;
                // font-size: 0;
                border-bottom-color: #b6faba;
                left: 10px;
                top: -20px;
            }
            .right {
                position: absolute;
                border: 10px solid transparent;
                // font-size: 0;
                border-bottom-color: #b6faba;
                right: 10px;
                top: -20px;
            }
            
            .tips {
                text-align: center;  
                font-size: 10px;
                color: #878585;
            }
        }
    }
    
}

</style>