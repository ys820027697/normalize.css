import { ElMessage } from 'element-plus'
import { guid } from './util'
import { myEtalkEvent } from '../websocket/webSocketConnect'
import { useChatStore } from '@/store/modules/chatStore'
import {
  addToMessageList_Action
} from '@/utils/etalkUtils/etalk/event'
const MessageType = {
  System: 0, Consumer: 1, Agent: 2, Satisfaction: 3, Robot: 4
}

let msguuid = ''
// 发送消息
// 默认消息都是 text 图片 也是 text 还有 音频 和视频 估计也是 以id的形式 处理
export function sendMessage (messageContent, sessionId, text = 'text') {
  console.log('三种状态 不能发送消息', messageContent.value, sessionId)
  // console.info(_isHangup, _isInsert, _isMonitor)
  // 如果  挂断 或者 没插入 不能发消息
  // const _isHangup = useChatStore().getCurrentMayItemKey('_isHangup')
  // const _isInsert = useChatStore().getCurrentMayItemKey('_isInsert')
  // if (_isHangup || !_isInsert) {
  //   return
  // }
  const msg = messageContent.value
  // console.log('msg', msg, 'myEtalkEvent', myEtalkEvent)
  if (msg != null && msg !== '') {
    // msg = top.encodeImages(msg)
    console.info('处理后的待发送消息:', msg)
    // 输入框未输入任何信息，则不做任何处理。
    if (msg.length === 0) {
      ElMessage.info('不能发送空消息！')
      return
    }
    if (msg.length > 2048) {
      ElMessage.info('发送内容太长[最多填写2048]')
      return
    }
    // 敏感字 判断
    console.log('判断敏感字')
    // const sensitiveword = top.softphoneIframe.sensitive(msg)
    // console.log('[发送消息] 敏感字: ' + sensitiveword)
    // if (sensitiveword) {
    //   ElMessage.info('发送内容包含敏感字[' + sensitiveword + ']')
    //   return
    // }
    msguuid = guid()
    text = 'text'
    const event = myEtalkEvent()
    if (!event || !event.etalkobj) {
      console.warn('myEtalkEvent 尚未初始化')
      return
    }
    event.etalkobj.sendMessage(msg, sessionId, text, msguuid)
  }
}

// 回显消息
export function echoMsg (json) {
  const sendName = json.type == '1005' ? json.consumerName : json.agentId2
  middleDiv.append(top.etalkMsg(json.msgType, json.content, json.recognition, json.type === 2007 ? '2' : '1', sendName, json.time))
  // window.setTimeout(function () { middleDiv.scrollTop(middleDiv[0].scrollHeight) }, 500)
}

/*
*重新发送消息
*/
export function resendMessage (id, msg) {
  const resendBtn = document.getElementById('resend' + id)
  resendBtn.style.display = 'none'
  // $('#editor1').wysiwyg('shell').setHTML(msg)
  sendMessage()
}
/*
* 撤回发送的消息
*/
export function revokeMessage (msguuid, msg) {
  const event = myEtalkEvent()
  if (!event || !event.etalkobj) {
    console.warn('myEtalkEvent 尚未初始化')
    return
  }
  document.getElementById(msguuid).style.display = 'none'
  echoSysMsgForRevoke('您撤销了一条消息！')
  event.etalkobj.revokeMessage(sessionId, msguuid)
}

/* 渲染系统消息 */
export function echoSysMsg (json) {
  console.log('渲染系统消息', json.msgType, json.content, '', '4', '系统消息', json.time)
  addToMessageList_Action(json, json.sessionId)
  // middleDiv.append(top.etalkMsg(json.msgType, json.content, '', '4', '系统消息', json.time))
  // window.setTimeout(function () { middleDiv.scrollTop(middleDiv[0].scrollHeight) }, 500)
}

export function echoEnterMsg (json) {
  $('#entryMsgSpan').html('客户正在输入消息......：' + json.content)
}
// 弹出转接窗口
export function transfer () {
  const event = myEtalkEvent()
  if (!event || !event.sessionMap || !event.sessionMap[sessionId]) {
    console.warn('myEtalkEvent 或 sessionMap 不存在')
    return
  }
  const win = parent.$e('subwindowAgentList')
  win.setLabel('转接窗口')
  win.setPath('transfer?channelType=text&direct=' + event.sessionMap[sessionId].direct + '&sessionId=' + sessionId)
  win.reload()
  win.show()
}
// 弹出会议窗口
export function meeting () {
  const event = myEtalkEvent()
  if (!event || !event.sessionMap || !event.sessionMap[sessionId]) {
    console.warn('myEtalkEvent 或 sessionMap 不存在')
    return
  }
  const win = parent.$e('subwindowAgentList')
  win.setLabel('会议窗口')
  win.setPath('meeting_agentlist?channelType=text&direct=' + event.sessionMap[sessionId].direct + '&sessionId=' + sessionId)
  win.reload()
  win.show()
}
/* 挂断会话 */
export function release () {
  const event = myEtalkEvent()
  if (!event || !event.etalkobj) {
    console.warn('myEtalkEvent 尚未初始化')
    return
  }
  useChatStore().setCurrentMapItemKey('_isHangup', true)
  // _isHangup = true
  event.etalkobj.hangup(sessionId)
}
/* 退出监听 */
export function listenout () {
  const event = myEtalkEvent()
  if (!event || !event.etalkobj) {
    console.warn('myEtalkEvent 尚未初始化')
    return
  }
  event.etalkobj.listenout(sessionId)
}
/* 强插会话 */
export function insert () {
  const event = myEtalkEvent()
  if (!event || !event.etalkobj) {
    console.warn('myEtalkEvent 尚未初始化')
    return
  }
  event.etalkobj.insert(sessionId)
}
/* 强拆会话，接管会话 */
export function kick () {
  const event = myEtalkEvent()
  if (!event || !event.etalkobj) {
    console.warn('myEtalkEvent 尚未初始化')
    return
  }
  event.etalkobj.kickOneAgentFromsession(sessionId)
}

export function afterInsert (ret) {
  // 是否是 插入
  useChatStore().setCurrentMapItemKey('_isInsert', true)
  // _isInsert = true
  $e('kickBtn').enabled()
  $e('insertBtn').disabled()
}
export function afterListenout (ret) {
  // 是否是监视器  不是监视器
  // _isMonitor = false
  useChatStore().setCurrentMapItemKey('_isMonitor', false)
  afterDropped(ret)
  // 是插入 也要做小结
  const _isInsert = useChatStore().getCurrentMayItemKey('_isInsert')
  if (_isInsert) {
    // 跳转到小结页面
    $bus.emit('makeSettlement', true)
    // document.getElementById('motherFrame').contentWindow.$e('tabset').setActivateTabById('summaryTab')
  }
}
export function afterTransferWaiting (ret) {
  // document.getElementById("transferBtn").onclick=null;
}
export function afterCustomerExit (ret) {
  const _isMonitor = useChatStore().getCurrentMayItemKey('_isMonitor')
  if (_isMonitor) {
    useChatStore().setCurrentMapItemKey('_isMonitor', false)
    // _isMonitor = false
  }
  afterDropped(ret)
}
export function afterTransferFail () {
  // $("#transferBtn").click("transfer");
}
export function afterKickagent4session (ret) {
  // $e('kickBtn').disabled()
  const _isInsert = useChatStore().getCurrentMayItemKey('_isInsert')
  if (_isInsert) {
    // 已经强插过,则强插按钮无法使用
    $e('insertBtn').disabled()
  }
}


