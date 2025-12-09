<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div class="queryWrap regular_shadow_tiling">
      <el-form :model="queryParams" label-position="top" @submit.prevent>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
            <el-form-item label="机构">
              <el-select
                v-model="queryParams.organization"
                placeholder="请选择机构"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in organizationList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
            <el-form-item label="部门">
              <el-select
                v-model="queryParams.department"
                placeholder="请选择部门"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
            <el-form-item label="团队">
              <el-select
                v-model="queryParams.team"
                placeholder="请选择团队"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in teamList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 选项卡切换 -->
    <div class="tabsWrap regular_shadow_tiling">
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="当前情况" name="current" />
        <el-tab-pane label="当日累计" name="daily" />
      </el-tabs>
    </div>

    <!-- 数据展示区域 -->
    <div class="dataWrap">
      <!-- 当前情况选项卡 -->
      <template v-if="activeTab === 'current'">
        <!-- 团队指标 -->
        <div class="table-card regular_shadow_tiling">
          <div class="table-header">
            <h3>团队指标</h3>
          </div>
          <el-table
            :data="currentTeamData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="team" label="团队" min-width="200" show-overflow-tooltip />
            <el-table-column prop="queueCount" label="排队人数" width="120" align="center" />
            <el-table-column prop="manualSessions" label="人工会话数" width="120" align="center" />
            <el-table-column prop="onlineAgents" label="在线坐席数" width="120" align="center" />
          </el-table>
        </div>

        <!-- 队列指标 -->
        <div class="table-card regular_shadow_tiling">
          <div class="table-header">
            <h3>队列指标</h3>
          </div>
          <el-table
            :data="currentQueueData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="queue" label="队列" min-width="150" show-overflow-tooltip />
            <el-table-column prop="queueCount" label="排队人数" width="120" align="center" />
            <el-table-column prop="longestWaitTime" label="排队最长等待时长" width="180" align="center" />
          </el-table>
        </div>

        <!-- 坐席指标 -->
        <div class="table-card regular_shadow_tiling">
          <div class="table-header">
            <h3>坐席指标</h3>
          </div>
          <el-table
            :data="currentAgentData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="姓名" width="100" align="center" />
            <el-table-column prop="ntAccount" label="NT账号" width="150" align="center" />
            <el-table-column prop="status" label="当前状态" width="120" align="center">
              <template #default="scope">
                <div class="status-cell">
                  <span :class="['status-dot', getStatusClass(scope.row.status)]" />
                  <span>{{ scope.row.status }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="statusDuration" label="当前状态持续时长" width="180" align="center" />
            <el-table-column prop="serviceTeam" label="当前服务团队" min-width="200" show-overflow-tooltip />
            <el-table-column prop="customerCount" label="对话中客户数" width="130" align="center" />
            <el-table-column prop="belongingQueue" label="所属队列" width="120" align="center" />
          </el-table>
        </div>
      </template>

      <!-- 当日累计选项卡 -->
      <template v-if="activeTab === 'daily'">
        <!-- 团队指标 -->
        <div class="table-card regular_shadow_tiling">
          <div class="table-header">
            <h3>团队指标</h3>
          </div>
          <el-table
            :data="dailyTeamData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="team" label="团队" min-width="200" show-overflow-tooltip />
            <el-table-column prop="manualTransferCount" label="转人工量" width="120" align="center" />
            <el-table-column prop="manualTransferRate" label="转人工率" width="120" align="center" />
            <el-table-column prop="manualServiceCount" label="人工服务量" width="120" align="center" />
            <el-table-column prop="manualServiceRate" label="人工服务率" width="120" align="center" />
          </el-table>
        </div>

        <!-- 服务来源指标和队列指标并排 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <div class="table-card regular_shadow_tiling">
              <div class="table-header">
                <h3>服务来源指标</h3>
              </div>
              <el-table
                :data="serviceSourceData"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="source" label="服务来源" min-width="150" show-overflow-tooltip />
                <el-table-column prop="consultationCount" label="咨询量" width="120" align="center" />
              </el-table>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="table-card regular_shadow_tiling">
              <div class="table-header">
                <h3>队列指标</h3>
              </div>
              <el-table
                :data="dailyQueueData"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="queue" label="队列" min-width="120" show-overflow-tooltip />
                <el-table-column prop="manualTransferCount" label="转人工量" width="120" align="center" />
                <el-table-column prop="manualServiceCount" label="人工服务量" width="120" align="center" />
                <el-table-column prop="manualServiceRate" label="人工服务率" width="120" align="center" />
              </el-table>
            </div>
          </el-col>
        </el-row>

        <!-- 坐席指标 -->
        <div class="table-card regular_shadow_tiling">
          <div class="table-header">
            <h3>坐席指标</h3>
          </div>
          <el-table
            :data="dailyAgentData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="姓名" width="100" align="center" sortable />
            <el-table-column prop="ntAccount" label="NT账号" width="150" align="center" sortable />
            <el-table-column prop="serviceCount" label="坐席服务量" width="120" align="center" sortable />
            <el-table-column prop="transferOutCount" label="坐席转出量" width="120" align="center" sortable />
            <el-table-column prop="transferOutRate" label="坐席转出率" width="120" align="center" sortable />
            <el-table-column prop="avgServiceDuration" label="平均人工服务时长" width="180" align="center" sortable />
            <el-table-column prop="unsatisfiedCount" label="不满意评价量" width="140" align="center" sortable />
          </el-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 查询参数
const queryParams = reactive({
  organization: '',
  department: '',
  team: ''
})

// 选项卡
const activeTab = ref('current')

// 机构列表假数据
const organizationList = ref([
  { label: '总部', value: 'org1' },
  { label: '北京分公司', value: 'org2' },
  { label: '上海分公司', value: 'org3' },
  { label: '广州分公司', value: 'org4' },
  { label: '深圳分公司', value: 'org5' }
])

// 部门列表假数据
const departmentList = ref([
  { label: '客服部', value: 'dept1' },
  { label: '销售部', value: 'dept2' },
  { label: '技术支持部', value: 'dept3' },
  { label: '运营部', value: 'dept4' },
  { label: '市场部', value: 'dept5' }
])

// 团队列表假数据
const teamList = ref([
  { label: 'VIP服务团队/一线团队/客服一组', value: 'team1' },
  { label: '普通服务团队/二线团队/客服二组', value: 'team2' },
  { label: '技术支持团队/技术组/技术一组', value: 'team3' },
  { label: '销售团队/销售组/销售一组', value: 'team4' },
  { label: '运营团队/运营组/运营一组', value: 'team5' }
])

// 格式化时长为 "00时12分20秒" 格式
const formatDuration = (seconds) => {
  if (!seconds) return '00时00分00秒'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}时${String(minutes).padStart(2, '0')}分${String(secs).padStart(2, '0')}秒`
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    离线: 'status-offline',
    忙碌: 'status-busy',
    支援: 'status-support',
    在线: 'status-online'
  }
  return statusMap[status] || 'status-offline'
}

// 当前情况 - 团队指标数据
const currentTeamData = ref([
  { team: 'VIP服务团队/一线团队/客服一组', queueCount: 0, manualSessions: 7, onlineAgents: 32 },
  { team: '普通服务团队/二线团队/客服二组', queueCount: 3, manualSessions: 15, onlineAgents: 28 },
  { team: '技术支持团队/技术组/技术一组', queueCount: 1, manualSessions: 5, onlineAgents: 12 },
  { team: '销售团队/销售组/销售一组', queueCount: 2, manualSessions: 10, onlineAgents: 20 },
  { team: '运营团队/运营组/运营一组', queueCount: 0, manualSessions: 8, onlineAgents: 18 }
])

// 当前情况 - 队列指标数据
const currentQueueData = ref([
  { queue: 'VIP队列', queueCount: 5, longestWaitTime: formatDuration(740) },
  { queue: '普通队列', queueCount: 12, longestWaitTime: formatDuration(1520) },
  { queue: '匿名队列', queueCount: 3, longestWaitTime: formatDuration(890) },
  { queue: '售前队列', queueCount: 8, longestWaitTime: formatDuration(1120) },
  { queue: '投诉队列', queueCount: 2, longestWaitTime: formatDuration(2340) }
])

// 当前情况 - 坐席指标数据
const currentAgentData = ref([
  {
    name: '张三',
    ntAccount: 'NCSC094_1',
    status: '离线',
    statusDuration: formatDuration(1289),
    serviceTeam: 'VIP服务团队/一线团队',
    customerCount: 0,
    belongingQueue: 'VIP/普通'
  },
  {
    name: '李四',
    ntAccount: 'NCSC094_2',
    status: '忙碌',
    statusDuration: formatDuration(2340),
    serviceTeam: '普通服务团队/二线团队',
    customerCount: 5,
    belongingQueue: '普通'
  },
  {
    name: '王五',
    ntAccount: 'NCSC094_3',
    status: '支援',
    statusDuration: formatDuration(890),
    serviceTeam: '技术支持团队/技术组',
    customerCount: 2,
    belongingQueue: 'VIP'
  },
  {
    name: '赵六',
    ntAccount: 'NCSC094_4',
    status: '在线',
    statusDuration: formatDuration(1560),
    serviceTeam: '销售团队/销售组',
    customerCount: 1,
    belongingQueue: '普通/VIP'
  },
  {
    name: '钱七',
    ntAccount: 'NCSC094_5',
    status: '在线',
    statusDuration: formatDuration(2100),
    serviceTeam: '运营团队/运营组',
    customerCount: 3,
    belongingQueue: '普通'
  }
])

// 当日累计 - 团队指标数据
const dailyTeamData = ref([
  { team: 'VIP服务团队/一线团队/客服一组', manualTransferCount: 512, manualTransferRate: '14.1%', manualServiceCount: 512, manualServiceRate: '100.00%' },
  { team: '普通服务团队/二线团队/客服二组', manualTransferCount: 856, manualTransferRate: '18.5%', manualServiceCount: 856, manualServiceRate: '100.00%' },
  { team: '技术支持团队/技术组/技术一组', manualTransferCount: 234, manualTransferRate: '12.3%', manualServiceCount: 234, manualServiceRate: '100.00%' },
  { team: '销售团队/销售组/销售一组', manualTransferCount: 678, manualTransferRate: '16.8%', manualServiceCount: 678, manualServiceRate: '100.00%' },
  { team: '运营团队/运营组/运营一组', manualTransferCount: 445, manualTransferRate: '15.2%', manualServiceCount: 445, manualServiceRate: '100.00%' }
])

// 当日累计 - 服务来源指标数据
const serviceSourceData = ref([
  { source: '官微', consultationCount: 97 },
  { source: '官网网销', consultationCount: 68 },
  { source: '互联网第三方-其他', consultationCount: 5 },
  { source: '爱健康', consultationCount: 13 },
  { source: '友邦友享', consultationCount: 3216 }
])

// 当日累计 - 队列指标数据
const dailyQueueData = ref([
  { queue: 'VIP', manualTransferCount: 67, manualServiceCount: 67, manualServiceRate: '100.00%' },
  { queue: '匿名', manualTransferCount: 9, manualServiceCount: 9, manualServiceRate: '100.00%' },
  { queue: '普通', manualTransferCount: 416, manualServiceCount: 416, manualServiceRate: '100.00%' },
  { queue: '售前', manualTransferCount: 11, manualServiceCount: 11, manualServiceRate: '100.00%' },
  { queue: '投诉', manualTransferCount: 4, manualServiceCount: 4, manualServiceRate: '100.00%' },
  { queue: '退保', manualTransferCount: 5, manualServiceCount: 5, manualServiceRate: '100.00%' }
])

// 当日累计 - 坐席指标数据
const dailyAgentData = ref([
  { name: '张三', ntAccount: 'NCSC094_1', serviceCount: 27, transferOutCount: 0, transferOutRate: '0.00%', avgServiceDuration: formatDuration(1289), unsatisfiedCount: 0 },
  { name: '李四', ntAccount: 'NCSC094_2', serviceCount: 45, transferOutCount: 2, transferOutRate: '4.44%', avgServiceDuration: formatDuration(2340), unsatisfiedCount: 1 },
  { name: '王五', ntAccount: 'NCSC094_3', serviceCount: 32, transferOutCount: 1, transferOutRate: '3.13%', avgServiceDuration: formatDuration(890), unsatisfiedCount: 0 },
  { name: '赵六', ntAccount: 'NCSC094_4', serviceCount: 38, transferOutCount: 0, transferOutRate: '0.00%', avgServiceDuration: formatDuration(1560), unsatisfiedCount: 2 },
  { name: '钱七', ntAccount: 'NCSC094_5', serviceCount: 52, transferOutCount: 3, transferOutRate: '5.77%', avgServiceDuration: formatDuration(2100), unsatisfiedCount: 1 }
])

// 选项卡切换处理
const handleTabChange = (tabName) => {
  console.log('切换到:', tabName)
  // 这里可以添加数据刷新逻辑
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.queryWrap {
  margin-bottom: 20px;
  padding: 20px;
}

.tabsWrap {
  margin-bottom: 20px;
  padding: 10px 20px;
}

.dataWrap {
  .table-card {
    margin-bottom: 20px;
    padding: 20px;

    .table-header {
      margin-bottom: 15px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #343741;
      }
    }
  }
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.status-offline {
    background-color: #909399;
  }

  &.status-busy {
    background-color: #F56C6C;
  }

  &.status-support {
    background-color: #409EFF;
  }

  &.status-online {
    background-color: #67C23A;
  }
}

:deep(.el-tabs) {
  .el-tabs__item {
    font-size: 16px;

    &.is-active {
      color: #F56C6C;
      font-weight: 600;
    }
  }

  .el-tabs__active-bar {
    background-color: #F56C6C;
  }
}
</style>
