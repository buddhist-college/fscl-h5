import { ref, isRef, unref, watchEffect, type Ref } from 'vue'
import { showToast } from '@/common/globalToast'
import { ErrorMsg } from '@/common/config'

export const useGet = <T>(url: string | Ref, param: Record<string, any>) => 
  useFetch<T>(param ? `${url}?${new URLSearchParams(param).toString()}` : url, {
    method: 'GET',
  })

export const usePost = <T>(url: string | Ref, data?: Record<string, any>) =>
  useFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })

interface ResType {
  code: string
  data: any
  msg: string
  timestamp: number
}

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
      const res = await fetch(urlValue, {
        ...option,
        mode: 'cors',
        credentials: 'include',
        headers: {
          ...option?.headers,
          // 'Authorization': '',
          'Content-Type': 'application/json',
        },
        body: option?.body,
      })
      const resJson: ResType = await res.json()
      if (resJson && resJson.code === '200') {
        data.value = resJson.data
      } else {
        error.value = resJson
        console.log(resJson)
        showToast(ErrorMsg.common)
      }
      loading.value = false
    } catch (e) {
      error.value = e
      loading.value = false
      console.log(e)
      showToast(ErrorMsg.common)
    }
  }

  if (isRef(url)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  return { data, loading, error, retry: doFetch }
}
