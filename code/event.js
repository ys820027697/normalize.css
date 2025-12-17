import { useChatStore } from '@/store/modules/chatStore'
import useUserStore from '@/store/modules/user'
import useSessionStore from '@/store/modules/sessionStore'
import { TextBtn } from '@/utils/etalkUtils/etalk/textBtnStatus'
// import $bus from '@/utils/bus'
// 处理数据 和动作

// 连接服务器成功 ON_SERVER_CONNECT
// 注意 消息体 一定不要用 【】 包起来  表情是 【】 包起来的

// 接听完成状态
export function toReceivedSetData_Action (sessionMap) {
  sessionMap.custGroup = sessionMap.groupNo
  sessionMap.isconnected = '1'
  console.log('接听成功', sessionMap, TextBtn.btnStatusList)
  const btnList = JSON.parse(JSON.stringify(TextBtn.btnStatusList))
  useChatStore().setTextBtnList(sessionMap.sessionId, btnList)
  // const currentSessionId = useChatStore().getSessionMapId()
  // if (currentSessionId === sessionMap.sessionId) {
  // }
  // if (type !== 'false') {
  // 更新sessionMap
  // TODO 拼接 图片的路径   &tenantId=${JSON.parse(localStorage.getItem('dsKey'))}
  if (sessionMap.headImgId) {
    const img = `${import.meta.env.VITE_APP_BASE_API}/file/file/download?fileid=${sessionMap.headImgId}&dsKey=${JSON.parse(localStorage.getItem('dsKey'))}`
    sessionMap.headImgUrl = img
  }
  useChatStore().addSessionMap(sessionMap, sessionMap.sessionId)
  // }
  // }

  // 更新sessionId
  useChatStore().setSessionMapId(sessionMap.sessionId)
  useSessionStore().setCurrentSession(sessionMap.sessionId)
  useSessionStore().addSessionView(sessionMap.sessionId)
  // 加入四个状态
  // 监督员  _isMonitor:false,  挂断 _isHangup : false,  插入 _isInsert : true,  已插入  _isInserted : false,
  // useUserStore().setCurrentMapItemKey('_isMonitor', false)
  // useUserStore().setCurrentMapItemKey('_isHangup', false)
  // useUserStore().setCurrentMapItemKey('_isInsert', true)
  // useUserStore().setCurrentMapItemKey('_isInserted', false)
  // 更新用户数据
  useUserStore().storeUser(sessionMap.staffNo, { name: sessionMap.staffName, avatar: '' })
}

// 挂断当前会话
export function textAgentHangupComplete_Action (data) {
  // 修改当前 sessionId 的状态
  useChatStore().setSessionMapItemKey(data.sessionId, 'isconnected', 0)
  // const currentSessionId = useChatStore().getSessionMapId()
  TextBtn.consumerExit(data.sessionId)

  console.log('挂断会话成功_TextBtn', data.sessionId)
  data.content = `(${data.agentId})挂断了会话，请进行小结！`
  textSystemMessages_Action(data)
  // deletaSessionMapItem_Action(sessionId)
}
// 退出监听成功
export function textAgentListEnoutComplete_Action (data) {
  const currentSessionId = useChatStore().getSessionMapId()
  if (currentSessionId === sessionId) {
    TextBtn.consumerExit(data.sessionId)
    useChatStore().setTextIsMonitor(false)
    console.log('退出监听成功_TextBtn')
  }
}
// 坐席退出会话 退出监听
export function text_ON_ADMIN_LISTENOUT_COMPLETE_Action (data) {
  data.content = `座席(${data.agentId})退出监听成功！`
  textSystemMessages_Action(data)
  // 坐席 退出监听 监听员 删 所有session
  if (data.monitorStatus === 'insert' || data.monitorStatus === 'kicked') {
    // 这块是 插入退出
    useChatStore().setSessionMapItemKey(data.sessionId, 'isconnected', 0)
    TextBtn.forceExit(data.sessionId)
    data.content = `(${data.agentId})挂断了会话，请进行小结！`
    textSystemMessages_Action(data)
  } else {
    // 监听退出
    remoerAllSessionMap_Action()
  }
}

// 强插成功通知  给坐席发消息
export function text_ON_MSG_JOIN_Action (data) {
  // TextBtn.overrideEnter(data.sessionId)
  // console.log('强插成功 _TextBtn')
  //  "您的主管[" + ret.agentId2 + "]已使用强插功能."
  data.content = `管理员(${data.agentId2}) 强插进入会话`
  textSystemMessages_Action(data)
}

// 强插成功  给管理员发消息
export function textAgentInsertComplete_Action (data) {
  TextBtn.overrideEnter(data.sessionId)
  console.log('强插成功 _TextBtn')
  //  "您的主管[" + ret.agentId2 + "]已使用强插功能."
  data.content = '强插成功'
  textSystemMessages_Action(data)
  // useChatStore().addSessionNumOne()
}

export function text_ON_MSG_KICKBYADMIN_Action (data) {
  data.content = '您已被客服主管踢出会话!'
  textSystemMessages_Action(data)
}
// 坐席被管理员强拆 给坐席发消息 ON_AGENT_KICKBYADMIN
export function text_ON_AGENT_KICKBYADMIN_Action (data) {
  data.content = '您已被客服主管踢出会话!'
  textSystemMessages_Action(data)
}
// 强拆坐席成功
export function textAgentKickAgent4SessionComplete_Action (data) {
  TextBtn.forcedDemolition(data.sessionId)
  data.content = `管理员(${data.agentId})强拆接管会话成功！`
  textSystemMessages_Action(data)

  // 用户进线状态 修改监督员身份
  useChatStore().setTextIsMonitor(false)
  TextBtn.consumerIn(data.sessionId)
}
// 坐席挂断会话通知
export function text_ON_MSG_AGENTHUNGUP_Action (data) {
  data.content = `坐席(${data.agentId2})退出会话！`
  textSystemMessages_Action(data)
}
// 会议退出
export function text_ON_AGENT_CONSULT_MEETING_PARTER_LEFT (data) {
  TextBtn.conferenceBtnExit(data.sessionId)
}

// 系统消息 System messages
export function textSystemMessages_Action (data) {
  // content 是消息体
  addToMessageList_Action(data)
}

// 设置 SessionMap
export function setSessionMap_Action (sessionMap) {
  useChatStore().addSessionMap(sessionMap, sessionMap.sessionId)
}
// 获取当前的 SessionMap
export function getSessionMapInfo_Action (sessionId) {
  useChatStore().getSessionMapInfo(sessionId)
}
// 删 所有session
export function remoerAllSessionMap_Action () {
  useChatStore().remoerSessionMessage()
  // console.log('签出事件')
}
// 删 某一个
export function deletaSessionMapItem_Action (sessionId) {
  useChatStore().deletaSessionMessageItem(sessionId)
}

// 更新当前 连接数
export function addSessionNumOne_Action (val) {
  useChatStore().addSessionNumOne(val)
}

// 更新 坐席 发送消息
export function addToMessageList_Action (sessionMap) {
  // useSessionStore().setCurrentSession(sessionMap.sessionId)
  console.log('坐席 发送消息', sessionMap)
  useChatStore().addToMessageList(sessionMap, sessionMap.sessionId)
  useChatStore().setSessionMapUnreadNum(sessionMap.sessionId)
}

// 修改当前 sessionId 的 map 的 key
export function setSessionMapItemKey_Action (sessionId, key, value) {
  useChatStore().setSessionMapItemKey(sessionId, key, value)
}
// 获取 sessionNum 的值
export function getSessionNum_Action () {
  return useChatStore().sessionNum
}


// 发消息
export function textSubSendMessage (messageContent, channelType) {
  const sessionId = chatStore.getSessionMapId()
  echoSysMsg(messageContent, sessionId, channelType)
}

// 聊天超时
export function textAgentChatTimeoutPrompt (data) {
  // data.content = '您与客户已有一段时间未沟通,请注意保持交流,超时未聊天会话将结束!'
  echoSysMsg(data)
}
// 转接被拒绝
export function textAfterTransferForce (data) {
  data.content = '(' + data.agentId2 + ')拒绝了转接！'
  echoSysMsg(data)
}
// 转接成功
export function textAfterTransfer (data) {
  // const currentSessionId = useChatStore().getSessionMapId()
  // if (currentSessionId === data.sessionId) {
  TextBtn.consumerIn(data.sessionId)

  if (data.agentId2 != undefined && data.agentId2 != '') {
    data.content = '转接' + '(' + data.agentId2 + ')成功，当前会话结束,请进行小结！'
  } else if (data.groupNo != undefined && data.groupNo != '') {
    data.content = '转接到队列' + '(' + data.groupNo + ')成功，当前会话结束,请进行小结！'
  } else {
    data.content = '转接成功，当前会话结束,请进行小结！'
  }
  echoSysMsg(data)
  // }
}

// 会议被拒绝  ret['content'] = "[" + ret.agentId2 + "]拒绝了会议！";
export function textAfterMeetingForce (data) {
  data.content = '' + data.agentId2 + '-拒绝了会议！'
  echoSysMsg(data)
}
// 会议成功
export function textAfterMeeting (data) {
  // const currentSessionId = useChatStore().getSessionMapId()
  // if (currentSessionId === data.sessionId) {
  data.content = '(' + data.meetingTarget + ')加入会议，会议成功！'
  echoSysMsg(data)
  // TextBtn.consumerIn(data.sessionId)
  TextBtn.conferenceBtnEnter(data.sessionId)
  // }
}

// 渲染系统消息
export function echoSysMsg (json) {
  console.log('渲染系统消息', json.msgType, json.content, '', '4', '系统消息', json.time)
  addToMessageList_Action(json)
}

// 客户退出
export function TextAfterCustomerExit (data) {
  data.content = '客户已经退出会话'
  textSystemMessages_Action(data)
  //   // 挂断
  //   // textAgentHangupComplete_Action(data.sessionId)
  //   // if (myEtalkEvent.sessionMap[data.sessionId].isconnected === 1) {
  //   // afterCustomerExit(data)

//   // }
}

// 消息撤回
export function TextMessageRecall (data) {
  // console.log('消息撤回123', data, data.errorMsg)
  if (data.type == '20271') {
    // 坐席
    useChatStore().delMsguuidItem(data.sessionId, data.msguuid, data.errorMsg)
  } else {
    useChatStore().delMsguuidItem(data.sessionId, data.msguuid)
  }
}
