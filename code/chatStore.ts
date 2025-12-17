import { defineStore } from 'pinia'
// import useSessionStore from './sessionStore'
// import Chat from '@/utils/etalkUtils/newEtalk/type/Chat'
// import Message from '@/utils/etalkUtils/newEtalk/type/Message'
// import ChatType from '@/utils/etalkUtils/newEtalk/config/ChatType'
// import { getLocalToken, setLocalToken } from '@/utils/auth'
// import myLocalStoreUtils from '@/utils/etalkUtils/newEtalk/MyLocalStoreUtils'
// import router from '@/router'
// import useUserStore from '@/store/modules/user'


export const useChatStore = defineStore({
  id: 'chat_store',
  state: () => ({
    // 好友 当前聊天的对象
    chats: [],
    // chats :[],
    // 当前聊天的对象
    index: 0,
    // 会话记录 1005 用户消息  2007 坐席消息  其他的都是系统消息
    chatMessage: new Map(),
    // 历史聊天数据
    historychatMessage: new Map(),

    // 当前连接数为 在线的
    sessionNum: 0,
    // {sessionId：{agentId: "yinshang"callee: "yinshang"caller: "tmppCHdof240412"channelType: "webchat"consumerData: "null"consumerId: "hannah_hang-webchat-tmppCHdof240412"consumerIdKey: "hannah_hang-webchat-tmppCHdof240412"consumerName: "游客"consumerNo: "tmppCHdof240412"consumerProvince: ""currentCardNo: undefinedcustRes: "webchat"direct: "1"groupNo: "webchat"isLeave: falseoriginSessionId: "efcdbc337fd04b6eac8513c048d4547a"originalCustCallee: "webchat"originalCustName: "张三"originalCustNumber: "tmppCHdof240412"sessionId: "efcdbc337fd04b6eac8513c048d4547a"tenantId: "hannah_hang"time: "2024-07-24 15:09:52"type: 20141unreadNum: 0videoId: "null"}}
    sessionMap: new Map(),
    // unreadNum 未读消息 数量

    // 当前 会话ID  sessionMapId 统一放到 sessionStore 里管理
    sessionMapId: '',
    // 判断是否断开
    isconnected: 0,
    // // 监督员
    _isMonitor: false,
    // // 挂断
    // _isHangup : false,
    // // 插入
    _isInsert: false,
    // // 已插入
    // _isInserted : false,
    // 小结用的菜单信息 业务里点击了哪些菜单 根据sessionId走
    businessMenuMap: new Map(),
    // // 文本的签入状态 是否准备好了
    // textReady: false,
    // 示忙
    textShowBusy: false,

    // 按钮状态
    TextBtnList: new Map(),
    // 文本 进线渠道 是否是自动签入
    isAutoAnswer: '0',
    // 超时撤回设置
    withdrawFlag: [1, 3],
    /* 引用记录对象 */
    quoteMessageObj: [],
    ETALK_AGENT_PULL_CLIENT_STRATEGY: 'true',
    // 待填充到消息输入框的内容（按 sessionId 存储）
    pendingMessageContent: new Map(),
    // myEtalkEvent 对象实例（全局唯一）
    myEtalkEvent: null,
    // 当前选择的资源
    currentResource: new Map()

  }),
  // 开启数据缓存
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: "chat",
  //       storage: myLocalStoreUtils,
  //       paths: ["index", "chats"]
  //     }
  //   ]
  // },
  getters: {},
  actions: {
    /*
    点击引用 获取 当前消息的SessId 和消息对象
    当发送消息时 给当前sessId 的消息框里展示消息记录的消息对象
    历史消息记录里
    */
    /* 设置 引用记录对象 */
    setquoteMessageObj (sessId, obj) {
      this.quoteMessageObj[sessId] = obj
    },
    // 获取 引用记录对象
    getquoteMessageObj (sessId) {
      return this.quoteMessageObj[sessId]
    },
    // 删除当前sessId 的引用记录对象
    delquoteMessageObj (sessId) {
      delete this.quoteMessageObj[sessId]
    },
    // 超时撤回设置
    setWithdrawFlag (switchs, val) {
      this.withdrawFlag = [switchs, val]
    },
    /**
     * 重新加载聊历史记录
     */
    /**
     * 把数据插入到消息的列表，有序插入
     *
     * @param list list
     * @param message 消息
     * @param message 消息
     */
    insertMessage (list, message) {
      if (list && list.length === 0) {
        list.push(message)
        return
      }
      // 如果能找到 就不插入
      // 处理系统消息没有 msguuid
      if (!message.msguuid) {
        list.push(message)
      } else {
        const index = list.findIndex((v) => v.msguuid === message.msguuid) || -1
        if (index < 0) {
          list.push(message)
        }
      }
    },

    /**
     * 重置未读消息计数
     */
    reset () {
      this.chats.forEach((item) => {
        item.unreadCount = 0
      })
    },

    /**
     * 限制聊天记录的数组的长度
     * @param message 新增的聊天消息
     * @param chatId 聊天室
     * @param sessionId
     *
     */
    addToMessageList (message, sessionId) {
      const messageList = this.chatMessage.get(sessionId) || []
      this.insertMessage(messageList, message)
      if (messageList.length > 8800) {
        messageList.shift()
      }
      this.chatMessage.set(sessionId, messageList)
    },
    // 删除当前的 msguuid 的消息 撤回功能专用
    delMsguuidItem (sessionId, msguuid, msg = '') {
      const messageList = this.chatMessage.get(sessionId)
      if (messageList.length > 0) {
        const index = messageList.findIndex(v => v.msguuid === msguuid)
        if (index >= 0) {
          // messageList.splice(index, 1)
          if (msg) {
            messageList[index].errorMsg = msg
          }
          messageList[index].revokeFlag = true
        }
        // this.chatMessage.set(sessionId, messageList)
      }
    },
    // 对btn 的更新
    setTextBtnList (sessionId, btnList) {
      this.TextBtnList.set(sessionId, btnList)
      // console.log('更新了 pinia', sessionId, this.TextBtnList)
    },
    // 修改 更新 BtnList 的数据
    setTextBtnItem (sessionId, btnName, obj) {
      const textBtnItem = this.TextBtnList.get(sessionId)
      // console.log('修改sessionId', sessionId, 'textBtnItem', textBtnItem)
      if (textBtnItem && Object.keys(textBtnItem).length > 0) {
        textBtnItem[btnName] = obj

        this.TextBtnList.set(sessionId, textBtnItem)
      }
    },
    getTextBtnList (sessionId) {
      return this.TextBtnList.get(sessionId)
    },
    // 保存历史 会话记录
    addHistoryMessageAll (messList) {
      const list = this.historychatMessage.get(messList.key)
      // debugger
      const arrays = []
      if (list && list.length > 0) {
        // 向上
        if (messList.direct && messList.direct === '1') {
          for (let index = 0; index < messList.value.length; index++) {
            const element = messList.value[index]
            // list.unshift(element)+
            // arrays.push(element)

            if (!list.some(v => v.id === element.id)) {
              arrays.push(element)
            }
          }
          const arr = arrays.concat(list)
          this.historychatMessage.set(messList.key, arr)
        }
      } else {
        this.historychatMessage.set(messList.key, messList.value)
      }
    },

    // 存 用户数据
    addSessionMap (message, sessionId) {
      console.log('sessionId_ 2开始存数据了', sessionId)
      this.sessionMap.set(sessionId, message)
    },
    // 取当前sessionMapId 下的Map数据
    getSessionItemObj (sessionId) {
      return this.sessionMap.get(sessionId)
    },
    // 删除所有
    remoerSessionMessage () {
      this.sessionMap = new Map()
      this.sessionMapId = ''
      this.chatMessage = new Map()
      this.historychatMessage = new Map()
      this.sessionNum = 0
      this.resetMyEtalkEvent()
    },

    deletaSessionMessageItem (sessionId) {
      this.sessionMap.delete(sessionId)
      this.chatMessage.delete(sessionId)
      this.historychatMessage.delete(sessionId)
    },
    getSessionMapInfo (sessionId) {
      return this.sessionMap.get(sessionId)
    },
    // 修改指定sessionId 的sessionMap某一变量的值 没有
    // [{},{}]
    setSessionMapItemKey (sessionId, key, value) {
      // findIndex
      const sessionMapItem = this.sessionMap.get(sessionId)
      //  Object.assign(sessionMapItem,{[key]:value}
      if (sessionMapItem) {
        this.sessionMap.set(sessionId, Object.assign(sessionMapItem, { [key]: value }))
      } else {
        // this.sessionMap.set(sessionId, {})
      }
      // console.log("11111 ___ 检查修改和加key",this.sessionMap.get(sessionId),'key',key,'value',value);
    },

    // unreadNum 未读消息 数量
    // 当前消息的 sessionid 不等于 sessionMapId 就把 unreadNum 加1
    setSessionMapUnreadNum (sessionid) {
      const sessionMapItem = this.sessionMap.get(sessionid) || {}
      if (sessionid !== this.sessionMapId) {
        if (Object.keys(sessionMapItem).length > 0) {
          if (sessionMapItem.unreadNum) {
            let unread = sessionMapItem.unreadNum
            unread++
            sessionMapItem.unreadNum = unread
          } else {
            sessionMapItem.unreadNum = 1
          }
          this.sessionMap.set(sessionid, sessionMapItem)
        }
      } else {
        if (Object.keys(sessionMapItem).length > 0) {
          sessionMapItem.unreadNum = 0
          this.sessionMap.set(sessionid, sessionMapItem)
        }
      }
    },

    setCurrentMapItemKey (key, value) {
      this.setSessionMapItemKey(this.sessionMapId, key, value)
    },
    getSessionMapItemKey (sessionId, key) {
      return this.sessionMap.get(sessionId)[key]
    },

    getCurrentMayItemKey (key) {
      return this.getSessionMapItemKey(this.sessionMapId, key)
    },
    getSessionMapList () {
      const mapList = []
      for (const [i, v] of this.sessionMap.entries()) {
        // console.log("i",i,'v',v); unshift
        if (Object.keys(v).length) {
          mapList.unshift({ sessionId: i, message: v, channelType: 'webchat' })
        }
      }
      return mapList
    },
    // 记录当前服务的在线人数
    addSessionNumOne (value = 1) {
      this.sessionNum = this.sessionNum + value
      if (this.sessionNum < 0) {
        this.sessionNum = 0
      }
    },
    reduceSessionNumOne () {
      if (this.sessionNum > 0) {
        this.sessionNum = this.sessionNum - 1
      } else {
        this.sessionNum = 0
      }
    },
    setSessionNum (value) {
      this.sessionNum = value
    },
    removeSessionNum () {
      this.sessionNum = 0
    },
    getSessinNum () {
      return this.sessionNum
    },
    //
    setIsConnected (val = 0) {
      this.isconnected = val
    },
    // 对session 的更新
    setSessionMapId (val) {
      this.sessionMapId = val
      this.setSessionMapUnreadNum(val)
    },
    getSessionMapId () {
      return this.sessionMapId
    },

    getSessionMap () {
      return this.sessionMap
    },
    // 小结完成 清理 sessionMapId 和sessionMap
    removeSessionMapObj (sessionId) {
      this.deletaSessionMessageItem(sessionId)
      // this.sessionMapId = ''
    },

    // 小结关联业务
    addBusinessMenuMap (sessionId, message) {
      const mapList = this.businessMenuMap.get(sessionId) || []
      // console.log("mapList",mapList);
      if (mapList.length > 0) {
        const list = mapList.filter(v => v.menuId === message.menuId)
        // console.log("list小结关联业务",list);
        if (list.length <= 0) {
          mapList.push(message)
          this.businessMenuMap.set(sessionId, mapList)
        }
      } else {
        mapList.push(message)
        this.businessMenuMap.set(sessionId, mapList)
      }
      // console.log("addBusinessMenuMap",list);
    },
    remoerBusinessMenuMessage () {
      this.businessMenuMap = new Map()
    },
    deletaBusinessMenuMessageItem (sessionId) {
      this.businessMenuMap.delete(sessionId)
    },
    getBusinessMenuMapInfo (sessionId) {
      return this.businessMenuMap.get(sessionId)
    },

    // TextReady 的更新
    setTextShowBusy (val) {
      this.textShowBusy = val
    },
    getTextShowBusy () {
      return this.textShowBusy
    },

    // TextReady 的更新
    setAutoAnswer (val) {
      this.isAutoAnswer = val
    },
    getAutoAnswer () {
      return this.isAutoAnswer
    },
    // _isMonitor 的更新
    setTextIsMonitor (val) {
      this._isMonitor = val
    },
    getTextIsMonitor () {
      return this._isMonitor
    },
    // _isInsert
    setTextIsInsert (val) {
      this._isInsert = val
    },
    getTextIsInsert () {
      return this._isInsert
    },

    // 这个方法没有被执行
    delChat (id) {
      this.chats.splice(this.getChatIndex(id), 1)
    },

    getTextSessionConnectLen () {
      let length = 0
      this.sessionMap.forEach(item => {
        if (item.isconnected !== 0) {
          length++
        }
      })
      return length
    },
    setETALK_AGENT_PULL_CLIENT_STRATEGY (payload) {
      this.ETALK_AGENT_PULL_CLIENT_STRATEGY = payload
    },
    // 设置待填充到消息输入框的内容
    setPendingMessageContent (sessionId, content) {
      this.pendingMessageContent.set(sessionId, content)
    },
    // 获取并清除待填充到消息输入框的内容
    getAndClearPendingMessageContent (sessionId) {
      const content = this.pendingMessageContent.get(sessionId)
      if (content) {
        this.pendingMessageContent.delete(sessionId)
        return content
      }
      return null
    },
    // 清除指定 sessionId 的待填充内容
    clearPendingMessageContent (sessionId) {
      this.pendingMessageContent.delete(sessionId)
    },
    // 设置 myEtalkEvent 对象
    setMyEtalkEvent (myEtalkEvent) {
      this.myEtalkEvent = myEtalkEvent
    },
    // 获取 myEtalkEvent 对象
    getMyEtalkEvent () {
      return this.myEtalkEvent
    },
    // 重置 myEtalkEvent 对象
    resetMyEtalkEvent () {
      this.myEtalkEvent = null
    },
    setCurrentResource (payload) {
      this.currentResource.set(payload.teamNo, payload.autoAnswer)
    },
    getCurrentResource (teamNo) {
      return this.currentResource.get(teamNo)
    },
    removeCurrentResource (resourceNo) {
      this.currentResource = new Map()
    }
    /**
     * 把一个消息推送到对应的聊天记录里面
     * @param message 消息
     * 这个方法没有执行
     */
    // pushMessage (message) {
    //   //
    //   // this. .push
    //   console.log('message.sessionId', message.sessionId, 'message', message
    //   )
    //   // if(typeof message !== 'object') return ;
    //   const i = this.getChatIndex(message.sessionId)
    //   console.log('检查是否创建了一个新的聊天室i', i, '聊天数据', message)

    //   // 说明该聊天对话框已经存在
    //   if (i > -1) {
    //     const chat = this.chats[i]
    //     this.addMessage(i, chat, message)
    //   } else {
    //     this.createChatRoom(message)
    //     this.addMessage(i, this.chats[0], message)
    //   }
    // },
    /**
     * 创建一个新聊天室
     * @param message message
     * @private 私有方法
     * 这个方法 也没有被执行
     */
    // createChatRoom (message) {
    //   //
    //   console.log('检查是否有新房间创建 message', message, 'chats', this.chats)
    //   if (message.type === ChatType.GROUP) {
    //     // 这个是组信息
    //     // 先占位，后加载
    //     const chat = {
    //       id: message.chatId,
    //       name: '加载中...',
    //       avatar: '', // 头像
    //       type: ChatType.GROUP, // 消息类型
    //       lastMessage: message.content,
    //       unreadCount: 0, // 未读消息
    //       isLoading: false, //
    //       loaded: true
    //     }
    //     this.chats.unshift(chat)
    //     // 这里会创建一个消息房间

    //     // GroupApi.get(chat.id).then((group) => {
    //     //   const i = this.getChatIndex(chat.id);
    //     //   this.chats[i].name = group.data.name;
    //     //   this.chats[i].avatar = group.data.avatar;
    //     // });
    //   } else {
    //     // 人信息
    //     const chat = {
    //       id: message.chatId,
    //       name: '',
    //       avatar: '',
    //       type: ChatType.FRIEND,
    //       lastMessage: message.content,
    //       unreadCount: 0,
    //       isLoading: false,
    //       loaded: true
    //     }
    //     this.chats.unshift(chat)

    //   }
    //   setLocalToken('chats_List', JSON.stringify(this.chats))
    // }
 
  }
})

