<template>
  <div class="customer-detail-container">
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="客户资料" name="info" />
      <el-tab-pane label="快捷消息" name="message" />
      <el-tab-pane label="创建工单(张三)" name="order" closable />
    </el-tabs>

    <div class="content-body">
      <section class="info-section">
        <div class="section-header">
          <span class="title-line">客户信息</span>
          <div class="header-ops">
            <el-button link type="primary" :icon="Refresh">身份刷新</el-button>
            <el-button link type="danger" :icon="User">紧急联系人</el-button>
          </div>
        </div>
        
        <el-descriptions :column="3" border-style="none">
          <el-descriptions-item label="Alpna_id:">40025</el-descriptions-item>
          <el-descriptions-item label="客户姓名:">张三</el-descriptions-item>
          <el-descriptions-item label="客户性别:">女</el-descriptions-item>
          <el-descriptions-item label="VIP等级:">投诉历史</el-descriptions-item>
          <el-descriptions-item label="证件类型:">身份证</el-descriptions-item>
          <el-descriptions-item label="证件号码:">310110199901205566</el-descriptions-item>
        </el-descriptions>

        <div class="action-footer">
          <el-button type="primary" plain>身份核对</el-button>
          <el-button type="danger" plain>转接</el-button>
          <el-button type="danger" plain>转队列</el-button>
        </div>
      </section>

      <section class="reminder-section mt-4">
        <div class="section-header">
          <span class="title-line">客户提醒</span>
        </div>
        <div class="tag-group">
          <el-check-tag checked class="mr-2">待办提醒信息栏 (12)</el-check-tag>
          <el-check-tag :checked="false">重点关注信息栏 (123)</el-check-tag>
        </div>
        <div class="sub-tags mt-2">
          <span class="text-danger mr-4">待交保费</span>
          <span class="text-danger mr-4">客户信息异常</span>
          </div>
      </section>

      <section class="policy-section mt-4">
        <div class="section-header">
          <span class="title-line">保单列表</span>
        </div>
        <div class="filter-buttons mb-4">
          <el-radio-group v-model="policyFilter" size="small">
            <el-radio-button label="all">只有有效保质期</el-radio-button>
            <el-radio-button label="unpaid">只看未交费保单</el-radio-button>
          </el-radio-group>
        </div>
        
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="index" label="序号" width="60" />
          <el-table-column prop="id" label="保单号" sortable />
          <el-table-column prop="city" label="投保城市" />
          <el-table-column prop="name" label="保单名称" />
          <el-table-column prop="status" label="保单状态描述" />
        </el-table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, User } from '@element-plus/icons-vue'

const activeTab = ref('info')
const policyFilter = ref('all')

const tableData = ref([
  { index: 1, id: '11111111', city: '上海', name: '名称名称名称', status: '描述描述描述' },
  { index: 2, id: '11111111', city: '上海', name: '名称名称名称', status: '描述描述描述' },
  { index: 3, id: '11111111', city: '上海', name: '名称名称名称', status: '描述描述描述' },
])
</script>

<style scoped>
.customer-detail-container {
  padding: 16px;
  background-color: #f5f7fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.title-line {
  border-left: 4px solid #d7000f; /* 红色左边框 */
  padding-left: 10px;
  font-weight: bold;
}

.action-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.mt-4 { margin-top: 16px; }
.mr-4 { margin-right: 16px; }
.text-danger { color: #f56c6c; cursor: pointer; font-size: 14px; }
</style>
