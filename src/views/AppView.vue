<template>
  <a-layout class="min-h-screen">
    <a-layout-header :style="headerStyle">
      <Header />
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed">
        <LeftNavigate />
      </a-layout-sider>

      <a-layout-content>
        <div class="px-4 py-6 bg-white min-h-[360px] w-full h-full">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>

    <a-layout-footer class="h-4 flex items-center justify-center">
      <a href="http://beian.miit.gov.cn" target="_blank">浙ICP备2025181588号</a>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import LeftNavigate from '../components/LeftNavigate.vue'
import Header from '@/components/Header.vue'

const headerStyle = {
  textAlign: 'right',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#108ee9'
}

const collapsed = ref(false)
</script>
