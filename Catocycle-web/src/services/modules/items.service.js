import { read, write } from '../mock/storage'

export async function getItems() {
  return Promise.resolve(read('items'))
}

export async function addItem(item) {
  const list = read('items')
  item.id = Date.now()
  list.unshift(item)
  write('items', list)
  return Promise.resolve(item)
}

export async function getItem(id) {
  const list = read('items')
  const found = list.find((i) => i.id === id)
  return Promise.resolve(found)
}

export async function updateItem(item) {
  const list = read('items')
  const idx = list.findIndex((i) => i.id === item.id)
  if (idx !== -1) {
    list.splice(idx, 1, item)
    write('items', list)
    return Promise.resolve(item)
  }
  return Promise.reject(new Error('not found'))
}

export async function deleteItem(id) {
  const list = read('items')
  const filtered = list.filter((item) => item.id !== id)
  write('items', filtered)
  return Promise.resolve()
}
