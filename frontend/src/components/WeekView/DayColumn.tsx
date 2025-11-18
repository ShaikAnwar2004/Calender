// src/components/WeekView/DayColumn.tsx
import React, { useRef, useState, useEffect } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import EventBlock from './EventBlock'
import EventModal from '../Shared/EventModal'
import type { EventItem } from '../../api/events'
import { topOffsetForTime } from '../../utils/dateUtils'

const PIXEL_PER_MINUTE = 0.8

export default function DayColumn({ day }: { day: Date }) {
  const { events, today } = useCalendar()
  const ref = useRef<HTMLDivElement | null>(null)

  // overlay state for drag-to-create
  const [dragging, setDragging] = useState(false)
  const [overlayTop, setOverlayTop] = useState(0)
  const [overlayHeight, setOverlayHeight] = useState(0)
  const [overlayStartISO, setOverlayStartISO] = useState<string | null>(null)
  const [modalInitial, setModalInitial] = useState<Partial<EventItem> | null>(null)

  const isToday = day.toDateString() === today.toDateString()

  const dayEvents = events.filter(e => {
    const s = new Date(e.start)
    const eDate = new Date(e.end)
    return !(eDate <= startOfDay(day) || s >= endOfDay(day))
  })

  // now-line position
  const [nowTop, setNowTop] = useState<number | null>(null)

  useEffect(() => {
    if (!isToday || !ref.current) {
      setNowTop(null)
      return
    }
    function updateNow() {
      const now = new Date()
      const mins = now.getHours() * 60 + now.getMinutes()
      setNowTop(mins * PIXEL_PER_MINUTE)
    }
    updateNow()
    const t = setInterval(updateNow, 30 * 1000) // update every 30s
    return () => clearInterval(t)
  }, [isToday])

  // pointer helpers (same as before)
  function clientYToMinutes(clientY: number) {
    const rect = ref.current!.getBoundingClientRect()
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top))
    const minutes = Math.round(y / PIXEL_PER_MINUTE)
    return minutes
  }

  function minutesToISO(mins: number) {
    const start = new Date(day)
    start.setHours(0, 0, 0, 0)
    start.setMinutes(mins)
    return start.toISOString()
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    (e.target as Element).setPointerCapture(e.pointerId)
    setDragging(true)

    const startMins = clientYToMinutes(e.clientY)
    const topPx = startMins * PIXEL_PER_MINUTE
    setOverlayTop(topPx)
    setOverlayHeight(2)
    setOverlayStartISO(minutesToISO(startMins))
    e.preventDefault()
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !ref.current) return
    const startISO = overlayStartISO
    if (!startISO) return
    const startMins = new Date(startISO).getHours() * 60 + new Date(startISO).getMinutes()
    const curMins = clientYToMinutes(e.clientY)
    const topMins = Math.min(startMins, curMins)
    const bottomMins = Math.max(startMins, curMins)
    setOverlayTop(topMins * PIXEL_PER_MINUTE)
    setOverlayHeight(Math.max(2, (bottomMins - topMins) * PIXEL_PER_MINUTE))
    e.preventDefault()
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragging) return
    (e.target as Element).releasePointerCapture(e.pointerId)
    setDragging(false)

    const topMins = Math.round(overlayTop / PIXEL_PER_MINUTE)
    const durationMins = Math.max(15, Math.round(overlayHeight / PIXEL_PER_MINUTE))
    const start = new Date(day); start.setHours(0,0,0,0); start.setMinutes(topMins)
    const end = new Date(start); end.setMinutes(start.getMinutes() + durationMins)

    setModalInitial({
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      color: '#3b82f6'
    })

    setOverlayTop(0)
    setOverlayHeight(0)
    setOverlayStartISO(null)
    e.preventDefault()
  }

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="day-column"
      style={{ touchAction: 'none', background: isToday ? 'linear-gradient(180deg, rgba(37,99,235,0.02), transparent)' : undefined }}
    >
      {/* now-line */}
      {isToday && nowTop !== null && (
        <div className="now-line" style={{ top: nowTop }} />
      )}

      {/* events */}
      {dayEvents.map(ev => (
        <EventBlock key={ev._id} ev={ev} day={day} pxPerMinute={PIXEL_PER_MINUTE} />
      ))}

      {/* overlay visual during drag */}
      {(dragging || overlayHeight > 0) && (
        <div
          aria-hidden
          className="selection-overlay"
          style={{
            top: overlayTop,
            height: overlayHeight
          }}
        />
      )}

      {/* modal for create/edit */}
      {modalInitial && (
        <EventModal initial={modalInitial} onClose={() => setModalInitial(null)} />
      )}
    </div>
  )
}

function startOfDay(d: Date){ const c = new Date(d); c.setHours(0,0,0,0); return c }
function endOfDay(d: Date){ const c = new Date(d); c.setHours(23,59,59,999); return c }
