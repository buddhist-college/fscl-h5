export function getItem (key: string) {
  const rawValue = window.localStorage.getItem(key)
  return rawValue ? JSON.parse(rawValue) : null
}

export function setItem (key: string, value: any) {
  return window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem (key: string) {
  return window.localStorage.removeItem(key)
}

export default {
  getItem,
  setItem,
  removeItem,
}