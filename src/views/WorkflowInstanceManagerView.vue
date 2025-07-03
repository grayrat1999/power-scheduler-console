<template>
  <div>
    <a-form
      labelAlign="left"
      ref="queryFormRef"
      :model="queryFormState"
      :label-col="{ span: 4, offset: 0 }"
      :wrapper-col="{ span: 15 }"
      @finish="onFinish"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="appCode" label="应用名称">
            <a-select
              v-model:value="queryFormState.appCode"
              show-search
              :options="appGroupOptions"
              :filterOption="false"
              @change="handleAppGroupChange"
              @search="fetchAppGroupOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="workflowId" label="工作流">
            <a-select
              show-search
              allowClear
              v-model:value="queryFormState.workflowId"
              :options="jobInfoOptions"
              :filterOption="false"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="status" label="实例状态">
            <a-select
              allowClear
              class="w-full"
              v-model:value="queryFormState.status"
              :options="workflowStatusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="workflowInstanceId" label="实例id">
            <a-input v-model:value="queryFormState.workflowInstanceId"></a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="startAtRange" label="开始时间">
            <a-range-picker
              allowClear
              class="w-full"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="queryFormState.startAtRange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="endAtRange" label="结束时间">
            <a-range-picker
              allowClear
              class="w-full"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="queryFormState.endAtRange"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" class="text-left">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button class="ml-4" @click="() => queryFormRef.resetFields()">清除</a-button>
        </a-col>
      </a-row>
    </a-form>

    <div class="mt-3">
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <span class="mr-1 text-blue-500 cursor-pointer" @click="goToDetailView(record.id)">
              详情
            </span>
            <a-dropdown v-if="record.showMoreAction" class="mr-1 text-blue-500 cursor-pointer">
              <span>更多</span>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <div class="text-blue-500" @click="handleReattemptJob(record)">重跑任务</div>
                  </a-menu-item>
                  <a-menu-item>
                    <div class="text-blue-500" @click="handleTerminateJob(record)">终止任务</div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>

    <JobInstanceMessageModal ref="jobInstanceMessageModalRef" />
  </div>
</template>

<script setup>
import { Modal, message } from 'ant-design-vue'
import { reactive, ref, h, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { listAppGroup } from '@/service/api/appGroupApi'
import { listWorkflowInstance } from '@/service/api/workflowInstanceApi'
import { terminate, reattempt } from '@/service/api/jobInstanceApi'
import { listMetadata } from '@/service/api/metadataApi'
import { listJobInfo } from '@/service/api/jobInfoApi'
import { buildMetadataOptions } from '@/utils/metadataUtils'
import requestForPage from '@/utils/pageRequest'
import JobInstanceMessageModal from '@/components/JobInstanceMessageModal.vue'
import { globalStore } from '@/stores/global'

const [jobInstanceMessageModalRef] = [ref()]

const route = useRoute()
const router = useRouter()
const queryFormRef = ref()
const queryFormState = reactive({})

const columns = [
  {
    title: '实例id',
    dataIndex: 'id'
  },
  {
    title: '实例名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '应用名称',
    dataIndex: 'appName'
  },
  {
    title: '任务状态',
    dataIndex: ['status', 'label']
  },
  {
    title: '开始时间',
    dataIndex: 'startAt'
  },
  {
    title: '结束时间',
    dataIndex: 'endAt'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]

const appGroupOptions = ref([])
const jobInfoOptions = ref([])
const workflowStatusOptions = ref([])
const dataSource = ref([])

const { run, loading, current, pagination, pageSize } = requestForPage(
  async (params) => listWorkflowInstance(params),
  {
    onSuccess: (data) => {
      let content = data.content
      for (let item of content) {
        item.showMoreAction = item.status.code != 'WAITING_SCHEDULE'
      }
      dataSource.value = content
      console.log('dataSource.value:', dataSource.value)
    }
  }
)

const handleTableChange = (page, filters, sorter) => {
  const namespaceCode = globalStore.getNamespaceCode()
  run({
    ...queryFormState,
    namespaceCode,
    pageNo: page?.current,
    pageSize: page.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters
  })
}

const fetchWorkflowInstance = async () => {
  const { appCode, jobId, jobInstanceId, jobStatus, processor, startAtRange, endAtRange } =
    queryFormState
  const namespaceCode = globalStore.getNamespaceCode()
  run({
    namespaceCode,
    appCode,
    jobId,
    jobInstanceId,
    jobStatus,
    processor,
    startAtRange,
    endAtRange,
    pageNo: current.value,
    pageSize: pageSize.value
  })
}

const onFinish = (values) => {
  fetchWorkflowInstance()
}

const handleAppGroupChange = (value) => {
  globalStore.setAppCode(value)
  fetchWorkflow(value)
}

const fetchWorkflow = async (appCode) => {
  const namespaceCode = globalStore.getNamespaceCode()
  let jobInfoPage = await listJobInfo({
    namespaceCode,
    appCode,
    pageNo: 1,
    pageSize: 10
  })
  jobInfoOptions.value = jobInfoPage.content.map((it) => {
    return {
      label: it.jobName,
      value: it.id
    }
  })
}

const fetchAppGroupOptions = async (searchText) => {
  const namespaceCode = globalStore.getNamespaceCode()
  let jobGroupPage = await listAppGroup({
    namespaceCode,
    name: searchText,
    pageNo: 1,
    pageSize: 10
  })
  appGroupOptions.value = jobGroupPage.content.map((it) => {
    return {
      label: it.name,
      value: it.code
    }
  })
  appGroupOptions.value.unshift({
    label: '全部应用',
    value: ''
  })
}

const goToDetailView = (workflowInstanceId) => {
  router.push({
    name: '工作流实例详情',
    query: { workflowInstanceId }
  })
}

const handleReattemptJob = async (record) => {
  Modal.confirm({
    title: `确认重跑任务`,
    content: h('div', [
      h('span', `确定要重跑 `),
      h('span', { class: 'font-semibold text-blue-500' }, record.jobName),
      h('span', ' ?')
    ]),
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await reattempt({ jobInstanceId: record.id })
      message.success('操作成功')
      fetchWorkflowInstance()
    }
  })
}

const handleTerminateJob = async (record) => {
  Modal.confirm({
    title: `确认终止任务`,
    content: h('div', [
      h('span', `确定要终止 `),
      h('span', { class: 'font-semibold text-blue-500' }, record.jobName),
      h('span', ' ?')
    ]),
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await terminate({ jobInstanceId: record.id })
      message.success('操作成功')
      fetchWorkflowInstance()
    }
  })
}

const initOptions = async () => {
  queryFormState.appCode = globalStore.getAppCode()
  const metadatas = await listMetadata({
    metadataCodes: ['WorkflowStatusEnum']
  })
  const options = buildMetadataOptions(metadatas)
  workflowStatusOptions.value = options['WorkflowStatusEnum']
  fetchAppGroupOptions(null)
  fetchWorkflow(queryFormState.appCode)
}

onMounted(async () => {
  initOptions()
  const namespaceCode = globalStore.getNamespaceCode()
  run({
    ...queryFormState,
    namespaceCode,
    pageNo: current.value,
    pageSize: pageSize.value
  })
})
</script>
