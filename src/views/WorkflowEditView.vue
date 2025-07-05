<template>
  <div>
    <div class="form">
      <div class="flex justify-between items-center py-4">
        <a-button type="primary" @click="goBack">返回</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>

      <a-form
        ref="formRef"
        :model="currentWorkflow"
        :label-col="{ span: 3, offset: 0 }"
        :wrapper-col="{ span: 24 }"
        labelAlign="left"
        autocomplete="off"
      >
        <a-form-item
          label="工作流名称"
          name="name"
          :rules="[{ required: true, message: 'Please input name' }]"
        >
          <a-input v-model:value="currentWorkflow.name" />
        </a-form-item>

        <a-form-item label="工作流描述" name="description">
          <a-textarea v-model:value="currentWorkflow.description" :rows="2" />
        </a-form-item>

        <a-form-item
          label="调度方式"
          name="scheduleType"
          :rules="[{ required: true, message: 'Please Select scheduleType!' }]"
        >
          <a-select v-model:value="currentWorkflow.scheduleType" :options="scheduleTypeOptions" />
        </a-form-item>

        <a-form-item
          label="调度配置"
          name="scheduleConfig"
          :rules="[{ required: true, message: 'Please Input scheduleConfig!' }]"
        >
          <a-input v-model:value="currentWorkflow.scheduleConfig">
            <template #addonAfter v-if="currentWorkflow.scheduleType === 'CRON'">
              <a-button type="link" size="small" @click="handleParseCron">验证表达式</a-button>
            </template>
            <template
              #addonAfter
              v-else-if="['FIX_RATE', 'FIX_DELAY'].includes(currentWorkflow.scheduleType)"
            >
              <span>秒</span>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="实例并发数"
          name="maxConcurrentNum"
          v-if="currentWorkflow.scheduleType !== 'FIX_DELAY'"
          :rules="[{ required: true, message: 'Please Input maxConcurrentNum!' }]"
        >
          <a-input-number class="w-full" v-model:value="currentWorkflow.maxConcurrentNum" min="1" />
        </a-form-item>

        <a-form-item
          label="清理策略"
          name="retentionPolicy"
          :rules="[{ required: true, message: 'Please Select retentionPolicy!' }]"
        >
          <a-input v-model:value="currentWorkflow.retentionValue">
            <template #addonBefore>
              <span>最近</span>
            </template>

            <template #addonAfter>
              <a-select
                v-model:value="currentWorkflow.retentionPolicy"
                :options="retentionPolicyOptions"
              />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </div>

    <WorkflowEditor ref="workflowEditorRef" :graphData="graphData" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, message } from 'ant-design-vue'
import { parseCron } from '@/service/api/toolApi'
import { listMetadata } from '@/service/api/metadataApi'
import { buildMetadataOptions } from '@/utils/metadataUtils'
import { getWorkflow, addWorkflow, editWorkflow } from '@/service/api/workflowApi'
import WorkflowEditor from '@/components/WorkflowEditor.vue'
import { globalStore } from '@/stores/global'

const route = useRoute()
const router = useRouter()
const appCode = route.query.appCode || ''
const workflowId = route.query.workflowId || null

const graphData = ref({})
const workflowEditorRef = ref()
const scheduleTypeOptions = ref([])
const executeModeOptions = ref([])
const jobTypeOptions = ref([])
const scriptTypeOptions = ref([])
const retentionPolicyOptions = ref([])
const currentWorkflow = reactive({
  scheduleType: 'CRON',
  retentionPolicy: 'RECENT_COUNT',
  retentionValue: 100,
  maxConcurrentNum: 1
})

const goBack = () => {
  router.push({
    name: '工作流管理'
  })
}

const handleParseCron = async () => {
  const items = await parseCron({
    cronExpression: currentWorkflow.scheduleConfig
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

const handleSave = async () => {
  const graphData = workflowEditorRef.value.exportGraph()
  const namespaceCode = globalStore.getNamespaceCode()
  console.log('导出图形数据:', graphData)

  if (workflowId) {
    await editWorkflow({
      workflowId,
      ...currentWorkflow,
      nodes: graphData.filter((it) => it.shape === 'workflow-node').map((it) => it.data),
      graphData: JSON.stringify(graphData)
    })
    message.success('操作成功')
  } else {
    const returnWorkflowId = await addWorkflow({
      namespaceCode,
      appCode,
      ...currentWorkflow,
      nodes: graphData.filter((it) => it.shape === 'workflow-node').map((it) => it.data),
      graphData: JSON.stringify(graphData)
    })
    message.success('操作成功')
    router.push({
      name: '工作流编辑器',
      query: { workflowId: returnWorkflowId }
    })
  }
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

onMounted(async () => {
  if (workflowId) {
    const workflow = await getWorkflow({ workflowId })
    Object.assign(currentWorkflow, workflow)
    graphData.value = JSON.parse(workflow.graphData)
  }
  fetchMetadatas()
})
</script>
