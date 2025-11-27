<template>
  <div>
    
  <div class="pub-title-div">{{ $t('logview.title') }}</div>
  <el-card>
    <div class="pub-select-area">
      <el-row :gutter="10" class="pub-select-row">
        <el-col :span="10" class="pub-select-col">
          <label class="pub-select-label">{{ $t('logview.daterange') }}</label>
          <el-date-picker
              v-model="daterange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="-"
              :start-placeholder="$t('logview.startdate')"
              :end-placeholder="$t('logview.enddate')"
          />
        </el-col>
        <el-col :span="4" class="pub-select-col">
            <label class="pub-select-label">{{ $t('logview.type') }}</label>
            <el-select v-model="type_v" :placeholder="$t('logview.type')" style="width: 80%;" clearable>
                <el-option
                v-for="item in type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
        </el-col>
        <el-col :span="6">
          <label class="pub-select-label">{{ $t('logview.search_key') }}</label>
          <el-input v-model="search_v" :placeholder="$t('logview.search_key')" style="width: 60%;" />
        </el-col>
        <el-col :span="4" class="pub-select-col">
            <el-button type="primary" @click="search">{{ $t('common.search') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table :data="tableData"
      :row-class-name="tableRowClassName">
      <el-table-column prop="created_at" label="Date" />
      <el-table-column prop="record_type" label="Type">
        <template #default="scope">
          <div>{{getType(scope.row.record_type)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="data" label="Data" />
      <el-table-column prop="url" label="Url" />
    </el-table>
  </el-card>

  </div>
</template>


<script lang="ts">
import { ref, defineComponent } from 'vue'
import { logApi, type LogParams, type LogResponseData } from '@/api/log'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'LogView',
  components: {
    
  },
  methods: {
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
        pages: 1,
        page_size: 10,
        record_type: this.type_v,
        start_time: start_time,
        end_time: end_time,
        url: this.search_v
      }).then((res) => {
        this.tableData = res.data
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

    return {
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


<style>
.el-table .odd-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
.el-table .even-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>