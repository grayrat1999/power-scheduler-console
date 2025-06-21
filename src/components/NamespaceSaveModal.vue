<template>
  <a-modal v-model:open="visibility" :title="title" @ok="handleSave">
    <a-form name="basic" ref="formRef" :model="currentNamespace">
      <a-form-item
        label="命名空间编码"
        name="code"
        :disabled="saveMode === 'edit'"
        :rules="[{ required: true, message: 'Please input code' }]"
      >
        <a-input v-model:value="currentNamespace.code" :disabled="saveMode == 'edit'" />
      </a-form-item>
      <a-form-item
        label="命名空间名称"
        name="name"
        :rules="[{ required: true, message: 'Please input name' }]"
      >
        <a-input v-model:value="currentNamespace.name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { addNamespace, editNamespace } from '@/service/api/namespaceApi'

const emit = defineEmits(['onSubmitSuccess'])
const emptyNamespace = {
  id: null,
  code: '',
  name: ''
}

const title = ref('新建命名空间')
const formRef = ref()
const saveMode = ref('')
const visibility = ref(false)
const currentNamespace = reactive({})

const openModal = (namespace) => {
  if (namespace) {
    saveMode.value = 'edit'
    title.value = '编辑命名空间'
    Object.assign(currentNamespace, namespace)
  } else {
    saveMode.value = 'add'
    title.value = '新建命名空间'
    Object.assign(currentNamespace, emptyNamespace)
  }
  visibility.value = true
}

const handleSave = async () => {
  if (saveMode.value === 'add') {
    await addNamespace({ ...currentNamespace })
  } else {
    await editNamespace(currentNamespace)
  }
  visibility.value = false
  formRef.value.resetFields()
  message.success('操作成功')
  emit('onSubmitSuccess')
}

defineExpose({ openModal })
</script>
