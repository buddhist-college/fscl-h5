import eventEmitter from "@/common/eventEmitter"

// for dev
// window.appData = {
//   isInApp: true,
//   isLogin: true,
// }

type BridgeReturn = Promise<{
  status: 1 | 0;
}>;

export const bridges = {
  test: async (data: any): BridgeReturn => {
    alert(JSON.stringify(data))
    return {
      status: 1,
    };
  },
  updateSubscribedStatus: async (params: { status: boolean }): BridgeReturn => {
    eventEmitter.emit('updateSubscribedStatus', params.status)
    return {
      status: 1,
    }
  },
  updateSubscribeNum: async (params: { num: string }): BridgeReturn => {
    eventEmitter.emit('updateSubscribeNum', params.num)
    return {
      status: 1,
    }
  },
  updateAdmireNum: async (params: { num: string }): BridgeReturn => {
    eventEmitter.emit('updateAdmireNum', params.num)
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

const callNative = (params: CallNativeParams) => window.appChannel?.postMessage(params)

export default {
  test: () => {
    callNative({
      code: -1,
      callbackName: 'test',
      params: {
        a: 1,
        b: 2
      }
    })
  },
  goLogin: () => {
    callNative({
      code: 0,
      callbackName: '',
      params: {}
    })
  },
  changeSubscribedStatus: (value: number) => {
    callNative({
      code: 1,
      callbackName: 'updateSubscribedStatus',
      params: {
        value,
      }
    })
  },
  operateSubscribe: () => {
    callNative({
      code: 2,
      callbackName: '',
      params: {}
    })
  },
}