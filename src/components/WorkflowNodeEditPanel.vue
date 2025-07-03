<template>
  <div v-show="visibility">
    <div class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      {{ title }}
    </div>
    <a-form
      ref="formRef"
      :model="currentWorkflowNode"
      :label-col="{ span: 7, offset: 0 }"
      :wrapper-col="{ span: 17 }"
      labelAlign="left"
      autocomplete="off"
      class="mt-5"
    >
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
        <a-select v-model:value="currentWorkflowNode.jobType" :options="jobTypeOptions" />
      </a-form-item>

      <a-form-item
        v-if="currentWorkflowNode.jobType == 'JAVA'"
        label="任务处理器"
        name="processor"
        :rules="[{ required: true, message: 'Please input processor!' }]"
      >
        <a-input v-model:value="currentWorkflowNode.processor" />
      </a-form-item>

      <a-form-item
        v-if="currentWorkflowNode.jobType == 'SCRIPT'"
        label="脚本类型"
        name="scriptType"
        :rules="[{ required: true, message: 'Please select scriptType!' }]"
      >
        <a-select v-model:value="currentWorkflowNode.scriptType" :options="scriptTypeOptions" />
      </a-form-item>

      <a-form-item
        v-if="currentWorkflowNode.jobType == 'JAVA'"
        label="任务参数"
        name="executeParams"
      >
        <a-textarea v-model:value="currentWorkflowNode.executeParams" :rows="3" />
      </a-form-item>

      <a-form-item
        v-if="currentWorkflowNode.jobType == 'SCRIPT'"
        label="脚本代码"
        name="scriptCode"
        :rules="[{ required: true, message: 'Please input scriptCode!' }]"
      >
        <a-textarea v-model:value="currentWorkflowNode.scriptCode" :rows="3" />
      </a-form-item>

      <a-form-item
        label="执行方式"
        name="executeMode"
        :rules="[{ required: true, message: 'Please Select executeMode!' }]"
      >
        <a-select v-model:value="currentWorkflowNode.executeMode" :options="executeModeOptions" />
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
          v-if="currentWorkflowNode.executeMode !== 'SINGLE'"
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
          v-if="currentWorkflowNode.executeMode !== 'SINGLE'"
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

      <a-row>
        <a-col :span="3">
          <a-button type="primary" @click="onSubmit">确定</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref, h, onMounted } from 'vue'
import { buildMetadataOptions } from '@/utils/metadataUtils'
import { listMetadata } from '@/service/api/metadataApi'

const emptyJobInfo = {
  name: null,
  description: null,
  processor: null,
  executeParams: null,
  priority: 2,
  maxAttemptCnt: 0,
  attemptInterval: 15,
  taskMaxAttemptCnt: 0,
  taskAttemptInterval: 15,
  jobType: 'JAVA',
  scriptType: 'BASH',
  executeMode: 'SINGLE',
  uuid: null
}

const emit = defineEmits(['onSubmitSuccess'])

const executeModeOptions = ref([])
const jobTypeOptions = ref([])
const scriptTypeOptions = ref([])
const title = ref('')
const saveMode = ref('')
const formRef = ref()
const visibility = ref(true)
const currentWorkflowNode = reactive({})
Object.assign(currentWorkflowNode, emptyJobInfo)

const open = async (workflowNode) => {
  visibility.value = true
  fetchAllOptions()
  if (workflowNode) {
    saveMode.value = 'edit'
    title.value = '编辑节点'
    Object.assign(currentWorkflowNode, workflowNode)
  } else {
    saveMode.value = 'add'
    title.value = '新建节点'
    Object.assign(currentWorkflowNode, emptyJobInfo)
  }
}

const onSubmit = async () => {
  if (currentWorkflowNode.jobType == 'SCRIPT') {
    currentWorkflowNode.jobHandler = 'scriptHandler'
  }
  visibility.value = false
  emit('onSubmitSuccess', currentWorkflowNode)
}

const fetchAllOptions = async () => {
  const mates = await listMetadata({
    metadataCodes: ['JobTypeEnum', 'ExecuteModeEnum', 'ScriptTypeEnum']
  })
  const options = buildMetadataOptions(mates)
  executeModeOptions.value = options['ExecuteModeEnum']
  jobTypeOptions.value = options['JobTypeEnum']
  scriptTypeOptions.value = options['ScriptTypeEnum']
}

onMounted(() => {
  // 初始化时获取所有选项
  fetchAllOptions()
})

defineExpose({ open })
</script>
