<template>
  <div>
    <div class="ml-2 mb-4">
      <span class="font-bold">系统概况</span>
      <a-divider type="vertical" class="h-[20px] ml-4 border-black border-l-2" />

      <a-select
        v-model:value="currentAppCode"
        show-search
        :options="appGroupOptions"
        :filterOption="false"
        class="w-64 ml-2"
        @change="handleAppGroupChange"
        @search="fetchAppGroupOptions"
      ></a-select>
    </div>

    <a-flex gap="middle" align="start" vertical :class="cardCss">
      <a-flex :style="{ ...boxStyle }" justify="space-around" align="center" class="text-center">
        <div>
          <div :class="labelCss">总任务数</div>
          <div :class="valueCss">{{ basicInfo.jobInfoCount }}</div>
        </div>
        <div>
          <div :class="labelCss">启用任务数</div>
          <div :class="valueCss">
            {{ basicInfo.enabledJobInfoCount }}
          </div>
        </div>
        <div>
          <div :class="labelCss">禁用任务数</div>
          <div :class="valueCss">
            {{ basicInfo.disabledJobInfoCount }}
          </div>
        </div>
        <div>
          <div :class="labelCss">在线worker</div>
          <div :class="valueCss">{{ basicInfo.onlineWorkerCount }}</div>
        </div>
      </a-flex>
    </a-flex>

    <div class="ml-2 mt-8 mb-4">
      <span class="font-bold">任务汇总</span>
      <a-divider type="vertical" class="h-[20px] ml-4 border-black border-l-2" />
      <a-select
        v-model:value="selectedstatisticsTimeRangeOption"
        show-search
        :options="statisticsTimeRangeOptions"
        :filterOption="false"
        class="w-64 ml-2"
        @change="handleStatisticsTimeRangeOptionChange"
      ></a-select>
    </div>

    <a-flex gap="middle" align="start" vertical :class="cardCss">
      <a-flex :style="{ ...boxStyle }" justify="space-around" align="center" class="text-center">
        <div>
          <div :class="labelCss">调度次数</div>
          <div :class="valueCss">{{ statisticsInfo.jobInstanceCount }}</div>
        </div>
        <div>
          <div :class="labelCss">执行成功</div>
          <div :class="valueCss">{{ statisticsInfo.succeedJobInstanceCount }}</div>
        </div>
        <div>
          <div :class="labelCss">执行失败</div>
          <div :class="valueCss">{{ statisticsInfo.failedJobInstanceCount }}</div>
        </div>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import { reactive, ref, h, onMounted } from 'vue'
import { listAppGroup } from '@/service/api/appGroupApi'
import { queryBasicInfo, queryStatisticsInfo } from '@/service/api/dashboardApi'
import dayjs from 'dayjs'
import { globalStore } from '@/stores/global'

const labelCss = 'text-gray-500'
const valueCss = 'text-blue-500 font-semibold text-2xl'
const cardCss = 'border-2 border-dashed border-gray-300 rounded-lg p-4 m-2'

const currentAppCode = ref('')
const appGroupOptions = ref([])
const statisticsTimeRangeOptions = [
  {
    label: '最近1小时',
    value: '1-hour'
  },
  {
    label: '最近1天',
    value: '1-day'
  },
  {
    label: '最近7天',
    value: '7-day'
  }
]
const selectedstatisticsTimeRangeOption = ref(statisticsTimeRangeOptions[0].value)

const basicInfo = reactive({
  jobInfoCount: '-',
  enabledJobInfoCount: '-',
  disabledJobInfoCount: '-',
  onlineWorkerCount: '-'
})
const statisticsInfo = reactive({
  jobInstanceCount: 0,
  succeedJobInstanceCount: 0,
  failedJobInstanceCount: 0
})
const boxStyle = {
  width: '100%',
  height: '120px'
}

const handleAppGroupChange = (appCode) => {
  const scheduleAtRange = calculateSelectedTimeRange(selectedstatisticsTimeRangeOption.value)
  fetchBasicInfo(appCode)
  fetchStatisticsInfo(appCode, scheduleAtRange)
}

const handleStatisticsTimeRangeOptionChange = (optionValue) => {
  const scheduleAtRange = calculateSelectedTimeRange(optionValue)
  fetchStatisticsInfo(currentAppCode.value, scheduleAtRange)
}

const calculateSelectedTimeRange = (timeRangeOptionValue) => {
  const [timeValue, timeUnit] = timeRangeOptionValue.split('-')
  return [
    dayjs().subtract(timeValue, timeUnit).format('YYYY-MM-DD HH:mm:ss'),
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  ]
}

const fetchAppGroupOptions = async (searchText) => {
  const namespaceCode = globalStore.getNamespaceCode()
  let appGroupPage = await listAppGroup({
    namespaceCode,
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

const fetchBasicInfo = async (appCode) => {
  const namespaceCode = globalStore.getNamespaceCode()
  const basicInfoQueryResult = await queryBasicInfo({ namespaceCode, appCode })
  Object.assign(basicInfo, basicInfoQueryResult)
}

const fetchStatisticsInfo = async (appCode, scheduleAtRange) => {
  const namespaceCode = globalStore.getNamespaceCode()
  const statisticsInfoQueryResult = await queryStatisticsInfo({
    namespaceCode,
    appCode,
    scheduleAtRange
  })
  Object.assign(statisticsInfo, statisticsInfoQueryResult)
}

onMounted(async () => {
  const scheduleAtRange = calculateSelectedTimeRange(selectedstatisticsTimeRangeOption.value)
  fetchAppGroupOptions('')
  fetchBasicInfo('')
  fetchStatisticsInfo('', scheduleAtRange)
})
</script>
