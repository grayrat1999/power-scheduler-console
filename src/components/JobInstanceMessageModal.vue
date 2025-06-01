<template>
  <a-modal v-model:open="visibility" title="异常信息" width="700px">
    <template #footer>
      <a-button @click="visibility = false">确定</a-button>
    </template>
    <pre class="max-h-[60vh]">{{ currentJobErrorMessage }}</pre>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { getErrorMessage } from '@/service/api/jobInstanceApi'

const visibility = ref(false)
const currentJobErrorMessage = ref('')

const openModal = async (record) => {
  currentJobErrorMessage.value = await getErrorMessage({ jobInstanceId: record.id })
  visibility.value = true
}

defineExpose({ openModal })
</script>
