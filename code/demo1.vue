<template>
  <QueryTable
    ref="queryTableRef"
    :query-config="queryConfig"
    :table-config="tableConfig"
    :table-data="sensitivewordsList"
    :paginations="pagination"
    @onQuery="getList"
    @onSelectionChange="handleTableSelectionChange"
  >
    <!-- 自定义按钮 -->
    <template #query-buttons>
      <el-button type="primary" icon="Plus" size="large" @click="handleAdd">
        新增
      </el-button>
      <el-button type="danger" size="large" icon="Delete" :disabled="multiple" @click="handleDelete">
        批量删除
      </el-button>
      <el-button type="warning" size="large" icon="Download" @click="handleExport">
        导出全部
      </el-button>
    </template>

    <!--table 自定义列里展示的字段和样式 -->
    <template #direction="{ scope }">
      <dict-tag :options="omni_sensitivewords_direct" :value="scope.row.direction" />
    </template>
    <!-- table 自定义 操作列 -->
    <template #table-columns>
      <el-table-column label="操作" width="190">
        <template #default="scope">
          <el-button type="primary" text @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="primary" text @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </template>
  </QueryTable>

  <!-- 添加或修改敏感字管理对话框 -->
  <el-dialog v-model="open" :draggable="true" :title="title" width="500px" append-to-body destroy-on-close>
    <el-form ref="sensitivewordsRef" label-position="top" :model="form" :rules="rules" label-width="120px" @submit.prevent>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item :label="$t('om_po_sensitivewordsName', '敏感词')" prop="sensitivewordsName">
            <el-input v-model="form.sensitivewordsName" clearable :placeholder="$t('sys_i18n_pleaseEnter', '请输入')" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('om_po_direction', '控制方向')" prop="direction">
            <el-select v-model="form.direction" placeholder="" clearable>
              <el-option v-for="item in omni_sensitivewords_direct" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="敏感词等级" prop="level">
            <el-select v-model="form.level" placeholder="" clearable>
              <el-option v-for="item in omni_sensitivewords_level" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import QueryTable from '@/components/QueryTable/index.vue'
import { ElMessageBox } from 'element-plus'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'

import { listSensitivewords, getSensitivewords, delSensitivewords, addSensitivewords, updateSensitivewords } from '@/api/omnimedia/sensitivewords'
import moment from 'moment'
const { proxy } = getCurrentInstance()
const { omni_sensitivewords_direct, omni_sensitivewords_level } = proxy.useDict('omni_sensitivewords_direct', 'omni_sensitivewords_level')
const open = ref(false)
const title = ref('')
const form = reactive({
  sensitivewordsId: null,
  sensitivewordsName: null,
  direction: null,
  level: null
})
// 来设置禁用掉的日期
const handleDisabledDateday = (date) => {
  // 这里是限制日期范围的逻辑
  if (new Date(date).getFullYear() <= new Date().getFullYear()) {
    // console.log('firstselectDataDay', firstselectDataDay.value, '这里是限制日期范围的逻辑', date)
    if (firstselectDataDay.value) {
      const startTime = moment(firstselectDataDay.value).format('YYYY-MM-DD')
      const endTime = moment(date).format('YYYY-MM-DD')
      const xianzhiEndTime = moment(startTime, 'YYYY-MM-DD').add(1, 'months').format('YYYY-MM-DD')
      const xianzhiStartTime = moment(startTime, 'YYYY-MM-DD').subtract(1, 'months').format('YYYY-MM-DD')
      // console.log('firstselectDataDay', firstselectDataDay.value, 'startTime', startTime, 'endTime', endTime, 'xianzhiEndTime', xianzhiEndTime, 'xianzhiStartTime', xianzhiStartTime)

      if (endTime >= xianzhiStartTime && endTime <= xianzhiEndTime) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  } else {
    return true
  }
}
// 用户确认选定的值时触发
// const handleChangeTime = (data) => {
//   if (data?.length > 0) {
//     queryParams.contractStartDate = data[0]
//     queryParams.contractEndDate = data[1]
//   } else {
//     queryParams.contractStartDate = ''
//     queryParams.contractEndDate = ''
//   }
// }
const handleChangeTime = ([start, end]) => {
  queryParams.contractStartDate = start || ''
  queryParams.contractEndDate = end || ''

  getList(queryParams.value, pagination)
}
const handleCalendarChangeData = (data) => {
  // console.log('在日历所选日期更改时触发', data)
  firstselectDataDay.value = data[0]
  if (data[1]) {
    firstselectDataDay.value = ''
  }
}
const firstselectDataDay = ref('')
// 在日历所选日期更改时触发
const startTimes = moment().format('YYYY-MM-DD')
const endTimes = moment().subtract(1, 'months').format('YYYY-MM-DD')
const queryConfig = [
  {
    label: '敏感词',
    prop: 'sensitivewordsName',
    type: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入'
    }
  },
  {
    label: '控制方向',
    prop: 'direction',
    type: 'el-select',
    attrs: {
      clearable: true,
      placeholder: '请选择',
      options: omni_sensitivewords_direct.value
    },
    defaultValue: '0'
  },
  {
    label: '查询时间',
    prop: 'timeList',
    type: 'el-date-picker',
    attrs: {
      clearable: true,
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      rangeSeparator: '-',
      'disabled-date': handleDisabledDateday
    },
    onChange: handleChangeTime,
    onCalendarChange: handleCalendarChangeData,
    defaultValue: [endTimes, startTimes]
  }
]

const tableConfig = [
  { type: 'selection', width: '50' },
  { label: '序号', type: 'index', width: '60' },
  { label: '敏感词', prop: 'sensitivewordsName' },
  {
    label: '控制方向',
    prop: 'direction',
    slot: 'direction',
    width: '120'
  },
  { label: '创建人', prop: 'createBy', width: '120' },
  { label: '创建时间', prop: 'createTime', width: '160' }
]
const queryTableRef = ref()
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const data = reactive({
  queryParams: {
    sensitivewordsName: null,
    direction: null
  },
  rules: {
    sensitivewordsName: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    direction: [
      { required: true, message: proxy.$t('sys_i18n_pleaseSelect', '请选择'), trigger: 'change' }
    ],
    level: [
      { required: true, message: proxy.$t('sys_i18n_pleaseSelect', '请选择'), trigger: 'change' }
    ]
  }
})

onMounted(() => {
  getList(queryParams.value, pagination)
})

const { queryParams, rules } = toRefs(data)
const loading = ref(false)
const sensitivewordsList = ref([])
const ids = ref([])
const multiple = ref(true)
const getList = (queryFormItem, paginationItem) => {
  console.log('查询条件:', queryFormItem)
  console.log('分页参数:', paginationItem)
  const params = {
    ...queryFormItem,
    pageNum: paginationItem.pageNum,
    pageSize: paginationItem.pageSize
  }
  /** 查询敏感字管理列表 */
  loading.value = true
  listSensitivewords(params).then(response => {
    sensitivewordsList.value = response.rows
    pagination.total = response.total * 1
    loading.value = false
  })
}

const handleAdd = () => {
  queryTableRef.value.handleReset()
  open.value = true
  title.value = '新增窗口'
  // 清空 form 数据
  Object.keys(form).forEach(key => {
    form[key] = null
  })
}
// 取消按钮
function cancel () {
  open.value = false
  queryTableRef.value.handleReset()
}
const sensitivewordsRef = ref()
/** 提交按钮 */
function submitForm () {
  sensitivewordsRef.value.validate(valid => {
    if (valid) {
      console.log('submitForm', form)

      if (form.sensitivewordsId != null) {
        updateSensitivewords(form).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList(queryParams.value, pagination)
        })
      } else {
        addSensitivewords(form).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList(queryParams.value, pagination)
        })
      }
    }
  })
}

/** 编辑按钮操作 */
function handleUpdate (row) {
  const sensitivewordsId = row.sensitivewordsId || ids.value
  getSensitivewords(sensitivewordsId).then(response => {
    Object.assign(form, response.data)
    open.value = true
    title.value = proxy.$t('common_win_modify', '修改窗口')
  })
}
/** 批量选中数据后 */
function handleTableSelectionChange (selection) {
  ids.value = selection.map(item => item.sensitivewordsId)
  // single.value = selection.length != 1
  multiple.value = !selection.length
}
/** 删除按钮操作 */
function handleDelete (row) {
  const sensitivewordsIds = row.sensitivewordsId || ids.value
  // const name = row.sensitivewordsName
  const text = Array.isArray(sensitivewordsIds) ? proxy.$t('common_opt_deleteCheckedRecord', '是否需要删除选中的记录?') : proxy.$t('common_opt_deleteRecord', '是否需要删除记录?')
  ElMessageBox.confirm(
    text,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
      draggable: true,
      customClass: 'error',
      overflow: true,
      confirmButtonClass: 'el-button--danger'
    }
  ).then(function () {
    return delSensitivewords(sensitivewordsIds)
  }).then(() => {
    getList(queryParams.value, pagination)
    proxy.$modal.msgSuccess(proxy.$t('sys_i18n_deleteSuccess', '删除成功'))
  }).catch(() => {})
}
/** 导出按钮操作 */
function handleExport () {
  proxy.download('omnimedia/sensitivewords/export', {
    ...queryParams.value
  }, `sensitivewords_${new Date().getTime()}.xlsx`)
}
</script>
