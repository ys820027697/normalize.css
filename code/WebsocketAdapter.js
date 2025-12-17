import Stomp from 'stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { ElMessage } from 'element-plus'
import { getLocalToken } from '@/utils/auth'
class WebsocketAdapter {
  constructor (obj = '', url, agentId, currentIp) {
    this.obj = obj
    this.url = url
    this.agentId = agentId
    this.currentIp = currentIp
    this.reconnectAttempts = 0
    this.reconnectTimer = null

    this.connect()
  }

  connect () {
    const protocols_whitelist = ['websocket']
    const option = {
      devel: false,
      debug: false,
      info: undefined,
      rtt: 10000
    }
    const socket = new SockJS(this.url, protocols_whitelist, option)
    this.stompClient = Stomp.over(socket)
    this.isOpen = false
    const dsKey = JSON.parse(getLocalToken('dsKey')) || ''

    this.stompClient.connect({ uid: this.agentId, ip: this.currentIp, dsKey }, (frame) => {
      console.log('连接websocket服务成功', 'frame', frame)
      this.isOpen = true
      this.reconnectAttempts = 0

      this.stompClient.subscribe(`/user/${dsKey}${this.agentId}/ecore`, (response) => {
        console.log('订阅-成功！', response)
        this.obj.callByObject(response.body)
      })

      if (!this.isReconnect) {
        this.obj.callByObject('{"type":"6036"}')
      }
    }, (frame) => {
      console.log(`websocket error 报错了. ${frame}`)
      this.handleReconnect()
    })

    this.stompClient.debug = () => {}
  }

  handleReconnect () {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }


    this.reconnectTimer = setTimeout(() => {
      this.isReconnect = true
      this.reconnectAttempts++
      console.log(`开始第${this.reconnectAttempts}次重连`)

      try {
        this.close()
        this.connect()
        console.log('重连成功')
      } catch (error) {
        console.log('重连失败', error)
        this.handleReconnect()
      }
    }, 3000)
  }

  send (msg) {
    if (this.isOpen) {
      this.stompClient.send('/ecore', {}, msg)
    } else {
      if (this.obj) {
        this.obj.callByObject('{"type":"6038"}')
      } else {
        ElMessage.error('请先检查websocket是否连接成功')
        return false
      }
    }
  }

  close () {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.stompClient != null) {
      this.stompClient.disconnect()
      this.stompClient = null
    }
    this.isOpen = false
    this.isReconnect = false
    this.reconnectAttempts = 0
  }
}

export default WebsocketAdapter
