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
  }
}
