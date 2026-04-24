export const FIRST_ACTIVITY = {
  id: 1,
  title: '环岛摩旅自驾',
  time: '2025.1.25-2025.2.7',
  people: '11人',
  desc: '11人组队环岛，从东线到西线。',
  photos: ['/images/activities/H1.jpg']
}

export const SECOND_ACTIVITY = {
  id: 2,
  title: '沙滩露营',
  time: '2025.4.3-2025.4.7',
  people: '',
  desc: '野地真人CS，露营，营火，沙地越野。',
  photos: ['/images/activities/H3.jpg']
}

export const DEFAULT_ACTIVITIES = [
  FIRST_ACTIVITY,
  SECOND_ACTIVITY,
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: i + 3,
    title: `活动 ${i + 3}`,
    time: '',
    people: '',
    desc: '',
    photos: []
  }))
]

export const FIRST_PERSON = {
  id: 1,
  name: '留雨',
  personality: '0.5个男人，会骑车，手工技艺，常年旅居',
  contact: '',
  photos: ['/images/person/person1.jpg']
}

export const DEFAULT_PEOPLE = [
  FIRST_PERSON,
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: i + 2,
    name: `成员 ${i + 2}`,
    personality: '',
    contact: '',
    photos: []
  }))
]

export const DEFAULT_ITEMS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `物品 ${i + 1}`,
  time: '',
  description: '',
  image: ''
}))

export const DEFAULT_MAP = {
  activities: DEFAULT_ACTIVITIES,
  people: DEFAULT_PEOPLE,
  items: DEFAULT_ITEMS
}
