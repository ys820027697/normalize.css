<template>
  <div class="crm-page">
    <el-container class="outer-container">

      <el-aside width="64px" class="ultra-side">
        <div class="avatar-box">
          <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <div class="status-dot"></div>
        </div>
        <div class="side-icons">
          <el-icon class="active"><ChatLineRound /></el-icon>
          <el-icon><Postcard /></el-icon>
          <el-icon><Operation /></el-icon>
        </div>
      </el-aside>

      <el-aside width="280px" class="session-aside">
        <div class="session-header">
          全部会话 (2/3) <el-icon><ArrowDown /></el-icon>
        </div>
        <el-scrollbar>
          <div v-for="i in 5" :key="i" class="session-card" :class="{ active: i === 1 }">
            <el-avatar :size="32" shape="square" class="user-head" />
            <div class="card-content">
              <div class="card-top">
                <span class="nick">张三</span>
                <span class="time">15:32</span>
              </div>
              <div class="card-bottom">
                <span class="preview">[图片]</span>
                <span class="status-text">待办中</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="monitor-info">
          <div class="monitor-title">监控信息</div>
          <div class="monitor-row"><span>队列</span><span>排队数量</span></div>
          <div class="monitor-item"><span>四川核保专家专属</span><span>0</span></div>
          <div class="monitor-item"><span>四川核保专家专属</span><span>0</span></div>
        </div>
      </el-aside>

      <el-container class="chat-container">
        <el-header class="chat-header" height="45px">
          <span class="current-user">张三</span>
          <span class="online-tag">● 在线</span>
          <div class="header-right">持续 23:59:12</div>
        </el-header>

        <el-main class="chat-main">
          <div class="msg-wrapper">
            <div class="time-divider">15:12:31</div>

            <div class="chat-item left">
              <el-avatar :size="32" />
              <div class="bubble">文案文案文案文案文案</div>
            </div>

            <div class="sys-tip">你已接受转接话务员 <span class="name">小发</span></div>

            <div class="chat-item right">
              <div class="bubble blue">
                为了维护您的权益，请<span class="link">点击此处</span>完成身份验证，谢谢！
              </div>
              <el-avatar :size="32" />
            </div>

            <div class="chat-item left">
              <el-avatar :size="32" />
              <div class="bubble-image">
                <img src="https://via.placeholder.com/200x120" alt="content" />
              </div>
            </div>
          </div>
        </el-main>

        <el-footer class="chat-footer" height="180px">
          <div class="tool-bar">
            <el-icon><Emoji /></el-icon>
            <el-icon><Picture /></el-icon>
            <el-icon><Scissor /></el-icon>
            <el-icon><FolderOpened /></el-icon>
            <el-icon><ChatDotSquare /></el-icon>
          </div>
          <el-input type="textarea" :rows="4" placeholder="请输入..." resize="none" class="no-border-input" />
          <div class="footer-btns">
            <el-button size="small" type="danger" plain>外呼</el-button>
            <el-button size="small" type="danger" plain>满意度评价推送</el-button>
            <el-button size="small" type="danger">结束会话</el-button>
            <el-button size="small" type="primary" class="send-btn">发送</el-button>
          </div>
        </el-footer>
      </el-container>

      <el-aside width="500px" class="right-panel">
        <el-tabs v-model="activeTab" class="biz-tabs">
          <el-tab-pane label="客户资料" name="1" />
          <el-tab-pane label="快捷消息" name="2" />
          <el-tab-pane label="创建工单(张三)" name="3">
            <div class="biz-section">
              <div class="biz-title">
                <span class="text">保单列表</span>
                <el-link type="primary" :underline="false" size="small">显示所有保单</el-link>
              </div>
              <el-table :data="tableData" border size="small" class="compact-table">
                <el-table-column type="selection" width="35" />
                <el-table-column prop="id" label="序号" width="50" />
                <el-table-column prop="org" label="机构名称" />
                <el-table-column prop="city" label="投保城市" width="80" />
                <el-table-column prop="no" label="保单号" />
                <el-table-column label="保单状态" width="80">
                  <template #default><span class="status-ok">● 正常</span></template>
                </el-table-column>
              </el-table>
            </div>

            <div class="biz-section mt-15">
              <div class="biz-title">
                <span class="text">工单号: TK202506230001</span>
                <div class="title-right">
                  <span>公司: 友邦保险</span>
                  <span>创建人: 张三</span>
                </div>
              </div>
              <el-form label-position="top" size="small" class="custom-form">
                <el-row :gutter="15">
                  <el-col :span="12">
                    <el-form-item label="客户姓名" required>
                      <el-input value="张三">
                        <template #suffix><span class="vip-tag">VIP</span></template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人姓名" required>
                      <el-input value="张三" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="12">
                    <el-form-item label="事件属性" required>
                      <el-select v-model="formValue" style="width:100%"><el-option label="一般" value="1" /></el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="工单来源" required>
                      <el-select placeholder="请选择" style="width:100%"></el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="业务分类" required>
                  <el-button type="danger" plain size="small">+ 添加分类</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>

    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChatLineRound, Postcard, Operation, ArrowDown,
  Picture, Scissor, FolderOpened, ChatDotSquare
} from '@element-plus/icons-vue'

const activeTab = ref('3')
const formValue = ref('1')
const tableData = Array(5).fill({ id: 1, org: '北京总经办', city: '北京', no: '0000000000' })
</script>

<style lang="scss" scoped>
/* 基础布局 */
.crm-page { height: 100vh; background: #fff; overflow: hidden; color: #333; }
.outer-container { height: 100%; }

/* 1. 极窄侧边栏 */
.ultra-side { background: #f8f9fb; border-right: 1px solid #e6e6e6; display: flex; flex-direction: column; align-items: center; padding: 15px 0; }
.avatar-box { position: relative; margin-bottom: 30px; }
.status-dot { width: 10px; height: 10px; background: #67c23a; border: 2px solid #fff; border-radius: 50%; position: absolute; bottom: 0; right: 0; }
.side-icons { display: flex; flex-direction: column; gap: 25px; color: #909399; font-size: 22px; cursor: pointer; }
.side-icons .active { color: #f56c6c; }

/* 2. 会话列表 */
.session-aside { border-right: 1px solid #e6e6e6; display: flex; flex-direction: column; }
.session-header { padding: 12px 15px; font-weight: bold; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
.session-card { padding: 12px 15px; display: flex; gap: 10px; border-bottom: 1px solid #f8f8f8; cursor: pointer; }
.session-card.active { background: #edf5ff; }
.card-content { flex: 1; }
.card-top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
.card-bottom { display: flex; justify-content: space-between; font-size: 12px; color: #999; }
.status-text { color: #f56c6c; }

.monitor-info { border-top: 1px solid #eee; padding: 10px; font-size: 12px; }
.monitor-title { font-weight: bold; margin-bottom: 8px; border-left: 3px solid #f56c6c; padding-left: 6px; }
.monitor-row { display: flex; justify-content: space-between; color: #999; padding: 4px 0; }
.monitor-item { display: flex; justify-content: space-between; padding: 4px 0; }

/* 3. 聊天区 */
.chat-container { background: #fff; }
.chat-header { border-bottom: 1px solid #eee; display: flex; align-items: center; padding: 0 15px; font-size: 14px; }
.online-tag { color: #67c23a; font-size: 12px; margin-left: 10px; }
.header-right { margin-left: auto; color: #999; font-size: 12px; }
.chat-main { background: #f4f5f7; padding: 15px; }
.time-divider { text-align: center; color: #bbb; font-size: 12px; margin: 10px 0; }
.chat-item { display: flex; gap: 10px; margin-bottom: 20px; }
.chat-item.right { justify-content: flex-end; }
.bubble { padding: 8px 12px; border-radius: 4px; background: #fff; max-width: 70%; font-size: 13px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.bubble.blue { background: #eef7ff; color: #409eff; }
.bubble-image img { border-radius: 4px; border: 1px solid #ddd; }
.sys-tip { text-align: center; font-size: 12px; color: #999; margin: 15px 0; }
.sys-tip .name { color: #f56c6c; }

.chat-footer { border-top: 1px solid #eee; padding: 10px; display: flex; flex-direction: column; }
.tool-bar { display: flex; gap: 15px; font-size: 18px; color: #666; margin-bottom: 8px; }
.footer-btns { display: flex; gap: 10px; justify-content: flex-start; margin-top: auto; }
.send-btn { margin-left: auto !important; }

/* 4. 右侧面板 */
.right-panel { border-left: 1px solid #e6e6e6; padding: 0 15px; }
.biz-section { margin-top: 15px; }
.biz-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-left: 3px solid #f56c6c; padding-left: 8px; }
.biz-title .text { font-weight: bold; font-size: 14px; }
.title-right { font-size: 12px; color: #666; display: flex; gap: 10px; }
.status-ok { color: #67c23a; }
.vip-tag { background: #e6a23c; color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 2px; }

/* Element Plus 重写 */
:deep(.el-tabs__item) { font-size: 13px; height: 40px; }
:deep(.el-form-item__label) { padding-bottom: 4px !important; font-size: 12px; color: #666; }
:deep(.el-input__inner) { font-size: 12px; }
:deep(.no-border-input .el-textarea__inner) { border: none; box-shadow: none; padding: 0; }
.mt-15 { margin-top: 15px; }
</style>
