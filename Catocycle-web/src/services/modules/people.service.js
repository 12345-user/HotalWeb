import { read, write } from '../mock/storage'
import { FIRST_PERSON } from '../mock/seeds'

export async function getPeople() {
  let list = read('people')

  if (!list.some((p) => p && p.name === FIRST_PERSON.name)) {
    list = [FIRST_PERSON, ...list]
    write('people', list)
  }

  return Promise.resolve(list)
}

export async function addPerson(person) {
  const list = read('people')
  person.id = Date.now()
  list.unshift(person)
  write('people', list)
  return Promise.resolve(person)
}

export async function updatePerson(person) {
  const list = read('people')
  const idx = list.findIndex((i) => i.id === person.id)
  if (idx !== -1) {
    list.splice(idx, 1, person)
    write('people', list)
    return Promise.resolve(person)
  }
  return Promise.reject(new Error('not found'))
}

export async function deletePerson(id) {
  const list = read('people')
  const filtered = list.filter((item) => item.id !== id)
  write('people', filtered)
  return Promise.resolve()
}
