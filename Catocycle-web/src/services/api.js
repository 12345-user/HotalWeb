import {
  addActivity,
  deleteActivity,
  getActivities,
  updateActivity
} from './modules/activities.service'
import { addPerson, deletePerson, getPeople, updatePerson } from './modules/people.service'
import { addItem, deleteItem, getItem, getItems, updateItem } from './modules/items.service'

const api = {
  // Activities
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,

  // People
  getPeople,
  addPerson,
  updatePerson,
  deletePerson,

  // Items
  getItems,
  addItem,
  getItem,
  updateItem,
  deleteItem
}

export default api
