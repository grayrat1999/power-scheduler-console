<template>
  <a-layout class="min-h-screen">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <LeftNavigate />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <div class="px-4 py-6 bg-white min-h-[360px]">
          <RouterView />
        </div>
      </a-layout-content>
      <a-layout-footer class="text-center"></a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import LeftNavigate from '../components/LeftNavigate.vue'

const collapsed = ref(false)
</script>
