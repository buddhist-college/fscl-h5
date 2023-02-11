import { createVNode, render } from 'vue'
import GlobalToast from '@/common/globalToast/GlobalToast.vue'

export const showToast = (message: string | number, duration: number = 3000) => {
  const container = document.createElement('div')
  const vm = createVNode(GlobalToast, {
    message,
    duration,
  })
  render(vm, container)
  document.body.appendChild(container)
  const destroy = () => {
    const dom = vm.el as HTMLDivElement
    const msgEl = dom.querySelector('.toast-message')
    if (msgEl) {
      msgEl.classList.add('remove')
      const t = setTimeout(() => {
        render(null, container)
        document.body.removeChild(container)
        clearTimeout(t)
      }, 500)
    }
  }
  if (duration) {
    const timer = setTimeout(() => {
      destroy()
      clearTimeout(timer)
    }, duration)
  }
  return destroy
}