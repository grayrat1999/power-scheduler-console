<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    class="w-full h-full"
    mode="inline"
    theme="dark"
    :items="items"
    @click="handleClick"
    @openChange="handleOpenChange"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive, ref, h, onMounted } from 'vue'
import {
  DashboardOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  UserOutlined,
  FunctionOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  MailOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const selectedKeys = ref(['index'])
const openKeys = ref([])
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}
const items = reactive([
  getItem('首页', 'index', () => h(DashboardOutlined)),
  getItem('应用管理', 'groupManager', () => h(AppstoreOutlined)),
  getItem('任务管理', 'jobManager', () => h(FunctionOutlined)),
  getItem('执行记录', 'jobInstanceManager', () => h(CalendarOutlined))
])

const handleClick = (clickItem) => {
  sessionStorage.setItem('selectedMenuItem', clickItem.key)
  router.push(clickItem.key)
}

const handleOpenChange = (openKeys) => {
  sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
}

onMounted(() => {
  const storedSelectedKey = sessionStorage.getItem('selectedMenuItem')
  const storedOpenKeys = sessionStorage.getItem('openKeys')
  console.log(storedSelectedKey)
  if (storedSelectedKey) {
    selectedKeys.value = [storedSelectedKey]
  }
  if (storedOpenKeys) {
    openKeys.value = JSON.parse(storedOpenKeys) || []
  }
})
</script>
