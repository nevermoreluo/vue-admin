<script lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.el-table .odd-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
/* .el-table .even-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
} */

</style>
