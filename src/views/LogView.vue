<template>
    <p>{{ t('logview.title') }}</p>
    <div class="demo-datetime-picker">
        <div class="block">
        <span class="demonstration">{{ t('logview.daterange') }}</span>
        <el-date-picker
            v-model="daterange"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
        />
        </div>
    </div>
    <el-select v-model="type_v" placeholder="{{ t('logview.type') }}" style="width: 240px">
        <el-option
        v-for="item in type_options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        />
    </el-select>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()



const start = new Date()
const end = new Date()
start.setDate(start.getDate() - 1)

const daterange = ref<[Date, Date]>([
  start,
  end,
])

const type_v = ref('')


const type_options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]



</script>