<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col v-for="card in summaryCards" :key="card.key" :xs="24" :sm="12" :md="12" :lg="6">
        <el-card class="summary-card" :class="card.key" :style="{ backgroundImage: `url('/src/assets/img/home/${card.bg}.png')` }" >
          <!-- <div class="card-icon" >
            <el-icon :size="22">
              <component :is="card.icon" />
            </el-icon>
          </div> -->
          <div class="card-content">
            <div class="card-content-left">
              <p class="card-label">{{ card.label }}</p>
              <p class="card-value">{{ card.value }}</p>
            </div>
            <i class="card-icon-class" :style="{ backgroundImage: `url('/src/assets/img/home/icon-${card.bg}.png')` }"></i>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24" :xs="24" :sm="12" :md="12" :lg="12">
        <el-card class="chart-card" v-loading="loading">
          <div class="chart-header">
            <div>
              <h3>{{ t('home.charts.usageTitle') }}</h3>
            </div>
            <el-button text @click="refreshData">
              <el-icon :class="{ 'is-loading': loading }">
                <Refresh />
              </el-icon>
            </el-button>
          </div>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="24" :xs="24" :sm="12" :md="12" :lg="12">
        <el-card class="chart-card" v-loading="loading">
          <div class="chart-header">
            <div>
              <h3>{{ t('home.charts.deployTitle') || 'Device Deployment' }}</h3>
            </div>
          </div>
          <div ref="deployChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { fetchSummaryCount, fetchDeviceUsage, fetchDeviceDeployCount } from '@/api/home'
import { Cpu, DataBoard, Monitor, Refresh, TrendCharts } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    Cpu,
    DataBoard,
    Monitor,
    Refresh,
    TrendCharts,
  },
  setup() {
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

    interface DeployItem {
      name: string
      value: number
    }

    const usageData = ref<UsageItem[]>([])
    const deployData = ref<DeployItem[]>([])
    const loading = ref(false)
    const chartRef = ref<HTMLDivElement | null>(null)
    const deployChartRef = ref<HTMLDivElement | null>(null)
    let chartInstance: echarts.ECharts | null = null
    let deployChartInstance: echarts.ECharts | null = null

    const summaryCards = computed(() => [
      {
        key: 'departments',
        label: t('home.summary.departments'),
        value: summary.value.departmentsCount,
        icon: DataBoard,
        bg: 'dwzs',
      },
      {
        key: 'deviceTypes',
        label: t('home.summary.deviceTypes'),
        value: summary.value.deviceTypesCount,
        icon: Cpu,
        bg: 'sblx',
      },
      {
        key: 'devices',
        label: t('home.summary.devices'),
        value: summary.value.devicesCount,
        icon: Monitor,
        bg: 'jrsb',
      },
      {
        key: 'onlineDevices',
        label: t('home.summary.onlineDevices'),
        value: summary.value.devicesOnlineCount,
        icon: TrendCharts,
        bg: 'sbzx',
      },
    ])

    const initChart = () => {
      if (!chartRef.value) return
      const existingInstance = echarts.getInstanceByDom(chartRef.value)
      if (existingInstance) {
        existingInstance.dispose()
      }
      chartInstance = echarts.init(chartRef.value, null, {
        renderer: 'canvas',
        useDirtyRect: false,
        devicePixelRatio: window.devicePixelRatio || 2,
      })
      setChartOptions()
    }

    const initDeployChart = () => {
      if (!deployChartRef.value) return
      const existingInstance = echarts.getInstanceByDom(deployChartRef.value)
      if (existingInstance) {
        existingInstance.dispose()
      }
      deployChartInstance = echarts.init(deployChartRef.value, null, {
        renderer: 'canvas',
        useDirtyRect: false,
        devicePixelRatio: window.devicePixelRatio || 2,
      })
      setDeployChartOptions()
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
              fontSize: 20,
              fontWeight: 500,
              fontFamily: 'Microsoft YaHei, Arial, sans-serif',
              color: '#333',
              align: 'center',
              verticalAlign: 'middle',
              textBorderColor: '#fff',
              textBorderWidth: 0.5,
            },
            data: usageData.value,
          },
        ],
      })
    }

    const setDeployChartOptions = () => {
      if (!deployChartInstance) return
      deployChartInstance.setOption({
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: deployData.value.map((item) => item.name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: deployData.value.map((item) => item.value),
            type: 'line',
            smooth: true,
          },
        ],
      })
    }

    const formatDate = (date: Date): string => {
      const pad = (n: number) => (n < 10 ? `0${n}` : n)
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 6)
        startDate.setHours(0, 0, 0, 0)

        const [summaryRes, usageRes, deployRes] = await Promise.all([
          fetchSummaryCount(),
          fetchDeviceUsage(),
          fetchDeviceDeployCount({
            deploy_time_start: formatDate(startDate),
            deploy_time_end: formatDate(endDate),
          }),
        ])

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

        deployData.value =
          deployRes?.map((item) => ({
            name: item.name,
            value: Number(item.value),
          })) ?? []

        nextTick(() => {
          setChartOptions()
          setDeployChartOptions()
        })
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

    const resizeChart = () => {
      chartInstance?.resize()
      deployChartInstance?.resize()
    }

    onMounted(() => {
      initChart()
      initDeployChart()
      fetchData()
      window.addEventListener('resize', resizeChart)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart)
      chartInstance?.dispose()
      deployChartInstance?.dispose()
      chartInstance = null
      deployChartInstance = null
    })

    watch(usageData, () => {
      setChartOptions()
    })

    watch(deployData, () => {
      setDeployChartOptions()
    })

    return {
      t,
      summaryCards,
      usageData,
      deployData,
      loading,
      chartRef,
      deployChartRef,
      refreshData,
      Refresh
    }
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.el-col {
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: none;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: cover; /* 铺满且保持比例，裁剪超出部分 */
  background-position: center;
  /* 元素尺寸（必须设置） */
  /* width: 100%; */
  /* height: 100%; */
  /* 可选：避免元素内边距影响尺寸 */
  box-sizing: border-box;
  position: relative;

  .card-icon-class {
    position: absolute;
    right: 20%;
    width: 58px;
    height: 61px;
    background-repeat: no-repeat;
  }
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.summary-card:hover .card-icon {
  transform: scale(1.1);
}

.card-content {
  /* flex: 1; */
  display: flex;
  /* flex-direction: row; */
  
  align-items: center;
}

.card-label {
  margin: 0;
  color: #feffff;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.card-value {
  margin: 8px 0 0;
  font-size: 32px;
  /* font-weight: 700; */
  color: #f0f2f5;
  line-height: 1.2;
}

.chart-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.chart-subtitle {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 14px;
}

.chart-container {
  width: 100%;
  height: 360px;
}
</style>
