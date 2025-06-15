<template>
  <a-drawer
    v-model:open="visibility"
    title="任务详情"
    size="large"
    placement="right"
    @close="handleClose"
  >
    <a-tabs v-model:activeKey="activeTagKey" type="card" @change="handleChangeTag">
      <a-tab-pane key="basicInfo" tab="基本信息">
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
              <pre class="max-h-36">{{ currentJobInstanceDetail.message }}</pre>
            </a-col>
          </a-row>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="progressInfo"
        tab="任务进度"
        v-if="currentJobInstanceDetail?.executeMode?.code != 'SINGLE'"
      >
        <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="
                Array.isArray(column.dataIndex) && column.dataIndex.join('.') === 'taskStatus.label'
              "
            >
              <span className="inline-flex items-center text-sm text-gray-800">
                <CheckCircleTwoTone
                  v-if="record.taskStatus.code == 'SUCCESS'"
                  two-tone-color="#52c41a"
                />

                <ExclamationCircleTwoTone
                  v-else-if="record.taskStatus.code == 'FAILED'"
                  two-tone-color="#ff4d4f"
                />

                <SyncOutlined v-else spin class="text-blue-500" />
                <span class="ml-2">{{ record.taskStatus.label }}</span>
              </span>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <span> 重跑 </span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup>
import { getJobInstanceDetail, queryProgress } from '@/service/api/jobInstanceApi'
import { reactive, ref } from 'vue'
import requestForPage from '@/utils/pageRequest'
import { CheckCircleTwoTone, ExclamationCircleTwoTone, SyncOutlined } from '@ant-design/icons-vue'

const visibility = ref(false)
const activeTagKey = ref('basicInfo')
const currentJobInstanceDetail = reactive({})
const dataSource = ref([])
const columns = [
  {
    title: '子任务id',
    dataIndex: 'taskId'
  },
  {
    title: '子任务名称',
    dataIndex: 'taskName',
    ellipsis: true
  },
  {
    title: '任务状态',
    dataIndex: ['taskStatus', 'label']
  },
  {
    title: 'worker地址',
    dataIndex: 'workerAddress'
  }
]

const openModal = async (jobInstanceId) => {
  visibility.value = true
  const queryResult = await getJobInstanceDetail({ jobInstanceId })
  Object.assign(currentJobInstanceDetail, queryResult)
}

const { run, loading, current, pagination, pageSize, cancel } = requestForPage(
  async (params) => queryProgress(params),
  {
    onSuccess: (data) => {
      dataSource.value = data.content
    },
    pollingInterval: 5000
  }
)

const handleChangeTag = (activeKey) => {
  if (activeKey === 'progressInfo') {
    run({ jobInstanceId: currentJobInstanceDetail.id })
  } else {
    cancel()
  }
}

const handleTableChange = (page, filters, sorter) => {
  run({
    jobInstanceId,
    pageNo: page?.current,
    pageSize: page.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters
  })
}

const handleClose = () => {
  // 取消轮训
  cancel()
}

defineExpose({ openModal })
</script>
