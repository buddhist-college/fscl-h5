import eventEmitter from "@/common/eventEmitter"
import { TimingSettingOptions } from '@/common/config'

type BridgeReturn = Promise<{
  status: 1 | 0;
}>;

const handleCallH5 = (cb: (cbParams: any) => BridgeReturn) => (params = '{}') => {
  let _params = {}
  try {
    console.log(`callH5: ${cb.toString()}`)
    console.log(`callH5 params: ${params}`)
    _params = JSON.parse(params)
  } catch(err) {
    console.log(err)
    return Promise.resolve({ status: 0 })
  }
  return cb.call(null, _params)
}

export const bridges = {
  updateSubscribedStatus: handleCallH5(async (params: { value: 1 | 0 }) => {
    if ([1, 0].includes(params.value)) {
      eventEmitter.emit('updateSubscribedStatus', params.value)
      return {
        status: 1,
      }
    }
    return {
      status: 0,
    }
  }),
  increaseAdmireNum: handleCallH5(async () => {
    eventEmitter.emit('increaseAdmireNum')
    return {
      status: 1,
    }
  }),
  decreaseAdmireNum: handleCallH5(async () => {
    eventEmitter.emit('decreaseAdmireNum')
    return {
      status: 1,
    }
  }),
  updateTimingSetting: handleCallH5(async (params: { value: typeof TimingSettingOptions[number] }) => {
    if (TimingSettingOptions.includes(params.value)) {
      eventEmitter.emit('updateTimingSetting', params.value)
      return {
        status: 1,
      }
    }
    return {
      status: 0,
    }
  }),
}

window.appBridge = bridges

interface CallNativeParams {
  code: number;
  callbackName: string;
  params: Record<string, any>;
}

const callNative = (params: CallNativeParams) => {
  try {
    const _params = JSON.stringify(params)
    console.log(`callNative: ${_params}`)
    return window.appChannel?.postMessage(_params)
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
  changeAudioEpisode: (index: number, id: number) => {
    callNative({
      code: 3,
      callbackName: '',
      params: {
        index,
        id,
      }
    })
  },
  changeVideoEpisode: (index: number, id: number) => {
    callNative({
      code: 4,
      callbackName: '',
      params: {
        index,
        id,
      }
    })
  },
  nativeJump: (url: string, replace?: boolean) => {
    callNative({
      code: 5,
      callbackName: '',
      params: {
        url,
        replace,
      }
    })
  },
  resetTimingSetting: () => {
    callNative({
      code: 6,
      callbackName: '',
      params: {},
    })
  },
}