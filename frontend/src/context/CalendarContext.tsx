// src/context/CalendarContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchEventsRange, createEvent as apiCreate, updateEvent as apiUpdate, deleteEvent as apiDelete } from '../api/events'
import type { EventItem } from '../api/events'

type ContextType = {
  weekStart: Date
  events: EventItem[]
  loadWeek: (start: Date) => Promise<void>
  createEvent: (ev: Partial<EventItem>) => Promise<EventItem | null>
  updateEvent: (id: string, patch: Partial<EventItem>) => Promise<EventItem | null>
  deleteEvent: (id: string) => Promise<void>
  prevWeek: () => void
  nextWeek: () => void
  goToToday: () => void
  today: Date
}

const CalendarContext = createContext<ContextType | undefined>(undefined)

function startOfWeek(d: Date) {
  const clone = new Date(d)
  const day = clone.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // Monday start
  clone.setDate(clone.getDate() + diff)
  clone.setHours(0,0,0,0)
  return clone
}

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()))
  const [events, setEvents] = useState<EventItem[]>([])
  const today = new Date()

  useEffect(() => {
    loadWeek(weekStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart])

  async function loadWeek(start: Date) {
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    const data = await fetchEventsRange(start.toISOString(), end.toISOString())
    setEvents(data || [])
  }

  async function createEvent(ev: Partial<EventItem>) {
    const created = await apiCreate(ev)
    if (created) setEvents(prev => [...prev, created])
    return created
  }

  async function updateEvent(id: string, patch: Partial<EventItem>) {
    const updated = await apiUpdate(id, patch)
    if (updated) setEvents(prev => prev.map(e => e._id === id ? updated : e))
    return updated
  }

  async function deleteEvent(id: string) {
    await apiDelete(id)
    setEvents(prev => prev.filter(e => e._id !== id))
  }

  function prevWeek() {
    const s = new Date(weekStart)
    s.setDate(s.getDate() - 7)
    setWeekStart(startOfWeek(s))
  }

  function nextWeek() {
    const s = new Date(weekStart)
    s.setDate(s.getDate() + 7)
    setWeekStart(startOfWeek(s))
  }

  function goToToday() {
    setWeekStart(startOfWeek(new Date()))
  }

  return (
    <CalendarContext.Provider value={{ weekStart, events, loadWeek, createEvent, updateEvent, deleteEvent, prevWeek, nextWeek, goToToday, today }}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendar must be used inside provider')
  return ctx
}

