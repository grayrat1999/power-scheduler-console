<template>
  <a-modal v-model:open="visibility" title="新建应用" @ok="handleSave">
    <a-form name="basic" ref="formRef" :model="currentAppGroup">
      <a-form-item
        label="应用编码"
        name="code"
        :rules="[{ required: true, message: 'Please input code' }]"
      >
        <a-input v-model:value="currentAppGroup.code" />
      </a-form-item>
      <a-form-item
        label="应用名称"
        name="name"
        :rules="[{ required: true, message: 'Please input name' }]"
      >
        <a-input v-model:value="currentAppGroup.name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { addAppGroup } from '@/service/api/appGroupApi'

const emit = defineEmits(['onSubmitSuccess'])

const emptyAppGroup = {
  id: null,
  code: '',
  name: ''
}

const formRef = ref()
const saveMode = ref('')
const visibility = ref(false)
const currentAppGroup = reactive({})

const openModal = (appGroup) => {
  if (appGroup) {
    saveMode.value = 'edit'
    Object.assign(currentAppGroup, appGroup)
  } else {
    saveMode.value = 'add'
    Object.assign(currentAppGroup, emptyAppGroup)
  }
  visibility.value = true
}

const handleSave = async () => {
  if (saveMode.value === 'add') {
    await addAppGroup({ ...currentAppGroup })
  } else {
    console.log('edit')
  }
  visibility.value = false
  formRef.value.resetFields()
  message.success('操作成功')
  emit('onSubmitSuccess')
}

defineExpose({ openModal })
</script>
