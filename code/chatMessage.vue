<template>
  <div v-loading="loading" class="im-chat ChatMessage">
    <div class="im-chat-main">
      <div class="im-chat-main-left">
        <div id="message-box" class="im-chat-main-box messages">
          <el-scrollbar ref="scrollbarRef" @scroll="handleScrollFun">
            <ul :id="'message_box_ul' + session.message.sessionId">
              <template v-if="historychatMessageList.length > 0">
                <li
                  v-for="item in historychatMessageList"
                  :key="item.uuids"
                  :class="{
                    'im-chat-mine':
                      item.type + '' === '2007' || item.type + '' === '9527'
                  }"
                >
                  <div class="im-chat-user">
                    <!-- 2007 客服 1005 坐席  其他·系统消息 -->
                    <Avatar
                      v-if="
                        item.type + '' === '2007' || item.type + '' === '9527'
                      "
                      icon-class="kefu"
                      class="useAvatar"
                      :img="userStore.avatar"
                      style="font-size: 30px"
                    />
                    <Avatar
                      v-else-if="item.type + '' === '1005'"
                      class="useAvatar"
                      :img="session.message.headImgUrl"
                      :title="setNameLengthFun(currentSessMap.originalCustName)"
                    />
                    <Avatar
                      v-else
                      icon-class="user"
                      class="useAvatar"
                      :title="$t('sys_po_management', '管理')"
                    />
                    <!-- 客服信息展示 -->
                    <div
                      v-if="
                        item.type + '' === '2007' || item.type + '' === '9527'
                      "
                      class="message-info right"
                    >
                      <span class="topName">{{
                        item.actName || item.agentId
                      }}</span><span>[{{
                        item.type + '' === '2007'
                          ? $t('sys_po_CustomerService', '客服')
                          : $t('sys_po_Intelligent', '智能') +
                            $t('sys_po_CustomerService', '客服')
                      }}]</span>
                      <i>
                        <Time :time="item.time" />
                      </i>
                      <span class="2007">{{
                        userMap.get(item.agentId)?.name
                      }}</span>
                    </div>
                    <!-- 坐席信息展示 -->
                    <div
                      v-else-if="item.type + '' === '1005'"
                      class="message-info"
                    >
                      <!-- <span>{{ userMap.get(item.agentId)?.name }}</span> -->
                      <span class="topName">{{
                        currentSessMap.originalCustName
                      }}</span>
                      <span>[{{ $t('sys_po_Client', '客户') }}]</span>
                      <i>
                        <Time :time="item.time" />
                      </i>
                    </div>
                    <!-- 系统信息展示 -->
                    <div v-else class="message-info">
                      <!-- <span>{{ userMap.get(item.agentId)?.name }}</span> -->
                      <span>[{{ $t('qc_myReview_sysMsg', '系统消息') }}]</span>
                      <i>
                        <Time :time="item.time" />
                      </i>
                    </div>
                  </div>
                  <div v-if="item.msgType === 'card'" class="im-chat-text">
                    <FileCard
                      :config="JSON.parse(item.content)"
                      @loadImageSuccess="setScrollTopFun"
                    />
                  </div>
                  <div
                    v-if="item.msgType === 'text' || item.msgType === 'link'"
                    class="im-chat-text"
                  >
                    <!-- <pre v-setHtml="ChatUtils.transform(item.content)" /> -->
                    <!-- <SearchClickView
                      :key="item.time" :item-info="item" :session="session"
                      @searchEv="handleSearchFun"
                    /> -->
                    <pre
                      v-setHtml="
                        ChatUtils.transform(
                          item.content,
                          session.message.custRes
                        )
                      "
                      class="preText preImage"
                    />
                  </div>
                  <div
                    v-if="msgTypeList.includes(item.msgType)"
                    class="im-chat-text im_Type_other"
                  >
                    <!-- 消息为图片 -->
                    <fieleByFileIdtype
                      :file-id="item.content"
                      :file-id-type="item.msgType"
                    />
                  </div>
                  <div
                    v-if="item.messageType === MessageType.file"
                    class="im-chat-text"
                    style="width: 50%"
                  >
                    <a
                      class="file-box"
                      :title="item.extend.fileName"
                      :href="item.extend.url"
                      @click="openImageProxy($event)"
                    >
                      <div class="file-icon">
                        <i class="iconfont icon-v-xiazai" />
                      </div>
                      <div class="file-text">
                        <div class="file-name">{{ item.extend.fileName }}</div>
                      </div>
                    </a>
                  </div>
                  <div
                    v-if="item.messageType === MessageType.voice"
                    class="im-chat-text"
                    :title="item.msgType"
                    :style="{
                      width:
                        item.extend.time > 40
                          ? '50%'
                          : item.extend.time + 10 + '%'
                    }"
                  >
                    <div @click="handleAudio(item)">
                      <i
                        class="iconfont icon-v-voice"
                        :class="{ 'icon-v-voice-right': item.type === '1005' }"
                      />
                    </div>
                  </div>
                  <!-- 系统消息 -->
                  <div
                    v-if="
                      item.type + '' !== '1005' &&
                        item.type + '' !== '2007' &&
                        item.type + '' !== '9527'
                    "
                    class="im-chat-text xt"
                    title="系统"
                  >
                    <pre
                      v-setHtml="
                        ChatUtils.transform(
                          item.content,
                          session.message.custRes
                        )
                      "
                      class="preText preImage"
                    />
                  </div>
                </li>
                <li class="history">
                  <div class="history_item">
                    ----------------------------------{{
                      $t('sys_po_history_ends', '历史记录到这里为止')
                    }}-----------------------
                  </div>
                </li>
              </template>

              <template v-for="item in messageList" :key="item._key">
                <!-- 消息撤回 -->
                <template v-if="item?.revokeFlag">
                  <template v-if="item.type + '' === '2007'">
                    <div class="revoke" :title="JSON.stringify(item)">
                      {{ item.errorMsg }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="revoke">
                      [{{ $t('sys_po_Client', '客户') }}]:{{
                        currentSessMap.originalCustName
                      }}{{ $t('sys_po_messagerecalled', '撤回了一条消息') }}
                    </div>
                  </template>
                </template>

                <li
                  v-else
                  :class="{ 'im-chat-mine': item.type + '' === '2007' }"
                >
                  <div class="im-chat-user">
                    <!-- 2007 客户 1005 坐席  其他·系统消息 -->
                    <Avatar
                      v-if="item.type + '' === '2007'"
                      :img="userStore.avatar"
                      icon-class="kefu"
                      class="useAvatar"
                      style="font-size: 30px"
                    />
                    <!--  :title="item.agentId2 || item.agentId" -->
                    <Avatar
                      v-else-if="item.type + '' === '1005'"
                      class="useAvatar"
                      :img="session.message.headImgUrl"
                      :title="setNameLengthFun(currentSessMap.originalCustName)"
                    />
                    <Avatar
                      v-else
                      class="useAvatar"
                      :title="$t('sys_po_management', '管理')"
                    />
                    <!-- 客服信息展示 -->
                    <div
                      v-if="item.type + '' === '2007'"
                      class="message-info right"
                    >
                      <div class="top">
                        <span class="topName">{{
                          item.agentId2 || item.agentId
                        }}</span>
                        <span>[{{ $t('sys_po_CustomerService', '客服') }}]</span>
                        <i>
                          <Time :time="item.time" />
                        </i>
                        <span class="2007">{{
                          userMap.get(item.agentId)?.name
                        }}</span>
                      </div>
                    </div>

                    <!-- 坐席信息展示 -->
                    <div
                      v-else-if="item.type + '' === '1005'"
                      class="message-info"
                    >
                      <div class="top">
                        <!-- <span>{{ userMap.get(item.agentId)?.name }}</span> -->
                        <span class="topName">{{
                          currentSessMap.originalCustName
                        }}</span><span>[{{ $t('sys_po_Client', '客户') }}]</span>
                        <i>
                          <Time :time="item.time" />
                        </i>
                      </div>
                    </div>

                    <!-- 系统信息展示 -->
                    <div v-else class="message-info">
                      <!-- <span>{{ userMap.get(item.agentId)?.name }}</span> -->
                      <span>[{{ $t('qc_myReview_sysMsg', '系统消息') }}]</span>
                      <i>
                        <Time :time="item.time" />
                      </i>
                    </div>
                  </div>
                  <template v-if="item.type + '' === '2007'">
                    <div v-if="item.msgType === 'card'" class="im-chat-text">
                      <FileCard
                        :config="item.content"
                        @loadImageSuccess="setScrollTopFun"
                      />
                    </div>
                    <template
                      v-if="item.msgType === 'text' || item.msgType === 'link'"
                    >
                      <div class="chatMesContent">
                        <RightclickView
                          :key="item._key"
                          :item-info="item"
                          :session="session"
                          @revokeInfoEv="handleRevokeInfo"
                          @searchEv="handleSearchFun"
                        />
                        <!-- 引用消息展示 -->
                        <div v-if="item.relation" class="relationView">
                          <template v-if="item.relation.type + '' == '1005'">
                            <span class="khmessage_title">{{ currentSessMap.originalCustName }}:{{
                              item.relation.content
                            }}</span>
                          </template>
                          <template v-if="item.relation.type + '' == '2007'">
                            <span class="khmessage_title">{{
                              item.relation.agentId2 || item.relation.agentId
                            }}:{{ item.relation.content }}</span>
                          </template>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="relationView_wrap">
                        <div
                          v-if="msgTypeList.includes(item.msgType)"
                          class="im-chat-text im_Type_other"
                        >
                          <!-- <fieleByFileIdtype :file-id="item.content" :file-id-type="item.msgType" /> -->
                          <fieleByFileIdtypezx
                            :file-id="item.content"
                            :file-id-type="item.msgType"
                            :item-info="item"
                            :session="session"
                            @revokeInfoEv="handleRevokeInfo"
                          />
                        </div>
                        <!-- 引用消息展示 -->
                        <div v-if="item.relation" class="relationView">
                          <template v-if="item.relation.type + '' == '1005'">
                            <span class="khmessage_title">{{ currentSessMap.originalCustName }}:{{
                              item.relation.content
                            }}</span>
                          </template>
                          <template v-if="item.relation.type + '' == '2007'">
                            <span class="khmessage_title">{{
                              item.relation.agentId2 || item.relation.agentId
                            }}:{{ item.relation.content }}</span>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                  <!-- 客户消息 -->
                  <template v-else>
                    <div
                      v-if="item.msgType === 'text' || item.msgType === 'link'"
                      class="im-chat-text chatMesContentLeft"
                    >
                      <!-- <RightclickView
                        :key="item._key" :item-info="item" :isclient="true" :session="session"
                        @revokeInfoEv="handleRevokeInfo" @searchEv="handleSearchFun"
                      /> -->
                      <pre
                        class="preText preImage"
                        v-html="
                          ChatUtils.transform(
                            item.content,
                            session.message.custRes
                          )
                        "
                      />
                      <!-- 引用消息展示 -->
                      <div v-if="item.relation" class="relationView">
                        <template v-if="item.relation.type + '' == '1005'">
                          <span class="khmessage_title">{{ currentSessMap.originalCustName }}:{{
                            item.relation.content
                          }}</span>
                        </template>
                        <template v-if="item.relation.type + '' == '2007'">
                          <span class="khmessage_title">{{
                            item.relation.agentId2 || item.relation.agentId
                          }}:{{ item.relation.content }}</span>
                        </template>
                      </div>
                    </div>
                    <div
                      v-if="msgTypeList.includes(item.msgType)"
                      class="im-chat-text im_Type_other"
                    >
                      <!-- 消息为图片 -->
                      <fieleByFileIdtype
                        :file-id="item.content"
                        :file-id-type="item.msgType"
                      />
                    </div>
                  </template>

                  <div
                    v-if="item.messageType === MessageType.file"
                    class="im-chat-text"
                    style="width: 50%"
                  >
                    <a
                      class="file-box"
                      :title="item.extend.fileName"
                      :href="item.extend.url"
                      @click="openImageProxy($event)"
                    >
                      <div class="file-icon">
                        <i class="iconfont icon-v-xiazai" />
                      </div>
                      <div class="file-text">
                        <div class="file-name">{{ item.extend.fileName }}</div>
                      </div>
                    </a>
                  </div>
                  <div
                    v-if="item.messageType === MessageType.voice"
                    class="im-chat-text"
                    :title="item.msgType"
                    :style="{
                      width:
                        item.extend.time > 40
                          ? '50%'
                          : item.extend.time + 10 + '%'
                    }"
                  >
                    <div @click="handleAudio(item)">
                      <i
                        class="iconfont icon-v-voice"
                        :class="{ 'icon-v-voice-right': item.type === '1005' }"
                      />
                    </div>
                  </div>
                  <!-- 系统消息 -->
                  <div
                    v-if="
                      item.type + '' !== '1005' && item.type + '' !== '2007'
                    "
                    class="im-chat-text xt"
                    :title="$t('qc_myReview_sysMsg', '系统消息')"
                  >
                    <pre
                      v-setHtml="
                        ChatUtils.transform(
                          item.content,
                          session.message.custRes
                        )
                      "
                      class="preText preImage"
                    />
                  </div>
                </li>
              </template>
            </ul>
          </el-scrollbar>
          <!--播放语音-->
          <audio ref="Audio" />
        </div>
        <div class="im-chat-footer">
          <div class="im-chat-tool">
            <!-- 表情 -->
            <svg-icon
              class="Scissors"
              style="width: 24px; height: 24px; margin-right: 8px"
              icon-class="ordinary_icon_emoji"
              @click="handleShowFace"
            />
            <!-- <Sunny style="width: 1em; height: 1em; margin-right: 8px" @click="showFace = !showFace" /> -->
            <!-- 截图 -->
            <!-- <Scissors /> -->
            <svg-icon
              class="Scissors"
              style="width: 24px; height: 24px; margin-right: 8px"
              icon-class="ordinary_icon_scissors"
              @click="handleScissorsFun"
            />
            <!-- 图片上传 <el-icon><FolderChecked /></el-icon> -->
            <upload
              :disabled="btnListFlag"
              class="upload-icon"
              :is-img="true"
              :file-types="[
                'png',
                'jpg',
                'jpeg',
                'gif',
                'docx',
                'doc',
                'xls',
                'xlsx',
                'ppt',
                'pptx',
                'pdf'
              ]"
              @uploadSuccess="uploadSuccess"
            >
              <!-- <FolderChecked style="width: 24px; height: 24px; margin-right: 8px" /> -->
              <svg-icon
                class="Scissors"
                style="width: 24px; height: 24px; margin-right: 8px"
                icon-class="ordinary_icon_image"
              />
            </upload>
            <!-- 消息历史 -->
            <!-- <svg-icon
              class="Scissors" style="width: 24px; height: 24px; margin-right: 8px"
              icon-class="ordinary_icon_chathistory" @click="setShowChatFun"
            /> -->
            <!-- <ChatDotRound style="width: 24px; height: 16px; margin-right: 8px" @click="setShowChatFun" /> -->

            <!-- 截图 -->
            <screen-short
              v-if="screenshotStatus"
              :disabled="btnListFlag"
              @get-image-data="getImg"
              @destroy-component="destroyComponent"
            />

            <faces
              v-if="showFace"
              class="faces-box"
              :face-type="session.message.channelType"
              @insertFace="insertFace"
            />
          </div>
          <div ref="messageEditorWrapperRef" class="message-editor-wrapper">
            <wangeditor
              ref="messageEditorRef"
              v-model="messageContent"
              :is-show-toolbar="false"
              :min-height="250"
              :max-length="2048"
              :upload-image-flag="false"
              class="message-editor"
              @showImagePreview="handleShowImagePreview"
            />
            <!-- 命中统计弹框组件 -->
            <HitCountPopover
              v-if="isShowViewFlag"
              ref="hitCountPopoverRef"
              :reference-element="messageEditorWrapperRef"
              :debounce-time="500"
              @query-success="handleQuerySuccess"
              @query-error="handleQueryError"
              @close="handleHitCountClose"
            />
          </div>
          <div v-if="Object.keys(quoteMessage).length" class="relationInput">
            <div class="relation_wrap">
              <div class="relation_item">
                <template v-if="quoteMessage.type + '' === '1005'">
                  <span>{{ currentSessMap.originalCustName }}:{{
                    quoteMessage.content
                  }}</span>
                </template>
                <template v-if="quoteMessage.type + '' === '2007'">
                  <span>{{ quoteMessage.agentId }}:{{ quoteMessage.content }}</span>
                </template>
              </div>
              <el-icon class="relation_close" @click="relation_closeFun">
                <Close />
              </el-icon>
            </div>
          </div>
          <div class="im-chat-send">
            <el-dropdown trigger="click" class="button_dropdown" split-button @command="handleSendModeChange">
              <el-button
                type="primary"
                :class="{ sendBtn: true, btnColor: !btnListFlag }"
                :disabled="btnListFlag"
                @click="mineSend()"
              >
                <svg-icon class="icon" icon-class="ordinary_icon_send" />
                {{ $t('ob_po_sendInfo', '发送') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="'enter'"
                    :class="{ 'is-active': sendMode === 'enter' }"
                  >
                    <el-icon v-if="sendMode === 'enter'">
                      <Check />
                    </el-icon>
                    <span
                      :style="{
                        marginLeft: sendMode === 'enter' ? '8px' : '24px'
                      }"
                    >
                      Enter {{ $t('ob_po_sendInfo', '发送') }}
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'ctrlEnter'"
                    :class="{ 'is-active': sendMode === 'ctrlEnter' }"
                  >
                    <el-icon v-if="sendMode === 'ctrlEnter'">
                      <Check />
                    </el-icon>
                    <span
                      :style="{
                        marginLeft: sendMode === 'ctrlEnter' ? '8px' : '24px'
                      }"
                    >
                      Ctrl+Enter {{ $t('ob_po_sendInfo', '发送') }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="showPreview" width="50%" @close="closePreview">
      <el-image
        :src="pastImage"
        fit="contain"
        style="width: 100%; height: auto"
      />
      <!-- 自定义 footer -->
      <template #footer>
        <el-button size="large" @click="closePreview">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="handleUploadPastImage">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="chatMessage">
import moment from 'moment'
import RightclickView from './RightclickView.vue'
import { useChatStore } from '@/store/modules/chatStore'
import useUserStore from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import fieleByFileIdtype from '@/components/fileByFileId/indexall.vue'
import fieleByFileIdtypezx from '@/components/fileByFileId/indexallzx.vue'
// import { checkSensitiveWords } from '@/api/omnimedia/sensitivewords.js'
import { uploadFileApi } from '@/api/file/index'
// import ChatHistoryDialog from './ChatHistoryDialog.vue'
// import SearchClickView from './SearchClickView.vue'
import { getMessionInfo } from '@/utils/textCommon'
import { ElMessageBox } from 'element-plus'
import FileCard from './FileCard.vue'
// import { TextBtnStatusObj } from '@/utils/etalkUtils/websocket/webSocketConnect'
// import { TextBtn } from '@/utils/etalkUtils/etalk/textBtnStatus'
import { uuid } from '@/utils/hannah.js'
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect
} from 'vue'
import { Check } from '@element-plus/icons-vue'
import Avatar from '@/components/ChatMessage/Avatar.vue'
import Time from '@/components/ChatMessage/Time.vue'
import Faces from '@/components/ChatMessage/Faces.vue'
// import HistoryMessage from "@/components/HistoryMessage.vue";
import ChatUtils from '@/utils/etalkUtils/newEtalk/ChatUtils'
// import ChatType from '@/utils/etalkUtils/newEtalk/config/ChatType'
import Upload from '@/components/ChatMessage/upload/Upload.vue'
// import GroupApi from "@/api/GroupApi";
// import MessageApi from '@/api/workbench/MessageApi'
import MessageType from '@/utils/etalkUtils/newEtalk/MessageType'
import wangeditor from '@/components/wangeditor/index.vue'

// import { sendMessage } from '@/utils/etalkUtils/etalk/chat'

import {
  textsendMessage,
  textRevokeMessage
} from '@/utils/etalkUtils/etalk/action'
import $bus from '@/utils/bus'
// import { queryMatch } from '@/api/replyMap/replyMatch.js'
import HitCountPopover from './HitCountPopover.vue'

// $bus.on('TEXT_CONSUMER_MSG_RECEIVE', data => {
//   if (data.sessionId === session.message.sessionId) {
//     // messageContent.value = data.content
//     // const params = {
//     //   sendContent: data.content,
//     //   cutsomerName: data.consumerId
//     // }
//     // queryMatch(params).then(res => {
//     //   if (res.data && res.data.replyContent) {
//     //     messageContent.value = res.data.replyContent
//     //   }
//     // })
//   }
// })

const { proxy } = getCurrentInstance()
const chatStore = useChatStore()
const userStore = useUserStore()
const msgTypeList = [
  'audio',
  'video',
  'image',
  'mp3',
  'mp4',
  'pdf',
  'voice',
  'ppt',
  'word',
  'excel'
]

// 发送模式：'enter' 或 'ctrlEnter'
const SEND_MODE_KEY = 'chat_send_mode'
const sendMode = ref(localStorage.getItem(SEND_MODE_KEY) || 'enter')

// 当前 坐席信息
// const currentUser = userStore.getUser()
// 是否展示表情
const showFace = ref(false)
const session = inject('session')
console.log('session', session)
const { userMap } = storeToRefs(userStore)
// 获取当前实例自己的 sessionId（每个实例独立的 sessionId）
// 注意：这里使用 session.message.sessionId，而不是全局的 sessionMapId
const currentInstanceSessionId = computed(() => {
  return session?.message?.sessionId || null
})

onMounted(() => {
  handleCurrentMessageInfo()
  // 在编辑器容器上添加键盘事件监听
  setupEditorKeyboardListener()
})
// 处理编辑器中的图片预览事件
const handleShowImagePreview = (imageData, type) => {
  console.log('handleShowImagePreview', imageData, type)

  if (type === 'rtf') {
    // 处理 RTF 图片数据（从 Word 等富文本编辑器粘贴）
    if (imageData && imageData.length > 0) {
      const rtfImage = imageData[0] // 只处理第一个图片
      try {
        // 将十六进制数据转换为 base64
        const binaryData = hexToBinary(rtfImage.hex)
        const blob = binaryToBlob(binaryData, rtfImage.type)
        const reader = new FileReader()

        reader.onload = (e) => {
          pastImageData.value = blob
          showPreview.value = true
          pastImage.value = e.target.result
        }

        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('处理 RTF 图片数据失败:', error)
        ElMessage.error('图片数据处理失败')
      }
    }
  } else if (type === 'file') {
    // 处理直接粘贴的图片文件对象
    if (imageData && imageData.length > 0) {
      const imageFileObj = imageData[0] // 只处理第一个图片
      pastImageData.value = imageFileObj.file || imageFileObj // 兼容不同的数据结构
      showPreview.value = true

      // 创建文件预览 URL
      const reader = new FileReader()
      reader.onload = (e) => {
        pastImage.value = e.target.result
      }
      reader.readAsDataURL(pastImageData.value)
    }
  } else if (type === 'base64') {
    // 处理 base64 格式的图片数据
    if (imageData && imageData.length > 0) {
      const base64Image = imageData[0] // 只处理第一个图片
      pastImageData.value = base64Image.data // base64 字符串
      showPreview.value = true
      pastImage.value = base64Image.data // 直接使用 base64 数据作为预览
    }
  }
}

const showPreview = ref(false)
const pastImage = ref('')
const pastImageData = ref('')
// 发送图片
const handleUploadPastImage = () => {
  uploadFileApi({ file: pastImageData.value }).then(res => {
    console.log('res', res)
    showPreview.value = false
    textsendMessage(res.fileId, sessionMapId.value, 'image')
  })
}
const closePreview = () => {
  showPreview.value = false
}

// 设置编辑器键盘事件监听
const setupEditorKeyboardListener = () => {
  nextTick(() => {
    let retryCount = 0
    const maxRetries = 10

    // 等待编辑器创建完成
    const trySetupListener = () => {
      if (messageEditorRef.value && messageEditorWrapperRef.value) {
        // 查找编辑器内部的 contenteditable 元素
        const editorContainer = messageEditorWrapperRef.value
        const editableElement = editorContainer.querySelector('[contenteditable="true"]')

        if (editableElement) {
          // 如果之前已经添加过监听器，先移除
          if (editableElementRef.value) {
            editableElementRef.value.removeEventListener('keydown', handleEditorKeyDown, true)
          }

          // 直接在可编辑元素上监听键盘事件（使用捕获阶段确保能捕获到）
          editableElement.addEventListener('keydown', handleEditorKeyDown, true)
          editableElementRef.value = editableElement
          console.log('编辑器键盘事件监听已设置')
        } else {
          // 如果找不到，延迟重试
          retryCount++
          if (retryCount < maxRetries) {
            setTimeout(trySetupListener, 100)
          } else {
            console.warn('编辑器键盘事件监听设置失败：找不到可编辑元素')
          }
        }
      } else {
        // 如果编辑器还没创建，延迟重试
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(trySetupListener, 100)
        } else {
          console.warn('编辑器键盘事件监听设置失败：编辑器未创建')
        }
      }
    }

    trySetupListener()
  })
}

// 编辑器键盘事件处理
const handleEditorKeyDown = event => {
  // 只处理 Enter 键
  if (event.key === 'Enter' || event.keyCode === 13) {
    // 读取最新的发送模式配置
    const currentSendMode = localStorage.getItem(SEND_MODE_KEY) || 'enter'

    // 根据发送模式判断
    if (currentSendMode === 'enter') {
      // Enter 发送模式：Shift+Enter 换行，Ctrl+Enter 换行，Enter 发送
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        return // 允许换行，不发送消息
      }
      // 单独按下 Enter 键时，阻止默认行为并发送消息
      event.preventDefault()
      event.stopPropagation()
      if (!btnListFlag.value) {
        mineSend()
      }
    } else if (currentSendMode === 'ctrlEnter') {
      // Ctrl+Enter 发送模式：Enter 换行，Ctrl+Enter 发送
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+Enter 或 Cmd+Enter 发送
        event.preventDefault()
        event.stopPropagation()
        if (!btnListFlag.value) {
          mineSend()
        }
      }
      // 单独 Enter 键允许换行（不做处理，不阻止默认行为）
    }
  }
}

// 处理发送模式切换
const handleSendModeChange = mode => {
  sendMode.value = mode
  localStorage.setItem(SEND_MODE_KEY, mode)
  ElMessage.success(
    mode === 'enter'
      ? 'Enter ' + proxy.$t('ob_po_sendInfo', '发送') + '，Shift+Enter 换行'
      : 'Ctrl+Enter ' + proxy.$t('ob_po_sendInfo', '发送') + '，Enter 换行'
  )
}

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  if (editableElementRef.value) {
    editableElementRef.value.removeEventListener(
      'keydown',
      handleEditorKeyDown,
      true
    )
    editableElementRef.value = null
  }
})

// //转发
// const dialogVisible = ref(false);
// 展示用户信息
// const show = ref(false)
// //群人数
// const count = ref(0);
//

// const isFindType = (value) => {
//   if (value === '1') return 'image'
//   if (value === '2') return 'mp3'
//   if (value === '3') return 'mp4'
// }

const loading = ref(true)
// 语音
const Audio = ref()
const {
  sessionMapId,
  chatMessage,
  _isMonitor,
  _isInsert,
  historychatMessage,
  // withdrawFlag,
  quoteMessageObj,
  pendingMessageContent
} = storeToRefs(chatStore)

const quoteMessage = computed(() => {
  return quoteMessageObj.value[sessionMapId.value] || {}
})

const isShowViewFlag = computed(() => {
  if (chatStore.getSessionItemObj(sessionMapId.value).isconnected === 0) {
    return false
  } else {
    return (
      session?.message?.sessionId !== null &&
      session?.message?.sessionId === sessionMapId.value
    )
  }
})
// 控制播放还是暂停音频文件
const handleAudio = item => {
  if (Audio.value.paused) {
    Audio.value.src = item.extend.url
    Audio.value.play()
  } else {
    // item
    Audio.value.src = ''
    Audio.value.stop()
  }
}
const screenshotStatus = ref(false)
// 截图
const handleScissorsFun = () => {
  if (btnListFlag.value) {
    return false
  }
  if (window.innerWidth > 2560 || window.innerHeight > 1440) {
    ElMessageBox.confirm(
      '您当前的分辨率过大截图可能会异常，确认要截图吗？',
      proxy.$t('common_dialog_tips', '温馨提示'),
      {
        confirmButtonText: proxy.$t('common_modal_confirmBtn', '确认'),
        cancelButtonText: proxy.$t('common_opt_cancel', '取消'),
        type: 'warning',
        draggable: true,
        customClass: 'warning',
        overflow: true,
        confirmButtonClass: 'el-button--warning'
      }
    )
      .then(() => {
        screenshotStatus.value = true
      })
      .catch(() => {
        screenshotStatus.value = false
      })
  } else {
    screenshotStatus.value = true
  }
}

// 截图按了√以后生成64编码
async function getImg (base64) {
  fetch(base64)
    .then(res => res.blob())
    .then(blob => {
      console.log('getImg', blob)
      uploadFileApi({ file: blob }).then(res => {
        console.log('res', res)
        // ElMessage.success('文件上传成功')
        textsendMessage(res.fileId, sessionMapId.value, 'image')
      })
    })
  // 截图完成后显示弹框
  screenshotStatus.value = false
}
// 取消截图 显示弹窗 隐藏截图插件
function destroyComponent () {
  screenshotStatus.value = false
}

// 设置 取name 后俩字
const setNameLengthFun = name => {
  console.log('测试name', name)
  return name.slice(-2)
}
// 消息撤回

const handleRevokeInfo = res => {
  console.log('handleRevokeInfo', res)
  textRevokeMessage(sessionMapId.value, res.msguuid)
}
// {{ $t('common_op_search','搜索') }}
const handleSearchFun = res => {
  // console.log('handleSearchFun', res.content)
  $bus.emit('KnowledgeSearch', res)
}

// const btnList = chatStore.getTextBtnList(sessionMapId.value) || {}
const btnListFlag = computed(() => {
  if (sessionMapId.value) {
    const btnList = useChatStore().getTextBtnList(sessionMapId.value)
    return btnList.sending.disable
  }
  return false
})
// console.log('btnList', btnList)
// 用户
// const users = ref()
loading.value = false
const emit = defineEmits(['setSessionMapItem'])
// 是否展示聊天记录
// 通过 当前的 sessionMapId 来查 用户信息
const isDisabled = ref(false)
const currentSessMap = ref()
const originalCustNumberCurrent = ref()
watchEffect(() => {
  if (sessionMapId.value) {
    currentSessMap.value =
      chatStore.getSessionMapInfo(sessionMapId.value) || {}
    originalCustNumberCurrent.value =
      currentSessMap.value.originalCustNumber || ''
    emit('setSessionMapItem', currentSessMap.value)
    // console.log('currentSessMap_123', currentSessMap)
    // 是否监听
    if (_isMonitor.value && _isInsert.value) {
      isDisabled.value = false
    } else {
      // 是否退出
      if (currentSessMap.value.isconnected === 0 || _isMonitor.value) {
        isDisabled.value = true
        // 坐席已经离线
      } else {
        isDisabled.value = false
      }
    }
  } else {
    isDisabled.value = true
  }
  // console.log('btnList', btnList)
})
const scrollbarRef = ref()

const setScrollTopFun = height => {
  const times = setInterval(() => {
    const div = document.getElementById(
      'message_box_ul' + session.message.sessionId
    )
    if (div) {
      nextTick(() => {
        if (!height) {
          scrollbarRef.value?.setScrollTop(div.scrollHeight)
        } else {
          scrollbarRef.value?.setScrollTop(height)
        }
      })
    }
    clearInterval(times)
  }, 200)
}
// 当前的 sessionMapId  来查 聊天记录
const messageList = computed(() => {
  return (chatMessage.value.get(sessionMapId.value) ?? []).map(item => ({
    ...item,
    _key: item.msguuid || `${getUuid()}`
  }))
})
const getUuid = () => {
  return uuid(32)
}

// || moment().format('YYYY-MM-DD HH:mm:ss')
// 一进来 查历史
const handleCurrentMessageInfo = async () => {
  loading.value = true
  const params = {
    originalCustNumber: currentSessMap.value.originalCustNumber,
    actTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    direct: '1', // 1-向上，2-向下
    pageSize: 20
  }
  const isGetNewInfo = await getMessionInfo(
    params,
    currentSessMap.value.sessionId,
    loading
  )
  // console.log('isGetNewInfo', isGetNewInfo)
  if (isGetNewInfo) {
    setScrollTopFun()
  }
}

// 滑动 查历史消息，不包含当天数据
const handleScrollFun = async item => {
  if (item.scrollTop === 0) {
    console.log(
      'handleScrollFun查历史消息',
      historychatMessageList.value,
      'sessionMapId.value',
      sessionMapId.value,
      'historychatMessage',
      historychatMessage.value,
      'messageList',
      messageList.value
    )
    loading.value = true
    const params = {
      originalCustNumber: currentSessMap.value.originalCustNumber,
      actTime:
        historychatMessageList.value[0]?.time ||
        messageList.value[0]?.time ||
        moment().format('YYYY-MM-DD HH:mm:ss'),
      direct: '1', // 1-向上，2-向下
      pageSize: 20
    }
    const isGetNewInfo = await getMessionInfo(
      params,
      currentSessMap.value.sessionId,
      loading
    )
    if (isGetNewInfo) {
      setScrollTopFun(1000)
    }
  }
}

// 查 历史 聊天记录
// const historychatMessageList = computed(() => {
//   const keys = historychatMessage.value.keys()
//   console.log('keys', keys)
//   return []
// })
const messageContent = ref('')
const messageEditorRef = ref()
const messageEditorWrapperRef = ref()
const hitCountPopoverRef = ref()
// const historychatMessageList = ref([])
// 保存可编辑元素的引用，用于清理事件监听器
const editableElementRef = ref(null)
// watch(
//   () => historychatMessage.value,
//   () => {
//     // const keys = historychatMessage.value.keys()
//     // const keysVal = keys.next().value
//     if (currentInstanceSessionId.value) {
//       historychatMessageList.value = historychatMessage.value.get(
//         currentInstanceSessionId.value
//       )
//     } else {
//       historychatMessageList.value = []
//     }
//   },
//   { deep: true }
// )

const historychatMessageList = computed(() => {
  console.log(
    '【watch-historychatMessage-997】',
    historychatMessage.value,
    sessionMapId.value,
    chatStore
  ); 
  return historychatMessage.value.get(session.message.sessionId) ?? [];
});

watch(
  () => chatMessage.value.get(currentInstanceSessionId.value),
  () => {
    setScrollTopFun()
  },
  { deep: true }
)

// 使用 computed 来跟踪当前实例的待填充内容，确保每个实例都能正确响应
// 每个实例使用自己的 sessionId，而不是全局的 sessionMapId
const currentPendingContent = computed(() => {
  const instanceSessionId = currentInstanceSessionId.value
  if (!instanceSessionId) return null
  // 将 Map.get() 的结果包装成对象，确保 Vue 能追踪到变化
  const content = pendingMessageContent.value.get(instanceSessionId)
  return content ? { sessionId: instanceSessionId, content } : null
})

// 监听待填充的消息内容（每个实例独立监听自己的 sessionId）
watch(
  () => currentPendingContent.value,
  (newVal, oldVal) => {
    // 获取当前实例的 sessionId
    const instanceSessionId = currentInstanceSessionId.value
    if (!instanceSessionId) return

    // 确保是当前实例的内容且确实有变化
    if (newVal && newVal.sessionId === instanceSessionId && newVal.content) {
      // 只有当内容确实变化时才处理（避免重复处理）
      if (!oldVal || oldVal.content !== newVal.content) {
        console.log('当前实例收到待填充内容', {
          sessionId: newVal.sessionId,
          content: newVal.content,
          instanceId: instanceSessionId,
          globalSessionMapId: sessionMapId.value
        })
        // 获取并清除内容（只清除当前实例对应的内容）
        const messageContentValue =
          chatStore.getAndClearPendingMessageContent(instanceSessionId)
        if (messageContentValue) {
          messageContent.value = messageContentValue
          // 使用 nextTick 确保编辑器已经渲染完成
          nextTick(() => {
            if (messageEditorRef.value) {
              // 使用 setHtmlAndFocusEnd 设置内容并将光标移到末尾
              messageEditorRef.value.setHtmlAndFocusEnd(messageContentValue)
            }
          })
        }
      }
    }
  },
  { deep: true, immediate: false }
)

// 额外监听整个 Map 的变化作为兜底方案，确保所有实例都能检测到 Map 的增删改
// 当有新的内容添加到 Map 时，所有实例都会触发这个监听，但只有匹配的实例会处理
watch(
  () => pendingMessageContent.value,
  () => {
    // 使用当前实例自己的 sessionId，而不是全局的 sessionMapId
    const instanceSessionId = currentInstanceSessionId.value
    if (instanceSessionId) {
      const content = pendingMessageContent.value.get(instanceSessionId)
      // 只有当内容存在且与当前 messageContent 不同时才处理
      if (content && content !== messageContent.value) {
        console.log('Map变化检测到待填充内容（兜底方案）', {
          sessionId: instanceSessionId,
          content,
          instanceId: instanceSessionId,
          globalSessionMapId: sessionMapId.value
        })
        const messageContentValue =
          chatStore.getAndClearPendingMessageContent(instanceSessionId)
        if (messageContentValue) {
          messageContent.value = messageContentValue
          nextTick(() => {
            if (messageEditorRef.value) {
              // 使用 setHtmlAndFocusEnd 设置内容并将光标移到末尾
              messageEditorRef.value.setHtmlAndFocusEnd(messageContentValue)
            }
          })
        }
      }
    }
  },
  { deep: true, immediate: false }
)

// 监听当前实例的 sessionId 变化（当实例切换会话时），检查是否有待填充的内容
// 注意：这里监听的是当前实例自己的 sessionId，而不是全局的 sessionMapId
watch(
  () => currentInstanceSessionId.value,
  (newSessionId, oldSessionId) => {
    // 当实例初始化或切换会话时检查
    if (newSessionId) {
      // immediate: true 时，oldSessionId 可能是 undefined，需要处理初始化情况
      if (newSessionId !== oldSessionId) {
        const content =
          chatStore.getAndClearPendingMessageContent(newSessionId)
        if (content) {
          console.log('实例切换会话时发现待填充内容', {
            sessionId: newSessionId,
            content,
            instanceId: newSessionId,
            oldSessionId: oldSessionId || 'initial'
          })
          messageContent.value = content
          // 使用 nextTick 确保编辑器已经渲染完成
          nextTick(() => {
            if (messageEditorRef.value) {
              // 使用 setHtmlAndFocusEnd 设置内容并将光标移到末尾
              messageEditorRef.value.setHtmlAndFocusEnd(content)
            }
          })
        }
      }
    }
  },
  { immediate: true }
)

// 监听 messageContent 变化，用于触发命中统计查询
// 注意：不再同步到编辑器，因为 v-model 已经处理了双向绑定
watch(
  () => messageContent.value,
  (newContent, oldContent) => {
    console.log('=== messageContent watch 触发 ===')
    console.log('oldContent:', oldContent)
    console.log('newContent:', newContent)

    // 触发命中统计查询
    if (newContent !== undefined) {
      const textNoHtmlValueNew = newContent.replace(/<[^>]*>/g, '').trim()
      console.log('messageContent watch - 触发命中统计查询', textNoHtmlValueNew)
      // 触发命中统计查询（防抖在组件内部处理）
      if (
        hitCountPopoverRef.value &&
        textNoHtmlValueNew !== '' &&
        textNoHtmlValueNew !== textNoHtmlValue.value
      ) {
        textNoHtmlValue.value = textNoHtmlValueNew
        hitCountPopoverRef.value.query(textNoHtmlValueNew)
      }
    }

    console.log('=== messageContent watch 结束 ===')
  },
  { immediate: true }
)

// 填充假数据
// chatStore.addMessageAll()

// 附件和图片点击展开
const openImageProxy = event => {
  event.preventDefault()
  const target = event.currentTarget
  console.log('ondeName', target)
  if (target.nodeName === 'IMG') {
    proxy.$winControl.default.openURL(event.target.src)
  } else if (target.className === 'file-box' || target.nodeName === 'A') {
    proxy.$winControl.default.openURL(target.href)
  }
}

// 引用消息撤回
const relation_closeFun = () => {
  // console.log('item', item)
  chatStore.delquoteMessageObj(currentInstanceSessionId.value)
}
const textNoHtmlValue = ref('')


// 命中统计查询成功回调
const handleQuerySuccess = data => {
  // 可以在这里处理查询成功后的逻辑
  console.log('命中统计查询成功', data)
}

// 命中统计查询失败回调
const handleQueryError = error => {
  // 可以在这里处理查询失败后的逻辑
  console.error('命中统计查询失败', error)
}

// 命中统计弹框关闭回调
const handleHitCountClose = () => {
  // 可以在这里处理弹框关闭后的逻辑
}

// 发送消息
const mineSend = async () => {
  // console.log("消息体开始",'chat',sessionMapItem.value.sessionId,'currentUser',currentUser.id);
  // if (btnListFlag.value) return false
  const relation =
    chatStore.getquoteMessageObj(currentInstanceSessionId.value) || ''
  // 从编辑器获取 HTML 内容
  let content = ''
  if (messageEditorRef.value) {
    content = messageEditorRef.value.getHtml() || ''
    console.log('从编辑器获取的内容:', content)
    console.log('messageContent.value 的值:', messageContent.value)
    if (content.length > 2048) {
      ElMessage.error('发送内容太长[最多填写2048]')
      return
    }
  } else {
    content = messageContent.value || ''
    console.log('编辑器不存在，使用 messageContent.value:', content)
  }
  // 检查内容是否为空（去除 HTML 标签后）
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  if (textContent === '') {
    return
  }
  console.log('发送消息，消息体---', content)

  // 先发送消息
  textsendMessage(
    content,
    currentInstanceSessionId.value,
    'text',
    '',
    relation
  )

  // 使用 nextTick 确保消息发送后再清空编辑器
  nextTick(() => {
    // 清空编辑器内容
    if (messageEditorRef.value) {
      // 先设置空内容，再清空编辑器
      messageEditorRef.value.setHtml('')
      messageEditorRef.value.clearContent()
    }
    messageContent.value = ''
    chatStore.delquoteMessageObj(currentInstanceSessionId.value)
  })
}

// const subSendMessage = (messageContent, channelType) => {
//   const sessionId = chatStore.getSessionMapId()
//   sendMessage(messageContent, sessionId, channelType)
// }
// 打开表情面板（保存光标位置）
const handleShowFace = () => {
  if (btnListFlag.value) {
    return false
  }
  // 关键：在打开表情面板前保存光标位置
  try {
    if (messageEditorRef.value) {
      messageEditorRef.value.saveSelection()
      console.log('光标位置已保存')
    }
  } catch (error) {
    console.error('保存光标位置时出错:', error)
  }
  showFace.value = !showFace.value
}

// 添加表情
const insertFace = item => {
  console.log('insertFace 收到的参数:', item, '类型:', typeof item)

  // 确保 item 是字符串
  if (typeof item !== 'string') {
    console.error('insertFace 参数必须是字符串，收到:', typeof item, item)
    return
  }

  if (messageEditorRef.value) {
    // 使用 insertText 方法在保存的光标位置插入表情文本
    console.log('调用 messageEditorRef.insertText，参数:', item)
    messageEditorRef.value.insertText(item)
  } else {
    console.log('编辑器不存在，直接追加到 messageContent')
    messageContent.value = messageContent.value + item
  }
  showFace.value = false
}
nextTick(() => {
  ChatUtils.imageLoad('message_box_ul')
})
// 上传成功
const uploadSuccess = extend => {
  console.log('extend', extend)

  let type = 'image'
  const typeList = ['.png', '.jpg', '.jpeg', '.gif']
  if (typeList.includes(extend.fileType)) {
    type = 'image'
  } else if (['.docx', '.doc'].includes(extend.fileType)) {
    type = 'word'
  } else if (['.xlsx', '.xls'].includes(extend.fileType)) {
    type = 'excel'
  } else if (['.pptx', '.ppt'].includes(extend.fileType)) {
    type = 'ppt'
  } else if (['.pdf'].includes(extend.fileType)) {
    type = 'pdf'
  }
  const relation =
    chatStore.getquoteMessageObj(currentInstanceSessionId.value) || ''
  textsendMessage(
    extend.fileId,
    currentInstanceSessionId.value,
    type,
    extend.fileFullname,
    relation
  )
  chatStore.delquoteMessageObj(currentInstanceSessionId.value)
}
</script>

<style lang="scss" scoped>
.relationInput {
  max-height: 50px;
  overflow-y: auto;

  .relation_wrap {
    position: relative;
    display: inline-block;
    background-color: #999;
    border-radius: 5px;
    padding-right: 20px;

    // display: flex;
    .relation_item {
      padding: 5px 10px;
      display: inline-block;
      // margin-right: 20px;
    }

    .relation_close {
      position: absolute;
      top: 7px;
    }
  }
}

.ChatMessage {
  border-left: 1px solid #d3dae6;

  .useAvatar {
    font-size: 14px;
    background-color: var(--el-color-primary);
  }

  .upload-icon {
    vertical-align: sub;
  }

  .im-chat-main {
    margin-top: 10px;
    flex: 1;
    display: flex;
    flex-direction: row;
    height: calc(100% - 40px);

    .Scissors {
      cursor: pointer;
      color: #98a2b3;
    }

    .screenshort {
      z-index: 1000000;
    }

    .im-chat-main-left {
      flex: 4;
      display: flex;
      flex-direction: column;

      .history {
        .history_item {
          font-size: 14px;
          text-align: center;
          color: #ccc;
        }
      }

      // .im-chat-main-box {
      //   flex: 4;
      //   /* padding: 1rem 1rem 0 1rem; */
      //   /* overflow-x: hidden;
      //   overflow-y: auto; */
      // }
    }

    .message-img {
      max-width: 20rem;
    }

    .preText {
      word-wrap: break-word;
      word-break: break-word;
      white-space: pre-wrap;
      img{
        max-width: 300px;
      }
    }

    .im-chat-users {
      width: 180px;
      border-left: 1px solid #cccccc;

      .chat-user-list {
        list-style: none;
        margin: 0;

        .user {
          cursor: pointer;
          padding: 5px 2px;
          position: relative;
          display: flex;
          align-items: center;

          &:hover {
            background-color: #eeeeee;

            &:after {
              content: '...';
              position: absolute;
              right: 10px;
              font-weight: bold;
            }
          }

          & > .im-chat-avatar {
            width: 3.2rem;
            height: 3.2rem;
            display: inline-block;
            vertical-align: middle;

            & > img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .messages {
      width: 100%;
      // height: calc(100% - 3rem);
      overflow-y: auto;
      flex: 4;

      .preText,
      pre {
        word-wrap: break-word;
        word-break: break-word;
        white-space: pre-wrap;
      }

      ul {
        width: 100%;
        padding: 0px 10px 0 5px;

        li {
          position: relative;
          font-size: 0;
          margin-bottom: 10px;
          padding-left: 55px;
          min-height: 68px;

          /* 这块是 对方的聊天样式 */
          .im_Type_other {
            padding: 10px !important;
          }

          .im-chat-text {
            position: relative;
            line-height: 22px;
            margin-top: 25px;
            padding: 10px;
            background-color: #e2e2e2;
            border-radius: 3px;
            color: #333;
            word-break: break-all;
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
            line-height: 1.2;
            border-radius: 0px 12px 12px 12px;

            pre {
              margin: 0;
            }

            .faceImage {
              width: 20px;
            }

            // &:after {
            //   content: "";
            //   position: absolute;
            //   left: -10px;
            //   top: 13px;
            //   width: 0;
            //   height: 0;
            //   border-style: solid dashed dashed;
            //   border-color: #e2e2e2 transparent transparent;
            //   overflow: hidden;
            //   border-width: 10px;
            // }

            pre {
              width: 100%;
              word-wrap: break-word;
              word-break: break-word;
              white-space: pre-wrap;

              img {
                display: block;
              }
            }
          }

          .chatzx {
            cursor: pointer;
            font-size: 14px;
          }
        }
      }
      .chatMesContent {
        .relationView {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;

          span {
            line-height: 1.2;
            display: inline-block;
            background-color: #e2e2e2;
            padding: 5px;
            border-radius: 5px;
          }
        }
      }

      .chatMesContentLeft {
        .relationView {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;

          span {
            line-height: 1.2;
            display: inline-block;
            background-color: #e2e2e2;
            padding: 5px;
            border-radius: 5px;
          }
        }
      }
      .im-chat-user {
        width: 4rem;
        height: 4rem;
        padding: 10px 3px 3px 3px;
        position: absolute;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        left: 3px;
        right: auto;

        .message-info {
          position: absolute;
          left: 55px;
          top: -2px;
          width: 100%;
          min-width: 400px;
          line-height: 24px;
          font-size: 12px;
          white-space: nowrap;
          color: #999;
          text-align: left;
          font-style: normal;

          .topName {
            font-weight: 600;
            font-size: 14px;
            color: #343741;
          }

          i {
            font-style: normal;
            padding-left: 10px;
          }
        }

        .right {
          right: 0;
          text-align: right;
          left: auto;

          i {
            padding-right: 10px;
          }
        }

        img {
          width: 4rem;
          height: 4rem;
        }
      }

      .revoke {
        text-align: center;
        color: #ccc;
        margin: 20px 0;
      }

      .im-chat-mine {
        text-align: right;
        padding-left: 0;
        padding-right: 55px;

        .relationView_wrap {
          .relationView {
            font-size: 12px;
            color: #666666;
            margin-top: 10px;

            span {
              line-height: 1.2;
              display: inline-block;
              background-color: #e2e2e2;
              padding: 5px;
              border-radius: 5px;
            }
          }
        }

        /* 这块是 我的聊天样式 */
        .im-chat-text {
          margin-left: 10px;
          text-align: left;
          background-color: var(--el-color-primary);
          color: #fff;
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.2;
          border-radius: 12px 0px 12px 12px;

          .faceImage {
            width: 20px;
          }

          pre {
            margin: 0;
          }

          .faceImage {
            width: 20px;
          }

          // &:after {
          //   left: auto;
          //   right: -10px;
          //   border-top-color: #0060F6;
          // }
        }

        .im-chat-user {
          left: auto;
          right: 3px;

          cite {
            left: auto;
            right: 60px;
            text-align: right;

            i {
              padding-left: 0;
              padding-right: 10px;
            }
          }

          .message-info {
            right: 55px !important;
            display: inline-block;
          }
        }
      }
    }
  }

  .im-chat-footer {
    // border-top: 1px solid #ccc;
    margin: 0 16px 16px;
    height: 300px;
    display: flex;
    flex-direction: column;
    background-color: #f1f4fa;
    border-radius: 8px;

    .im-chat-tool {
      padding: 12px 12px;
      height: 40px;
      position: relative;

      i {
        font-size: 2rem;
        cursor: pointer;
        margin: 1rem;
      }

      .faces-box {
        position: absolute;
        bottom: 35px;
      }

      .ivu-upload {
        display: inline-block;
      }

      .history-message-btn {
        float: right;
      }
    }

    .message-editor-wrapper {
      flex: 1;
      overflow: hidden;
      background-color: #f1f4fa;
      border-radius: 8px;
      margin: 0 16px;
      display: flex;
      flex-direction: column;
      position: relative;

      .message-editor {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: none !important;

        :deep(> div) {
          border: none !important;
          background-color: transparent !important;
        }

        :deep(.w-e-text-container) {
          background-color: #f1f4fa !important;
          border: none !important;
          flex: 1;
        }

        :deep(.w-e-text-placeholder) {
          color: #999;
        }

        :deep(.w-e-toolbar) {
          border-bottom: 1px solid #e0e0e0;
          background-color: #f8f9fa;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }

        :deep(.w-e-text-container-wrapper) {
          border: none !important;
        }
      }
    }

    .textarea {
      text-indent: 10px;
      border: 0;
      padding: 5px;
      width: 100%;
      flex: 1;
      resize: none;
      background-color: #f1f4fa !important;

      &:focus-visible {
        border: 0;
        box-shadow: none;
        background-color: transparent;
        outline: none;
      }

      > :deep(textarea) {
        height: 100px;
        background-color: #f1f4fa !important;
        box-shadow: none;

        &:focus {
          border: 0;
          box-shadow: none;
          background-color: transparent;
        }
      }
    }

    .im-chat-send {
      /* height: 4rem; */
      // position: relative;
      text-align: right;
      padding: 0 1rem 1rem 0;

      .btnColor {
        // 保留用于未来样式扩展
        // 占位符，避免空规则集警告
        display: inherit;
      }

      .sendBtn {
        height: 32px;

        .icon {
          margin-right: 10px;
        }
      }

      // split-button 样式调整
      :deep(.el-dropdown) {
        .el-button {
          height: 32px;
        }
      }

      :deep(.el-dropdown-menu__item.is-active) {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }
  }

  .right-menu {
    position: absolute;
    z-index: 999;
    background-color: #69cbe9;
    display: inline-block;
  }

  .im-chat-top {
    border-bottom: 1px solid #cccccc;
    color: #323232;
    padding: 0 0 5px 10px;
    font-size: 24px;
    font-weight: bold;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu {
      color: #323232;
      display: inline-block;
      padding: 0 10px;
    }
  }

  .user-model {
    .user-model-img {
      padding: 15px;
      text-align: center;

      img {
        border-radius: 50%;
      }
    }

    .user-model-item {
      display: flex;
      padding: 5px 0;

      label {
        flex: 2;
        font-weight: bold;
        text-align: right;
      }

      span {
        flex: 3;
      }
    }
  }

  .file-box {
    width: 100%;
    min-height: 20px;
    display: flex;
    background-color: #efefef;
    color: #666666;

    .file-icon {
      background-color: #cccccc;
      padding: 10px;
      flex: 1;
      flex-shrink: 0;

      .iconfont {
        line-height: normal;
        font-size: 4rem;
      }
    }

    .file-text {
      width: 0;
      padding: 10px;
      flex: 5;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      overflow: hidden;

      .file-name {
        -webkit-line-clamp: 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.im-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.ivu-scroll-wrapper {
  margin: 0 !important;
}

.ivu-scroll-container {
  padding: 15px 15px 5px;
  overflow-y: visible !important;
}

/* 重新覆盖iview 里面的 model 小于768px 时候 宽度变100% 的问题 */
@media (max-width: 768px) {
  .user-model {
    .ivu-modal {
      width: 30rem !important;
      margin: 0 auto;
    }
  }
}

.history-message {
  width: 80%;
  height: calc(100% - 30px);
}

.page {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0.5rem;
}

.ivu-drawer-body {
  padding: 0 !important;

  .messages {
    height: calc(100% - 3rem);
  }
}

.model-footer {
  text-align: right;
  margin: 10px;
}

.icon-v-voice-right:after {
  transform: rotate(180deg) !important;
}
</style>
