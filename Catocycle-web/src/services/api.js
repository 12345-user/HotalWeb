import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
  timeout: 5000
})

// 本示例中没有真实后端，因此我们用 localStorage 做简单模拟
function read(key){
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}
function write(key, data){
  localStorage.setItem(key, JSON.stringify(data))
}

export default {
  // Activities
  async getActivities(){
    return Promise.resolve(read('activities'))
  },
  async addActivity(item){
    const list = read('activities')
    item.id = Date.now()
    list.unshift(item)
    write('activities', list)
    return Promise.resolve(item)
  },
  async deleteActivity(id){
    const list = read('activities')
    const filtered = list.filter(item => item.id !== id)
    write('activities', filtered)
    return Promise.resolve()
  },

  // People
  async getPeople(){
    return Promise.resolve(read('people'))
  },
  async addPerson(person){
    const list = read('people')
    person.id = Date.now()
    list.unshift(person)
    write('people', list)
    return Promise.resolve(person)
  },
  async deletePerson(id){
    const list = read('people')
    const filtered = list.filter(item => item.id !== id)
    write('people', filtered)
    return Promise.resolve()
  },

  // Items
  async getItems(){
    return Promise.resolve(read('items'))
  },
  async addItem(item){
    const list = read('items')
    item.id = Date.now()
    list.unshift(item)
    write('items', list)
    return Promise.resolve(item)
  },
  async getItem(id){
    const list = read('items')
    const found = list.find(i => i.id === id)
    return Promise.resolve(found)
  },
  async updateItem(item){
    const list = read('items')
    const idx = list.findIndex(i => i.id === item.id)
    if(idx !== -1){
      list.splice(idx, 1, item)
      write('items', list)
      return Promise.resolve(item)
    }
    return Promise.reject(new Error('not found'))
  },
  async deleteItem(id){
    const list = read('items')
    const filtered = list.filter(item => item.id !== id)
    write('items', filtered)
    return Promise.resolve()
  }
}
