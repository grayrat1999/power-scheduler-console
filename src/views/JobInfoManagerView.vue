<template>
  <div>
    <a-form :model="queryFormState" @finish="fetchJobInfo">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="appCode" label="应用名称">
            <a-select
              v-model:value="queryFormState.appCode"
              show-search
              allowClear
              :options="appGroupOptions"
              :filterOption="false"
              @change="handleAppGroupChange"
              @search="searchAppGroup"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="jobName" label="任务名称">
            <a-input v-model:value="queryFormState.jobName" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="processor" label="任务处理器">
            <a-input v-model:value="queryFormState.processor" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" class="text-right">
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-col>
      </a-row>
    </a-form>

    <div class="search-result-list">
      <a-button type="primary" class="mb-2" @click="showSaveModel(null)">新建</a-button>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-key="(record) => record.id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'scheduleConfig'">
            <div>{{ record.scheduleConfig }}</div>
          </template>

          <template v-if="column.dataIndex === 'jobName'">
            <span v-if="record.enabled"><a-tag color="green">启用</a-tag></span>
            <span v-else><a-tag color="red">禁用</a-tag></span>
            <span>{{ record.jobName }}</span>
          </template>

          <template v-if="column.dataIndex === 'jobType&processor'">
            <div>{{ record.jobType.label }}</div>

            <a-typography-text
              v-if="record.jobType.code === 'JAVA'"
              :style="{ width: '150px' }"
              :ellipsis="{ tooltip: record.processor }"
              v-model:content="record.processor"
            >
            </a-typography-text>
          </template>

          <template v-if="column.dataIndex === 'operation'">
            <span class="mr-1 text-blue-500 cursor-pointer" @click="showSaveModel(record)">
              编辑
            </span>

            <a-dropdown>
              <span class="mr-1 text-blue-500 cursor-pointer">更多</span>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <div class="text-blue-500 cursor-pointer" @click="handleSwitchEnable(record)">
                      <span v-if="record.enabled">禁用</span>
                      <span v-else>启用</span>
                    </div>
                  </a-menu-item>
                  <a-menu-item>
                    <div
                      class="text-blue-500 cursor-pointer"
                      @click="jobRunOnceModalRef.openModal(record)"
                    >
                      执行一次
                    </div>
                  </a-menu-item>
                  <a-menu-item>
                    <div class="text-blue-500 cursor-pointer" @click="showDeleteConfirm(record)">
                      删除
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>

    <JobRunOnceModal ref="jobRunOnceModalRef" title="执行一次" />
    <JobInfoSaveModal ref="saveModelRef" @onSubmitSuccess="onSubmitSuccess" />
  </div>
</template>

<script setup>
import { Modal, message } from 'ant-design-vue'
import { reactive, ref, onMounted, h } from 'vue'

import requestForPage from '@/utils/pageRequest'
import { listAppGroup } from '@/service/api/appGroupApi'
import { listJobInfo, removeJobInfo, switchEnable } from '@/service/api/jobInfoApi'

import JobRunOnceModal from '@/components/JobRunOnceModal.vue'
import JobInfoSaveModal from '@/components/JobInfoSaveModal.vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    ellipsis: true
  },
  {
    title: '应用名称',
    dataIndex: 'appName',
    ellipsis: true
  },
  {
    title: '任务类型/处理器',
    dataIndex: 'jobType&processor'
  },
  {
    title: '执行方式',
    dataIndex: ['executeMode', 'label']
  },
  {
    title: '调度类型/调度配置',
    dataIndex: 'scheduleConfigDesc'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]

const [saveModelRef, jobRunOnceModalRef] = [ref(), ref()]
const currentAppCode = ref('')
const appGroupOptions = ref([])
const queryFormState = reactive({})
const dataSource = ref([])
let lastQueryParam = null

const query = async (params) => {
  lastQueryParam = params
  currentAppCode.value = params.appCode
  return listJobInfo(params)
}

const { run, loading, current, pageSize, pagination, handleTableChange } = requestForPage(
  query,
  (data) => (dataSource.value = data.content),
  {
    appCode: 'sample-job-springboot',
    pageNo: 1,
    pageSize: 1
  }
)

const fetchJobInfo = () => {
  run({
    ...queryFormState,
    pageNo: current.value,
    pageSize: pageSize.value
  })
}

const showSaveModel = (record) => {
  if (!record && !currentAppCode.value) {
    message.error('请先选择应用')
    return
  }
  const appCode = record ? record.appCode : currentAppCode.value
  saveModelRef.value.openModal(appCode, record?.id)
}

const onSubmitSuccess = async () => {
  run({
    ...lastQueryParam,
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize
  })
}

const showDeleteConfirm = (record) => {
  Modal.confirm({
    title: '删除确认',
    content: h('div', [
      h('span', '确定要删除 '),
      h('span', { class: 'font-semibold text-blue-500' }, record.jobName),
      h('span', ' ?')
    ]),
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await removeJobInfo({
        jobId: record.id
      })
      run({
        ...lastQueryParam,
        pageNo: pagination.value.current,
        pageSize: pagination.value.pageSize
      })
    }
  })
}

const handleSwitchEnable = async (record) => {
  await switchEnable({
    jobId: record.id,
    enabled: !record.enabled
  })
  run({
    ...lastQueryParam,
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize
  })
}

const searchAppGroup = async (searchText) => {
  let appGroupPage = await listAppGroup({
    appCode: searchText,
    pageNo: 1,
    pageSize: 10
  })
  appGroupOptions.value = appGroupPage.content.map((it) => {
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

const handleAppGroupChange = (value) => {
  localStorage.setItem('selectedAppCode', value || '')
  run({
    appCode: value,
    pageNo: 1,
    pageSize: pageSize.value
  })
}

onMounted(() => {
  searchAppGroup()
  const selectedAppCode = localStorage.getItem('selectedAppCode')
  queryFormState.appCode = selectedAppCode
  currentAppCode.value = selectedAppCode
  run({
    ...queryFormState,
    pageNo: current.value,
    pageSize: pageSize.value
  })
})
</script>
