export const isIos = /(iPhone|iPod|iPad)/.test(navigator.userAgent);
export const isAndroid = /Android/.test(navigator.userAgent);

export const thousandNumberFormat = (num: string | number): string => {
  if (!isNaN(Number(num)) && num > 1000) {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  } else {
    return String(num)
  }
}