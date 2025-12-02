<template>
  <div class="about-container">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('layout.menu.about') }}</span>
        </div>
      </template>
      <div class="content">
        <p class="description">
          {{ $t('about.description') }}
        </p>
        <el-divider />
        <h3>Tech Stack</h3>
        <div class="tags">
          <el-tag>Vue 3</el-tag>
          <el-tag type="success">TypeScript</el-tag>
          <el-tag type="info">Vite</el-tag>
          <el-tag type="warning">Element Plus</el-tag>
          <el-tag type="danger">ECharts</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.about-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
}

.about-card {
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 20px;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: #606266;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
