<template>
  <div class="quick-msg-page">
    <div class="sub-tabs">
      <div 
        v-for="tab in ['公共消息', '个人消息']" 
        :key="tab"
        :class="['sub-tab-item', activeSubTab === tab ? 'is-active' : '']"
        @click="activeSubTab = tab"
      >
        {{ tab }}
      </div>
    </div>

    <div class="main-container">
      <aside class="left-aside">
        <div class="aside-header">
          <span class="vertical-line">快捷消息分类</span>
          <div class="icon-ops">
            <el-tooltip content="导入"><el-icon><Download /></el-icon></el-tooltip>
            <el-tooltip content="导出"><el-icon><Upload /></el-icon></el-tooltip>
            <el-icon><Refresh /></el-icon>
            <el-icon class="text-red"><Plus /></el-icon>
          </div>
        </div>
        
        <div class="tree-search">
          <el-input v-model="filterText" placeholder="请输入分类的描述">
            <template #append><span class="search-btn">搜索</span></template>
          </el-input>
        </div>

        <el-tree
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          highlight-current
          class="custom-tree"
        >
          <template #default="{ node, data }">
            <div class="tree-node-content">
              <span class="node-label">
                <el-icon v-if="data.children"><FolderOpened /></el-icon>
                <el-icon v-else class="text-red"><Document /></el-icon>
                {{ node.label }}
              </span>
              <el-dropdown trigger="hover" class="node-more">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>新增下级分类</el-dropdown-item>
                    <el-dropdown-item>编辑</el-dropdown-item>
                    <el-dropdown-item class="text-red">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </aside>

      <main class="right-main">
        <div class="warning-bar">
          <el-icon><WarningFilled /></el-icon>
          未选择分类！请在左侧选择具体所需新增快捷消息分类后进行操作
        </div>

        <div class="filter-bar">
          <el-input v-model="searchMsg" placeholder="搜索消息标题或内容" style="width: 45%" />
          <div class="btn-groups">
            <el-button>重置</el-button>
            <el-button type="danger" class="btn-solid-red">查询</el-button>
            <el-button type="danger" plain @click="handleAdd">新增消息</el-button>
          </div>
        </div>

        <div class="msg-list">
          <div v-for="i in 4" :key="i" class="msg-card">
            <div class="msg-header">
              <span class="msg-title">消息标题消息标题消息标题 (12345)</span>
            </div>
            <div class="msg-body">
              <p>1. 消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容...</p>
              <p>2. 消息内容消息内容消息内容消息内容消息内容内容内容。</p>
              
              <div v-if="i === 3" class="img-preview-box">
                <div class="img-wrapper">
                  <el-image 
                    src="https://via.placeholder.com/150" 
                    :preview-src-list="['https://via.placeholder.com/800']"
                    fit="cover"
                  />
                  <div class="img-mask">
                    <el-icon><Search /></el-icon>
                    <span>鼠标放到图片上面显示放大镜</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-footer">
              <el-button link type="primary">编辑</el-button>
              <el-button link type="danger">删除</el-button>
              <el-button link type="primary">发送</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <QuickMessageDialog v-model="showAddDialog" :categoryName="selectedCategory" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Download, Upload, Refresh, Plus, FolderOpened, 
  Document, MoreFilled, WarningFilled, Search 
} from '@element-plus/icons-vue'

const activeSubTab = ref('公共消息')
const filterText = ref('')
const searchMsg = ref('')
const showAddDialog = ref(false)
const selectedCategory = ref('二级分类')

const treeData = [
  { label: '一级', children: [{ label: '二级' }, { label: '二级' }] },
  { label: '一级', children: [{ label: '二级' }, { label: '二级' }] },
  { label: '一级' }
]
const defaultProps = { children: 'children', label: 'label' }

const handleAdd = () => { showAddDialog.value = true }
</script>

<style scoped>
/* 整体页面背景 */
.quick-msg-page {
  background-color: #f5f7fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 1. 顶部二级 Tab 样式 */
.sub-tabs {
  background: #fff;
  display: flex;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}
.sub-tab-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  position: relative;
}
.sub-tab-item.is-active {
  color: #d7000f;
  font-weight: bold;
}
.sub-tab-item.is-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 2px;
  background: #d7000f;
}

/* 布局控制 */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 12px;
  gap: 12px;
}

/* 2. 左侧分类树样式 */
.left-aside {
  width: 280px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.aside-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.vertical-line {
  border-left: 4px solid #d7000f;
  padding-left: 8px;
  font-weight: bold;
  font-size: 14px;
}
.icon-ops .el-icon {
  margin-left: 10px;
  cursor: pointer;
  color: #909399;
}
.text-red { color: #d7000f !important; }

.tree-search :deep(.el-input-group__append) {
  background-color: #fff;
  color: #d7000f;
  cursor: pointer;
}

.custom-tree { margin-top: 15px; }
.tree-node-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.node-more { visibility: hidden; }
.tree-node-content:hover .node-more { visibility: visible; }

/* 3. 右侧内容样式 */
.right-main {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  overflow-y: auto;
}

.warning-bar {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.btn-solid-red { background-color: #d7000f; border-color: #d7000f; }

.msg-card {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}
.msg-title { font-weight: bold; font-size: 15px; color: #333; }
.msg-body { color: #666; font-size: 14px; line-height: 1.6; margin: 10px 0; }

/* 图片悬浮放大镜效果 */
.img-wrapper {
  position: relative;
  width: fit-content;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}
.img-mask {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  font-size: 12px;
}
.img-wrapper:hover .img-mask { opacity: 1; }

.msg-footer {
  text-align: right;
  margin-top: -10px;
}
</style>
