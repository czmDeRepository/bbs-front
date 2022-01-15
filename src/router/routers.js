import Vue from 'vue'
import Router from 'vue-router'

import index from '../views/index.vue'
import search from '../views/components/search.vue'
import ArticleDetail from '../views/article/ArticleDetail.vue'
import login from '@/views/login.vue'
import personal from '@/views/personal/personal'
import ArticleWrite from '@/views/article/ArticleWrite.vue'
import NotFound from '@/views/404.vue'
import Admin from '@/views/admin/index.vue'
import CategoryAdmin from '@/views/admin/CategoryAdmin.vue'
import LabelAdmin from '@/views/admin/LabelAdmin.vue'
import ArticleAdmin from '@/views/admin/ArticleAdmin.vue'
import UserAdmin from '@/views/admin/UserAdmin.vue'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    mode: 'history',//去掉url中的#
    routes:[
        {
            path: '*',
            name: 'any', 
            component: NotFound,
        },
        {   //路由重定向
            path: '/',
            name: 'boot', 
            redirect: '/main/index'
        },
        {
            path: '/main',
            name: 'main',  // 路由名称
            component: index,  // 组件对象
            redirect: '/main/index',
            children: [
                {path: 'index', name: 'index', component: search, meta: {requireAuth: true, title: '搜索结果'}},
                {path: 'articleDetail/:id', name: 'mainArticleDetail', component: ArticleDetail, props: true}, //props: true id设置到属性中
            ]
        }, 
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/personal',
            name: 'personal',
            component: personal,
        },
        {
            path: '/article/write',
            name: 'articleCreate',
            component: ArticleWrite,
        },
        {
            path: '/article/write/:id',
            name: 'articleModify',
            props: true,
            component: ArticleWrite,
        },
        {
            path: '/articleDetail/:id/:marginStyle', 
            name: 'articleDetail', 
            component: ArticleDetail, 
            props: true,
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            redirect: '/admin/category',
            children: [
                {path: 'category', name: 'categoryAdmin', component: CategoryAdmin},
                {path: 'user', name: 'userAdmin', component: UserAdmin},
                {path: 'label', name: 'labelAdmin', component: LabelAdmin},
                {path: 'article', name: 'articleAdmin', component: ArticleAdmin},
            ]
        }
    ]
})
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default router