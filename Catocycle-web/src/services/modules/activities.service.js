import http from '../http'

export async function getActivities() {
  const { data } = await http.get('/activities')
  return data
}

export async function addActivity(item) {
  const { data } = await http.post('/activities', item)
  return data
}

export async function updateActivity(activity) {
  const { data } = await http.put(`/activities/${activity.id}`, activity)
  return data
}

export async function deleteActivity(id) {
  await http.delete(`/activities/${id}`)
}
