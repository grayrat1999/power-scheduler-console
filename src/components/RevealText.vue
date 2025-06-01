<template>
  <div class="flex items-center space-x-2">
    <a-typography-text copyable>
      {{ showSecret ? value : MASKED_TEXT }}
    </a-typography-text>
    <eye-outlined
      v-if="!showSecret"
      @click="showSecret = true"
      class="cursor-pointer text-lg text-gray-500 hover:text-gray-700"
    />
    <eye-invisible-outlined
      v-else
      @click="showSecret = false"
      class="cursor-pointer text-lg text-gray-500 hover:text-gray-700"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

const MASKED_TEXT = '*'.repeat(42)

defineProps({
  value: {
    type: String,
    required: true
  }
})

const showSecret = ref(false)
</script>
