import store from '@/services/store.js'
var websocket = null
export default{
    name: 'websocket',
    showClose: true,
    // websocket消息类型
    ONLINE_NUM:         4,
    CHANGE_CATEGORY:    5,
    CHAT_MESSAGE:       6,
    onOpen(){},
    onMessage(msg) {},
    onClose(){},
    init(obj) {
        if(websocket == null) {
            websocket = new WebSocket(`ws${obj.$axios.defaults.baseURL.slice(obj.$axios.defaults.baseURL.indexOf(':'))}/ws/chat?token=${store.getToken()}`)
            this.showClose = true
            console.log('新建立连接')
        }
        websocket.onopen = ()=> {
            this.onOpen()
            let heartbeat = {type: 7}
            let that = this
            //每隔4分钟发送一次心跳
            let timer = setInterval(function(){
                if(!that.send(heartbeat)) {
                    clearInterval(timer)
                }
            }, 4 * 60 * 1000)
        }
        websocket.onmessage = this.onMessage
        websocket.onclose = ()=>{
            websocket = null
            this.onClose()
        }
    },
    send(message) {
        if(websocket == null) {
            return false
        }
        console.log(JSON.stringify(message))
        websocket.send(JSON.stringify(message))
        return true
    },
    close() {
        console.log(websocket)
        if(websocket != null) {
            websocket.close()
            websocket = null
        }
    },
    isOnline() {
        return websocket != null
    }
    
}