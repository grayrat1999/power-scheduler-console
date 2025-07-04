<template>
  <div class="border border-gray-300 bg-white rounded-md shadow-sm p-3 text-xs w-[180px]">
    <div class="label h-[16px] leading-[16px]">{{ data.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted } from 'vue'

// 注入 X6 提供的 getNode 方法（X6 会自动注入）
const getNode = inject<() => any>('getNode')
const data = ref({
  name: '默认文案',
  status: 'running'
})

onMounted(() => {
  const node = getNode!!()
  data.value = node.getData()
  // console.log('当前节点信息:', node)
})
</script>
