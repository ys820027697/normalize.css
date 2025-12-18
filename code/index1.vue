<template>
  <div class="crm-wrapper">
    <el-container class="h-full">
      <el-aside width="60px" class="dock-aside">
        <div class="avatar-wrap">
          <el-avatar :size="36" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <i class="status-online"></i>
        </div>
        <div class="dock-menu">
          <el-icon class="is-active"><ChatDotSquare /></el-icon>
          <el-icon><User /></el-icon>
          <el-icon><Monitor /></el-icon>
        </div>
      </el-aside>

      <el-aside width="240px" class="session-aside">
        <div class="header">全部会话 (2/3) <el-icon><ArrowDown /></el-icon></div>
        <div class="list-container">
          <div v-for="i in 5" :key="i" class="user-card" :class="{ 'is-active': i === 1 }">
            <el-avatar shape="square" :size="32" />
            <div class="meta">
              <div class="row"><strong>张三</strong><span class="time">15:32</span></div>
              <div class="row"><span class="preview">[图片]</span><span class="tag">待办中</span></div>
            </div>
          </div>
        </div>
        <div class="monitor-panel">
          <div class="title">监控信息</div>
          <div class="mon-row head"><span>队列</span><span>排队数量</span></div>
          <div v-for="j in 3" :key="j" class="mon-row">
            <span>四川核保专家专属</span><span>0</span>
          </div>
        </div>
      </el-aside>

      <el-container class="chat-main">
        <el-header height="40px" class="chat-header">
          <span class="name">张三</span>
          <span class="status-dot">● 持续 23:59:12</span>
        </el-header>
        
        <el-main class="message-view">
          <div class="msg-box">
            <div class="msg-time">15:12:31</div>
            <div class="msg-item left">
              <el-avatar :size="32" />
              <div class="bubble">文案文案文案文案文案</div>
            </div>
            <div class="sys-info">你已接受转接话务员 <span>小发</span></div>
            <div class="msg-item right">
              <div class="bubble blue">为了维护您的权益，请<a href="#">点击此处</a>完成身份验证，谢谢！</div>
              <el-avatar :size="32" />
            </div>
          </div>
        </el-main>

        <el-footer height="160px" class="input-area">
          <div class="tools">
            <el-icon><Picture /></el-icon><el-icon><Scissor /></el-icon><el-icon><FolderOpened /></el-icon>
          </div>
          <el-input type="textarea" :rows="3" placeholder="请输入..." resize="none" border="none" />
          <div class="btns">
            <el-button size="small" type="danger" plain>外呼</el-button>
            <el-button size="small" type="danger" plain>满意度评价</el-button>
            <el-button size="small" type="primary">发送</el-button>
          </div>
        </el-footer>
      </el-container>

      <el-aside width="480px" class="biz-aside">
        <el-tabs v-model="activeTab" class="full-tabs">
          <el-tab-pane label="客户资料" name="1" />
          <el-tab-pane label="快捷消息" name="2" />
          <el-tab-pane label="创建工单(张三)" name="3">
            <div class="biz-scroll-area">
              <div class="biz-card">
                <div class="card-head">
                  <span class="title-text">保单列表</span>
                  <el-link type="primary" :underline="false">显示所有保单</el-link>
                </div>
                <el-table :data="tableData" border size="small" class="mini-table">
                  <el-table-column type="selection" width="35" />
                  <el-table-column prop="id" label="序号" width="45" />
                  <el-table-column prop="org" label="机构名称" width="100" />
                  <el-table-column prop="city" label="投保城市" width="70" />
                  <el-table-column prop="no" label="保单号" />
                  <el-table-column label="状态" width="60">
                    <template #default><span class="c-green">●正常</span></template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="biz-card mt-10">
                <div class="card-head">
                  <span class="title-text">工单号: TK202506230001</span>
                </div>
                <div class="info-bar">公司: 友邦保险 | 部门: 消保部 | 创建人: 张三</div>
                
                <el-form label-position="top" size="small" class="compact-form">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="客户姓名">
                        <el-input value="张三"><template #suffix><b class="vip">VIP</b></template></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="* 联系人" required><el-input value="张三" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系人类型"><el-select style="width:100%" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="* 事件属性" required>
                        <el-select value="一般" style="width:100%" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="* 业务分类" required>
                    <el-button type="danger" plain size="small" class="btn-add">+ 添加分类</el-button>
                    <el-table :data="[{}]" size="small" border class="mt-5">
                       <el-table-column label="序号" width="50" type="index" />
                       <el-table-column label="业务大类"><template #default><el-select placeholder="请选择" /></template></el-table-column>
                       <el-table-column label="操作" width="60"><template #default><el-link type="danger">删除</el-link></template></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatDotSquare, User, Monitor, ArrowDown, Picture, Scissor, FolderOpened } from '@element-plus/icons-vue'
const activeTab = ref('3')
const tableData = Array(5).fill({ id: 1, org: '北京总经办', city: '北京', no: '00000000' })
</script>

<style lang="scss" scoped>
$red: #c62828;
$border: #e4e7ed;

.crm-wrapper {
  height: 100vh;
  background: #fff;
  overflow: hidden;

  .h-full { height: 100%; }

  // 1. 侧边栏
  .dock-aside {
    background: #f5f7f9;
    border-right: 1px solid $border;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    .avatar-wrap {
      position: relative; margin-bottom: 30px;
      .status-online { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #52c41a; border: 2px solid #fff; border-radius: 50%; }
    }
    .dock-menu {
      display: flex; flex-direction: column; gap: 25px; font-size: 22px; color: #909399;
      .is-active { color: $red; }
    }
  }

  // 2. 会话列表
  .session-aside {
    border-right: 1px solid $border;
    display: flex;
    flex-direction: column;
    .header { padding: 12px; font-weight: bold; font-size: 13px; border-bottom: 1px solid #f2f2f2; }
    .list-container { flex: 1; overflow-y: auto; }
    .user-card {
      display: flex; padding: 10px 12px; gap: 10px; border-bottom: 1px solid #fafafa; cursor: pointer;
      &.is-active { background: #f0f7ff; }
      .meta {
        flex: 1;
        .row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px; }
        .preview { color: #999; }
        .tag { color: $red; font-size: 11px; }
      }
    }
    .monitor-panel {
      border-top: 1px solid $border; padding: 10px; font-size: 11px;
      .title { border-left: 3px solid $red; padding-left: 5px; font-weight: bold; margin-bottom: 5px; }
      .mon-row { display: flex; justify-content: space-between; padding: 3px 0; &.head { color: #999; } }
    }
  }

  // 3. 聊天区
  .chat-main {
    background: #f9fbff;
    .chat-header { border-bottom: 1px solid $border; background: #fff; display: flex; align-items: center; .status-dot { color: #52c41a; font-size: 12px; margin-left: 10px; } }
    .message-view { 
      padding: 15px;
      .msg-time { text-align: center; color: #ccc; font-size: 12px; margin-bottom: 15px; }
      .msg-item { display: flex; gap: 8px; margin-bottom: 15px; }
      .msg-item.right { justify-content: flex-end; }
      .bubble { max-width: 70%; padding: 8px 12px; background: #fff; border-radius: 4px; font-size: 13px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        &.blue { background: #e6f7ff; color: #1890ff; a { color: $red; } }
      }
      .sys-info { text-align: center; font-size: 12px; color: #999; margin: 10px 0; span { color: $red; } }
    }
    .input-area {
      background: #fff; border-top: 1px solid $border; padding: 8px 12px;
      .tools { display: flex; gap: 12px; color: #666; margin-bottom: 5px; font-size: 18px; }
      :deep(.el-textarea__inner) { border: none !important; box-shadow: none !important; padding: 0; }
      .btns { display: flex; justify-content: flex-end; gap: 8px; margin-top: 5px; }
    }
  }

  // 4. 右侧面板
  .biz-aside {
    border-left: 1px solid $border;
    .biz-scroll-area { height: calc(100vh - 50px); overflow-y: auto; padding: 12px; }
    .biz-card {
      .card-head { display: flex; justify-content: space-between; align-items: center; border-left: 3px solid $red; padding-left: 8px; margin-bottom: 8px;
        .title-text { font-weight: bold; font-size: 13px; }
      }
      .info-bar { font-size: 11px; color: #777; margin-bottom: 8px; background: #fdfdfd; padding: 4px; }
    }
    .vip { background: #fa8c16; color: #fff; padding: 1px 4px; border-radius: 2px; font-size: 10px; }
    .btn-add { border-color: $red; color: $red; }
    .c-green { color: #52c41a; font-size: 12px; }
  }
}

// 覆盖 Element Plus 的紧凑样式
:deep(.el-form-item--small) { margin-bottom: 8px !important; }
:deep(.el-form-item__label) { padding: 0 !important; font-size: 12px; color: #666; line-height: 20px; }
:deep(.el-input__inner) { font-size: 12px; }
:deep(.el-tabs__nav-wrap::after) { height: 1px; }
.mt-10 { margin-top: 10px; }
.mt-5 { margin-top: 5px; }
</style>
