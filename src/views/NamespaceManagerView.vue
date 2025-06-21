<template>
  <div>
    <a-button type="primary" @click="openSaveModel(null)" class="mb-2">新建</a-button>
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
          <template v-else-if="column.dataIndex === 'action'">
            <span class="mr-1 text-blue-500 cursor-pointer" @click="openSaveModel(record)">
              编辑
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <NamespaceSaveModal ref="namespaceSaveModalRef" @onSubmitSuccess="onSubmitSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listNamespace } from '@/service/api/namespaceApi'
import requestForPage from '@/utils/pageRequest'
import NamespaceSaveModal from '@/components/NamespaceSaveModal.vue'
import RevealText from '@/components/RevealText.vue'

const namespaceSaveModalRef = ref()
const dataSource = ref([])
const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]

const { run, loading, current, pageSize, pagination, handleTableChange } = requestForPage(
  async (params) => listNamespace(params),
  {
    onSuccess: (data) => {
      dataSource.value = data.content
    }
  }
)

const openSaveModel = (record) => {
  namespaceSaveModalRef.value.openModal(record)
}

const onSubmitSuccess = async () => {
  run({ pageNo: current.value, pageSize: pageSize.value })
}

onMounted(() => {
  run({ pageNo: current.value, pageSize: pageSize.value })
})
</script>
