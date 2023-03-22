import { ref, isRef, unref, watchEffect, type Ref } from 'vue'
import fetch from '@/common/fetch'

export const useGet = <T>(url: string | Ref, param: Record<string, any>) => 
  useFetch<T>(param ? `${url}?${new URLSearchParams(param).toString()}` : url, {
    method: 'GET',
  })

export const usePost = <T>(url: string | Ref, data?: Record<string, any>) =>
  useFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export function useFetch<T>(url: string | Ref, option?: RequestInit) {
  const loading = ref(false)
  const data = ref<T | null>(null)
  const error = ref<any>(null)

  async function doFetch() {
    data.value = null
    error.value = null
    
    const urlValue = unref(url)

    try {
      loading.value = true
      data.value = await fetch(urlValue, option)
      loading.value = false
    } catch(err) {
      error.value = err
      loading.value = false
    }
  }

  if (isRef(url)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  return { data, loading, error, retry: doFetch }
}
