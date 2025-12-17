<template>
  <div class="app-container case-management">
    <el-scrollbar height="calc(100vh - 100px)">
      <el-form ref="formRef" :model="formData" label-width="120px" label-position="top">
        <!-- 案件基本信息 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            案件基本信息
          </h3>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="案件编号" required>
                <el-input v-model="formData.caseNumber" placeholder="请输入案件编号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="案件大类" required>
                <el-select v-model="formData.caseCategory" placeholder="请选择案件大类" clearable style="width: 100%">
                  <el-option label="类型1" value="type1" />
                  <el-option label="类型2" value="type2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="案件中类">
                <el-select v-model="formData.caseSubCategory" placeholder="请选择案件中类" clearable style="width: 100%">
                  <el-option label="子类型1" value="subtype1" />
                  <el-option label="子类型2" value="subtype2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="案件小类">
                <el-select v-model="formData.caseMinorCategory" placeholder="请选择案件小类" clearable style="width: 100%">
                  <el-option label="小类型1" value="minortype1" />
                  <el-option label="小类型2" value="minortype2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="建案时间">
                <el-date-picker
                  v-model="formData.createTimeRange"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人">
                <el-input v-model="formData.creator" placeholder="请输入创建人" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="当前处理人">
                <el-input v-model="formData.currentHandler" placeholder="请输入当前处理人" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="意见反馈时间">
                <el-date-picker
                  v-model="formData.feedbackTimeRange"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="意见反馈内容">
                <el-input
                  v-model="formData.feedbackContent"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入意见反馈内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 客户信息 -->
        <div class="section-card regular_shadow_tiling">
          <div class="section-header">
            <h3 class="section-title">
              客户信息
            </h3>
            <el-button type="primary" icon="Plus" @click="handleAddCustomer">
              添加
            </el-button>
          </div>
          <el-table :data="customerList" border stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="customerName" label="客户姓名" width="120" align="center" />
            <el-table-column prop="currentAge" label="当前年龄" width="100" align="center" />
            <el-table-column prop="vipFlag" label="VIP客户标识" width="120" align="center" />
            <el-table-column prop="gender" label="性别" width="80" align="center" />
            <el-table-column prop="idType" label="证件类型" width="120" align="center" />
            <el-table-column prop="idNumber" label="证件号码" min-width="180" show-overflow-tooltip />
            <el-table-column prop="mobileNumber" label="手机号码" width="150" align="center" />
            <el-table-column prop="daytimePhone" label="日间电话号码" width="150" align="center" />
            <el-table-column prop="otherPhone" label="其他电话号码" width="150" align="center" />
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" text @click="handleViewCustomerDetail(scope.row)">
                  查看详情
                </el-button>
                <el-button type="danger" text @click="handleDeleteCustomer(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 联系人信息 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            联系人信息
          </h3>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="联系人">
                <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人类型">
                <el-input v-model="formData.contactPersonType" placeholder="请输入联系人类型" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话">
                <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 关联合同 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            关联合同
          </h3>
          <el-tabs v-model="contractActiveTab">
            <el-tab-pane label="关联健管合同" name="health">
              <el-table :data="healthContractList" border stripe>
                <el-table-column type="selection" width="50" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="rightType" label="权益类型" width="120" align="center" />
                <el-table-column prop="orderNumber" label="订单编号" min-width="150" show-overflow-tooltip />
                <el-table-column prop="serviceContractNo" label="服务合同号" min-width="150" show-overflow-tooltip />
                <el-table-column prop="policyNumber" label="保单号" min-width="150" show-overflow-tooltip />
                <el-table-column prop="policyName" label="保单名称" width="120" align="center" />
                <el-table-column prop="branchOffice" label="分支机构" width="120" align="center" />
                <el-table-column prop="serviceName" label="服务名称" width="120" align="center" />
                <el-table-column prop="contractOwner" label="合同所有人" width="120" align="center" />
                <el-table-column prop="contractStatus" label="合同状态" width="120" align="center" />
                <el-table-column prop="serviceBenefitExpiryDate" label="服务权益有效期" width="180" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="关联个险保单" name="individual">
              <el-table :data="individualPolicyList" border stripe>
                <el-table-column type="selection" width="50" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="policyNumber" label="保单号" min-width="150" show-overflow-tooltip />
                <el-table-column prop="policyName" label="保单名称" width="120" align="center" />
                <el-table-column prop="branchOffice" label="分支机构" width="120" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="关联团险保单" name="group">
              <el-table :data="groupPolicyList" border stripe>
                <el-table-column type="selection" width="50" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="policyNumber" label="保单号" min-width="150" show-overflow-tooltip />
                <el-table-column prop="policyName" label="保单名称" width="120" align="center" />
                <el-table-column prop="branchOffice" label="分支机构" width="120" align="center" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 意见反馈处理步骤 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            意见反馈处理步骤
          </h3>
          <el-steps :active="currentStep" align-center finish-status="success">
            <el-step title="立案" />
            <el-step title="调查" />
            <el-step title="合议" />
            <el-step title="方案制定" />
            <el-step title="沟通方案" />
            <el-step title="方案实施" />
            <el-step title="第三方处理" />
            <el-step title="回访" />
            <el-step title="暂结" />
            <el-step title="结案" />
            <el-step title="撤案" />
          </el-steps>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-form-item label="处理意见" required>
                <el-input
                  v-model="formData.processingOpinion"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入处理意见"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 案件跟进信息 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            案件跟进信息
          </h3>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="首次响应时间">
                <el-date-picker
                  v-model="formData.firstResponseTime"
                  type="datetime"
                  placeholder="请选择首次响应时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="案件状态">
                <el-select v-model="formData.caseStatus" placeholder="只读状态" disabled style="width: 100%">
                  <el-option label="状态1" value="status1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联工单">
                <el-input v-model="formData.relatedWorkOrder" placeholder="请输入关联工单" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作">
                <el-radio-group v-model="formData.operationType">
                  <el-radio-button label="协办">
                    协办
                  </el-radio-button>
                  <el-radio-button label="转办">
                    转办
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="选择部门">
                <el-select v-model="formData.selectedDepartment" placeholder="请选择部门" clearable style="width: 100%">
                  <el-option label="部门1" value="dept1" />
                  <el-option label="部门2" value="dept2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="选择人员">
                <el-select v-model="formData.selectedPerson" placeholder="请选择人员" clearable style="width: 100%">
                  <el-option label="人员1" value="person1" />
                  <el-option label="人员2" value="person2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮件提醒">
                <el-checkbox v-model="formData.sendEmailReminder">
                  发送邮件提醒
                </el-checkbox>
                <el-radio-group v-model="formData.emailReminderFlag" style="margin-left: 20px;">
                  <el-radio label="是">
                    是
                  </el-radio>
                  <el-radio label="否">
                    否
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 案件分析 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            案件分析
          </h3>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="意见反馈渠道来源">
                <el-select v-model="formData.feedbackChannelSource" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="渠道1" value="channel1" />
                  <el-option label="渠道2" value="channel2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="反馈人类型">
                <el-select v-model="formData.feedbackPersonType" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="类型1" value="type1" />
                  <el-option label="类型2" value="type2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="涉及部门大类">
                <el-select v-model="formData.involvedDeptCategory" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="大类1" value="category1" />
                  <el-option label="大类2" value="category2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="涉及部门小类">
                <el-select v-model="formData.involvedDeptSubCategory" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="小类1" value="subcategory1" />
                  <el-option label="小类2" value="subcategory2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="业务类型">
                <el-select v-model="formData.businessType" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="业务类型1" value="business1" />
                  <el-option label="业务类型2" value="business2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务类型二类">
                <el-select v-model="formData.businessTypeSecondary" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="二类1" value="secondary1" />
                  <el-option label="二类2" value="secondary2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务流程节点二类">
                <el-select v-model="formData.businessProcessNodeSecondary" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="节点1" value="node1" />
                  <el-option label="节点2" value="node2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="根因大类">
                <el-select v-model="formData.rootCauseCategory" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="根因1" value="root1" />
                  <el-option label="根因2" value="root2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="案件简述">
                <el-input
                  v-model="formData.caseSummary"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入案件简述"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理方案">
                <el-input
                  v-model="formData.resolutionPlan"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入处理方案"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="涉及OH案件编号">
                <el-input v-model="formData.involvedOHCaseNumber" placeholder="请输入涉及OH案件编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 溯源整改 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            溯源整改
          </h3>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="溯源整改工作进展">
                <el-select v-model="formData.rectificationProgress" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="完成" value="completed" />
                  <el-option label="进行中" value="inProgress" />
                  <el-option label="未开始" value="notStarted" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否涉及溯源整改">
                <el-checkbox v-model="formData.involvesRectification" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="溯源整改责任部门">
                <el-select v-model="formData.rectificationDept" placeholder="请选择" clearable style="width: 100%">
                  <el-option label="部门1" value="dept1" />
                  <el-option label="部门2" value="dept2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计完成日期">
                <el-date-picker
                  v-model="formData.estimatedCompletionDate"
                  type="date"
                  placeholder="不可改状态"
                  disabled
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="溯源发现问题">
                <el-select v-model="formData.rectificationProblem" placeholder="不可改状态" disabled style="width: 100%">
                  <el-option label="问题1" value="problem1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="改善举措">
                <el-select v-model="formData.improvementMeasures" placeholder="不可改状态" disabled style="width: 100%">
                  <el-option label="举措1" value="measure1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 附件列表 -->
        <div class="section-card regular_shadow_tiling">
          <div class="section-header">
            <h3 class="section-title">
              附件列表
            </h3>
            <el-button type="primary" icon="Upload" @click="handleUploadAttachment">
              上传附件
            </el-button>
          </div>
          <div class="tip-info">
            <span>● 非本人上传无法删除</span>
            <span class="tip-arrow">→</span>
            <span>如非本人上传的附件，点击删除按钮，拦截提示</span>
          </div>
          <el-table :data="attachmentList" border stripe>
            <el-table-column type="selection" width="50" />
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="attachmentName" label="附件名称" min-width="200" show-overflow-tooltip />
            <el-table-column prop="attachmentDescription" label="附件描述" min-width="250" show-overflow-tooltip />
            <el-table-column prop="uploader" label="上传人员" width="120" align="center" />
            <el-table-column prop="uploadTime" label="上传时间" width="180" align="center" />
            <el-table-column label="操作" width="280" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" text @click="handleEditAttachment(scope.row)">
                  编辑
                </el-button>
                <el-button type="primary" text @click="handleViewAttachment(scope.row)">
                  查看
                </el-button>
                <el-button type="primary" text @click="handleDownloadAttachment(scope.row)">
                  下载
                </el-button>
                <el-button type="danger" text @click="handleDeleteAttachment(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 历史跟进记录 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            历史跟进记录
          </h3>
          <el-table :data="historyRecordList" border stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="operationTime" label="操作时间" width="180" align="center" />
            <el-table-column prop="operation" label="操作" width="120" align="center" />
            <el-table-column prop="operatingTeam" label="操作团队" width="120" align="center" />
            <el-table-column prop="operator" label="操作人" width="120" align="center" />
            <el-table-column prop="toOperatingTeam" label="给操作团队" width="120" align="center" />
            <el-table-column prop="toOperator" label="给操作人" width="120" align="center" />
            <el-table-column prop="fromStatus" label="从状态" width="120" align="center" />
            <el-table-column prop="firstResponseTime" label="首次响应时间" width="180" align="center" />
            <el-table-column prop="processingOpinion" label="处理意见" min-width="300" show-overflow-tooltip />
          </el-table>
        </div>

        <!-- 关联工单 -->
        <div class="section-card regular_shadow_tiling">
          <h3 class="section-title">
            关联工单
          </h3>
          <el-table :data="relatedWorkOrderList" border stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="workOrderNumber" label="工单编号" min-width="180" show-overflow-tooltip />
            <el-table-column prop="branchOffice" label="分支机构" width="120" align="center" />
            <el-table-column prop="policyNumber" label="保单号" width="150" align="center" />
            <el-table-column prop="healthContractNo" label="健管服务合同号" width="180" align="center" />
            <el-table-column prop="eventCategory" label="事件大类" width="120" align="center" />
            <el-table-column prop="eventSubCategory" label="事件中类" width="120" align="center" />
            <el-table-column prop="eventMinorCategory" label="事件小类" width="120" align="center" />
            <el-table-column prop="workOrderCategory" label="工单大类" width="120" align="center" />
            <el-table-column prop="workOrderSecondary" label="工单二类" width="120" align="center" />
            <el-table-column prop="workOrderTertiary" label="工单三类" width="120" align="center" />
            <el-table-column prop="creator" label="创建人" width="120" align="center" />
            <el-table-column prop="currentHandler" label="当前处理人" width="120" align="center" />
            <el-table-column prop="workOrderContent" label="工单内容" min-width="200" show-overflow-tooltip />
          </el-table>
        </div>
      </el-form>
    </el-scrollbar>

    <!-- 底部操作按钮 -->
    <div class="footer-actions">
      <el-button @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
      <el-button type="warning" @click="handleUrge">
        催办
      </el-button>
      <el-button type="success" @click="handleSubmit">
        提交
      </el-button>
      <el-button type="danger" @click="handleTransferToComplaint">
        转投诉
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive({
  caseNumber: '1111111111',
  caseCategory: '',
  caseSubCategory: '',
  caseMinorCategory: '',
  createTimeRange: null,
  creator: '张三',
  currentHandler: '张三',
  feedbackTimeRange: null,
  feedbackContent: '',
  contactPerson: '',
  contactPersonType: '',
  contactPhone: '',
  processingOpinion: '',
  firstResponseTime: null,
  caseStatus: '',
  relatedWorkOrder: '',
  operationType: '协办',
  selectedDepartment: '',
  selectedPerson: '',
  sendEmailReminder: true,
  emailReminderFlag: '是',
  feedbackChannelSource: '',
  feedbackPersonType: '',
  involvedDeptCategory: '',
  involvedDeptSubCategory: '',
  businessType: '',
  businessTypeSecondary: '',
  businessProcessNodeSecondary: '',
  rootCauseCategory: '',
  caseSummary: '',
  resolutionPlan: '',
  involvedOHCaseNumber: '',
  rectificationProgress: '完成',
  involvesRectification: false,
  rectificationDept: '',
  estimatedCompletionDate: null,
  rectificationProblem: '',
  improvementMeasures: ''
})

// 当前步骤
const currentStep = ref(0)

// 关联合同选项卡
const contractActiveTab = ref('health')

// 客户信息列表
const customerList = ref([
  {
    customerName: '张三',
    currentAge: '23岁',
    vipFlag: '是',
    gender: '女',
    idType: '身份证',
    idNumber: '222222222222222',
    mobileNumber: '222222222222222',
    daytimePhone: '222222222222222',
    otherPhone: '222222222222222'
  },
  {
    customerName: '张三',
    currentAge: '23岁',
    vipFlag: '是',
    gender: '女',
    idType: '身份证',
    idNumber: '222222222222222',
    mobileNumber: '222222222222222',
    daytimePhone: '222222222222222',
    otherPhone: '222222222222222'
  },
  {
    customerName: '张三',
    currentAge: '23岁',
    vipFlag: '是',
    gender: '女',
    idType: '身份证',
    idNumber: '222222222222222',
    mobileNumber: '222222222222222',
    daytimePhone: '222222222222222',
    otherPhone: '222222222222222'
  },
  {
    customerName: '张三',
    currentAge: '23岁',
    vipFlag: '是',
    gender: '女',
    idType: '身份证',
    idNumber: '222222222222222',
    mobileNumber: '222222222222222',
    daytimePhone: '222222222222222',
    otherPhone: '222222222222222'
  },
  {
    customerName: '张三',
    currentAge: '23岁',
    vipFlag: '是',
    gender: '女',
    idType: '身份证',
    idNumber: '222222222222222',
    mobileNumber: '222222222222222',
    daytimePhone: '222222222222222',
    otherPhone: '222222222222222'
  }
])

// 健管合同列表
const healthContractList = ref([
  {
    rightType: '类型',
    orderNumber: '111111111111111',
    serviceContractNo: '111111111111111',
    policyNumber: '111111111111111',
    policyName: '名称',
    branchOffice: '机构',
    serviceName: '名称',
    contractOwner: '张三',
    contractStatus: '张三',
    serviceBenefitExpiryDate: '2023-09-09 09:09:09'
  },
  {
    rightType: '类型',
    orderNumber: '111111111111111',
    serviceContractNo: '111111111111111',
    policyNumber: '111111111111111',
    policyName: '名称',
    branchOffice: '机构',
    serviceName: '名称',
    contractOwner: '张三',
    contractStatus: '张三',
    serviceBenefitExpiryDate: '2023-09-09 09:09:09'
  },
  {
    rightType: '类型',
    orderNumber: '111111111111111',
    serviceContractNo: '111111111111111',
    policyNumber: '111111111111111',
    policyName: '名称',
    branchOffice: '机构',
    serviceName: '名称',
    contractOwner: '张三',
    contractStatus: '张三',
    serviceBenefitExpiryDate: '2023-09-09 09:09:09'
  },
  {
    rightType: '类型',
    orderNumber: '111111111111111',
    serviceContractNo: '111111111111111',
    policyNumber: '111111111111111',
    policyName: '名称',
    branchOffice: '机构',
    serviceName: '名称',
    contractOwner: '张三',
    contractStatus: '张三',
    serviceBenefitExpiryDate: '2023-09-09 09:09:09'
  },
  {
    rightType: '类型',
    orderNumber: '111111111111111',
    serviceContractNo: '111111111111111',
    policyNumber: '111111111111111',
    policyName: '名称',
    branchOffice: '机构',
    serviceName: '名称',
    contractOwner: '张三',
    contractStatus: '张三',
    serviceBenefitExpiryDate: '2023-09-09 09:09:09'
  }
])

// 个险保单列表
const individualPolicyList = ref([])

// 团险保单列表
const groupPolicyList = ref([])

// 附件列表
const attachmentList = ref([
  {
    attachmentName: '文件名称.pdf',
    attachmentDescription: '描述描述描述描述描述描述描述描述描述',
    uploader: '张三',
    uploadTime: '2029-09-09 09:09:09'
  },
  {
    attachmentName: '文件名称.pdf',
    attachmentDescription: '描述描述描述描述描述描述描述描述描述',
    uploader: '张三',
    uploadTime: '2029-09-09 09:09:09'
  },
  {
    attachmentName: '文件名称.pdf',
    attachmentDescription: '描述描述描述描述描述描述描述描述描述',
    uploader: '张三',
    uploadTime: '2029-09-09 09:09:09'
  },
  {
    attachmentName: '文件名称.pdf',
    attachmentDescription: '描述描述描述描述描述描述描述描述描述',
    uploader: '张三',
    uploadTime: '2029-09-09 09:09:09'
  },
  {
    attachmentName: '文件名称.pdf',
    attachmentDescription: '描述描述描述描述描述描述描述描述描述',
    uploader: '张三',
    uploadTime: '2029-09-09 09:09:09'
  }
])

// 历史跟进记录列表
const historyRecordList = ref([
  {
    operationTime: '2029-09-09 09:09:09',
    operation: '提交',
    operatingTeam: '团队',
    operator: '张三',
    toOperatingTeam: '张三',
    toOperator: '张三',
    fromStatus: '状态',
    firstResponseTime: '2029-09-09 09:09:09',
    processingOpinion: '意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见'
  },
  {
    operationTime: '2029-09-09 09:09:09',
    operation: '提交',
    operatingTeam: '团队',
    operator: '张三',
    toOperatingTeam: '张三',
    toOperator: '张三',
    fromStatus: '状态',
    firstResponseTime: '2029-09-09 09:09:09',
    processingOpinion: '意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见'
  },
  {
    operationTime: '2029-09-09 09:09:09',
    operation: '提交',
    operatingTeam: '团队',
    operator: '张三',
    toOperatingTeam: '张三',
    toOperator: '张三',
    fromStatus: '状态',
    firstResponseTime: '2029-09-09 09:09:09',
    processingOpinion: '意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见'
  },
  {
    operationTime: '2029-09-09 09:09:09',
    operation: '提交',
    operatingTeam: '团队',
    operator: '张三',
    toOperatingTeam: '张三',
    toOperator: '张三',
    fromStatus: '状态',
    firstResponseTime: '2029-09-09 09:09:09',
    processingOpinion: '意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见'
  },
  {
    operationTime: '2029-09-09 09:09:09',
    operation: '提交',
    operatingTeam: '团队',
    operator: '张三',
    toOperatingTeam: '张三',
    toOperator: '张三',
    fromStatus: '状态',
    firstResponseTime: '2029-09-09 09:09:09',
    processingOpinion: '意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见意见'
  }
])

// 关联工单列表
const relatedWorkOrderList = ref([
  {
    workOrderNumber: '1111111111111111',
    branchOffice: '机构',
    policyNumber: '111111111',
    healthContractNo: '111111111',
    eventCategory: '大类',
    eventSubCategory: '中类',
    eventMinorCategory: '小类',
    workOrderCategory: '大类',
    workOrderSecondary: '二类',
    workOrderTertiary: '三类',
    creator: '张三',
    currentHandler: '张三',
    workOrderContent: '内容内容内容内容'
  },
  {
    workOrderNumber: '1111111111111111',
    branchOffice: '机构',
    policyNumber: '111111111',
    healthContractNo: '111111111',
    eventCategory: '大类',
    eventSubCategory: '中类',
    eventMinorCategory: '小类',
    workOrderCategory: '大类',
    workOrderSecondary: '三类',
    workOrderTertiary: '二类',
    creator: '张三',
    currentHandler: '张三',
    workOrderContent: '内容内容内容内容'
  },
  {
    workOrderNumber: '1111111111111111',
    branchOffice: '机构',
    policyNumber: '111111111',
    healthContractNo: '111111111',
    eventCategory: '大类',
    eventSubCategory: '中类',
    eventMinorCategory: '小类',
    workOrderCategory: '大类',
    workOrderSecondary: '二类',
    workOrderTertiary: '三类',
    creator: '张三',
    currentHandler: '张三',
    workOrderContent: '内容内容内容内容'
  }
])

// 添加客户
const handleAddCustomer = () => {
  customerList.value.push({
    customerName: '新客户',
    currentAge: '0岁',
    vipFlag: '否',
    gender: '男',
    idType: '身份证',
    idNumber: '',
    mobileNumber: '',
    daytimePhone: '',
    otherPhone: ''
  })
}

// 查看客户详情
const handleViewCustomerDetail = (row) => {
  console.log('查看客户详情', row)
  ElMessage.info('查看客户详情功能待实现')
}

// 删除客户
const handleDeleteCustomer = (index) => {
  ElMessageBox.confirm('确认删除该客户信息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    customerList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 上传附件
const handleUploadAttachment = () => {
  ElMessage.info('上传附件功能待实现')
}

// 编辑附件
const handleEditAttachment = (row) => {
  console.log('编辑附件', row)
  ElMessage.info('编辑附件功能待实现')
}

// 查看附件
const handleViewAttachment = (row) => {
  console.log('查看附件', row)
  ElMessage.info('查看附件功能待实现')
}

// 下载附件
const handleDownloadAttachment = (row) => {
  console.log('下载附件', row)
  ElMessage.info('下载附件功能待实现')
}

// 删除附件
const handleDeleteAttachment = (index) => {
  ElMessageBox.confirm('确认删除该附件？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    attachmentList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 取消
const handleCancel = () => {
  ElMessage.info('取消操作')
}

// 保存
const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('请填写必填项')
    }
  })
}

// 催办
const handleUrge = () => {
  ElMessage.info('催办功能待实现')
}

// 提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
    } else {
      ElMessage.error('请填写必填项')
    }
  })
}

// 转投诉
const handleTransferToComplaint = () => {
  ElMessageBox.confirm('确认转投诉？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('转投诉成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.case-management {
  padding: 20px;

  .section-card {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;

    .section-title {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: #343741;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .section-title {
        margin: 0;
      }
    }
  }

  .tip-info {
    margin-bottom: 15px;
    padding: 10px;
    background: #f5f7fa;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;

    .tip-arrow {
      margin: 0 10px;
      color: #409eff;
    }
  }

  .footer-actions {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 15px 20px;
    background: #fff;
    border-top: 1px solid #e4e7ed;
    text-align: right;
    z-index: 1000;

    .el-button {
      margin-left: 10px;
    }
  }
}

:deep(.el-steps) {
  margin-bottom: 20px;
}
</style>
