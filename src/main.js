import Vue from 'vue'
import 'default-passive-events'
import App from './App.vue'
import axios from 'axios'
import store from '@/services/store.js'
// Element --start
// 部分组件引用
// import  { Button, Select,Table } from 'element-ui';
// /* 或写为
//  * Vue.use(Button)
//  * Vue.use(Select)
//  */
// Vue.component(Button.name, Button);
// Vue.component(Select.name, Select);
// Vue.use(Table)
// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
//完全引用 
import  ElementUI from 'element-ui';
// Element --end
import router from './router/routers.js'

Vue.use(ElementUI);
axios.defaults.baseURL = 'http://localhost:8081/v1'
// axios.defaults.baseURL = 'http://8a7i5n.natappfree.cc/v1'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data, config) {
  // 对content-type为fmultipart/form-data的不进行序列化处理
  if ((config['Content-Type']+"").toLowerCase().startsWith('multipart/form-data')) {
    return data
  }
  // 将参数序列化成URL的形式
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]


// 全局异常处理
axios.interceptors.response.use(function (response) {
  // 2003 失效 2002请求缺少token
  if (response.data.code == 2003 || response.data.code == 2002) {
      store.clear()
      vue.$message({
        showClose: true,
        message: '登陆状态已失效，请重新登陆',
        type: 'error',
        duration: 0,
        onClose: ()=>{
          store.clear()
          vue.$router.push("/")
        },
      })
  }
  return response
})
// , function (error) {
//   vue.$message.error(`请求失败${error}`)
//   return Promise.reject(error.data)
// }
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 全局颜色数组
Vue.prototype.colors = [
  '',
  'success',
  'info',
  'danger',
  'warning',
  ]
// 全局事件
Vue.prototype.$EventBus = new Vue()

export const vue = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
