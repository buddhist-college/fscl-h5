import eventEmitter from "@/common/eventEmitter"

// for dev
window.appData = {
  isInApp: true,
  isLogin: true,
}

type BridgeReturn = Promise<{
  status: 1 | 0;
}>;

export const bridges = {
  updateSubscribedStatus: async (params: { status: boolean }): BridgeReturn => {
    eventEmitter.emit('updateSubscribedStatus', params.status)
    return {
      status: 1,
    }
  },
  increaseAdmireNum: async (params: { num: string }): BridgeReturn => {
    eventEmitter.emit('increaseAdmireNum', params.num)
    return {
      status: 1,
    }
  },
  decreaseAdmireNum: async (params: { num: string }): BridgeReturn => {
    eventEmitter.emit('decreaseAdmireNum', params.num)
    return {
      status: 1,
    }
  },
}

window.appBridge = bridges

interface CallNativeParams {
  code: number;
  callbackName: string;
  params: Record<string, any>;
}

const callNative = (params: CallNativeParams) => {
  try {
    console.log(`callNative: ${JSON.stringify(params)}`)
    return window.appChannel?.postMessage(params)
  } catch(err) {
    console.log(err)
  }
}

export default {
  goLogin: () => {
    callNative({
      code: 0,
      callbackName: '',
      params: {}
    })
  },
  operateSubscribe: () => {
    callNative({
      code: 1,
      callbackName: '',
      params: {}
    })
  },
  changeSubscribedStatus: (value: 1 | 0) => {
    callNative({
      code: 2,
      callbackName: 'updateSubscribedStatus',
      params: {
        value,
      }
    })
  },
  changeAudioEpisode: (index: number) => {
    callNative({
      code: 3,
      callbackName: '',
      params: {
        index,
      }
    })
  },
  changeVideoEpisode: (index: number) => {
    callNative({
      code: 4,
      callbackName: '',
      params: {
        index,
      }
    })
  },
  nativeJump: (url: string) => {
    callNative({
      code: 5,
      callbackName: '',
      params: {
        url,
      }
    })
  },
}