<template>
  <el-dialog
    v-model="visible"
    title="新增快捷消息"
    width="600px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="消息标题" prop="title">
        <el-input 
          v-model="formData.title" 
          placeholder="请输入消息标题" 
          maxlength="50" 
          show-word-limit 
        />
      </el-form-item>

      <el-form-item label="所属分类">
        <el-tag type="info" variant="plain">{{ categoryName || '未选择' }}</el-tag>
      </el-form-item>

      <el-form-item label="消息内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="4"
          placeholder="请输入消息内容，多条内容建议分行填写"
        />
      </el-form-item>

      <el-form-item label="添加图片">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="3"
          v-model:file-list="fileList"
        >
          <el-icon><Plus /></el-icon>
          <template #tip>
            <div class="el-upload__tip">最多上传 3 张图片，单张不超过 2MB</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="danger" @click="submitForm(formRef)">确定新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  categoryName: String // 从父组件传进来的当前选中分类名
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const formRef = ref()
const fileList = ref([])

// 表单数据
const formData = reactive({
  title: '',
  content: '',
})

// 校验规则
const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
}

// 同步弹窗状态
watch(() => props.modelValue, (val) => {
  visible.value = val
})
watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  if (formRef.value) formRef.value.resetFields()
  fileList.value = []
}

const submitForm = async (el) => {
  if (!el) return
  await el.validate((valid) => {
    if (valid) {
      // 模拟提交逻辑
      console.log('提交数据:', { ...formData, images: fileList.value })
      ElMessage.success('新增成功')
      emit('submit', { ...formData })
      visible.value = false
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
:deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
}
</style>
