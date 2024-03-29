import { showToast } from '@/common/globalToast'
import { ErrorMsg } from '@/common/config'
import { useAppData } from '@/stores/appData'

interface ResType {
  code: string
  data: any
  msg: string
  timestamp: number
}

export default async function<T> (url: string, option?: RequestInit): Promise<T> {
  let error: any
  const { auth } = useAppData()
  try {
    const res = await fetch(url, {
      ...option,
      mode: 'cors',
      credentials: 'include',
      headers: {
        ...option?.headers,
        ...auth ? { 'Authorization': auth } : {},
        'Content-Type': 'application/json',
      },
      body: option?.body,
    })
    const resJson: ResType = await res.json()
    if (resJson) {
      if (resJson.code === '200') {
        return resJson.data
      } else if (resJson.code === '401') {
        console.log(resJson)
        showToast(ErrorMsg.unauthorized)
        error = resJson
      } else {
        console.log(resJson)
        showToast(resJson.msg || ErrorMsg.common)
        error = resJson
      }
    } else {
      console.log(resJson)
      showToast(ErrorMsg.common)
      error = resJson
    }
  } catch (err) {
    console.log(err)
    showToast(ErrorMsg.common)
    throw err
  }
  throw error
}