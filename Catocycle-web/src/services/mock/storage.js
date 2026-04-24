import { DEFAULT_MAP } from './seeds'

export function read(key) {
  const raw = localStorage.getItem(key)
  if (!raw && DEFAULT_MAP[key]) {
    const seed = DEFAULT_MAP[key]
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  return raw ? JSON.parse(raw) : []
}

export function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
