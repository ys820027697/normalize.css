<template>
  <div class="quick-message-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="title-line">快捷消息分类</span>
        <div class="header-icons">
          <el-icon><Download /></el-icon>
          <el-icon><Upload /></el-icon>
          <el-icon><Refresh /></el-icon>
          <el-icon class="plus-icon"><Plus /></el-icon>
        </div>
      </div>
      
      <el-input v-model="filterText" placeholder="请输入分类的描述" class="search-input">
        <template #append>搜索</template>
      </el-input>

      <el-tree
        ref="treeRef"
        :data="categoryData"
        :props="defaultProps"
        highlight-current
        @node-click="handleNodeClick"
        class="category-tree"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-icon v-if="data.children"><Folder /></el-icon>
            <el-icon v-else><Document /></el-icon>
            <span class="label">{{ node.label }}</span>
            <el-dropdown trigger="hover" class="node-more">
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>新增下级分类</el-dropdown-item>
                  <el-dropdown-item>编辑</el-dropdown-item>
                  <el-dropdown-item divider>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
    </aside>

    <main class="main-content">
      <el-alert
        title="未选择分类！请在左侧选择具体所需新增快捷消息分类后进行操作"
        type="warning"
        show-icon
        :closable="false"
        class="mb-4"
      />

      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="搜索消息标题或内容" style="width: 400px" />
        <div class="search-btns">
          <el-button>重置</el-button>
          <el-button type="danger">查询</el-button>
          <el-button type="danger" plain>新增消息</el-button>
        </div>
      </div>

      <div class="message-list">
        <div v-for="i in 4" :key="i" class="message-item">
          <div class="item-header">
            <span class="message-title">消息标题消息标题消息标题 (12345)</span>
          </div>
          <div class="item-body">
            <p>1. 消息内容消息内容消息内容消息内容消息内容...</p>
            <p>2. 消息内容消息内容消息内容消息内容消息内容...</p>
            <div v-if="i === 3" class="image-preview">
              <el-image 
                src="https://via.placeholder.com/100" 
                :preview-src-list="['https://via.placeholder.com/600']"
              />
            </div>
          </div>
          <div class="item-footer">
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
            <el-button link type="primary">发送</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Download, Upload, Refresh, Plus, Folder, Document, MoreFilled } from '@element-plus/icons-vue'

const filterText = ref('')
const searchQuery = ref('')

const categoryData = [
  { label: '一级', children: [{ label: '二级' }, { label: '二级' }] },
  { label: '一级', children: [{ label: '二级' }] },
]

const defaultProps = { children: 'children', label: 'label' }

const handleNodeClick = (data) => {
  console.log('选中分类:', data.label)
}
</script>

<style scoped>
.quick-message-container {
  display: flex;
  height: 100vh;
  background-color: #fff;
}

/* 左侧样式 */
.sidebar {
  width: 260px;
  border-right: 1px solid #e6e6e6;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title-line {
  border-left: 4px solid #d7000f;
  padding-left: 8px;
  font-weight: bold;
}

.header-icons .el-icon {
  margin-left: 8px;
  cursor: pointer;
  color: #909399;
}

.plus-icon { color: #d7000f !important; }

.search-input { margin-bottom: 16px; }

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.node-more { visibility: hidden; }
.custom-tree-node:hover .node-more { visibility: visible; }

/* 右侧样式 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.message-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
  position: relative;
}

.message-title {
  font-weight: bold;
  color: #333;
}

.item-body {
  color: #666;
  font-size: 13px;
  line-height: 1.8;
  margin-top: 8px;
}

.item-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mb-4 { margin-bottom: 16px; }
</style>
