import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
  timeout: 5000
})

// 默认种子数据：5 条活动、5 个成员、10 个物品（可作为初始空白模板使用）
// 单独定义前两条活动，便于在已有数据时也能自动补齐一次
const FIRST_ACTIVITY = {
  id: 1,
  title: '环岛摩旅自驾',
  time: '2025.1.25-2025.2.7',
  people: '11人',
  desc: '11人组队环岛，从东线到西线。',
  photos: ['/images/activities/H1.jpg']
}

const SECOND_ACTIVITY = {
  id: 2,
  title: '沙滩露营',
  time: '2025.4.3-2025.4.7',
  people: '',
  desc: '野地真人CS，露营，营火，沙地越野。',
  photos: ['/images/activities/H3.jpg']
}

const DEFAULT_ACTIVITIES = [
  FIRST_ACTIVITY,
  SECOND_ACTIVITY,
  // 其余几条留作空白占位，方便后续补充
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: i + 3,
    title: `活动 ${i + 3}`,
    time: '',
    people: '',
    desc: '',
    photos: []
  }))
]

// 单独定义第一条人员，便于在已有数据时也能自动补齐一次
const FIRST_PERSON = {
  id: 1,
  name: '留雨',
  personality: '0.5个男人，会骑车，手工技艺，常年旅居',
  contact: '',
  photos: ['/images/person/person1.jpg']
}

const DEFAULT_PEOPLE = [
  FIRST_PERSON,
  // 其余几条留作空白占位，方便后续补充
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: i + 2,
    name: `成员 ${i + 2}`,
    personality: '',
    contact: '',
    photos: []
  }))
]

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
    let list = read('activities')

    let changed = false

    // 如果还没有“环岛摩旅自驾”这条活动，自动补充一次
    if (!list.some(a => a && a.title === FIRST_ACTIVITY.title)) {
      list = [FIRST_ACTIVITY, ...list]
      changed = true
    }

    // 如果还没有“沙滩露营”这条活动，同样自动补充一次
    if (!list.some(a => a && a.title === SECOND_ACTIVITY.title)) {
      list = [SECOND_ACTIVITY, ...list]
      changed = true
    }

    if (changed) {
      write('activities', list)
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
  async updateActivity(activity){
    const list = read('activities')
    const idx = list.findIndex(i => i.id === activity.id)
    if(idx !== -1){
      list.splice(idx, 1, activity)
      write('activities', list)
      return Promise.resolve(activity)
    }
    return Promise.reject(new Error('not found'))
  },
  async deleteActivity(id){
    const list = read('activities')
    const filtered = list.filter(item => item.id !== id)
    write('activities', filtered)
    return Promise.resolve()
  },

  // People
  async getPeople(){
    let list = read('people')

    // 如果还没有“留雨”这条人员，自动补充一次
    if (!list.some(p => p && p.name === FIRST_PERSON.name)) {
      list = [FIRST_PERSON, ...list]
      write('people', list)
    }

    return Promise.resolve(list)
  },
  async addPerson(person){
    const list = read('people')
    person.id = Date.now()
    list.unshift(person)
    write('people', list)
    return Promise.resolve(person)
  },
  async updatePerson(person){
    const list = read('people')
    const idx = list.findIndex(i => i.id === person.id)
    if(idx !== -1){
      list.splice(idx, 1, person)
      write('people', list)
      return Promise.resolve(person)
    }
    return Promise.reject(new Error('not found'))
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
