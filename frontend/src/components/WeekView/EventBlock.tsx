import React, { useState } from 'react'
import type { EventItem } from '../../api/events'
import { topOffsetForTime, minutesBetween } from '../../utils/dateUtils'
import EventModal from '../Shared/EventModal'

export default function EventBlock({ ev, day, pxPerMinute } : { ev: EventItem, day: Date, pxPerMinute: number }) {
  const [open, setOpen] = useState(false)

  const start = new Date(ev.start)
  const end = new Date(ev.end)

  const dayStart = new Date(day); dayStart.setHours(0,0,0,0)
  const startClamped = start < dayStart ? dayStart : start
  const dayEnd = new Date(day); dayEnd.setHours(23,59,59,999)
  const endClamped = end > dayEnd ? dayEnd : end

  const top = topOffsetForTime(startClamped, 0, pxPerMinute)
  const height = Math.max(12, minutesBetween(startClamped, endClamped) * pxPerMinute)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter') setOpen(true) }}
        title={ev.title}
        style={{
          position: 'absolute',
          left: 6,
          right: 6,
          top,
          height,
          background: ev.color || '#3b82f6',
          color: '#fff',
          padding: 6,
          borderRadius: 6,
          boxSizing: 'border-box',
          fontSize: 12,
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontWeight: 600 }}>{ev.title}</div>
        <div style={{ fontSize: 11 }}>
          {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(ev.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {open && (
        <EventModal
          initial={ev}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}


