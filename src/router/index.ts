import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import JobInfoManagerView from '@/views/JobInfoManagerView.vue'
import AppManagerView from '@/views/AppGroupManagerView.vue'
import JobInstanceManagerView from '@/views/JobInstanceManagerView.vue'
import NamespaceManagerView from '@/views/NamespaceManagerView.vue'
import WorkflowManagerView from '@/views/WorkflowManagerView.vue'
import WorkflowEditView from '@/views/WorkflowEditView.vue'
import WorkflowInstanceManagerView from '@/views/WorkflowInstanceManagerView.vue'
import WorkflowInstanceDetailView from '@/views/WorkflowInstanceDetailView.vue'

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
    },
    {
      path: '/workflowManager',
      name: '工作流管理',
      component: WorkflowManagerView
    },

    {
      path: '/workflowEditor',
      name: '工作流编辑器',
      component: WorkflowEditView
    },
    {
      path: '/workflowInstanceManager',
      name: '工作流执行记录',
      component: WorkflowInstanceManagerView
    },
    {
      path: '/workflowInstanceDetail',
      name: '工作流实例详情',
      component: WorkflowInstanceDetailView
    }
  ]
})

export default router
