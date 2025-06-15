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
              @change="handleJobGroupChange"
              @search="fetchAppGroup"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="jobId" label="任务名称">
            <a-select
              show-search
              allowClear
              v-model:value="queryFormState.jobId"
              :options="jobInfoOptions"
              :filterOption="false"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="jobStatus" label="任务状态">
            <a-select
              allowClear
              class="w-full"
              v-model:value="queryFormState.jobStatus"
              :options="jobStatusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="jobInstanceId" label="任务实例id">
            <a-input v-model:value="queryFormState.jobInstanceId"></a-input>
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
            <span
              class="mr-1 text-blue-500 cursor-pointer"
              @click="jobInstanceDetailModalRef.openModal(record.id)"
            >
              详情
            </span>
            <a-dropdown v-if="record.showMoreAction" class="mr-1 text-blue-500 cursor-pointer">
              <span>更多</span>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-if="record.jobStatus.code == 'FAILED'">
                    <div
                      class="text-blue-500"
                      @click="jobInstanceMessageModalRef.openModal(record)"
                    >
                      异常信息
                    </div>
                  </a-menu-item>
                  <a-menu-item
                    v-if="['SUCCESS', 'FAILED', 'CANCELED'].includes(record.jobStatus.code)"
                  >
                    <div class="text-blue-500" @click="handleReattemptJob(record)">重跑任务</div>
                  </a-menu-item>
                  <a-menu-item
                    v-if="
                      ['WAITING_DISPATCH', 'DISPATCHING', 'PENDING', 'PROCESSING'].includes(
                        record.jobStatus.code
                      )
                    "
                  >
                    <div class="text-blue-500" @click="handleTerminateJob(record)">终止任务</div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>

    <JobInstanceDetailModal ref="jobInstanceDetailModalRef" />
    <JobInstanceMessageModal ref="jobInstanceMessageModalRef" />
  </div>
</template>

<script setup>
import { Modal, message } from 'ant-design-vue'
import { reactive, ref, h, onMounted } from 'vue'

import { listAppGroup } from '@/service/api/appGroupApi'
import { listJobInstance, terminate, reattempt } from '@/service/api/jobInstanceApi'
import { listMetadata } from '@/service/api/metadataApi'
import { listJobInfo } from '@/service/api/jobInfoApi'
import { buildMetadataOptions } from '@/utils/metadataUtils'
import requestForPage from '@/utils/pageRequest'
import JobInstanceDetailModal from '@/components/JobInstanceDetailModal.vue'
import JobInstanceMessageModal from '@/components/JobInstanceMessageModal.vue'

const [jobInstanceMessageModalRef, jobInstanceDetailModalRef] = [ref(), ref()]

const queryFormRef = ref()
const queryFormState = reactive({})

const columns = [
  {
    title: '任务实例id',
    dataIndex: 'id'
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    ellipsis: true
  },
  {
    title: '应用名称',
    dataIndex: 'appName'
  },
  {
    title: '任务类型/处理器',
    dataIndex: 'jobType&processor'
  },
  {
    title: '任务状态',
    dataIndex: ['jobStatus', 'label']
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
const jobStatusOptions = ref([])
const dataSource = ref([])

const { run, loading, current, pagination, pageSize } = requestForPage(
  async (params) => listJobInstance(params),
  {
    onSuccess: (data) => {
      let content = data.content
      for (let item of content) {
        item.showMoreAction = item.jobStatus.code != 'WAITING_SCHEDULE'
      }
      dataSource.value = content
    }
  }
)

const handleTableChange = (page, filters, sorter) => {
  run({
    ...queryFormState,
    pageNo: page?.current,
    pageSize: page.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters
  })
}

const fetchJobInstance = async () => {
  const { appCode, jobId, jobInstanceId, jobStatus, processor, startAtRange, endAtRange } =
    queryFormState
  run({
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
  fetchJobInstance()
}

const handleJobGroupChange = (value) => {
  localStorage.setItem('selectedAppCode', value)
  fetchJobInfo(value)
}

const fetchJobInfo = async (appCode) => {
  let jobInfoPage = await listJobInfo({
    appCode: appCode,
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

const fetchAppGroup = async (searchText) => {
  let jobGroupPage = await listAppGroup({
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
      fetchJobInstance()
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
      fetchJobInstance()
    }
  })
}

const initOptions = async () => {
  queryFormState.appCode = localStorage.getItem('selectedAppCode')
  const metadatas = await listMetadata({
    metadataCodes: ['JobStatusEnum']
  })
  const options = buildMetadataOptions(metadatas)
  jobStatusOptions.value = options['JobStatusEnum']
  fetchAppGroup(null)
  fetchJobInfo(queryFormState.appCode)
}

onMounted(async () => {
  initOptions()
  run({
    ...queryFormState,
    pageNo: current.value,
    pageSize: pageSize.value
  })
})
</script>
