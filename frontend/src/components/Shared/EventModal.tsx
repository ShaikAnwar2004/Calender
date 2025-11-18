// src/components/Shared/EventModal.tsx
import React, { useEffect, useState } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import type { EventItem } from '../../api/events'

type Props = {
  initial: Partial<EventItem> & { _id?: string }
  onClose: () => void
}

export default function EventModal({ initial, onClose }: Props) {
  const { createEvent, updateEvent, deleteEvent } = useCalendar()

  const [title, setTitle] = useState(initial.title ?? '')
  const [start, setStart] = useState(initial.start ? isoToLocalInput(initial.start) : isoToLocalInput(new Date().toISOString()))
  const [end, setEnd] = useState(initial.end ? isoToLocalInput(initial.end) : isoToLocalInput(new Date(Date.now() + 30 * 60000).toISOString()))
  const [color, setColor] = useState(initial.color ?? '#3b82f6')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTitle(initial.title ?? '')
    setStart(initial.start ? isoToLocalInput(initial.start) : isoToLocalInput(new Date().toISOString()))
    setEnd(initial.end ? isoToLocalInput(initial.end) : isoToLocalInput(new Date(Date.now() + 30 * 60000).toISOString()))
    setColor(initial.color ?? '#3b82f6')
  }, [initial])

  async function handleSave() {
    setError(null)
    // convert local input back to ISO UTC
    const startISO = localInputToISO(start)
    const endISO = localInputToISO(end)

    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (new Date(startISO) >= new Date(endISO)) {
      setError('End must be after start')
      return
    }

    setSaving(true)
    try {
      if (initial._id) {
        await updateEvent(initial._id, { title: title.trim(), start: startISO, end: endISO, color })
      } else {
        await createEvent({ title: title.trim(), start: startISO, end: endISO, color })
      }
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initial._id) return
    if (!confirm('Delete this event?')) return
    setSaving(true)
    try {
      await deleteEvent(initial._id)
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onMouseDown={(e) => {
        // close when clicking the overlay
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        style={{
          width: 420,
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 8 }}>{initial._id ? 'Edit event' : 'Create event'}</h2>

        <label style={{ display: 'block', marginTop: 8 }}>
          <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Event title"
            autoFocus
          />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>Start</div>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box' }}
            />
          </label>

          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>End</div>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <div style={{ fontSize: 12, color: '#444' }}>Color</div>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        {error && <div style={{ color: 'crimson', marginTop: 10 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
          {initial._id && (
            <button
              onClick={handleDelete}
              disabled={saving}
              style={{
                background: 'transparent',
                border: '1px solid #eee',
                padding: '8px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#b91c1c'
              }}
            >
              Delete
            </button>
          )}

          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              padding: '8px 10px',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: '#2563eb',
              border: 'none',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Helpers
 */

// Convert ISO (UTC) -> local datetime-local input value (yyyy-MM-ddTHH:mm)
function isoToLocalInput(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  // get local components
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Convert datetime-local input (local) -> ISO (UTC string)
function localInputToISO(val: string) {
  // val looks like "2025-11-20T10:00"
  if (!val) return new Date().toISOString()
  const d = new Date(val)
  return d.toISOString()
}
