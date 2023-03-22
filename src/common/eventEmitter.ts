class EventEmitter {
  events: Record<string, any>
  
  constructor() {
    this.events = {}
  }

  on(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  off(eventName: string, callback: Function) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb: Function) => cb !== callback
      )
    }
  }

  emit(eventName: string, ...args: any[]) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb: Function) => cb(...args))
    }
  }
}

export default new EventEmitter()