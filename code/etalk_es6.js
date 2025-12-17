/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
// import WebSocket_stomp from '@/utils/etalkUtils/websocket/WebSocket_stomp.js'
// message  事件监听 和处理 发送不同状态的消息
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/store/modules/chatStore'
import { getLocalToken } from '@/utils/auth'
import WebsocketAdapter from './WebsocketAdapter.js'

// 获取 myEtalkEvent 的辅助函数（从 Pinia store 获取）
function getMyEtalkEvent () {
  const chatStore = useChatStore()
  const myEtalkEvent = chatStore.getMyEtalkEvent()
  if (!myEtalkEvent) {
    console.warn('myEtalkEvent 尚未初始化，请先调用 WebSockInitText 进行初始化')
    return null
  }
  return myEtalkEvent
}
class EtalkEvent {
  constructor () {
    this.handlers = {}
  }

  // 绑定
  addListener (event, handler) {
    if (typeof this.handlers[event] === 'undefined') {
      this.handlers[event] = []
    }
    this.handlers[event].push(handler)
    return this
  }

  removeListener (event, handler) {
    if (this.handlers[event] instanceof Array) {
      const handlers = this.handlers[event]
      for (let i = 0, len = handlers.length; i < len; i++) {
        if (handler[i] == handler) {
          handlers.splice(i, 1)
          break
        }
      }
    }
    return this
  }

  // 触发
  fireEvent (event, data) {
    if (this.handlers[event] instanceof Array) {
      const handlers = this.handlers[event]
      for (let i = 0, len = handlers.length; i < len; i++) {
        handlers[i](data)
      }
    }
  }
}
class Etalk extends EtalkEvent {
  // events from agents
  ON_AGENT_LOGIN_COMPLETE = 'onAgentLoginComplete'
  ON_AGENT_LOGIN_FAIL = 'onAgentLoginFail'
  ON_AGENT_LOGOUT_COMPLETE = 'onAgentLogoutComplete'
  ON_AGENT_LOGOUT_FAIL = 'onAgentLogoutFail'
  ON_AGENT_IDLE_COMPLETE = 'onAgentIdleComplete'
  ON_AGENT_IDLE_FAIL = 'onAgentIdleFail'
  ON_AGENT_BUSY_COMPLETE = 'onAgentBusyComplete'
  ON_AGENT_BUSY_FAIL = 'onAgentBusyFail'
  ON_CONSUMER_MAKECALL_SUCCESS = 'onConsumerMakecallSuccess'
  ON_AGENT_TEMPLOGOUT_COMPLETE = 'onAgentTemplogoutComplete'
  ON_AGENT_TEMPLOGOUT_FAIL = 'onAgentTemplogoutFail'
  ON_AGENT_TEMPLOGIN_COMPLETE = 'onAgentTemploginComplete'
  ON_AGENT_TEMPLOGIN_FAIL = 'onAgentTemploginFail'
  ON_AGENT_RECEIVE_NEWSESSION = 'onAgentReceiveNewsession'
  ON_AGENT_RECEIVE_NEWSESSION_FAIL = 'onAgentReceiveNewsessionFail'
  ON_AGENT_APP_MAKECALL_FAIL = 'onAgentAppMakeCallFail'
  ON_AGENT_APP_MAKECALL_SUCCESS = 'onAgentAppMakeCallSuccess'
  ON_AGENT_WEMAKECALL_SUCCESS = 'onAgentWEMakeCallSuccess' // 微信外呼成功
  ON_AGENT_WEMAKECALL_FAIL = 'onAgentWEMakeCallFail' // 微信外呼失败
  ON_AGENT_INIT_SUCCESS = 'onAgentInitSuccess'
  ON_AGENT_RECOVER_SESSION_SUCCESS = 'onAgentRecoverSessionSuccess'
  // 转接事件
  ON_AGENT_RECEIVE_TRANSFER = 'onAgentReceiveTransfer'// 接起转接成功
  ON_AGENT_RECEIVE_TRANSFER_FAIL = 'onAgentReceiveTransferFail'// 接起转接失败
  ON_AGENT_TRANSFER_FORCE = 'onAgentTransferForce'// 拒绝转接
  ON_AGENT_TRANSFER_COMPLETE = 'onAgentTransferComplete'// 发起方转接完成
  ON_AGENT_TRANSFER_FAIL = 'onAgentTransferFail'// 发起方转接失败
  ON_AGENT_DENYTRANSFER_COMPLETE = 'onAgentDenyTransferComplete'// 拒绝转接完成
  ON_AGENT_TRANSFER_SENT_SUCCESS = 'onAgentTransferSentSuccess' // 转接发送成功，只是发送指令成功，此时目标方还没接起转接
  // 会议事件
  ON_AGENT_RECEIVE_MEETING = 'onAgentReceiveMeeting'// 接起文本会议成功了
  ON_AGENT_CONFERENCE_FORCE = 'onAgentConferenceForce'// 拒绝文本会议
  ON_AGENT_RECEIVE_MEETING_FAIL = 'onAgentReceiveMeetingFail'// 接起文本会议失败
  ON_AGENT_MEETING_COMPLETE = 'onAgentMeetingComplete'// 文本会议完成了
  ON_AGENT_MEETING_FAIL = 'onAgentMeetingFail'// 文本会议发起失败
  ON_AGENT_DENYMEETING_COMPLETE = 'onAgentDenyMeetingComplete'// 拒绝会议完成
  ON_AGENT_MEETING_SENT_SUCCESS = 'onAgentMeetingSentSuccess'// 会议发送成功
  // 咨询事件
  ON_AGENT_CONSULT_CTI = 'onAgentConsultCti' // 咨询CTI指令发送成功
  ON_AGENT_CONSULT_FORCE = 'onAgentConsultForce'// 拒绝咨询
  ON_AGENT_CONSULT_FAIL = 'onAgentConsultFail' // 咨询失败
  ON_AGENT_CONSULT_COMPLETE = 'onAgentConsultSuccess' // 咨询成功
  ON_AGENT_RECEIVE_CONSULT = 'onAgentReceiveConsult'// 接起咨询成功
  ON_AGENT_RECEIVE_CONSULT_FAIL = 'onAgentReceiveConsultFail'// 接起咨询失败
  ON_AGENT_DENYCONSULT_COMPLETE = 'onAgentDenyConsultComplete'// 拒绝咨询成功
  // 咨询取回事件
  ON_AGENT_CONSULTBACK_SUCCESS = 'onAgentConsultBackSuccess'// 咨询取回成功
  ON_AGENT_CONSULTBACK_FAIL = 'onAgentConsultBackFail' // 咨询取回失败
  ON_AGENT_CONSULTBACK = 'onAgentConsultBack'// 咨询会话被取回
  ON_AGENT_CONSULT_PARTER_LEFT = 'onAgentConsultParterLeft'// 咨询中有一方退出
  // 咨询会议事件
  ON_AGENT_RECEIVE_CONSULT_MEETING = 'onAgentReceiveConsultMeeting' // 咨询会议接起方接起成功事件
  ON_AGENT_CONSULT_MEETING_FAIL = 'onAgentReceiveConsultMeetingFail' // 咨询会议发起失败
  ON_AGENT_CONSULT_MEETING_COMPLETE = 'onAgentConsultMeetingSuccess' // 咨询会议发起方成功事件
  ON_AGENT_CONSULT_MEETING_PARTER_LEFT = 'onAgentConsultMeetingParterLeft'// 咨询会议中参与者退出事件
  // 咨询转接事件
  ON_AGENT_RECEIVE_CONSULT_TRANSFER = 'onAgentReceiveConsultTransfer' // 咨询转接接起方接起成功事件
  ON_AGENT_CONSULT_TRANSFER_FAIL = 'onAgentReceiveConsultTransferFail' // 咨询转接发起失败
  ON_AGENT_CONSULT_TRANSFER_COMPLETE = 'onAgentConsultTransferSuccess' // 咨询转接发起方成功事件
  // 转接ivr节点事件
  ON_AGENT_TRANSFER_IVRNODE_COMPLETE = 'onAgentTransferIvrNodeComplete'
  ON_AGENT_TRANSFER_IVRNODE_FAIL = 'onAgentTransferIvrNodeFail'
  ON_AGENT_TRANSFER_IVRNODE_IVRCALLBACK = 'onAgentTransferIvrNodeIvrCallback'
  // 转接ivr技能组事件
  ON_AGENT_TRANSFER_IVRGROUP_COMPLETE = 'onAgentTransferIvrGroupComplete'
  ON_AGENT_TRANSFER_IVRGROUP_FAIL = 'onAgentTransferIvrGroupFail'
  // 拒绝接起新会话事件
  ON_AGENT_DENY_NEWSESSION_COMPLETE = 'onAgentDenyNewsessionComplete'
  ON_AGENT_DENY_NEWSESSION_FAIL = 'onAgentDenyNewsessionFail'
  // 满意度事件
  ON_AGENT_TITLE_SATISFACTION_SUCCESS = 'onAgentTitleSatisfactionSuccess' // 推送满意度成功
  ON_AGENT_TITLE_SATISFACTION_FAIL = 'onAgentTitleSatisfactionFail' // 推送满意度失败
  ON_AGENT_MSG_RECEIVE = 'onAgentMsgReceive'
  ON_AGENT_MSG_SEND_FAIL = 'onAgentMsgSendFail'
  ON_AGENT_CHANGE_ANSWERCOUNT_COMPLETE = 'onAgentChangeAnswercountComplete'
  ON_AGENT_CHANGE_ANSWERCOUNT_FAIL = 'onAgentChangeAnswercountFail'
  ON_AGENT_ENTERMSG_COMPLETE = 'onAgentEntermsgComplete'
  ON_AGENT_ENTERMSG_FAIL = 'onAgentEntermsgFail'
  ON_AGENT_HANGUP_COMPLETE = 'onAgentHungupComplete'
  ON_AGENT_HANGUP_FAIL = 'onAgentHungupFail'
  ON_AGENT_ENDSUM_COMPLETE = 'onAgentEndsumComplete'
  ON_AGENT_ENDSUM_FAIL = 'onAgentEndsumFail'
  ON_AGENT_PULL_CLIENT_COMPLETE = 'onAgentPullClientComplete'
  ON_AGENT_PULL_CLIENT_FAIL = 'onAgentPullClientFail'
  ON_AGENT_CMD_RECEIVED = 'onAgentCmdReceived'
  ON_AGENT_CMD_FAIL = 'onAgentCmdFail'
  ON_AGENT_KICKBYADMIN = 'onAgentKickbyadmin'
  ON_AGENT_REMOVEBYADMIN = 'onAgentRemovebyadmin'
  ON_AGENT_ERROR = 'onAgentError'
  // events for admin
  ON_ADMIN_LISTEN_COMPLETE = 'onAdminListenComplete' // 监听成功
  ON_ADMIN_LISTEN_FAIL = 'onAdminListenFail' // 监听失败
  ON_ADMIN_LISTEN_RING = 'onAdminListenRing'// 监听振铃事件
  ON_ADMIN_LISTENOUT_COMPLETE = 'onAdminListenoutComplete' // 退出监听成功
  ON_ADMIN_LISTENOUT_FAIL = 'onAdminListenoutFail' // 退出监听失败
  ON_ADMIN_KICKAGENT4SESSION_COMPLETE = 'onAdminKickagent4sessionComplete'
  ON_ADMIN_KICKAGENT4SESSION_FAIL = 'onAdminKickagent4sessionFail' // 强拆失败
  ON_ADMIN_INSERT_COMPLETE = 'onAdminInsertComplete'
  ON_ADMIN_INSERT_FAIL = 'onAdminInsertFail'
  ON_ADMIN_INSERT_RING = 'onAdminInsertRing'// 强插振铃事件
  ON_ADMIN_KICKAGENT_COMPLETE = 'onAdminKickagentComplete'
  ON_ADMIN_KICKAGENT_FAIL = 'onAdminKickagentFail'
  // events for ring
  ON_NEWSESSION_RING = 'onNewsessionRing'
  ON_TRANSFER_RING = 'onTransferRing'
  ON_MEETING_RING = 'onMeetingRing'
  ON_CONSULT_RING = 'onConsultRing'
  ON_OUTBOUND_RING = 'onOutboundRing'// 外呼振铃
  // events from consumer
  ON_CONSUMER_MSG_RECEIVE = 'onConsumerMsgReceive'
  ON_CONSUMER_CMD_RECEIVE = 'onConsumerCmdReceive'
  ON_CONSUMER_EXIT = 'onConsumerExit'
  ON_CONSUMER_ENTERMSG = 'onConsumerEntermsg' // 客户正在输入的消息
  ON_CONSUMER_LEAVE = 'onConsumerLeave' // 客户离开app的消息
  ON_CONSUMER_BACK = 'onConusmerBack' // 客户返回app的消息
  // ON_CONSUMER_RING_EXIT = "onConsumerRingExit";
  ON_AGENT_CHAT_TIMEOUT_PROMPT = 'onAgentChatTimeoutPrompt'
  // events from server
  ON_SERVER_CONNECT = 'onServerConnect'
  ON_SERVER_CLOSE = 'onServerClose'
  ON_SERVER_NOTCONNECT = 'onServerNotconnect'
  ON_SERVER_EMPTYMSG = 'onServerEmptymsg'
  ON_SERVER_TOOLONGMSG = 'onServerToolongmsg'
  // events from common message
  ON_MSG_JOIN = 'onMsgJoin'
  ON_MSG_TRANSFER = 'onMsgTransfer'
  ON_MSG_AGENTHUNGUP = 'onMsgAgenthungup'
  ON_MSG_AGENTLISTENOUT = 'onMsgAgentListenOut'
  ON_MSG_MEETING = 'onMsgMeeting'
  ON_MSG_KICKBYADMIN = 'onMsgKickbyadmin'
  ON_MSG_REMOVEBYADMIN = 'onMsgRemovebyadmin'
  ON_AGENT_EXCEPTIONEXIT = 'onAgentExceptionExit'
  ON_MSG_ANNOUNCEMENT = 'onMsgAnnouncement'
  ON_AGENT_MAKECALL_SUCCESS = 'onAgentMakecallSuccess'// 坐席发起外呼成功，此时已经产生了会话流水
  ON_AGENT_MAKECALL_FAIL = 'onAgentMakecallFail'// 坐席发起外呼失败
  ON_AGENT_RECEIVE_OB_CALL = 'onAgentReceiveObCall'// 客户接起外呼，外呼成功事件
  ON_MESSAGE_RECALL = 'onMessageRecall' // 消息撤回
  ON_MESSAGE_RECALLFALL = 'onMessageRecallFall' // 消息撤回失败
  ON_RECALL_MSG_SUCCESS = 'onRecallMsgSuccess' // 客户撤回消息成功

  // 保持
  ON_AGENT_HOLD_SUCCESS = 'onAgentHoldSuccess' // hold成功
  ON_AGENT_HOLD_FAIL = 'onAgentHoldFail' // hold成功
  // 取回保持
  ON_AGENT_UNHOLD_SUCCESS = 'onAgentUnHoldSuccess' // hold成功
  ON_AGENT_UNHOLD_FAIL = 'onAgentUnHoldFail' // hold成功
  // 报工号事件
  ON_AGENT_BROADCAST = 'onAgentBroadcast'
  ON_AGENT_REFRESH = 'onAgentRefresh'
  ON_MESSAGE_CENTER = 'onMessageCenter' // 消息中心消息
  ON_MESSAGE_TIMEOUT = 'onMessageTimeout' // 消息超时

  /** socket对象，用于通讯**/
  // 构造函数
  constructor () {
    super()
    this.socketObj = null
    /** 坐席工号**/
    this.agentId = ''
    this.isHardPhone = ''
    /** 坐席姓名**/
    this.agentName = ''
    /** 技能组**/
    this.groupId = ''
    /** 租户ID**/
    this.tenantId = ''
    /** 最多应答客户数**/
    this.answerCount = 10
    /** 签入IP**/
    this.currentIp = ''
    /** 最近一次振铃类型**/
    this.lastestRingType = ''
    /** 最近一次振铃的会话id**/
    this.lastestSessionId = ''
    /** 最近一次振铃的操作坐席**/
    this.lastestOtherAgent = ''
    /** 最近一次心跳时间**/
    this.lastestheartmsgdate = null
    /** 分机号**/
    this.callernum = ''
    /** 坐席登录状态 */
    this.loginStatus = false
    /** 当前状态**/
    this.currentStatus = ''
    this.contextPath = ''
  }

  /** 初始化对象值**/
  initObj = function (agentId, agentName, agentGroupId, answerCount, callernum, url, tenantId, isHardPhone, currentIp, contextPath) {
    this.agentId = agentId
    this.agentName = agentName
    this.groupId = agentGroupId
    this.answerCount = answerCount
    this.tenantId = tenantId
    this.callernum = callernum
    this.isHardPhone = isHardPhone
    this.currentIp = currentIp
    // this.socketObj = new WebsocketAdapter(this, url, agentId, currentIp)
    // WebSocket_stomp.connect()
    this.contextPath = contextPath
  }

  createdWebsocket = function (url, agentId, currentIp) {
    // 确保在创建新连接前，旧的连接已被清理
    if (this.socketObj != null) {
      try {
        this.socketObj.close()
      } catch (e) {
        console.warn('关闭旧 WebSocket 连接时出错:', e)
      }
      this.socketObj = null
    }
    this.agentId = agentId
    this.currentIp = currentIp
    try {
      this.socketObj = new WebsocketAdapter(this, url, agentId, currentIp)
      console.log('WebSocket 连接已创建', { agentId, url })
    } catch (e) {
      console.error('创建 WebSocket 连接失败:', e)
      this.socketObj = null
      throw e
    }
  }

  /**
	 * 获得控件对象
	 */
  getSocket = function () {
    return this.socketObj
  }

  /**
	 * 签入
	 */
  connect () {
    console.log('开始签入', 'this.agentId', this.agentId)
    // 防止坐席多次点击签入
    if (this.agentId !== '') {
      // 赋值
      this.sendMsgToServer(`{type:2001,agentId:'${this.agentId}',agentName:'${this.agentName}',tenantId:'${this.tenantId}',extNo:'${this.callernum}',groupNo:'${this.groupId}',ip:'${this.currentIp}',maxLinks:${this.answerCount}}`)
      // console.log('这里做按钮控制')
    } else {
      ElMessage.error('坐席信息不完整,请联系技术人员,本次在线客服签入失败')
    }
  }

  //
  disconnect () {
    // console.log('触发了这个事件————', sessionNum)
    const myEtalkEvent = getMyEtalkEvent()
    if (myEtalkEvent && myEtalkEvent.sessionNum > 0) {
      if (confirm('当前有未处理完的会话，签出系统将挂断这些会话，您确定要签出么？')) {
        this.sendMsgToServer(`{type:2002,agentId:'${this.agentId}'}`)
      }
    } else {
      this.sendMsgToServer(`{type:2002,agentId:'${this.agentId}'}`)
    }
  }

  /**
     * 更改应答数量
     */
  changeAnswerCount (agentId, val) {
    console.log('更改应答数量', agentId, val)
    this.sendMsgToServer(`{type:2009,agentId:'${agentId}',maxLinks:${val}}`)
  }

  /**
     * 异常退出调用
     */
  exceptionExit () {
    this.sendMsgToServer(`{type:2013,agentId:'${this.agentId}'}`)
  }

  /**
     * 应答
     */
  answer () {
    // console.log('应答 sessionMap', sessionMap)
    // const originSessionId = sessionMap.message.originSessionId
    // const consumerId = sessionMap.message.consumerId
    // const channelType = sessionMap.message.channelType
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap[this.lastestSessionId]) {
      console.warn('myEtalkEvent 或 sessionMap 不存在，无法应答')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[this.lastestSessionId].originSessionId
    const consumerId = myEtalkEvent.sessionMap[this.lastestSessionId].consumerId
    const channelType = myEtalkEvent.sessionMap[this.lastestSessionId].channelType

    if (this.lastestRingType === '2008') { // 新会话
      this.sendMsgToServer(`{type:2014,agentId:'${this.agentId}',sessionId:'${originSessionId}',channelType:'${channelType}',
          consumerId:'${consumerId}'}`)
    } else if (this.lastestRingType === '2020') { // 转接
      this.sendMsgToServer(`{type:2018,agentId:'${this.agentId}',sessionId:'${originSessionId}',agentId2:'${this.lastestOtherAgent}',
          consumerId:'${consumerId}',mySessionId:'${this.lastestSessionId}',channelType:'${channelType}'}`)
    } else if (this.lastestRingType === '2021') { // 三方
      this.sendMsgToServer(`{type:2019,agentId:'${this.agentId}',sessionId:'${originSessionId}',agentId2:'${this.lastestOtherAgent}',
          consumerId:'${consumerId}',mySessionId:'${this.lastestSessionId}',channelType:'${channelType}'}`)
    } else if (this.lastestRingType === '2035') { // 咨询
      this.sendMsgToServer(`{type:2036,agentId:'${this.agentId}',sessionId:'${originSessionId}',agentId2:'${this.lastestOtherAgent}',
          consumerId:'${consumerId}',mySessionId:'${this.lastestSessionId}',channelType:'${channelType}'}`)
    } else if (this.lastestRingType === '2030') { // 当电话外呼成功后，会产生 callid，意味着外呼会话成功，通知核心，后端 CTI 集成的方式可以忽略此方法
      this.sendMsgToServer(`{type:2029,agentId:'${this.agentId}',sessionId:'${originSessionId}',
          consumerId:'${consumerId}',channelType:'${channelType}'}`)
    }
  }

  /**
       * 微信外呼
       * @param {string} calleenum 微信openid
       * @param {number} callernum
       * @param {string} nickname
       * @param {string} custNo
       * @param {string} consumerName
       * @param {string} headimgid
       * @param {string} consumerProvince
       * @param {string} lyId
       * @param {string} custRes
       */
  wemakecall (calleenum, callernum, nickname, custNo, consumerName, headimgid, consumerProvince, lyId, custRes) {
    if (!jQuery.trim(calleenum)) {
      ElMessage.error('没有微信openid')
      return
    }
    if (lyId !== undefined && lyId !== '') {
      // 这里 改
      // console.log('这里 改了 lyMap 的值')
      const myEtalkEvent = getMyEtalkEvent()
      if (myEtalkEvent && myEtalkEvent.lyMap) {
        myEtalkEvent.lyMap.put(calleenum, lyId)
      }
    }
    this.sendMsgToServer(`{type:2080,agentId:'${this.agentId}',calleenum:'${calleenum}', custNo:'${custNo}', consumerName:'${consumerName}',headImgId:'${headimgid}',consumerProvince:'${consumerProvince}',custRes:'${custRes}'}`)
  }

  /**
       * app外呼
       * @param {string} calleenum
       * @param {number} callernum
       * @param {string} nickname
       * @param {string} custNo
       * @param {string} consumerName
       * @param {string} headimgid
       * @param {string} consumerProvince
       * @param {string} deviceNo
       * @param {string} sdkVersion
       * @param {string} custRes
       */
  appmakecall (calleenum, callernum, nickname, custNo, consumerName, headimgid, consumerProvince, deviceNo, sdkVersion, custRes) {
    if (calleenum === undefined || calleenum === null || calleenum === '') {
      ElMessage.error('没有appid')
      return
    }
    if (deviceNo === undefined || deviceNo === null || deviceNo === '') {
      ElMessage.error('没有设备号')
      return
    }
    this.sendMsgToServer(`{type:2070,agentId:'${this.agentId}',calleenum:'${calleenum}', custNo:'${custNo}', consumerName:'${consumerName}',headImgId:'${headimgid}',consumerProvince:'${consumerProvince}',deviceNo:'${deviceNo}',sdkVersion:'${sdkVersion}',custRes:'${custRes}'}`)
  }

  /**
       * 电话外呼
       * @param {string} phone 外呼电话
       * @param {string} taskId 预览式任务外呼，此外呼不再弹屏，不进入inbound呼入界面
       * @param {number} source 外呼来源（0手动拨打1预览式拨打2回访拨打)
       */
  makeCall (phone, taskId, source) {
    if (phone === undefined || phone === null || phone === '' || phone.length < 7 || phone.length > 14) {
      ElMessage.error('电话号码非法')
      return
    }
    if (this.getAgentState() !== 'busy') {
      etalk.busy('busy')
    }
    if (taskId) {
      this.sendMsgToServer(JSON.stringify({ type: 2028, source: source || '0', taskId: taskId || '', agentId: this.agentId, calleenum: phone }))
    } else {
      this.sendMsgToServer(`{type:2028,agentId:'${this.agentId}',calleenum:'${phone}'}`)
    }
  }

  /**
       * 示闲
       */
  idle () {
    this.sendMsgToServer(`{type:2006,agentId:'${this.agentId}'}`)
  }

  /**
       * 示忙
       * @param {string} type
       */
  busy (type) {
    this.sendMsgToServer(`{type:2005,agentId:'${this.agentId}',smType:'${type}'}`)
  }

  /**
       * 示忙
       * @param {string} type
       */
  notReady (type) {
    console.log('示忙')
    this.sendMsgToServer(`{type:2005,agentId:'${this.agentId}',smType:'${type}'}`)
  }

  /**
       * 坐席挂断会话
       * @param {string} sessionId  会话id
       * @param {boolean} isAgentHangup 是否坐席挂断
       */
  hangup (sessionId, isAgentHangup) {
    // console.log('myEtalkEvent', myEtalkEvent)
    isAgentHangup = !(isAgentHangup != undefined && isAgentHangup == false && sessionId != undefined)
    let originSessionId = sessionId
    let channelType = ''
    ElMessage.success('挂断成功!')
    // ElMessage.warning(`${sessionId}通话是否为坐席发起的挂机:${isAgentHangup}`)

    const myEtalkEvent = getMyEtalkEvent()
    if (myEtalkEvent && myEtalkEvent.sessionMap && myEtalkEvent.sessionMap[sessionId]) {
      originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
      channelType = myEtalkEvent.sessionMap[sessionId].channelType
    }

    this.sendMsgToServer("{type:2011,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', releaseCause:'" + (isAgentHangup ? 'agent' : 'cust') + "',channelType:'" + channelType + "',mysessionId:'" + sessionId + "'}")
  }

  // 电话保持
  hold (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法保持')
      return
    }
    const direct = myEtalkEvent.sessionMap[sessionId].direct
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2032,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', direct:'" + direct + "'}")
  }

  // 取消保持
  unHold (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法取消保持')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    const direct = myEtalkEvent.sessionMap[sessionId].direct
    // console.log('unHold  sessionId:' + sessionId + ' , direct :' + direct)
    this.sendMsgToServer("{type:2033,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', direct:'" + direct + "'}")
  }

  recoverSession (sessionIdList) {
    this.sendMsgToServer("{type:2221,agentId:'" + this.agentId + "', sessionIdList:'" + sessionIdList + "'}")
  }

  /**
	 * 坐席挂机
	 * @date 2020/3/17 16:18
	 * @author leixg
	 * @param sessionId 会话id
	 * @param isAgentHangup 是否为坐席挂机
	 **/
  agentHangup (sessionId, isAgentHangup) {
    let callid = ''
    let originSessionId = sessionId
    let channelType = ''
    const myEtalkEvent = getMyEtalkEvent()
    if (myEtalkEvent && myEtalkEvent.sessionMap && myEtalkEvent.sessionMap[sessionId]) {
      originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
      channelType = myEtalkEvent.sessionMap[sessionId].channelType
      if (myEtalkEvent.sessionMap[sessionId].channelType === 'ivr') {
        callid = myEtalkEvent.sessionMap[sessionId].callid
      }
    }
    this.sendMsgToServer("{type:2011,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', releaseCause:'" + (isAgentHangup ? 'agent' : 'cust') + "',callid:'" + callid + "',mysessionId:'" + sessionId + "',channelType:'" + channelType + "'}")
  }

  /**
	 * 刷新客户的随路数据，当客户验密成功后，发送指令到核心，刷新客户的随路数据
	 * 当转接，咨询，会议给其他坐席时，会将刷新后的随路数据回传，达到随路数据共享的目的
	 * @param sessionId 会话id
	 * @param userdata json对象
	 */
  freshData (sessionId, userdata) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法刷新数据')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2050,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "',consumerData:'" + userdata + "'}")
  }

  // 事后总结
  endSum (sessionId, channel) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法进行事后总结')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2012,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', channel:'" + channel + "',mySessionId:'" + sessionId + "'}")
    // console.log('事后总结：sessionId:' + sessionId + '; --- originSessionId:' + originSessionId + ';-----agentId:' + this.agentId + ';----chanel:' + channel)
  }

  // 转接 1 sessionId，2 otherId  ds_agents  坐席的 staffNo ，3 reason 转接原因 ，4 extNo 分机号 number ， 5 sessionMap 的 transferData
  transfers (sessionId, otherId, reason, number, transferData) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法转接')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2016,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "',agentId2:'" + otherId + "', transferNumber:'" + number + "', consumerData:'" + transferData + "',reason:'" + reason + "'}")
  }

  /**
	 * 转接技能组队列
	 * @sessionId 会话id
	 * @transferReason 转接原因
	 * @groupNo 技能组编码
	 */
  transferGroup (sessionId, transferReason, groupNo) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法转接技能组')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2041,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', groupNo:'" + groupNo + "',reason:'" + transferReason + "',mySessionId:'" + sessionId + "'}")
  }

  /**
	 * 转IVR节点
	 * @param sessionId 会话id
	 * @param transferReason 转接原因
	 * @param ivrNode ivr节点
	 * @param isHangup 转接IVR后是否挂机
	 * @param data 随路数据
	 */
  transferIvrNode (sessionId, transferReason, ivrNode, isHangup, data) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法转接IVR节点')
      return
    }
    const callid2 = myEtalkEvent.sessionMap[sessionId].callid2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    let msg = {
      type: 2040,
      agentId: this.agentId,
      sessionId: originSessionId,
      ivrNode,
      reason: transferReason,
      extNo: this.callernum,
      isHangup,
      agentExtNo: 9249,
      callid2,
      consumerData: data
    }
    msg = JSON.stringify(msg)
    this.sendMsgToServer(msg)
  }

  /**
	 * 转接IVR满意度
	 * @param sessionId 会话id
	 * @param ivrNode 满意度节点
	 */
  satisfaction (sessionId, ivrNode) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法推送满意度')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    let msg = {
      type: 2025,
      agentId: this.agentId,
      sessionId: originSessionId,
      ivrNode,
      extNo: this.callernum
    }
    msg = JSON.stringify(msg)
    this.sendMsgToServer(msg)
  }

  // 发送拒绝转接消息
  forceTransfer (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法拒绝转接')
      return
    }
    const agentid2 = myEtalkEvent.sessionMap[sessionId].agentid2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:20160, agentId:'" + this.agentId + "',agentId2:'" + agentid2 + "', sessionId:'" + originSessionId + "',mySessionId:'" + sessionId + "'}")
  }

  // 会议
  conference (originSessionId, otherId, reason) {
    this.sendMsgToServer("{type:2017,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "',agentId2:'" + otherId + "',reason:'" + reason + "'}")
  }

  // 发送拒绝会议消息
  forceConference (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法拒绝会议')
      return
    }
    const agentid2 = myEtalkEvent.sessionMap[sessionId].agentid2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:20170, agentId:'" + this.agentId + "',agentId2:'" + agentid2 + "', sessionId:'" + originSessionId + "',mySessionId:'" + sessionId + "'}")
  }

  /**
	 * 咨询会议，在咨询状态下发起，将咨询中的两方坐席会话与客户组成三方会议
	 * @param sessionId 会话id
	 */
  consultConference (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法发起咨询会议')
      return
    }
    const otherId = myEtalkEvent.sessionMap[sessionId].agentId2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    const callid = myEtalkEvent.sessionMap[sessionId].callid
    this.sendMsgToServer("{type:2039,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "',agentId2:'" + otherId + "'}")
  }

  // consult conference,ivr渠道的咨询转接方法
  consultTransfer (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法咨询转接')
      return
    }
    const otherId = myEtalkEvent.sessionMap[sessionId].agentId2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    const callid = myEtalkEvent.sessionMap[sessionId].callid
    this.sendMsgToServer("{type:2042,agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "',agentId2:'" + otherId + "'}")
  }

  // 咨询
  consult (sessionId, agentId2, number, consultReason, transferData) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法发起咨询')
      return
    }
    if (agentId2 !== '') {
      // console.log('咨询 + 这里改了 agentId2 的值')
      myEtalkEvent.sessionMap[sessionId].agentId2 = agentId2
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2034,agentId:'" + this.agentId + "',agentId2:'" + agentId2 + "', consultNumber:'" + number + "', sessionId:'" + originSessionId + "', consumerData:'" + transferData + "',reason:'" + consultReason + "'}")
  }

  // 咨询取回
  consultBack (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法取回咨询')
      return
    }
    const agentId2 = myEtalkEvent.sessionMap[sessionId].agentId2
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:2037,agentId:'" + this.agentId + "',agentId2:'" + agentId2 + "', sessionId:'" + originSessionId + "'}")
  }

  // 发送拒绝咨询消息
  forceConsult (agentid2, sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法拒绝咨询')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:20340, agentId:'" + this.agentId + "',agentId2:'" + agentid2 + "', sessionId:'" + originSessionId + "'}")
  }

  // 坐席拉客户进入会话
  pullClient (consumerId, channelType) {
    this.sendMsgToServer("{type:2015, agentId:'" + this.agentId + "',channelType:'" + channelType + "', tenantId:'" + this.tenantId + "',consumerId:'" + consumerId + "'}")
  }

  // 监听
  listen (sessionId) {
    this.sendMsgToServer("{type:3001, agentId:'" + this.agentId + "',sessionId:'" + sessionId + "'}")
  }

  // 退出监听
  listenout (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法退出监听')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:3002, agentId:'" + this.agentId + "',sessionId:'" + originSessionId + "'}")
  }

  // 强拆会话(从会话中踢出一个坐席)
  kickOneAgentFromsession (sessionId, agentid2) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法强拆会话')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:3003, agentId:'" + this.agentId + "',sessionId:'" + originSessionId + "',agentId2:'" + agentid2 + "'}")
  }

  // 强拆会话(结束会话)
  kickAllAgentFromsession (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法强拆会话')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:3006, agentId:'" + this.agentId + "',sessionId:'" + originSessionId + "'}")
  }

  // 强插入某会话
  insert (sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法强插会话')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    this.sendMsgToServer("{type:3004, agentId:'" + this.agentId + "',sessionId:'" + originSessionId + "'}")
  }

  // 将某坐席踢出系统
  kick (agentid2) {
    this.sendMsgToServer("{type:3005, agentId:'" + this.agentId + "',agentId2:'" + agentid2 + "'}")
  }

  // 拒绝新会话  1拒绝并示忙0只拒绝不示忙
  denyNewsession (flag) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[this.lastestSessionId]) {
      console.warn('sessionMap 不存在，无法拒绝新会话')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[this.lastestSessionId].originSessionId
    const consumerId = myEtalkEvent.sessionMap[this.lastestSessionId].consumerId
    this.sendMsgToServer("{type:2043, agentId:'" + this.agentId + "', sessionId:'" + originSessionId + "', flag:'" + flag + "',consumerId:'" + consumerId + "'}")
  }

  // 坐席发送消息
  sendMessage (content, sessionId, contentType, msgId, fileName, relation) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法发送消息')
      return
    }
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    const p = {}
    p.type = 2007
    p.agentId = this.agentId
    p.sessionId = originSessionId
    p.content = content
    p.msgType = contentType
    p.relation = relation || ''
    p.recognition = fileName || ''
    // console.log('头像上送一次')
    p.headImgId = '' // $('#avatar').val() 头像上送
    if (msgId) {
      p.msguuid = msgId
    }
    this.sendMsgToServer(JSON.stringify(p))
  }

  // 坐席撤回消息
  revokeMessage (sessionId, msguuid) {
    const p = {}
    p.type = 2027
    p.agentId = this.agentId
    p.sessionId = sessionId
    p.msguuid = msguuid
    this.sendMsgToServer(JSON.stringify(p))
  }

  sendJson (json, sessionId) {
    const myEtalkEvent = getMyEtalkEvent()
    if (!myEtalkEvent || !myEtalkEvent.sessionMap || !myEtalkEvent.sessionMap[sessionId]) {
      console.warn('sessionMap 不存在，无法发送自定义消息')
      return
    }
    const p = {}
    const originSessionId = myEtalkEvent.sessionMap[sessionId].originSessionId
    p.type = 2022
    p.sessionId = originSessionId
    p.content = json
    p.agentId = this.agentId
    p.headImgId = '' // $('#avatar').val()
    this.sendMsgToServer(JSON.stringify(p))
  }

  // 提示信息区
  showIBMsg (msg) {
    // top.topFrame.document.getElementById("ibmsg").value = msg + "\r\n" + top.topFrame.document.getElementById("ibmsg").value;
  }

  // 心跳包
  probe () {
    const socket = this.getSocket()
    if (socket != null && socket !== undefined) {
      socket.probe()
    } else {
      console.warn('WebSocket 尚未初始化，无法发送心跳包')
    }
  }

  // 关闭socket 链接
  closeSocket () {
    try {
      const socket = this.getSocket()
      if (socket != null && socket !== undefined) {
        socket.close()
      }
    } catch (e) {
      console.log('[etalk_es6.js--closeSocket]', e)
    }
  }

  // 心跳包
  heartPackage () {
    this.sendMsgToServer("{type:'0000', agentId:'" + this.agentId + "', currentIp:'" + this.currentIp + "'}")
  }

  parseMsg (msg) {
    // 将单引号键名替换为双引号键名
    msg = msg.replace(/([\w]+):/g, '"$1":')
    // 解析JSON字符串并返回JavaScript对象
    // console.log('msg', msg)
    return JSON.parse(msg)
  }

  // 发送消息
  sendMsgToServer (_msg) {
    console.log('发送消息到服务器', _msg)
    const socket = this.getSocket()
    if (socket != null && socket !== undefined) {
      console.log('_msg', _msg)
      // eslint-disable-next-line no-eval
      const mession = eval(`(${_msg})`)
      mession.tenantId = JSON.parse(getLocalToken('dsKey'))
      // console.log('mession', mession)
      // 存一下聊天数据
      socket.send(JSON.stringify(mession))
    } else {
      console.warn('WebSocket 尚未初始化，无法发送消息。请稍后重试或检查连接状态。', {
        socketObj: this.socketObj,
        agentId: this.agentId
      })
      // 可选：延迟重试机制
      setTimeout(() => {
        const retrySocket = this.getSocket()
        if (retrySocket != null && retrySocket !== undefined) {
          console.log('重试发送消息')
          // eslint-disable-next-line no-eval
          const retryMession = eval(`(${_msg})`)
          retryMession.tenantId = JSON.parse(getLocalToken('dsKey'))
          retrySocket.send(JSON.stringify(retryMession))
        } else {
          console.error('WebSocket 初始化失败，消息发送失败')
        }
      }, 500)
    }
  }

  //
  callByObject (mapMsg) {
    console.log('mapMsg', mapMsg)
    const mapMsgVal = mapMsg + ''
    const ret = JSON.parse(mapMsgVal)
    const type = `${ret.type}`
    // window.status = `消息：${mapMsgVal}`

    switch (type) {
    case '6000':
      this.fireEvent(this.ON_MESSAGE_CENTER, ret)
      break
    case '0000':
      this.lastestheartmsgdate = new Date()
      // console.log(`收到心跳消息: ${this.lastestheartmsgdate.getTime()}`)
      break
    case '1111':
      this.fireEvent(this.ON_AGENT_ERROR, ret)
      break
    case '1005' : // 客户端消息到达
      this.fireEvent(this.ON_CONSUMER_MSG_RECEIVE, ret)
      break
    case '1010' : // 客户端自定义消息到达
      this.fireEvent(this.ON_CONSUMER_CMD_RECEIVE, ret)
      break
    case '10021' :// 客户退出
      this.fireEvent(this.ON_CONSUMER_EXIT, ret)
      break
    case '1013':
      this.fireEvent(this.ON_CONSUMER_ENTERMSG, ret)
      break
    case '1016':
      this.fireEvent(this.ON_CONSUMER_LEAVE, ret)
      break
    case '10171':
      this.fireEvent(this.ON_CONSUMER_BACK, ret)
      break
    case '10181':// app客户接起外呼成功
      this.fireEvent(this.ON_CONSUMER_MAKECALL_SUCCESS, ret)
      break
    case '20011':	// 签入成功
      this.fireEvent(this.ON_AGENT_LOGIN_COMPLETE, ret)
      this.loginStatus = true
      break
    case '20012':	// 签入失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_LOGIN_FAIL, ret)
      break
    case '20021':	// 签退成功
      this.fireEvent(this.ON_AGENT_LOGOUT_COMPLETE, ret)
      this.loginStatus = false
      break
    case '20022':	// 签退失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_LOGOUT_FAIL, ret)
      break
    case '20031':	// 临时签退成功
      this.fireEvent(this.ON_AGENT_TEMPLOGOUT_COMPLETE, ret)
      break
    case '20032':	// 临时签退失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_TEMPLOGOUT_FAIL, ret)
      break
    case '20041':	// 临时签入成功
      this.fireEvent(this.ON_AGENT_TEMPLOGIN_COMPLETE, ret)
      break
    case '20042':	// 临时签入失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_TEMPLOGIN_FAIL, ret)
      break
    case '20051':	// 示忙成功
      this.fireEvent(this.ON_AGENT_BUSY_COMPLETE, ret)
      break
    case '20052':	// 示忙失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_BUSY_FAIL, ret)
      break
    case '20061':	// 示闲成功
      this.fireEvent(this.ON_AGENT_IDLE_COMPLETE, ret)
      break
    case '20062':	// 示闲失败（没有上送坐席ID）
      this.fireEvent(this.ON_AGENT_IDLE_FAIL, ret)
      break
    case '20063':	// 示闲失败（未登录）
      this.fireEvent(this.ON_AGENT_IDLE_FAIL, ret)
      break
    case '2007':	// 接收自己发送的消息
      this.fireEvent(this.ON_AGENT_MSG_RECEIVE, ret)
      break
    case '20072':// 发送消息失败，没有agent id
      this.fireEvent(this.ON_AGENT_MSG_SEND_FAIL, ret)
      break
    case '2008':	// 新会话响铃
      this.lastestRingType = '2008'
      this.lastestSessionId = ret.sessionId
      this.lastestOtherAgent = ''
      this.fireEvent(this.ON_NEWSESSION_RING, ret)
      break
    case '2030':
      this.lastestRingType = '2030'
      this.lastestSessionId = ret.sessionId
      this.lastestOtherAgent = ''
      this.fireEvent(this.ON_OUTBOUND_RING, ret)
      break
    case '20091':// 应答量修改成功,此消息只发送给坐席
      this.fireEvent(this.ON_AGENT_CHANGE_ANSWERCOUNT_COMPLETE, ret)
      break
    case '20092':// 应答量修改失败,no agentid
      this.fireEvent(this.ON_AGENT_CHANGE_ANSWERCOUNT_FAIL, ret)
      break
    case '20101':// 坐席正在输入消息成功，此消息会发送给房间内的每一个参与者
      this.fireEvent(this.ON_AGENT_ENTERMSG_COMPLETE, ret)
      break
    case '20102':// 坐席正在输入消息失败,no agentid
      this.fireEvent(this.ON_AGENT_ENTERMSG_FAIL, ret)
      break
    case '20111':// 坐席挂断会话成功,此消息会发送给房间内的每一个参与者，接到该消息后，马上在聊天窗口内打印一条系统提示消息
      this.fireEvent(this.ON_AGENT_HANGUP_COMPLETE, ret)
      break
    case '20112':// 坐席挂断会话失败,no agentid
      this.fireEvent(this.ON_AGENT_HANGUP_FAIL, ret)
      break
    case '20121':// 坐席完成事后总结成功
      this.fireEvent(this.ON_AGENT_ENDSUM_COMPLETE, ret)
      break
    case '20122':// 坐席完成事后总结失败,no agentid
      this.fireEvent(this.ON_AGENT_ENDSUM_FAIL, ret)
      break
    case '20131':	// 坐席异常退出，提示坐席退出房间
      this.fireEvent(this.ON_AGENT_EXCEPTIONEXIT, ret)
      break
    case '20141':	// 坐席接起新会话成功,此消息既要发送给坐席，也要发送客户，客户接到该消息后进入到聊天界面
      this.fireEvent(this.ON_AGENT_RECEIVE_NEWSESSION, ret)
      break
    case '20142':	// 坐席接起新会话失败
      this.fireEvent(this.ON_AGENT_RECEIVE_NEWSESSION_FAIL, ret)
      break
    case '20151': // 坐席拉客户入会话成功
      this.fireEvent(this.ON_AGENT_PULL_CLIENT_COMPLETE, ret)
      break
    case '20152': // 坐席拉客户入会话失败
      this.fireEvent(this.ON_AGENT_PULL_CLIENT_FAIL, ret)
      break
    case '20160':	// 提示发起转接的坐席，对方拒绝了
      this.fireEvent(this.ON_AGENT_TRANSFER_FORCE, ret)
      break
    case '20161':	// 提示发起转接的坐席，转接成功了，目标方已经接起转接
      this.fireEvent(this.ON_AGENT_TRANSFER_COMPLETE, ret)
      break
    case '20162':	// 转接失败
      this.fireEvent(this.ON_AGENT_TRANSFER_FAIL, ret)
      break
    case '20163':	// 拒绝转接，发送给拒绝方
      this.fireEvent(this.ON_AGENT_DENYTRANSFER_COMPLETE, ret)
      break
    case '20164':	// 提示转接发送方，转接请求成功
      this.fireEvent(this.ON_AGENT_TRANSFER_SENT_SUCCESS, ret)
      break
    case '20170':	// 提示发起会议的坐席，对方拒绝了
      this.fireEvent(this.ON_AGENT_CONFERENCE_FORCE, ret)
      break
    case '20171':	// 提示发起会议的坐席，会议成功了
      this.fireEvent(this.ON_AGENT_MEETING_COMPLETE, ret)
      break
    case '20172':	// 会议发起失败，发给会议发送方
      this.fireEvent(this.ON_AGENT_MEETING_FAIL, ret)
      break
    case '20173':	// 拒绝会议成功，发送给拒绝方
      this.fireEvent(this.ON_AGENT_DENYMEETING_COMPLETE, ret)
      break
    case '20174':	// 会议请求发送成功，用于提示会议发起方，此时会议目标方会收到振铃事件，但还没有接起会议
      this.fireEvent(this.ON_AGENT_MEETING_SENT_SUCCESS, ret)
      break
    case '20181':	// 坐席接起转接成功,代表转接成功
      this.fireEvent(this.ON_AGENT_RECEIVE_TRANSFER, ret)
      break
    case '20182':	// 坐席接起转接会话失败
      this.fireEvent(this.ON_AGENT_RECEIVE_TRANSFER_FAIL, ret)
      break
    case '20191':// 坐席接起会议成功,代表会议成功
      this.fireEvent(this.ON_AGENT_RECEIVE_MEETING, ret)
      break
    case '20192':// 坐席接起会议会话失败
      this.fireEvent(this.ON_AGENT_RECEIVE_MEETING_FAIL, ret)
      break
    case '2020':	// 转接响铃
      this.lastestRingType = '2020'
      this.lastestSessionId = ret.sessionId
      this.lastestOtherAgent = ret.agentId2
      this.fireEvent(this.ON_TRANSFER_RING, ret)
      break
    case '2021':	// 会议响铃
      this.lastestRingType = '2021'
      this.lastestSessionId = ret.sessionId
      this.lastestOtherAgent = ret.agentId2
      this.fireEvent(this.ON_MEETING_RING, ret)
      break
    case '2022':// 发送自定义消息成功
      this.fireEvent(this.ON_AGENT_CMD_RECEIVED, ret)
      break
    case '20222':// 发送自定义消息失败
      this.fireEvent(this.ON_AGENT_CMD_FAIL, ret)
      break
    case '2023':// 坐席 被强拆
      this.fireEvent(this.ON_AGENT_KICKBYADMIN, ret)
      break
    case '2024': //  强踢
      this.fireEvent(this.ON_AGENT_REMOVEBYADMIN, ret)
      break
    case '20251':
      this.fireEvent(this.ON_AGENT_TITLE_SATISFACTION_SUCCESS, ret)
      break
    case '20252':
      this.fireEvent(this.ON_AGENT_TITLE_SATISFACTION_FAIL, ret)
      break
    case '2028':// 外呼发起成功事件，并不是外呼成功
      this.fireEvent(this.ON_AGENT_MAKECALL_SUCCESS, ret)
      break
    case '20282':// 外呼发起失败事件
      this.fireEvent(this.ON_AGENT_MAKECALL_FAIL, ret)
      break
    case '20291':// 外呼成功事件，客户已接起外呼电话
      this.fireEvent(this.ON_AGENT_RECEIVE_OB_CALL, ret)
      break
    case '2031':// 聊天超时给坐席提示
      this.fireEvent(this.ON_AGENT_CHAT_TIMEOUT_PROMPT, ret)
      break
    case '20323': // hold成功
      this.fireEvent(this.ON_AGENT_HOLD_SUCCESS, ret)
      break
    case '20322': // hold失败
      this.fireEvent(this.ON_AGENT_HOLD_FAIL, ret)
      break
    case '20333': // 保持取回成功
      this.fireEvent(this.ON_AGENT_UNHOLD_SUCCESS, ret)
      break
    case '20332': // 保持取回失败
      this.fireEvent(this.ON_AGENT_UNHOLD_FAIL, ret)
      break
    case '2034':// 咨询CTI指令发起成功
      this.fireEvent(this.ON_AGENT_CONSULT_CTI, ret)
      break
    case '20340':// 拒绝咨询
      this.fireEvent(this.ON_AGENT_CONSULT_FORCE, ret)
      break
    case '20341':// 咨询成功
      this.fireEvent(this.ON_AGENT_CONSULT_COMPLETE, ret)
      break
    case '20342':// 咨询失败
      this.fireEvent(this.ON_AGENT_CONSULT_FAIL, ret)
      break
    case '20343':// 咨询中有一方退出失败
      this.fireEvent(this.ON_AGENT_CONSULT_PARTER_LEFT, ret)
      break
    case '20344':// 拒绝咨询完成 ，发送给拒绝方
      this.fireEvent(this.ON_AGENT_DENYCONSULT_COMPLETE, ret)
      break
    case '2035':// 咨询振铃
      this.lastestRingType = '2035'
      this.lastestSessionId = ret.sessionId
      this.lastestOtherAgent = ret.agentId2
      this.fireEvent(this.ON_CONSULT_RING, ret)
      break
    case '20361':// 坐席接起咨询成功
      this.fireEvent(this.ON_AGENT_RECEIVE_CONSULT, ret)
      break
    case '20362':// 坐席接起咨询失败
      this.fireEvent(this.ON_AGENT_RECEIVE_CONSULT_FAIL, ret)
      break
    case '20371':// 咨询取回成功
      this.fireEvent(this.ON_AGENT_CONSULTBACK_SUCCESS, ret)
      break
    case '20372':// 咨询取回失败
      this.fireEvent(this.ON_AGENT_CONSULTBACK_FAIL, ret)
      break
    case '20373':// 咨询被取回挂机
      this.fireEvent(this.ON_AGENT_CONSULTBACK, ret)
      break
    case '20381' :// 转接,咨询,会议的callid刷新事件
      this.fireEvent(this.ON_AGENT_REFRESH, ret)
      break
    case '20391':	// 咨询会议成功，此消息会发送给咨询发送方
      this.fireEvent(this.ON_AGENT_CONSULT_MEETING_COMPLETE, ret)
      break
    case '20392':	// 发起咨询会议失败
      this.fireEvent(this.ON_AGENT_CONSULT_MEETING_FAIL, ret)
      break
    case '20393':	// 咨询会议成功事件，此消息会发送给咨询接起方
      this.lastestSessionId = ret.sessionId
      this.lastestRingType = '20393'
      this.fireEvent(this.ON_AGENT_RECEIVE_CONSULT_MEETING, ret)
      break
    case '20394':	// 咨询会议中有参与者退出事件，此消息会发送给咨询发起方
      this.fireEvent(this.ON_AGENT_CONSULT_MEETING_PARTER_LEFT, ret)
      break
    case '2040':// 转IVR节点
      this.fireEvent(this.ON_SERVER_TOOLONGMSG, ret)
      break
    case '20401':// 转IVR节点成功
      this.fireEvent(this.ON_AGENT_TRANSFER_IVRNODE_COMPLETE, ret)
      break
    case '20402':// 转IVR节点失败
      this.fireEvent(this.ON_AGENT_TRANSFER_IVRNODE_FAIL, ret)
      break
    case '20403':// ivr回调
      this.fireEvent(this.ON_AGENT_TRANSFER_IVRNODE_IVRCALLBACK, ret)
      break
    case '20411':// 消息超长(2048)
      this.fireEvent(this.ON_AGENT_TRANSFER_IVRGROUP_COMPLETE, ret)
      break
    case '20412':// 消息超长(2048)
      this.fireEvent(this.ON_AGENT_TRANSFER_IVRGROUP_FAIL, ret)
      break
    case '20421':	// 发起咨询起转接成功，此消息会发送给咨询发起方
      this.fireEvent(this.ON_AGENT_CONSULT_TRANSFER_COMPLETE, ret)
      break
    case '20422':	// 发起咨询转接失败
      this.fireEvent(this.ON_AGENT_CONSULT_TRANSFER_FAIL, ret)
      break
    case '20423':	// 接起咨询转接成功事件，此消息会发送给咨询接起方
      this.lastestSessionId = ret.sessionId
      this.lastestRingType = '20423'
      this.fireEvent(this.ON_AGENT_RECEIVE_CONSULT_TRANSFER, ret)
      break
    case '20431':	// 拒绝新会话成功
      this.fireEvent(this.ON_AGENT_DENY_NEWSESSION_COMPLETE, ret)
      break
    case '20432':	// 拒绝新会话失败
      this.fireEvent(this.ON_AGENT_DENY_NEWSESSION_FAIL, ret)
      break
    case '2047':// 监听振铃
      this.lastestSessionId = ret.sessionId
      this.lastestRingType = '2047'
      this.fireEvent(this.ON_ADMIN_LISTEN_RING, ret)
      break
    case '2048':// 强插振铃
      this.lastestSessionId = ret.sessionId
      this.lastestRingType = '2048'
      this.fireEvent(this.ON_ADMIN_INSERT_RING, ret)
      break
    case '20511':// 报工号成功
      this.fireEvent(this.ON_AGENT_BROADCAST, ret)
      break
    case '20701':// APP外呼成功
      this.fireEvent(this.ON_AGENT_APP_MAKECALL_SUCCESS, ret)
      break
    case '20702':// APP外呼失败
      this.fireEvent(this.ON_AGENT_APP_MAKECALL_FAIL, ret)
      break
    case '20801':// 微信外呼成功
      this.fireEvent(this.ON_AGENT_WEMAKECALL_SUCCESS, ret)
      break
    case '20803':// 微信外呼失败
      this.fireEvent(this.ON_AGENT_WEMAKECALL_FAIL, ret)
      break
    case '21211':// 初始化成功
      this.fireEvent(this.ON_AGENT_INIT_SUCCESS, ret)
      break
    case '22211':// 会话恢复成功
      this.fireEvent(this.ON_AGENT_RECOVER_SESSION_SUCCESS, ret)
      break
      //
    case '30011':
      this.lastestSessionId = ret.sessionId
      this.lastestRingType = '30011'
      this.fireEvent(this.ON_ADMIN_LISTEN_COMPLETE, ret)
      break
    case '30012':
      this.fireEvent(this.ON_ADMIN_LISTEN_FAIL, ret)
      break
    case '30021':
      this.fireEvent(this.ON_ADMIN_LISTENOUT_COMPLETE, ret)
      break
    case '30022':
      this.fireEvent(this.ON_ADMIN_LISTENOUT_FAIL, ret)
      break
    case '30031':// 从会话中强拆一个坐席成功
      this.fireEvent(this.ON_ADMIN_KICKAGENT4SESSION_COMPLETE, ret)
      break
    case '30032':
      this.fireEvent(this.ON_ADMIN_KICKAGENT4SESSION_FAIL, ret)
      break
    case '30041':// 管理员强插进入会话
      this.fireEvent(this.ON_ADMIN_INSERT_COMPLETE, ret)
      break
    case '30042':// 强插失败
      this.fireEvent(this.ON_ADMIN_INSERT_FAIL, ret)
      break
    case '30051':	// 被管理员踢出全媒体系统
      this.fireEvent(this.ON_ADMIN_KICKAGENT_COMPLETE, ret)
      break
    case '30052':	// 被管理员踢出全媒体系统
      this.fireEvent(this.ON_ADMIN_KICKAGENT_FAIL, ret)
      break
    case '5000':// 强插系统消息
      this.fireEvent(this.ON_MSG_JOIN, ret)
      break
    case '5001':// 转接成功系统消息
      this.fireEvent(this.ON_MSG_TRANSFER, ret)
      break
    case '5002':// 坐席挂断电话系统消息
      this.fireEvent(this.ON_MSG_AGENTHUNGUP, ret)
      break
    case '5003':// 坐席三方会议成功系统消息
      this.fireEvent(this.ON_MSG_MEETING, ret)
      break
    case '5004':// 坐席被强拆系统消息
      this.fireEvent(this.ON_MSG_KICKBYADMIN, ret)
      break
    case '5005':// 坐席被管理员踢出系统
      this.fireEvent(this.ON_MSG_REMOVEBYADMIN, ret)
      break
    case '5006':// 监听坐席退出
      this.fireEvent(this.ON_MSG_AGENTLISTENOUT, ret)
      break
    case '6001':// 公告消息
      this.fireEvent(this.ON_MSG_ANNOUNCEMENT, ret)
      break
    case '6036' :// 建立连接
      // console.log('cs')
      this.fireEvent(this.ON_SERVER_CONNECT, ret)
      {
        const myEtalkEvent = getMyEtalkEvent()
        if (myEtalkEvent && myEtalkEvent.etalkobj && myEtalkEvent.etalkobj.etalkHeart) {
          myEtalkEvent.etalkobj.etalkHeart.start()
        }
      }
      break
    case '6037':// 与服务器断开连接
      this.fireEvent(this.ON_SERVER_CLOSE, ret)
      {
        const myEtalkEvent = getMyEtalkEvent()
        if (myEtalkEvent && myEtalkEvent.etalkobj && myEtalkEvent.etalkobj.etalkHeart) {
          myEtalkEvent.etalkobj.etalkHeart.stop()
        }
      }
      break
    case '6038':// 尚未与服务器建立连接
      this.fireEvent(this.ON_SERVER_NOTCONNECT, ret)
      break
    case '6039':// 消息不能为空
      this.fireEvent(this.ON_SERVER_EMPTYMSG, ret)
      break
    case '20271':// 消息撤回 messageRecall  onMessageRecall
      this.fireEvent(this.ON_MESSAGE_RECALL, ret)
      break
    case '20272': // 消息撤回失败
      this.fireEvent(this.ON_MESSAGE_RECALLFALL, ret)
      break
    case '10151': // 客户消息撤回
      this.fireEvent(this.ON_RECALL_MSG_SUCCESS, ret)
      break
    case '2052': // 超时 给坐席 消息提醒
      this.fireEvent(this.ON_MESSAGE_TIMEOUT, ret)
      break
    default:
      break
    }
  }
}

// EtalkEvent = new EtalkEvent()
// 这段代码定义了一个 Etalk 类和一个 EtalkEvent 原型，提供事件机制。

// class Etalk extends EtalkEvent {
//   constructor() {
//     super();
//   }
// }
// Etalk 类定义了一个构造函数，该构造函数调用父类 EtalkEvent 的构造函数并继承了其所有原型方法。EtalkEvent 类定义了一个构造函数、一个 addListener() 方法、一个 removeListener() 方法和一个 fireEvent() 方法。
// addListener() 方法接收两个参数：一个字符串类型的事件名称和一个事件处理器，如果没有对应事件数组，则为该事件创建一个空数组，并将事件处理程序添加到数组中。
// removeListener() 方法接收两个参数：一个字符串类型的事件名称和要删除的事件处理程序。遍历事件处理程序数组并将数组中相应的项移除。
// fireEvent() 方法接收两个参数：一个字符串类型的事件名称和一个要传递给所有处理程序的数据对象。该方法遍历该事件的处理程序数组，并调用每个事件处理程序，传递事件数据。
// 请注意，在使用新的格式化代码时，您可能需要对已经存在的函数调用进行更改。


/*
 * 心跳对象
 */
class Heart {
  constructor () {
    this.heartPackage = null
  }

  /* 开始心跳 */
  start () {
    this.heartPackage = setInterval(() => {
      const myEtalkEvent = getMyEtalkEvent()
      if (myEtalkEvent && myEtalkEvent.etalkobj) {
        myEtalkEvent.etalkobj.heartPackage()
        // console.log('开始心跳')
        if (myEtalkEvent.etalkobj.lastestheartmsgdate) {
          const timeDiff = new Date().getTime() - myEtalkEvent.etalkobj.lastestheartmsgdate.getTime()
          if (timeDiff > 90000) {
            ElMessage.error('您的网络不稳定，可能会影响您和客户的沟通！')
          }
        }
      }
    }, 15000)
  }

  /* 停止心跳 */
  stop () {
    clearInterval(this.heartPackage)
  }
}
Etalk.prototype.etalkHeart = new Heart()
// const etalkHeart = new Heart()
export default Etalk
