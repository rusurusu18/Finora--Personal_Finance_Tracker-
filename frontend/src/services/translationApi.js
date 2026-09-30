import { apiRequest } from '../config/services'

export async function translateText(text) {
  const response = await apiRequest('/translations/translate', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })

  return response.data
}