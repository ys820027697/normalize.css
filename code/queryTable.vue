<template>
  <div class="query-table app-container queryTable">
    <!-- 查询条件 -->
    <div class="queryWrap regular_shadow_tiling">
      <el-form :model="queryForm" label-width="110px" @submit.prevent>
        <el-row :gutter="16">
          <template v-for="(item, index) in queryConfig" :key="index">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item :label="item.label" :prop="item.prop">
                <component
                  :is="item.type"
                  v-model="queryForm[item.prop]"
                  v-bind="item.attrs"
                  @change="item?.onChange"
                  @calendar-change="item?.onCalendarChange"
                >
                  <template v-if="item.type === 'el-select'">
                    <el-option
                      v-for="option in item.attrs.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </template>
                </component>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" class="btn-wrap">
            <el-button type="primary" @click="handleQuery">
              查询
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="tableWrap regular_shadow_tiling">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <slot name="query-buttons" />
        </el-col>
      </el-row>

      <div class="tableWrap_scrollbar">
        <el-table :data="tableData" border stripe highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column
            v-for="(column, index) in tableConfig"
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :type="column.type"
            :width="column.width"
            :min-width="column.minWidth"
            show-overflow-tooltip
          >
            <template v-if="!column.type" #default="scope">
              <template v-if="column.slot">
                <slot :name="column.slot" :scope="scope" />
              </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
          </el-table-column>
          <!-- 自定义列 -->
          <slot name="table-columns" />
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="paginationsc.total > 0"
          v-model:page="paginationsc.pageNum"
          v-model:limit="paginationsc.pageSize"
          :total="paginationsc.total"
          @pagination="handlePagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup name="QueryTable">
import { computed, onMounted, reactive, ref, toRefs } from 'vue'

const props = defineProps({
  queryConfig: {
    type: Array,
    default: () => []
  },
  tableConfig: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  paginations: {
    type: Object,
    default: () => ({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
  }

})
const paginationsc = reactive({ ...props.paginations })
const tableData = computed(() => props.tableData)
const queryForm = ref({})

// 监听 pagination 的变化
watch(
  () => props.paginations,
  (newVal) => {
    Object.assign(paginationsc, newVal)
    // console.log('newVal', newVal, 'paginationsc', paginationsc)
  },
  { deep: true, immediate: true }
)

const emit = defineEmits(['onQuery', 'onSelectionChange'])
// 查询条件配置

// 查询
const handleQuery = () => {
  console.log('queryForm', queryForm.value, 'paginationsc', paginationsc)
  // 触发父组件的查询事件
  paginationsc.pageNum = 1
  paginationsc.pageSize = 10
  emit('onQuery', queryForm.value, paginationsc)
}
// 表单重置
const resetQueryForm = () => {
  Object.keys(queryForm.value).forEach(key => {
    queryForm.value[key] = ''
  })
}
const handleReset = () => {
  // 表单重置
  resetQueryForm()
  handleQuery()
}
const initializeQueryForm = () => {
  props.queryConfig.forEach(item => {
    if (item.prop) {
      queryForm.value[item.prop] = item.defaultValue || null
    }
  })
}
onMounted(() => {
  // 初始化查询条件
  initializeQueryForm()
})
// 分页处理
const handlePagination = ({ page, limit }) => {
  // console.log('pageNum', pageNum, 'pageSize', pageSize)
  paginationsc.pageNum = page
  paginationsc.pageSize = limit
  emit('onQuery', queryForm.value, paginationsc)
}

const handleSelectionChange = (selection) => {
  // console.log('selection', selection)
  // 触发父组件的选择事件
  emit('onSelectionChange', selection)
}

defineExpose({
  handleReset,
  handleQuery
})
</script>

<style lang="scss" scoped>
.query-wrap {
  margin-bottom: 20px;
}
.table-wrap {
  margin-top: 20px;
}
.btn-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.queryTable{
  :deep(.el-form-item__label){
    line-height: 40px !important;
  }
}

</style>
