<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col v-for="card in summaryCards" :key="card.key" :xs="24" :sm="12" :md="12" :lg="6">
        <el-card class="summary-card">
          <div class="card-icon" :style="{ background: card.bg }">
            <el-icon :size="22">
              <component :is="card.icon" />
            </el-icon>
          </div>
          <div class="card-content">
            <p class="card-label">{{ card.label }}</p>
            <p class="card-value">{{ card.value }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card" v-loading="loading">
          <div class="chart-header">
            <div>
              <h3>{{ t('home.charts.usageTitle') }}</h3>
              <p class="chart-subtitle">
                {{ t('home.charts.countLabel', { count: usageData.length }) }}
              </p>
            </div>
            <el-button text :icon="Refresh" @click="refreshData"></el-button>
          </div>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { fetchSummaryCount, fetchDeviceUsage } from '@/api/home'
import { Cpu, DataBoard, Monitor, Refresh, TrendCharts } from '@element-plus/icons-vue'

const { t } = useI18n()

interface SummaryState {
  departmentsCount: number
  deviceTypesCount: number
  devicesCount: number
  devicesOnlineCount: number
}

const summary = ref<SummaryState>({
  departmentsCount: 0,
  deviceTypesCount: 0,
  devicesCount: 0,
  devicesOnlineCount: 0,
})

interface UsageItem {
  name: string
  value: number
}

const usageData = ref<UsageItem[]>([])
const loading = ref(false)
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const summaryCards = computed(() => [
  {
    key: 'departments',
    label: t('home.summary.departments'),
    value: summary.value.departmentsCount,
    icon: DataBoard,
    bg: 'rgba(255, 111, 97, 0.15)',
  },
  {
    key: 'deviceTypes',
    label: t('home.summary.deviceTypes'),
    value: summary.value.deviceTypesCount,
    icon: Cpu,
    bg: 'rgba(75, 123, 236, 0.15)',
  },
  {
    key: 'devices',
    label: t('home.summary.devices'),
    value: summary.value.devicesCount,
    icon: Monitor,
    bg: 'rgba(255, 206, 86, 0.2)',
  },
  {
    key: 'onlineDevices',
    label: t('home.summary.onlineDevices'),
    value: summary.value.devicesOnlineCount,
    icon: TrendCharts,
    bg: 'rgba(75, 192, 192, 0.2)',
  },
])

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas', // 强制canvas渲染（svg易模糊）
    useDirtyRect: false,
    devicePixelRatio: window.devicePixelRatio || 2, // 适配高清屏，默认2倍像素
  })
  setChartOptions()
}

const setChartOptions = () => {
  if (!chartInstance) return
  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        name: t('home.charts.usageTitle'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          // 核心：优化字体样式
          fontSize: 20, // 增大字体（默认12，偏小易模糊）
          fontWeight: 500, // 加粗（提升清晰度）
          fontFamily: 'Microsoft YaHei, Arial, sans-serif', // 选无衬线字体（更清晰）
          color: '#333', // 深色字体对比更强
          align: 'center',
          verticalAlign: 'middle',
          // 开启文本描边（可选，针对浅色背景）
          textBorderColor: '#fff',
          textBorderWidth: 0.5,
        },
        data: usageData.value,
      },
    ],
  })
}

const fetchData = async () => {
  loading.value = true
  try {
    const [summaryRes, usageRes] = await Promise.all([fetchSummaryCount(), fetchDeviceUsage()])

    summary.value = {
      departmentsCount: summaryRes?.departments_count ?? 0,
      deviceTypesCount: summaryRes?.device_types_count ?? 0,
      devicesCount: summaryRes?.devices_count ?? 0,
      devicesOnlineCount: summaryRes?.devices_online_count ?? 0,
    }

    usageData.value =
      usageRes?.map((item) => ({
        name: item.name,
        value: Number(item.value),
      })) ?? []

    nextTick(() => setChartOptions())
  } catch (error) {
    console.error(error)
    ElMessage.error(t('home.errors.loadFailed'))
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

onMounted(() => {
  initChart()
  fetchData()
  window.addEventListener('resize', resizeChart)
})

const resizeChart = () => {
  chartInstance?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
  chartInstance = null
})

watch(usageData, () => {
  setChartOptions()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  flex: 1;
}

.card-label {
  margin: 0;
  color: #888;
  font-size: 16px;
}

.card-value {
  margin: 4px 0 0;
  font-size: 28px;
  font-weight: 600;
}

.chart-card {
  min-height: 400px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-subtitle {
  margin: 4px 0 0;
  color: #888;
}

.chart-container {
  width: 100%;
  height: 360px;
}
</style>
