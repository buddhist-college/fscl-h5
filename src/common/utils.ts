import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const isIos = /(iPhone|iPod|iPad)/.test(navigator.userAgent);
export const isAndroid = /Android/.test(navigator.userAgent);

export const thousandNumberFormat = (num: string | number): string => {
  if (!isNaN(Number(num)) && Number(num) > 1000) {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  } else {
    return String(num)
  }
}

export const mediaTimeFormat = (second: number) => second && !isNaN(second)
  ? dayjs.duration(second, 's').format(second >= 3600 ? 'HH:mm:ss' : 'mm:ss')
  : '00:00'

export const getJumpUrl = (id: number, templateType: number): string => {
  switch (templateType) {
    case 1:
    case 4:
      return `/article/${id}`
    case 2:
      return `/videos/${id}`
    case 3:
      return `/audios/${id}`
    case 5:
      return `/videoDetail/${id}`
    case 6:
      return `/audioDetail/${id}`
    case 7:
      return `/intro/${id}`
    default:
      return `/article/${id}`
  }
}