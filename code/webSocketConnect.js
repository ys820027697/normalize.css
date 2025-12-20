// websocket 初始化
// '@/utils/etalkUtils/websocket/webSocketConnect'
import { setLocalToken, getLocalToken, setSissionStorage, getSessionStorage } from '@/utils/auth'
import { getReadyIn, readyWebsocket } from '@/api/workbench/workbench'
import { useChatStore } from '@/store/modules/chatStore'
import useUserStore from '@/store/modules/user'
import useSessionStore from '@/store/modules/sessionStore'
import useWrokBrenchStore from '@/store/modules/workBrenchStore'
import { initTextBtn } from '@/utils/etalkUtils/etalk/textBtnStatus'
import { groupListNopage } from '@/api/omnimedia/group'
// import $bus from '@/utils/bus'
// import { setSissionStorage, getSessionStorage } from '@/utils/auth'

// 延迟导入 Etalk 和 MyEtalkEvent 以避免循环依赖
let Etalks = null
let myEtalkEvent = null

// 初始化函数，延迟加载以避免循环依赖
async function initializeEtalk () {
  const chatStore = useChatStore()


  // 优先从 Pinia store 获取 myEtalkEvent
  const storedMyEtalkEvent = chatStore.getMyEtalkEvent()

  if (storedMyEtalkEvent) {
    // 如果 store 中已有，直接使用
    myEtalkEvent = storedMyEtalkEvent
    // 同时获取对应的 Etalks 实例
    if (myEtalkEvent && myEtalkEvent.etalkobj) {
      Etalks = myEtalkEvent.etalkobj
    }
  }

  // 如果 store 中没有或需要重新初始化
  if (!Etalks || !myEtalkEvent) {
    // 动态导入以避免循环依赖（使用 ES6 动态 import）
    const EtalkModule = await import('../etalk/sdk/etalk_es6.js')
    const MyEtalkEventModule = await import('../etalk/myEtalkEvent.js')
    const Etalk = EtalkModule.default || EtalkModule
    const MyEtalkEvent = MyEtalkEventModule.default || MyEtalkEventModule

    Etalks = new Etalk()
    myEtalkEvent = new MyEtalkEvent(Etalks, 'text', { webchat: { autoAnswer: 0 } })

    chatStore.resetMyEtalkEvent()
    // 存储到 Pinia store（确保全局唯一）
    chatStore.setMyEtalkEvent(myEtalkEvent)
    console.log('myEtalkEvent 已初始化并存储到 Pinia store')
  }

  return { Etalks, myEtalkEvent }
}

// 按钮初始化
initTextBtn()
async function initialization (url, staffName, currentIp) {
  // 确保已初始化
  const { Etalks: etalks, myEtalkEvent: event } = await initializeEtalk()

  event.init()
  // 确保在创建新连接前，旧的连接已被清理（在 createdWebsocket 中也会处理，这里双重保险）
  if (etalks.socketObj != null) {
    console.log('有-socketObj,做删除动作')
    try {
      const oldSocket = etalks.getSocket()
      if (oldSocket != null) {
        oldSocket.close()
      }
    } catch (e) {
      console.warn('关闭旧连接时出错:', e)
    }
    etalks.socketObj = null
  }
  console.log('初始化准备--createdWebsocket', { url, staffName, currentIp })
  // 确保 socket 创建成功
  try {
    etalks.createdWebsocket(url, staffName, currentIp)
    // 验证 socket 是否创建成功
    if (etalks.getSocket() == null) {
      throw new Error('WebSocket 创建失败：socketObj 为 null')
    }
    console.log('WebSocket 初始化完成')
  } catch (e) {
    console.error('WebSocket 初始化失败:', e)
    throw e
  }
}

// textEtalKinit()
async function WebSockInitText () {
  // useChatStore().setTextBtnList(sessionMapId.value, currentBtnList.btnStatusList)

  // 初始化建立socket 链接
  await readyWebsocket().then(async res => {
    const { webSocketPath, staffName, currentIp } = res.data
    await initialization(webSocketPath, staffName, currentIp)
  })
  // 处理文本渠道是否自动接听
  const setAutoAnswerFun = (data) => {
    const currentObj = data.map(v => {
      return {
        teamNo: v.teamNo,
        autoAnswer: v.autoAnswer
      }
    })
    if (currentObj && currentObj.length > 0) {
      currentObj.forEach(v => {
        useChatStore().setCurrentResource(v)
      })
    }
  }


  let ischeckIn = null
  await getReadyIn('text').then(async (Response) => {
    console.log('getReadyIn_123', Response)
    // console.log('getReadyIn,ivr', res)

    if (Response.data.withdraw === 'true') {
      useChatStore().setWithdrawFlag(1, Response.data.withdrawTime)
    } else {
      useChatStore().setWithdrawFlag(0, 0)
    }
    if (Response.data.groupNos.length === 0) {
      // 没有技能组
      useUserStore().setIsShowTextSession('false')
    } else {
      useUserStore().setIsShowTextSession('true')
    }
    // 文本最大连接数
    const maxLink = Response.data.maxLinks || 0
    const link = getSessionStorage('textMaxLinks') || maxLink
    console.log('文本最大连接数', maxLink, 'link', link)
    if (link) {
      setSissionStorage('textMaxLinks', link)
    } else {
      setSissionStorage('textMaxLinks', maxLink)
    }
    // 修改文本当前坐席的最大连接数
    // changeAnswerCount(userInfo.value.name, maxLink.value)


    console.log('Response', Response.data)
    // readyInfos = Response.data
    const { staffNo, staffName, groupNos, maxLinks, webSocketPath, currentIp, channels } = Response.data
    // const webSocketPath = 'http://192.168.2.75:8088/sqna/stompserver'// 'http://192.168.2.203:7080/sqna/stompserver' //
    const tenantId = JSON.parse(getLocalToken('dsKey')) || ''
    const isHardPhone = ''
    if (groupNos.length > 0) {
      useWrokBrenchStore().setTextGroupFlag(true)
    }
    // isHardPhone = 'CCQTGB'
    const userobj = {
      staffNo,
      staffName,
      // currentIp: cti?.currentIp, // '192.168.2.239', // currentIp ||
      // cti: cti?.extNo,
      // mobile: '18837123483',
      // isHardPhone,
      tenantId,
      groupNos,
      webSocketPath
    }
    useUserStore().setUser(userobj)
    setLocalToken('user_token', JSON.stringify(userobj))
    const groupNoString = groupNos.join(',')
    // avatar 头像
    // console.log('staffNo', staffNo, 'staffName', staffName, 'groupNos[0]', groupNos[0], 'maxLinks',
    // maxLinks, 'cti.extNo', cti, 'webSocketPath', webSocketPath, 'tenantId', tenantId, 'isHardPhone', isHardPhone, 'currentIp', currentIp)
    // textEtalKinit(staffName, staffName, groupNos[0], maxLinks, '', webSocketPath, tenantId, isHardPhone, currentIp, )
    // 首次连新核心获取信息,
    // 确保已初始化
    const { Etalks: etalks } = await initializeEtalk()
    etalks.initObj(staffName, staffName, groupNoString, maxLinks, '', webSocketPath, tenantId, isHardPhone, currentIp, '')
    ischeckIn = true
    const skillLit = channels.filter(v => groupNos.includes(v.teamNo)).map(v => {
      return {
        label: v.teamName,
        value: v.groupId,
        channel: 'text',
        teamNo: v.teamNo
      }
    })
    useSessionStore().setTextGroupNos(skillLit)
  }).catch((err) => {
    console.log('err', err)
    // ElMessage.error('用户信息查询失败!')
    ischeckIn = false
  })
  await groupListNopage().then(res => {
    console.log('groupListNopage', res)
    setAutoAnswerFun(res.data)
  })
  return ischeckIn
}
// 获取 Etalks 实例（同步获取，优先从 store 获取）
function getEtalks () {
  const chatStore = useChatStore()
  const storedMyEtalkEvent = chatStore.getMyEtalkEvent()
  if (storedMyEtalkEvent && storedMyEtalkEvent.etalkobj) {
    return storedMyEtalkEvent.etalkobj
  }
  // 如果 store 中没有，返回本地缓存的实例
  if (Etalks) {
    return Etalks
  }
  console.warn('Etalks 尚未初始化，请先调用 WebSockInitText 进行初始化')
  return null
}

// 获取 myEtalkEvent 实例（同步获取，从 store 获取，确保全局唯一）
function getMyEtalkEvent () {
  const chatStore = useChatStore()
  const event = chatStore.getMyEtalkEvent()
  if (event) {
    return event
  }
  // 如果 store 中没有，返回本地缓存的实例
  if (myEtalkEvent) {
    return myEtalkEvent
  }
  console.warn('myEtalkEvent 尚未初始化，请先调用 WebSockInitText 进行初始化')
  return null
}

export {
  getEtalks as Etalks,
  getMyEtalkEvent as myEtalkEvent,
  WebSockInitText,
  initializeEtalk
}
