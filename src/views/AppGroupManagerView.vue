<template>
  <div>
    <a-button type="primary" @click="openSaveModel" class="mb-2">新建分组</a-button>
    <div class="search-result-list">
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'secret'">
            <RevealText :value="record.secret" />
          </template>
        </template>
      </a-table>
    </div>

    <AppGroupSaveModal ref="appGroupSaveModalRef" @onSubmitSuccess="onSubmitSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listAppGroup } from '@/service/api/appGroupApi'
import requestForPage from '@/utils/pageRequest'
import AppGroupSaveModal from '@/components/AppGroupSaveModal.vue'
import RevealText from '@/components/RevealText.vue'

const appGroupSaveModalRef = ref()
const dataSource = ref([])
const columns = [
  {
    title: '应用名称',
    dataIndex: 'name'
  },
  {
    title: 'appCode',
    dataIndex: 'code'
  },
  {
    title: 'appSecret',
    dataIndex: 'secret'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  }
]

const { run, loading, current, pageSize, pagination, handleTableChange } = requestForPage(
  async (params) => listAppGroup(params),
  (data) => (dataSource.value = data.content),
  {
    pageNo: 1,
    pageSize: 1
  }
)

const openSaveModel = () => {
  appGroupSaveModalRef.value.openModal()
}

const onSubmitSuccess = async () => {
  run({ pageNo: current.value, pageSize: pageSize.value })
}

onMounted(() => {
  run({ pageNo: current.value, pageSize: pageSize.value })
})
</script>
