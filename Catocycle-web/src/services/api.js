import {
  addActivity,
  deleteActivity,
  getActivities,
  updateActivity
} from './modules/activities.service'
import { addPerson, deletePerson, getPeople, updatePerson } from './modules/people.service'
import { addItem, deleteItem, getItem, getItems, updateItem } from './modules/items.service'
import { uploadImage } from './modules/upload.service'

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
  deleteItem,

  // Upload
  uploadImage
}

export default api
