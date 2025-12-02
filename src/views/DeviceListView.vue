<template>
<div class="pub-main-div">
    <div class="pub-title-div">   
        <h1>{{ $t('devicelist.title') }}</h1>
        <el-button type="primary" @click="dialogVisible=true">{{ $t('devicelist.add_device') }}</el-button>
    </div>
    <DeviceDialog
        v-model="dialogVisible"
        :type_options="type_options"
        :usage_options="usage_options"
        :department_options="department_options"
        :enable_options="enable_options"
        :online_options="online_options"
        :supplier_options="supplier_options"
    />
    <el-card class="box-card">
        <div class="search-area">
            <el-row :gutter="20" class="device_type">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.device_type') }}:</span>
                        <el-select v-model="type_v" style="width: 60%" clearable>
                            <el-option
                                v-for="item in type_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.device_usage') }}:</span>
                        <el-select v-model="usage_v" style="width: 60%" clearable>
                            <el-option
                                v-for="item in usage_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.department') }}:</span>
                        <el-select v-model="department_v" style="width: 60%" clearable>
                            <el-option
                                v-for="item in department_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.serial_number') }}:</span>
                        <el-input v-model="search_v" style="width: 60%" clearable />
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.is_enable') }}:</span>
                        <el-select v-model="enable_v" style="width: 60%" clearable>
                            <el-option
                                v-for="item in enable_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" >
                    <div class="search-item">
                        <span class="label">{{ $t('devicelist.is_online') }}:</span>
                        <el-select v-model="online_v" style="width: 60%" clearable>
                            <el-option
                                v-for="item in online_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="4" :lg="4" class="search-col">
                    <el-button type="primary" @click="search" :icon="Search">{{ $t('common.search') }}</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table class="logtable"
            :data="tableData" :row-class-name="tableRowClassName" 
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}">
            <el-table-column prop="id" label="ID" min-width="180" />
            <el-table-column prop="name" :label="$t('devicelist.device_name')" min-width="120" />
            <el-table-column prop="device_type.hardware_type" :label="$t('devicelist.device_model')" show-overflow-tooltip min-width="200" />
            <el-table-column prop="serial_number" :label="$t('devicelist.device_number')" show-overflow-tooltip min-width="200" />
            <el-table-column prop="last_online_time" :label="$t('devicelist.last_login_time')" min-width="120" />
            <el-table-column prop="created_at" :label="$t('devicelist.setup_time')" min-width="120" />
        </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="10"
          :current-page="pages"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getDevices, getDeviceTypes, getDeviceUsages, getDepartments, getSuppliers, type DeviceListResponseData } from '@/api/devices'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import DeviceDialog from '@/views/DeviceDialog.vue'

interface TypeOption {
    value: number
    label: string
}

export default defineComponent({
  name: 'DeviceListView',
  setup() {
    return {
      Search
    }
  },
  components: {
    DeviceDialog
  },
  methods: {
    handleCurrentChange(page: number) {
      this.pages = page
      this.search()
    },
    getDeviceTypes() {
      getDeviceTypes({pages: 1, page_size: 100}).then((res) => {
        this.type_options = res.data.map((item) => {
          return {
            value: item.id,
            label: item.hardware_type
          }
        });
      })
    },
    getSuppliers() {
      getSuppliers({pages: 1, page_size: 100}).then((res) => {
        this.supplier_options = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        });
      })
    },
    getDeviceUsages() {
      getDeviceUsages({pages: 1, page_size: 100}).then((res) => {
        this.usage_options = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        });
      })
    },
    getDepartments() {
      getDepartments({pages: 1, page_size: 100}).then((res) => {
        this.department_options = res.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        });
      })
    },
    search() {
      getDevices({
        pages: this.pages,
        page_size: 10,
        device_type_id: this.type_v,
        device_usage_id: this.usage_v,
        department_id: this.department_v,
        serial_number: this.search_v,
        is_enable: this.enable_v,
        is_online: this.online_v
      }).then((res) => {
        this.total = res.total
        this.tableData = res.data
      }).catch((err) => {
        ElMessage.error(err.message)
      })
    },
    addDevice() {
    //   this.$router.push('/device/add')
    }
  },
  mounted() {
    this.search()
    this.getDeviceTypes()
    this.getDeviceUsages()
    this.getDepartments()
    this.getSuppliers()
  },
  data() {
    const enable_options = [
        {
            value: 1,
            label: this.$t('common.enable')
        },
        {
            value: 0,
            label: this.$t('common.disable')
        }
    ];

    const online_options = [
        {
            value: 1,
            label: this.$t('common.online')
        },
        {
            value: 0,
            label: this.$t('common.offline')
        }
    ];
    const tableRowClassNamea = ({row, rowIndex}: {
      row: DeviceListResponseData,
      rowIndex: number
    }) => {
      if (rowIndex & 1) {
        return 'odd-row'
      } else {
        return 'even-row'
      }
    }
    const total = ref(0)
    const pages = ref(1)
    return {
        dialogVisible: ref(false),
        enable_options,
        online_options,
        type_options: ref<TypeOption[]>([]),
        type_v: ref(),
        usage_options: ref<TypeOption[]>([]),
        usage_v: ref(),
        department_options: ref<TypeOption[]>([]),
        department_v: ref(),
        enable_v: ref(),
        online_v: ref(),
        search_v: ref(),
        tableRowClassName: tableRowClassNamea,
        tableData: ref<DeviceListResponseData[]>([]),
        total,
        pages,
        supplier_options: ref<TypeOption[]>([])
    }
  }
})
</script>

<style scoped>

.pub-title-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pub-title-div h1 {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.box-card {
  border-radius: 8px;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.search-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  margin-right: 10px;
}




/* 表头单元格背景色 + 文字颜色 */
:deep(.el-table__header th) {
  background-color: #63a3e4; /* 深色背景 */
  color: #ffffff; /* 白色文字 */
  padding: 16px 0; /* 表头上下内边距 16px */
}

/* 表头边框颜色（可选，与背景色协调） */
:deep(.el-table__header) {
  border-bottom: 1px solid #63a3e4; /* 边框颜色 */
}

/* 表头hover状态（可选，优化交互） */
:deep(.el-table__header th:hover) {
  background-color: #63a3e4; /* 略浅的hover色 */
}

/* 内容行行高（更小） */
:deep(.el-table__body td) {
  padding: 16px 0; /* 内容行上下内边距 8px */
}

/* 固定列同步调整 */
:deep(.el-table__fixed-header th) {
  padding: 16px 0;
}
:deep(.el-table__fixed-body td) {
  padding: 16px 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
