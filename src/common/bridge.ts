window.appChannel = {
  postMessage: (a) => console.log(a)
}

const callNative = (...args: any) => window.appChannel?.postMessage(...args)

window.appBridge = {
  test: (data: any) => {
    alert(data)
    alert(JSON.stringify(data))
  }
}

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
  }
}