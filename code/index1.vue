<template>
  <div class="crm-app">
    <nav class="side-dock">
      <div class="user-avatar">
        <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        <span class="online-status"></span>
      </div>
      <div class="menu-icons">
        <div class="icon-item active"><el-icon><ChatDotSquare /></el-icon></div>
        <div class="icon-item"><el-icon><User /></el-icon></div>
        <div class="icon-item"><el-icon><Setting /></el-icon></div>
      </div>
    </nav>

    <div class="main-content">
      <aside class="chat-list-panel">
        <div class="panel-header">全部会话 (2/3) <el-icon><ArrowDown /></el-icon></div>
        <div class="session-list">
          <div v-for="i in 4" :key="i" class="session-card" :class="{ active: i === 1 }">
            <el-avatar shape="square" :size="32" />
            <div class="card-info">
              <div class="top">
                <span class="name">张三</span>
                <span class="time">15:32</span>
              </div>
              <div class="bottom">
                <span class="msg-preview">[图片]</span>
                <span class="status">待办中</span>
              </div>
            </div>
          </div>
        </div>
        <div class="monitor-info">
          <div class="monitor-header">监控信息</div>
          <el-table :data="monitorData" size="small" class="monitor-table">
            <el-table-column prop="group" label="队列" />
            <el-table-column prop="count" label="排队数量" width="80" align="center" />
          </el-table>
        </div>
      </aside>

      <section class="chat-window">
        <header class="window-header">
          <span class="title">张三</span>
          <div class="time-track">
             <span class="dot"></span> 持续 23:59:12
          </div>
        </header>

        <main class="message-scroller">
          <div class="msg-group">
            <div class="timestamp">15:12:31</div>
            <div class="msg-row left">
              <el-avatar :size="32" />
              <div class="bubble">文案文案文案文案文案</div>
            </div>
            <div class="sys-notification">你已接受转接话务员 <span class="highlight">小发</span></div>
            <div class="msg-row right">
              <div class="bubble blue">
                为了维护您的权益，请<span class="link">点击此处</span>完成身份验证，谢谢！
              </div>
              <el-avatar :size="32" />
            </div>
            <div class="msg-row left">
              <el-avatar :size="32" />
              <div class="image-content">
                 <img src="https://via.placeholder.com/200x120" />
              </div>
            </div>
          </div>
        </main>

        <footer class="chat-input-area">
          <div class="toolbar">
            <el-icon><IceTea /></el-icon><el-icon><Picture /></el-icon><el-icon><Scissor /></el-icon>
          </div>
          <el-input type="textarea" :rows="3" placeholder="请输入..." resize="none" />
          <div class="action-footer">
            <div class="left-btns">
              <el-button size="small" type="danger" plain>外呼</el-button>
              <el-button size="small" type="danger" plain>满意度评价推送</el-button>
              <el-button size="small" type="danger" plain>结束会话</el-button>
            </div>
            <el-button type="primary" size="small">发送</el-button>
          </div>
        </footer>
      </section>

      <aside class="business-panel">
        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane label="客户资料" name="1" />
          <el-tab-pane label="快捷消息" name="2" />
          <el-tab-pane label="创建工单(张三)" name="3">
            <div class="biz-container">
              <div class="sub-section">
                <div class="sub-header">
                  <span class="marker"></span>保单列表
                  <el-link type="primary" :underline="false">显示所有保单</el-link>
                </div>
                <el-table :data="policyData" border size="small" class="policy-table">
                  <el-table-column type="selection" width="40" />
                  <el-table-column prop="idx" label="序号" width="50" />
                  <el-table-column prop="org" label="机构名称" />
                  <el-table-column prop="city" label="投保城市" width="70" />
                  <el-table-column prop="no" label="保单号" />
                  <el-table-column label="保单状态" width="80">
                    <template #default><span class="status-tag">● 正常</span></template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="sub-section">
                <div class="sub-header">
                  <span class="marker"></span>工单号: TK202506230001
                  <div class="header-meta">公司: 友邦保险 | 创建部门: 消保与服务管理部</div>
                </div>
                <el-form label-position="top" size="small" class="order-form">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="客户姓名">
                        <el-input value="张三"><template #suffix><span class="v-tag">VIP</span></template></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="*联系人" required>
                        <el-input value="张三" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系人类型">
                        <el-select placeholder="请选择" style="width:100%" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系人电话">
                        <el-input placeholder="--" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="*业务分类" required>
                    <el-button type="danger" plain size="small" class="add-btn">+ 添加分类</el-button>
                  </el-form-item>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatDotSquare, User, Setting, ArrowDown, IceTea, Picture, Scissor } from '@element-plus/icons-vue'

const activeTab = ref('3')
const monitorData = Array(3).fill({ group: '四川核保专家专属', count: 0 })
const policyData = Array(5).fill({ idx: 1, org: '北京总经办', city: '北京', no: '0000000000' })
</script>

<style lang="scss" scoped>
// 精确变量定义
$primary-red: #d32f2f;
$bg-light: #f4f6f8;
$border-color: #e0e0e0;
$text-main: #333;
$text-secondary: #999;

.crm-app {
  display: flex;
  height: 100vh;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: $text-main;

  // 1. 侧边极窄导航
  .side-dock {
    width: 60px;
    background: #f8f9fb;
    border-right: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;

    .user-avatar {
      position: relative;
      margin-bottom: 30px;
      .online-status {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 10px;
        height: 10px;
        background: #4caf50;
        border: 2px solid #fff;
        border-radius: 50%;
      }
    }

    .menu-icons {
      .icon-item {
        font-size: 24px;
        color: #b0b3b8;
        margin-bottom: 25px;
        cursor: pointer;
        &.active { color: $primary-red; }
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  // 2. 会话列表
  .chat-list-panel {
    width: 260px;
    border-right: 1px solid $border-color;
    display: flex;
    flex-direction: column;

    .panel-header {
      padding: 12px 15px;
      font-weight: bold;
      border-bottom: 1px solid #f0f0f0;
    }

    .session-list {
      flex: 1;
      .session-card {
        padding: 12px 15px;
        display: flex;
        gap: 10px;
        border-bottom: 1px solid #f9f9f9;
        cursor: pointer;
        &.active { background: #edf5ff; }

        .card-info {
          flex: 1;
          .top {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 4px;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            .msg-preview { color: #666; }
            .status { color: $primary-red; }
          }
        }
      }
    }

    .monitor-info {
      border-top: 1px solid $border-color;
      padding: 10px;
      .monitor-header {
        font-weight: bold;
        font-size: 12px;
        border-left: 3px solid $primary-red;
        padding-left: 8px;
        margin-bottom: 8px;
      }
    }
  }

  // 3. 聊天窗
  .chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;

    .window-header {
      height: 45px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      .title { font-weight: bold; }
      .time-track {
        font-size: 12px;
        color: #999;
        display: flex;
        align-items: center;
        gap: 5px;
        .dot { width: 8px; height: 8px; background: #4caf50; border-radius: 50%; }
      }
    }

    .message-scroller {
      flex: 1;
      background: $bg-light;
      padding: 20px;
      overflow-y: auto;

      .timestamp { text-align: center; color: #ccc; font-size: 12px; margin: 10px 0; }

      .msg-row {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        &.right { justify-content: flex-end; }

        .bubble {
          max-width: 70%;
          padding: 8px 12px;
          background: #fff;
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.6;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          &.blue { background: #e3f2fd; color: #1976d2; .link { color: $primary-red; text-decoration: underline; cursor: pointer; } }
        }
        .image-content img { border-radius: 4px; border: 1px solid #ddd; }
      }

      .sys-notification {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin: 15px 0;
        .highlight { color: $primary-red; }
      }
    }

    .chat-input-area {
      height: 160px;
      border-top: 1px solid #eee;
      padding: 10px 15px;
      .toolbar { font-size: 18px; color: #666; margin-bottom: 5px; display: flex; gap: 15px; }

      :deep(.el-textarea__inner) {
        border: none;
        box-shadow: none;
        padding: 5px 0;
      }

      .action-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        .left-btns { display: flex; gap: 8px; }
      }
    }
  }

  // 4. 右侧业务面板
  .business-panel {
    width: 520px;
    border-left: 1px solid $border-color;
    padding: 0 15px;

    .biz-container {
      margin-top: 10px;
      .sub-section {
        margin-bottom: 20px;
        .sub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 10px;
          .marker { width: 3px; height: 14px; background: $primary-red; margin-right: 8px; }
          .header-meta { font-weight: normal; font-size: 12px; color: #666; }
        }
      }
    }

    .status-tag { color: #4caf50; font-size: 12px; }
    .v-tag { background: #ff9800; color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 2px; }
    .add-btn { color: $primary-red; border-color: $primary-red; }
  }
}

// 全局覆盖 Element Plus 样式以实现高还原度
:deep(.el-tabs__header) { margin-bottom: 0; }
:deep(.el-form-item) { margin-bottom: 8px; }
:deep(.el-form-item__label) {
  font-size: 12px;
  padding: 0 !important;
  line-height: 20px;
  color: #666;
}
</style>
