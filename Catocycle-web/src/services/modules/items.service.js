import http from '../http'

export async function getItems() {
  const { data } = await http.get('/items')
  return data
}

export async function addItem(item) {
  const { data } = await http.post('/items', item)
  return data
}

export async function getItem(id) {
  const { data } = await http.get(`/items/${id}`)
  return data
}

export async function updateItem(item) {
  const { data } = await http.put(`/items/${item.id}`, item)
  return data
}

export async function deleteItem(id) {
  await http.delete(`/items/${id}`)
}
