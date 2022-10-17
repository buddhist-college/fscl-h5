export const thousandNumberFormat = (num: string | number): string => {
  if (!isNaN(Number(num)) && num > 1000) {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  } else {
    return String(num)
  }
}