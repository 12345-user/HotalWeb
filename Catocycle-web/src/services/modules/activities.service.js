import { read, write } from '../mock/storage'
import { FIRST_ACTIVITY, SECOND_ACTIVITY } from '../mock/seeds'

export async function getActivities() {
  let list = read('activities')
  let changed = false

  if (!list.some((a) => a && a.title === FIRST_ACTIVITY.title)) {
    list = [FIRST_ACTIVITY, ...list]
    changed = true
  }

  if (!list.some((a) => a && a.title === SECOND_ACTIVITY.title)) {
    list = [SECOND_ACTIVITY, ...list]
    changed = true
  }

  if (changed) {
    write('activities', list)
  }

  return Promise.resolve(list)
}

export async function addActivity(item) {
  const list = read('activities')
  item.id = Date.now()
  list.unshift(item)
  write('activities', list)
  return Promise.resolve(item)
}

export async function updateActivity(activity) {
  const list = read('activities')
  const idx = list.findIndex((i) => i.id === activity.id)
  if (idx !== -1) {
    list.splice(idx, 1, activity)
    write('activities', list)
    return Promise.resolve(activity)
  }
  return Promise.reject(new Error('not found'))
}

export async function deleteActivity(id) {
  const list = read('activities')
  const filtered = list.filter((item) => item.id !== id)
  write('activities', filtered)
  return Promise.resolve()
}
