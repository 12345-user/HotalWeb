import http from '../http'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}
