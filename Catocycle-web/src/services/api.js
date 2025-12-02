import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
  timeout: 5000
})

// 默认种子数据：5 条活动、5 个成员、10 个物品（可作为初始空白模板使用）
// 单独定义第 1 条活动，便于在已有数据时也能自动补齐一次
const FIRST_ACTIVITY = {
  id: 1,
  title: '环岛摩旅自驾',
  time: '2025.1.25-2025.2.7',
  people: '11人',
  desc: '11人组队环岛，从东线到西线。',
  photos: ['/images/activities/H1.jpg']
}

const DEFAULT_ACTIVITIES = [
  FIRST_ACTIVITY,
  // 其余几条留作空白占位，方便后续补充
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: i + 2,
    title: `活动 ${i + 2}`,
    time: '',
    people: '',
    desc: '',
    photos: []
  }))
]

const DEFAULT_PEOPLE = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  name: `成员 ${i + 1}`,
  personality: '',
  skills: '',
  contact: '',
  photos: []
}))

const DEFAULT_ITEMS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `物品 ${i + 1}`,
  time: '',
  description: '',
  image: ''
}))

const DEFAULT_MAP = {
  activities: DEFAULT_ACTIVITIES,
  people: DEFAULT_PEOPLE,
  items: DEFAULT_ITEMS
}

// 本示例中没有真实后端，因此我们用 localStorage 做简单模拟
function read(key){
  const raw = localStorage.getItem(key)
  if (!raw && DEFAULT_MAP[key]) {
    const seed = DEFAULT_MAP[key]
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  return raw ? JSON.parse(raw) : []
}
function write(key, data){
  localStorage.setItem(key, JSON.stringify(data))
}

export default {
  // Activities
  async getActivities(){
    const list = read('activities')

    // 如果还没有“环岛摩旅自驾”这条活动，自动补充一次
    if (!list.some(a => a && a.title === FIRST_ACTIVITY.title)) {
      const withFirst = [FIRST_ACTIVITY, ...list]
      write('activities', withFirst)
      return Promise.resolve(withFirst)
    }

    return Promise.resolve(list)
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
