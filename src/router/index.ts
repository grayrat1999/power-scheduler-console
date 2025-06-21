import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import JobInfoManagerView from '@/views/JobInfoManagerView.vue'
import AppManagerView from '@/views/AppGroupManagerView.vue'
import JobInstanceManagerView from '@/views/JobInstanceManagerView.vue'
import NamespaceManagerView from '@/views/NamespaceManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: '首页',
      component: DashboardView
    },
    {
      path: '/jobManager',
      name: '任务管理',
      component: JobInfoManagerView
    },
    {
      path: '/jobInstanceManager',
      name: '任务记录',
      component: JobInstanceManagerView
    },
    {
      path: '/groupManager',
      name: '应用管理',
      component: AppManagerView
    },
    {
      path: '/namespaceManager',
      name: '命名空间管理',
      component: NamespaceManagerView
    }
  ]
})

export default router
