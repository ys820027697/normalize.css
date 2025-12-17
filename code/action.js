import { Etalks, myEtalkEvent } from '@/utils/etalkUtils/websocket/webSocketConnect'
import { guid } from '@/utils/etalkUtils/etalk/util'
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/store/modules/chatStore'
import $bus from '@/utils/bus'

$bus.on('closeSocket', () => {
  logoutsocket()
})

// 转接事件
export function textTransfer (currentMapId, val) {
  const event = myEtalkEvent()
  const etalks = Etalks()
  if (!event || !etalks) {
    console.warn('myEtalkEvent 或 Etalks 尚未初始化')
    return
  }
  const parmas = {
    sessionId: currentMapId,
    otherId: val.staffNo,
    reason: val.reason,
    number: val.extNo,
    transferData: event.sessionMap[currentMapId]?.transferData
  }
  etalks.transfers(parmas.sessionId, parmas.otherId, parmas.reason, parmas.number)
}
// 发起会议
export function textConference (currentMapId, val) {
  const event = myEtalkEvent()
  const etalks = Etalks()
  if (!event || !etalks) {
    console.warn('myEtalkEvent 或 Etalks 尚未初始化')
    return
  }
  console.log('发起会议', event.sessionMap[currentMapId])
  const parmas = {
    sessionId: currentMapId,
    otherId: val.staffNo,
    reason: val.reason,
    originSessionId: event.sessionMap[currentMapId]?.originSessionId
  }
  console.log('发起会议', parmas)
  etalks.conference(parmas.originSessionId, parmas.otherId, parmas.reason)
}


// 拒绝新会话  1拒绝并示忙0只拒绝不示忙
export function textDenyNewsession (num) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.denyNewsession(num)
}
// 发送拒绝转接消息
export function textForceTransfer (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.forceTransfer(sessionId)
}

// 发送拒绝会议消息
export function textForcConference (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.forceConference(sessionId)
}

// 示闲
export function textIdle () {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.idle()
}

// 示忙
export function textBusy (type) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.busy(type)
}
// 应答
export function textAnswer () {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.answer()
}
/**
 * 坐席挂断会话
 * @param {string} sessionId  会话id
 * @param {boolean} isAgentHangup 是否坐席挂断
 */
export function textHangup (sessionId, isAgentHangup) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  isAgentHangup = !(isAgentHangup != undefined && isAgentHangup == false && sessionId != undefined)
  etalks.hangup(sessionId, isAgentHangup)
}


// 签入
export function textConnect () {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.connect()
}

// 满意度
export function satisfaction (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.satisfaction(sessionId)
}
// 文本坐席拉客户进线
export function pullClient (consumerId, channelType) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.pullClient(consumerId, channelType)
}

// 签出
export function textDisconnect (num) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化') 
    return
  } 

  etalks.disconnect(num)
  // const chatStore = useChatStore()
  // chatStore.resetMyEtalkEvent()
}

export function exceptionExit () {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.exceptionExit()
}
export function changeAnswerCount (agentId, num) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  const val = Number(num)
  etalks.changeAnswerCount(agentId, val)
}

// 坐席挂机
// export function textAgentHangup (sessionId, isAgentHangup) {
//   Etalks.agentHangup(sessionId, isAgentHangup)
// }
// 监听
export function textListen (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.listen(sessionId)
}
// 退出监听
export function TextListenout (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.listenout(sessionId)
}
// 强拆会话(从会话中踢出一个坐席)
export function textKickOneAgentFromsession (sessionId, agentid2) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.kickOneAgentFromsession(sessionId, agentid2)
}
// 强拆会话(结束会话)
export function textKickAllAgentFromsession (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.kickAllAgentFromsession(sessionId)
}
// 强插入某会话
export function textInsert (sessionId) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.insert(sessionId)
}
// 将某坐席踢出系统
export function textKick (agentid2) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.kick(agentid2)
}

// 退出 关闭 socket
export function logoutsocket () {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.closeSocket()
}

// 更新 坐席

// 坐席发送消息
export function textsendMessage (messageContent, sessionId, text = 'text', fileName = '', relation = '') {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  const msg = messageContent
  if (msg != null && msg !== '') {
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

    const msguuid = guid()
    // text = 'text'
    etalks.sendMessage(msg, sessionId, text, msguuid, fileName, relation)
  } else {
    ElMessage.info('信息为空，请确认')
  }
}
// 坐席撤回消息
export function textRevokeMessage (sessionId, msguuid) {
  const etalks = Etalks()
  if (!etalks) {
    console.warn('Etalks 尚未初始化')
    return
  }
  etalks.revokeMessage(sessionId, msguuid)
}

