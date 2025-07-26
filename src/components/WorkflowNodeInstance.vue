<template>
  <div :class="computedClass">
    <div class="flex items-center">
      <template v-if="data.status === 'WAITING'">
        <ClockCircleOutlined class="text-gray-500" />
      </template>
      <template v-else-if="data.status === 'RUNNING'">
        <SyncOutlined class="text-blue-500" spin />
      </template>
      <template v-else-if="data.status === 'SUCCESS'">
        <CheckCircleOutlined class="text-green-500" />
      </template>
      <template v-else-if="data.status === 'FAILED'">
        <CloseCircleOutlined class="text-red-500" />
      </template>

      <span class="ml-2">{{ data.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, computed } from 'vue'
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'

const commonClass = 'border border-gray-300 bg-white rounded-md shadow-sm p-3 text-xs w-[180px]'
const computedClass = computed(() => {
  console.log('data.value:', data.value)
  // data.value.status = 'FAILED'
  switch (data.value.status) {
    case 'WAITING':
      return `${commonClass} border-l-4 border-l-gray-400`
    case 'RUNNING':
      return `${commonClass} border-l-4 border-l-blue-400`
    case 'SUCCESS':
      return `${commonClass} border-l-4 border-l-green-500`
    case 'FAILED':
      return `${commonClass} border-l-4 border-l-red-500`
    default:
      return commonClass
  }
})

// 注入 X6 提供的 getNode 方法（X6 会自动注入）
const getNode = inject<() => any>('getNode')

const data = ref({
  name: '默认文案',
  status: 'WAITING'
})

onMounted(() => {
  const node = getNode!!()
  data.value = node.getData()
  // console.log('当前节点信息:', node)
})
</script>
