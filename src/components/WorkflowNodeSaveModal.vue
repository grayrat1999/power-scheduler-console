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
      :model="currentWorkflowNode"
      :label-col="{ span: 5, offset: 0 }"
      :wrapper-col="{ span: 19 }"
      labelAlign="left"
      autocomplete="off"
      class="mt-10"
    >
      <template v-if="currentStep == 0">
        <a-form-item
          label="节点名称"
          name="name"
          :rules="[{ required: true, message: 'Please input name!' }]"
        >
          <a-input v-model:value="currentWorkflowNode.name" />
        </a-form-item>

        <a-form-item label="节点说明" name="description">
          <a-textarea v-model:value="currentWorkflowNode.description" :rows="2" />
        </a-form-item>

        <a-form-item
          label="任务类型"
          name="jobType"
          :rules="[{ required: true, message: 'Please select jobType!' }]"
        >
          <a-select v-model:value="currentWorkflowNode.jobType.code" :options="jobTypeOptions" />
        </a-form-item>

        <a-form-item
          v-if="currentWorkflowNode.jobType.code == 'JAVA'"
          label="任务处理器"
          name="processor"
          :rules="[{ required: true, message: 'Please input processor!' }]"
        >
          <a-input v-model:value="currentWorkflowNode.processor" />
        </a-form-item>

        <a-form-item
          v-if="currentWorkflowNode.jobType.code == 'SCRIPT'"
          label="脚本类型"
          name="scriptType"
          :rules="[{ required: true, message: 'Please select scriptType!' }]"
        >
          <a-select
            v-model:value="currentWorkflowNode.scriptType.code"
            :options="scriptTypeOptions"
          />
        </a-form-item>

        <a-form-item
          v-if="currentWorkflowNode.jobType.code == 'JAVA'"
          label="任务参数"
          name="executeParams"
        >
          <a-textarea v-model:value="currentWorkflowNode.executeParams" :rows="3" />
        </a-form-item>

        <a-form-item
          v-if="currentWorkflowNode.jobType.code == 'SCRIPT'"
          label="脚本代码"
          name="scriptCode"
          :rules="[{ required: true, message: 'Please input scriptCode!' }]"
        >
          <a-textarea v-model:value="currentWorkflowNode.scriptCode" :rows="3" />
        </a-form-item>
      </template>

      <template v-else-if="currentStep == 1">
        <a-form-item
          label="执行方式"
          name="executeMode"
          :rules="[{ required: true, message: 'Please Select executeMode!' }]"
        >
          <a-select
            v-model:value="currentWorkflowNode.executeMode.code"
            :options="executeModeOptions"
          />
        </a-form-item>

        <div>
          <a-form-item
            label="任务优先级"
            name="priority"
            :rules="[{ required: true, message: 'Please Input priority!' }]"
          >
            <a-select v-model:value="currentWorkflowNode.priority">
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
            <a-input-number
              class="w-full"
              v-model:value="currentWorkflowNode.maxAttemptCnt"
              min="0"
            />
          </a-form-item>

          <a-form-item
            label="失败重试间隔"
            name="attemptInterval"
            :rules="[{ required: true, message: 'Please Input attemptInterval!' }]"
          >
            <a-input-number
              class="w-full"
              v-model:value="currentWorkflowNode.attemptInterval"
              min="0"
            >
              <template #addonAfter>
                <span>秒</span>
              </template>
            </a-input-number>
          </a-form-item>

          <a-form-item
            label="子任务失败重试次数"
            :name="['taskMaxAttemptCnt']"
            v-if="currentWorkflowNode.executeMode.code !== 'SINGLE'"
            :rules="[{ required: true, message: 'Please Input taskMaxAttemptCnt!' }]"
          >
            <a-input-number
              class="w-full"
              v-model:value="currentWorkflowNode.taskMaxAttemptCnt"
              min="0"
            />
          </a-form-item>

          <a-form-item
            label="子任务失败重试间隔"
            name="taskAttemptInterval"
            v-if="currentWorkflowNode.executeMode.code !== 'SINGLE'"
            :rules="[{ required: true, message: 'Please Input taskAttemptInterval!' }]"
          >
            <a-input-number
              class="w-full"
              v-model:value="currentWorkflowNode.taskAttemptInterval"
              min="0"
            >
              <template #addonAfter>
                <span>秒</span>
              </template>
            </a-input-number>
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
import { getJobInfo } from '@/service/api/jobInfoApi'
import { globalStore } from '@/stores/global'

const steps = [
  {
    title: '基本信息'
  },
  {
    title: '调度配置'
  }
]
const emptyJobInfo = {
  name: null,
  description: null,
  processor: null,
  executeParams: null,
  maxConcurrentNum: 1,
  priority: 2,
  maxAttemptCnt: 0,
  attemptInterval: 15,
  taskMaxAttemptCnt: 0,
  taskAttemptInterval: 15,
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

const executeModeOptions = ref([])
const jobTypeOptions = ref([])
const scriptTypeOptions = ref([])
const title = ref('')
const saveMode = ref('')
const formRef = ref()
const visibility = ref(false)
const currentStep = ref(0)
const currentWorkflowNode = reactive({})

const openModal = async (workflowNodeId) => {
  Object.assign(currentWorkflowNode, emptyJobInfo)
  visibility.value = true
  currentStep.value = 0
  fetchAllOptions()
  if (workflowNodeId) {
    saveMode.value = 'edit'
    title.value = '编辑节点'
    const jobInfoDetail = await getJobInfo({ jobId: workflowNodeId })
    Object.assign(currentWorkflowNode, jobInfoDetail)
  } else {
    saveMode.value = 'add'
    title.value = '新建节点'
    Object.assign(currentWorkflowNode, emptyJobInfo)
  }
}

const goToNextStep = () => {
  formRef.value.validateFields().then(() => {
    currentStep.value++
  })
}

const onSubmit = async () => {
  if (currentWorkflowNode.jobType == 'SCRIPT') {
    currentWorkflowNode.jobHandler = 'scriptHandler'
  }
  if (saveMode.value == 'add') {
    const namespaceCode = globalStore.getNamespaceCode()
  } else {
  }
  visibility.value = false
  message.success('保存成功')
  emit('onSubmitSuccess', currentWorkflowNode)
}

const fetchMetadatas = async () => {
  const mates = await listMetadata({
    metadataCodes: ['JobTypeEnum', 'ExecuteModeEnum', 'ScriptTypeEnum']
  })
  const options = buildMetadataOptions(mates)
  executeModeOptions.value = options['ExecuteModeEnum']
  jobTypeOptions.value = options['JobTypeEnum']
  scriptTypeOptions.value = options['ScriptTypeEnum']
}

const fetchAllOptions = async () => {
  fetchMetadatas()
}

defineExpose({ openModal })
</script>
