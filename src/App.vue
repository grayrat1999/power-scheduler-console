<template>
  <AppView></AppView>
</template>

<script setup>
import AppView from '@/views/AppView.vue'
</script>

<style>
:where(.css-dev-only-do-not-override-19iuou).ant-form-item
  .ant-form-item-label
  > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
  all: unset;
}

:where(.css-dev-only-do-not-override-19iuou).ant-form-item
  .ant-form-item-label
  > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after {
  display: inline-block;
  margin-inline-end: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
