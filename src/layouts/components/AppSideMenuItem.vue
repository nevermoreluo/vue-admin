<template>
  <template v-if="!item.children || item.children.length === 0">
    <el-menu-item :index="item.url">
      <el-icon v-if="item.icon" class="m-icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </template>

  <el-sub-menu v-else :index="item.url">
    <el-icon v-if="item.icon" class="m-icon">
      <component :is="item.icon" />
    </el-icon>
    <span>{{ item.name }}</span>
    <side-menu-item
      v-for="child in item.children"
      :key="child.url"
      :item="child"
    />
  </el-sub-menu>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import * as icons from '@element-plus/icons-vue'

export interface MenuItem {
  name: string
  url: string
  icon?: string
  children?: MenuItem[]
}

export default defineComponent({
  name: 'SideMenuItem',
  components: icons,
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
  },
})
</script>
