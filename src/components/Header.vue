<template>
  <div class="">
    <a-select
      class="text-left"
      v-model:value="selectedNamespaceCode"
      style="width: 140px"
      placeholder="请选择命名空间"
      :options="namespaceOptions"
      @change="handleChange"
    >
    </a-select>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listNamespace } from '@/service/api/namespaceApi'
import { globalStore } from '@/stores/global'

const selectedNamespaceCode = ref('')
const namespaceOptions = ref([])

const handleChange = (value) => {
  globalStore.clear()
  globalStore.setNamespaceCode(value)
  location.reload()
}

onMounted(async () => {
  const result = await listNamespace({})
  namespaceOptions.value = result.content.map((item) => ({
    label: item.name,
    value: item.code
  }))
  const cachedNamespaceCode = globalStore.getNamespaceCode()
  if (cachedNamespaceCode) {
    selectedNamespaceCode.value = cachedNamespaceCode
  } else {
    if (namespaceOptions.value.length > 0) {
      const namespaceCode = namespaceOptions.value[0].value
      selectedNamespaceCode.value = namespaceCode
      globalStore.setNamespaceCode(namespaceCode)
    }
  }
})
</script>
