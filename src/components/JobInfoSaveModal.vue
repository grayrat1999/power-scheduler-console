<template>
  <a-drawer
    v-model:open="visibility"
    :root-style="{ color: 'blue' }"
    :title="title"
    size="large"
    placement="right"
  >
    <a-row>
      <a-col :span="19" :offset="3">
        <a-steps v-model:current="currentStep" :items="steps"></a-steps>
      </a-col>
    </a-row>

    <a-form
      ref="formRef"
      :model="currentJobInfo"
      :label-col="{ span: 5, offset: 0 }"
      :wrapper-col="{ span: 19 }"
      labelAlign="left"
      autocomplete="off"
      class="mt-10"
    >
      <template v-if="currentStep == 0">
        <a-form-item
          label="任务名称"
          name="jobName"
          :rules="[{ required: true, message: 'Please input jobName!' }]"
        >
          <a-input v-model:value="currentJobInfo.jobName" />
        </a-form-item>

        <a-form-item label="任务说明" name="jobDesc">
          <a-textarea v-model:value="currentJobInfo.jobDesc" :rows="2" />
        </a-form-item>

        <a-form-item
          label="任务类型"
          name="jobType"
          :rules="[{ required: true, message: 'Please select jobType!' }]"
        >
          <a-select v-model:value="currentJobInfo.jobType.code" :options="jobTypeOptions" />
        </a-form-item>

        <a-form-item
          v-if="currentJobInfo.jobType.code == 'JAVA'"
          label="任务处理器"
          name="processor"
          :rules="[{ required: true, message: 'Please input processor!' }]"
        >
          <a-input v-model:value="currentJobInfo.processor" />
        </a-form-item>

        <a-form-item
          v-if="currentJobInfo.jobType.code == 'SCRIPT'"
          label="脚本类型"
          name="scriptType"
          :rules="[{ required: true, message: 'Please select scriptType!' }]"
        >
          <a-select v-model:value="currentJobInfo.scriptType.code" :options="scriptTypeOptions" />
        </a-form-item>

        <a-form-item
          v-if="currentJobInfo.jobType.code == 'JAVA'"
          label="任务参数"
          name="executeParams"
        >
          <a-textarea v-model:value="currentJobInfo.executeParams" :rows="3" />
        </a-form-item>

        <a-form-item
          v-if="currentJobInfo.jobType.code == 'SCRIPT'"
          label="脚本代码"
          name="scriptCode"
          :rules="[{ required: true, message: 'Please input scriptCode!' }]"
        >
          <a-textarea v-model:value="currentJobInfo.scriptCode" :rows="3" />
        </a-form-item>

        <a-form-item
          label="清理策略"
          name="retentionPolicy"
          :rules="[{ required: true, message: 'Please Select retentionPolicy!' }]"
        >
          <a-input v-model:value="currentJobInfo.retentionValue">
            <template #addonBefore>
              <span>最近</span>
            </template>

            <template #addonAfter>
              <a-select
                v-model:value="currentJobInfo.retentionPolicy.code"
                :options="retentionPolicyOptions"
              />
            </template>
          </a-input>
        </a-form-item>
      </template>

      <template v-else-if="currentStep == 1">
        <a-form-item
          label="调度方式"
          name="scheduleType"
          :rules="[{ required: true, message: 'Please Select scheduleType!' }]"
        >
          <a-select
            v-model:value="currentJobInfo.scheduleType.code"
            :options="scheduleTypeOptions"
          />
        </a-form-item>

        <a-form-item
          label="调度配置"
          name="scheduleConfig"
          :rules="[{ required: true, message: 'Please Input scheduleConfig!' }]"
        >
          <a-input v-model:value="currentJobInfo.scheduleConfig">
            <template #addonAfter v-if="currentJobInfo.scheduleType.code === 'CRON'">
              <a-button type="link" size="small" @click="handleParseCron">验证表达式</a-button>
            </template>
            <template
              #addonAfter
              v-else-if="['FIX_RATE', 'FIX_DELAY'].includes(currentJobInfo.scheduleType.code)"
            >
              <span>秒</span>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="执行方式"
          name="executeMode"
          :rules="[{ required: true, message: 'Please Select executeMode!' }]"
        >
          <a-select v-model:value="currentJobInfo.executeMode.code" :options="executeModeOptions" />
        </a-form-item>

        <div
          class="bg-gray-100 mb-4 cursor-pointer"
          @click="expandAdvanceConfig = !expandAdvanceConfig"
        >
          <div class="ml-4 h-[32px] leading-[32px]">
            <span v-show="expandAdvanceConfig">-</span>
            <span v-show="!expandAdvanceConfig">+</span>
            <span class="text-[14px] ml-2">高级配置</span>
          </div>
        </div>

        <div v-show="expandAdvanceConfig">
          <a-form-item
            label="任务并发数"
            name="maxConcurrentNum"
            v-if="currentJobInfo.scheduleType.code !== 'FIX_DELAY'"
            :rules="[{ required: true, message: 'Please Input maxConcurrentNum!' }]"
          >
            <a-input-number
              class="w-full"
              v-model:value="currentJobInfo.maxConcurrentNum"
              min="1"
            />
          </a-form-item>

          <a-form-item
            label="任务优先级"
            name="priority"
            :rules="[{ required: true, message: 'Please Input priority!' }]"
          >
            <a-select v-model:value="currentJobInfo.priority">
              <a-select-option :value="1">低</a-select-option>
              <a-select-option :value="2">中</a-select-option>
              <a-select-option :value="3">高</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="失败重试次数"
            :name="['maxAttemptCnt']"
            :rules="[{ required: true, message: 'Please Input maxAttemptCnt!' }]"
          >
            <a-input-number class="w-full" v-model:value="currentJobInfo.maxAttemptCnt" min="0" />
          </a-form-item>

          <a-form-item
            label="失败重试间隔(秒)"
            name="attemptInterval"
            :rules="[{ required: true, message: 'Please Input attemptInterval!' }]"
          >
            <a-input-number class="w-full" v-model:value="currentJobInfo.attemptInterval" min="0" />
          </a-form-item>
        </div>
      </template>

      <a-row>
        <a-col :span="3" :offset="18">
          <a-button type="primary" v-show="currentStep > 0" @click="currentStep--">上一步</a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" v-show="currentStep < steps.length - 1" @click="goToNextStep"
            >下一步</a-button
          >
          <a-button type="primary" v-show="currentStep == steps.length - 1" @click="onSubmit"
            >确定</a-button
          >
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { reactive, ref, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { buildMetadataOptions } from '@/utils/metadataUtils'
import { listMetadata } from '@/service/api/metadataApi'
import { parseCron } from '@/service/api/toolApi'
import { getJobInfo, addJobInfo, editJobInfo } from '@/service/api/jobInfoApi'

const steps = [
  {
    title: '基本信息'
  },
  {
    title: '调度配置'
  }
]
const emptyJobInfo = {
  jobName: null,
  jobDesc: null,
  processor: null,
  executeParams: null,
  scheduleConfig: null,
  maxConcurrentNum: 1,
  priority: 2,
  maxAttemptCnt: 0,
  attemptInterval: 15,
  jobType: {
    code: 'JAVA'
  },
  scriptType: {
    code: 'BASH'
  },
  executeMode: {
    code: 'SINGLE'
  },
  scheduleType: {
    code: 'CRON'
  },
  retentionPolicy: {
    code: 'RECENT_COUNT'
  },
  retentionValue: 300
}

const emit = defineEmits(['onSubmitSuccess'])

const scheduleTypeOptions = ref([])
const executeModeOptions = ref([])
const jobTypeOptions = ref([])
const scriptTypeOptions = ref([])
const retentionPolicyOptions = ref([])
const title = ref('')
const saveMode = ref('')
const formRef = ref()
const visibility = ref(false)
const expandAdvanceConfig = ref(false)
const currentStep = ref(0)
const currentAppCode = ref('')
const currentJobInfo = reactive({})

const openModal = async (appCode, jobId) => {
  Object.assign(currentJobInfo, emptyJobInfo)
  visibility.value = true
  currentStep.value = 0
  currentAppCode.value = appCode
  fetchAllOptions()
  if (jobId) {
    saveMode.value = 'edit'
    title.value = '编辑任务'
    const jobInfoDetail = await getJobInfo({ jobId: jobId })
    Object.assign(currentJobInfo, jobInfoDetail)
  } else {
    saveMode.value = 'add'
    title.value = '新建任务'
    Object.assign(currentJobInfo, emptyJobInfo)
    currentJobInfo.appCode = appCode
  }
}

const goToNextStep = () => {
  formRef.value.validateFields().then(() => {
    currentStep.value++
  })
}

const handleParseCron = async () => {
  const items = await parseCron({
    cronExpression: currentJobInfo.scheduleConfig
  })
  Modal.confirm({
    title: '下次执行时间',
    content: h(
      'ul',
      items.map((item) => h('li', item))
    ),
    okText: '确定',
    cancelButtonProps: { style: { display: 'none' } }
  })
}

const onSubmit = async () => {
  if (currentJobInfo.jobType == 'SCRIPT') {
    currentJobInfo.jobHandler = 'scriptHandler'
  }
  if (saveMode.value == 'add') {
    await addJobInfo({
      ...currentJobInfo,
      executeMode: currentJobInfo.executeMode.code,
      scheduleType: currentJobInfo.scheduleType.code,
      jobType: currentJobInfo.jobType.code,
      scriptType: currentJobInfo.scriptType.code,
      retentionPolicy: currentJobInfo.retentionPolicy.code,
      retentionValue: currentJobInfo.retentionValue,
      appCode: currentJobInfo.appCode,
      enable: false
    })
  } else {
    await editJobInfo({
      ...currentJobInfo,
      executeMode: currentJobInfo.executeMode.code,
      scheduleType: currentJobInfo.scheduleType.code,
      jobType: currentJobInfo.jobType.code,
      scriptType: currentJobInfo.scriptType.code,
      retentionPolicy: currentJobInfo.retentionPolicy.code,
      retentionValue: currentJobInfo.retentionValue,
      jobId: currentJobInfo.id
    })
  }
  visibility.value = false
  message.success('保存成功')
  emit('onSubmitSuccess')
}

const fetchMetadatas = async () => {
  const mates = await listMetadata({
    metadataCodes: [
      'JobTypeEnum',
      'ScheduleTypeEnum',
      'ExecuteModeEnum',
      'ScriptTypeEnum',
      'NotifyChannelEnum',
      'NotifySceneEnum',
      'RetentionPolicyEnum'
    ]
  })
  const options = buildMetadataOptions(mates)
  scheduleTypeOptions.value = options['ScheduleTypeEnum']
  executeModeOptions.value = options['ExecuteModeEnum']
  jobTypeOptions.value = options['JobTypeEnum']
  scriptTypeOptions.value = options['ScriptTypeEnum']
  retentionPolicyOptions.value = options['RetentionPolicyEnum'].map((item) => {
    return {
      label: item.label.replace('最近N', ''),
      value: item.value
    }
  })
}

const fetchAllOptions = async () => {
  fetchMetadatas()
}

defineExpose({ openModal })
</script>
