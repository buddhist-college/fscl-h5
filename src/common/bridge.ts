window.appData = {
  isInApp: true,
  isLogin: true,
}

type BridgeReturn = Promise<{
  status: 1 | 0;
}>;

export const bridges = {
  test: async (data: any) : BridgeReturn => {
    alert(JSON.stringify(data))
    return {
      status: 1,
    };
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
}