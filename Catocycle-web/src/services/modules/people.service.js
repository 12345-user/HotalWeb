import http from '../http'

export async function getPeople() {
  const { data } = await http.get('/people')
  return data
}

export async function addPerson(person) {
  const { data } = await http.post('/people', person)
  return data
}

export async function updatePerson(person) {
  const { data } = await http.put(`/people/${person.id}`, person)
  return data
}

export async function deletePerson(id) {
  await http.delete(`/people/${id}`)
}
