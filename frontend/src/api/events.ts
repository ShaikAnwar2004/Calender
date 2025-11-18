import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
})

export type EventItem = {
  _id?: string
  title: string
  start: string
  end: string
  color?: string
}

export async function fetchEventsRange(startISO: string, endISO: string) {
  const r = await API.get('/api/events', { params: { start: startISO, end: endISO } })
  return r.data as EventItem[]
}

export async function createEvent(ev: Partial<EventItem>) {
  const r = await API.post('/api/events', ev)
  return r.data as EventItem
}

export async function updateEvent(id: string, patch: Partial<EventItem>) {
  const r = await API.put(`/api/events/${id}`, patch)
  return r.data as EventItem
}

export async function deleteEvent(id: string) {
  await API.delete(`/api/events/${id}`)
}
