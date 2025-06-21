<template>
  <a-modal v-model:open="visibility" title="执行一次" @ok="handleRunOnce()">
    <a-row class="mt-4">
      <a-col>
        <span>确定要执行</span>
        <span class="font-semibold text-blue-500 ml-1 mr-1">{{ currentJobInfo.jobName }}</span>
        <span>吗？</span>
      </a-col>
    </a-row>
    <a-row class="mt-4" v-if="currentJobInfo.executeMode.code === 'SINGLE'">
      <a-col :span="6">指定机器</a-col>
      <a-col :span="18">
        <a-select class="w-full" v-model:value="selectedWorker" :options="workerOptions">
        </a-select>
      </a-col>
    </a-row>
    <a-row class="mt-4">
      <a-col :span="6">
        <div>任务参数</div>
      </a-col>
      <a-col :span="18">
        <a-textarea v-model:value="executeParams" :rows="6" />
      </a-col>
    </a-row>

    <a-row class="mt-4">
      <a-col :span="6">
        <div>数据时间</div>
      </a-col>
      <a-col :span="18">
        <a-date-picker
          class="w-full"
          v-model:value="dateTime"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择数据时间"
        />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { listWorker } from '@/service/api/workerApi'
import { run } from '@/service/api/jobInfoApi'

const selectedWorker = ref(null)
const workerOptions = ref([])
const visibility = ref(false)
const currentJobInfo = ref({})
const executeParams = ref('')
const dateTime = ref(null)

const handleRunOnce = async () => {
  await run({
    jobId: currentJobInfo.value.id,
    executeParams: executeParams.value,
    dataTime: dateTime.value.format('YYYY-MM-DD HH:mm:ss'),
    workerAddress: selectedWorker.value
  })
  message.success('操作成功')
  visibility.value = false
}

const openModal = async (record) => {
  dateTime.value = dayjs()
  currentJobInfo.value = record
  executeParams.value = record.executeParams
  const workerAddressList = await listWorker({
    namespaceCode: record.namespaceCode,
    appCode: record.appCode
  })
  workerOptions.value = workerAddressList.map((item) => {
    return {
      label: item.address,
      value: item.address
    }
  })
  visibility.value = true
}

defineExpose({ openModal })
</script>
