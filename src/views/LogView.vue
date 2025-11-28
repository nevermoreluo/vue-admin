<template>
  <div class="pub-main-div">
    <div class="pub-title-div">{{ $t('logview.title') }}</div>
    <el-card class="box-card" >
      <div class="search-area">
        <el-row :gutter="20" class="search-row">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="search-col">
            <div class="search-item">
              <span class="label">{{ $t('logview.daterange') }}</span>
              <el-date-picker
                v-model="daterange"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="-"
                :start-placeholder="$t('logview.startdate')"
                :end-placeholder="$t('logview.enddate')"
                style="width: 100%"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="4" class="search-col">
            <div class="search-item">
              <span class="label">{{ $t('logview.type') }}</span>
              <el-select v-model="type_v" :placeholder="$t('logview.type')" style="width: 100%" clearable>
                <el-option
                  v-for="item in type_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" class="search-col">
            <div class="search-item">
              <span class="label">{{ $t('logview.search_key') }}</span>
              <el-input v-model="search_v" :placeholder="$t('logview.search_key')" style="width: 100%" />
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
        <el-table-column prop="created_at" :label="$t('logview.daterange')" min-width="180" />
        <el-table-column prop="record_type" :label="$t('logview.type')" min-width="120">
          <template #default="scope">
            <el-tag :type="scope.row.record_type === 1 ? 'danger' : 'info'">{{ getType(scope.row.record_type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data" :label="$t('logview.data')" show-overflow-tooltip min-width="200" />
        <el-table-column prop="url" :label="$t('logview.url')" show-overflow-tooltip min-width="200" />
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
import { ref, defineComponent } from 'vue'
import { logApi, type LogParams, type LogResponseData } from '@/api/log'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'LogView',
  components: {

  },
  setup() {
    return {
      Search
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    handleCurrentChange(page: number) {
      this.pages = page
      this.search()
    },
    getType(type: number) {
      switch (type) {
        case 0:
          return this.$t('logview.type_options0')
        case 1:
          return this.$t('logview.type_options1')
        case 2:
          return this.$t('logview.type_options2')
        case 3:
          return this.$t('logview.type_options3')
        default:
          return this.$t('logview.type_options0')
      }
    },
    search() {
      const daterange = this.daterange
      const start_time = daterange ? daterange[0] + "+00:00:00" : ''
      const end_time = daterange ? daterange[1] + "+23:59:59" : ''
      logApi({
        pages: this.pages,
        page_size: 10,
        record_type: this.type_v,
        start_time: start_time,
        end_time: end_time,
        url: this.search_v
      }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      }).catch((err) => {
        ElMessage.error(err.message)
      })
    }
  },
  data() {
    const type_options = [
      {
        value: 0,
        label: this.$t('logview.type_options0'),
      },
      {
        value: 1,
        label: this.$t('logview.type_options1'),
      },
      {
        value: 2,
        label: this.$t('logview.type_options2'),
      },
      {
        value: 3,
        label: this.$t('logview.type_options3'),
      }
    ]
    const tableRowClassNamea = ({row, rowIndex}: {
      row: LogResponseData,
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
      pages,
      total,
      type_v: ref(""),
      daterange: ref<[Date, Date]>(),
      type_options: type_options,
      search_v: ref(""),
      tableRowClassName: tableRowClassNamea,
      tableData: ref<LogResponseData[]>([])
    }
  }
})
</script>

<style scoped>

/* 容器自适应 */
.pagination-container {
  width: 100%;
  overflow-x: auto; /* 防止小屏幕横向溢出 */
  padding: 10px 0;
}

.pub-main-div {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 90vh;
}

.pub-title-div {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
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

.search-row {
  row-gap: 15px;
}

.search-col {
  display: flex;
  align-items: center;
}

.search-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.label {
  font-weight: 500;
  margin-right: 10px;
  white-space: nowrap;
  color: #606266;
}

.logtable {
  margin-bottom: 40px;
}


.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

</style>