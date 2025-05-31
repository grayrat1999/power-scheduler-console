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

          <!-- <a-form-item label="超时时间(秒)" name="timeoutPeriod">
            <a-input-number
              class="w-full"
              v-model:value="currentJobInfo.extendConfig.timeoutPeriod"
              min="1"
            />
          </a-form-item>

          <a-form-item label="超时终止" name="timeoutAbortEnabled">
            <a-switch v-model:checked="currentJobInfo.extendConfig.timeoutAbortEnabled" />
          </a-form-item> -->

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

      <!-- <template v-else-if="currentStep == 2">
        <a-form-item label="通知场景" :name="['extendConfig', 'notifyConfig', 'notifyScenes']">
          <a-checkbox-group
            v-model:value="currentJobInfo.extendConfig.notifyConfig.notifyScenes"
            :options="matesOptions.notifyScene"
          />
        </a-form-item>

        <a-form-item label="通知渠道" :name="['extendConfig', 'notifyConfig', 'notifyChannels']">
          <a-checkbox-group
            v-model:value="currentJobInfo.extendConfig.notifyConfig.notifyChannels"
            :options="matesOptions.notifyChannel"
          />
        </a-form-item>

        <a-form-item
          label="通知联系组"
          :name="['extendConfig', 'notifyConfig', 'notifyContactIds']"
        >
          <a-select
            v-model:value="currentJobInfo.extendConfig.notifyConfig.notifyContactIds"
            show-search
            mode="multiple"
            :options="contactOptions"
            :filterOption="false"
            @search="fetchContactOptions"
          />
        </a-form-item>

        <a-form-item
          label="通知联系人"
          :name="['extendConfig', 'notifyConfig', 'notifyContactGroupIds']"
        >
          <a-select
            v-model:value="currentJobInfo.extendConfig.notifyConfig.notifyContactGroupIds"
            show-search
            mode="multiple"
            :options="contactGroupOptions"
            :filterOption="false"
            @search="fetchContactGroupOptions"
          />
        </a-form-item>
      </template> -->

      <a-row>
        <a-col :span="3" :offset="18">
          <a-button type="primary" v-show="currentStep > 0" @click="currentStep--">上一步</a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" v-show="currentStep < 2" @click="goToNextStep">下一步</a-button>
          <a-button type="primary" v-show="currentStep == 2" @click="onSubmit">确定</a-button>
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
// import { listContact } from '@/service/api/contact'
// import { listContactGroup } from '@/service/api/contactGroup'
import { getJobInfo, addJobInfo, editJobInfo } from '@/service/api/jobInfoApi'

const steps = [
  {
    title: '基本信息'
  },
  {
    title: '调度配置'
  },
  {
    title: '通知配置'
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
  }
}

const emit = defineEmits(['onSubmitSuccess'])

const scheduleTypeOptions = ref([])
const executeModeOptions = ref([])
const jobTypeOptions = ref([])
const scriptTypeOptions = ref([])
const title = ref('')
const saveMode = ref('')
const formRef = ref()
const contactOptions = ref([])
const contactGroupOptions = ref([])
const visibility = ref(false)
const expandAdvanceConfig = ref(false)
const currentStep = ref(0)
const currentAppCode = ref('')
const currentJobInfo = reactive({})

const fetchContactOptions = async (searchText) => {
  let contactGroupPage = await listContact({
    appCode: currentAppCode.value,
    name: searchText,
    pageNo: 1,
    pageSize: 10
  })
  contactOptions.value = contactGroupPage.content.map((it) => {
    return {
      label: it.name,
      value: it.id
    }
  })
}

const fetchContactGroupOptions = async (searchText) => {
  let contactGroupPage = await listContactGroup({
    appCode: currentAppCode.value,
    name: searchText,
    pageNo: 1,
    pageSize: 10
  })
  contactGroupOptions.value = contactGroupPage.content.map((it) => {
    return {
      label: it.name,
      value: it.id
    }
  })
}

const openModal = async (appCode, jobId) => {
  Object.assign(currentJobInfo, emptyJobInfo)
  visibility.value = true
  currentStep.value = 0
  currentAppCode.value = appCode
  const fetchOptionPromise = fetchAllOptions()
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
    cancelButtonProps: { style: { display: 'none' } } // 隐藏取消按钮
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
      'NotifySceneEnum'
    ]
  })
  const options = buildMetadataOptions(mates)
  scheduleTypeOptions.value = options['ScheduleTypeEnum']
  executeModeOptions.value = options['ExecuteModeEnum']
  jobTypeOptions.value = options['JobTypeEnum']
  scriptTypeOptions.value = options['ScriptTypeEnum']
}

const fetchAllOptions = async () => {
  // fetchContactOptions()
  // fetchContactGroupOptions()
  fetchMetadatas()
}

defineExpose({ openModal })
</script>
