<template>
  <a-drawer v-model:open="visibility" title="任务详情" size="large" placement="right">
    <div class="h-[350px] leading-normal">
      <a-row class="mb-2">
        <a-col :span="6">实例id</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.id }}</a-col>
        <a-col :span="6">应用名称</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.appName }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">任务id</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.jobId }}</a-col>
        <a-col :span="6">任务名称</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.jobName }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">任务类型</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.jobType?.label }}</a-col>

        <template v-if="currentJobInstanceDetail.jobType?.code == 'JAVA'">
          <a-col :span="6">任务处理器</a-col>
          <a-col :span="6">
            <a-typography-paragraph
              style="margin-bottom: 0px"
              :ellipsis="true"
              :content="currentJobInstanceDetail.processor"
            />
          </a-col>
        </template>
        <template v-else-if="currentJobInstanceDetail.jobType?.code == 'SCRIPT'">
          <a-col :span="6">脚本语言</a-col>
          <a-col :span="6">{{ currentJobInstanceDetail.scriptType?.label }}</a-col>
        </template>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">调度时间</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.scheduleAt }}</a-col>
        <a-col :span="6">数据时间</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.dataTime }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">开始时间</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.startAt }}</a-col>
        <a-col :span="6">结束时间</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.endAt }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">调度节点</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.schedulerAddress }}</a-col>
        <a-col :span="6">执行节点</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.workerAddress }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">执行模式</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.executeMode?.label }}</a-col>
        <a-col :span="6">优先级</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.priority }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">任务状态</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.jobStatus?.label }}</a-col>
        <a-col :span="6">重试次数</a-col>
        <a-col :span="6">{{ currentJobInstanceDetail.attemptCnt }}</a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">实例参数</a-col>
        <a-col :span="18">{{ currentJobInstanceDetail.executeParams }}</a-col>
      </a-row>

      <a-row class="mb-2" v-if="currentJobInstanceDetail.jobType?.code == 'SCRIPT'">
        <a-col :span="6">脚本代码</a-col>
        <a-col :span="18">
          <a-typography-paragraph
            copyable
            code
            :ellipsis="{ rows: 4 }"
            :content="currentJobInstanceDetail.scriptCode"
          />
        </a-col>
      </a-row>

      <a-row class="mb-2">
        <a-col :span="6">执行结果或错误信息</a-col>
        <a-col :span="18">
          <a-typography-paragraph
            copyable
            :ellipsis="{ rows: 2 }"
            :content="currentJobInstanceDetail.message"
          />
        </a-col>
      </a-row>
    </div>
  </a-drawer>
</template>

<script setup>
import { getJobInstanceDetail } from '@/service/api/jobInstanceApi'
import { ref } from 'vue'

const visibility = ref(false)
const currentJobInstanceDetail = ref({})

const openModal = async (jobInstanceId) => {
  visibility.value = true
  currentJobInstanceDetail.value = await getJobInstanceDetail({ jobInstanceId })
  console.log(currentJobInstanceDetail.value)
}

defineExpose({ openModal })
</script>
