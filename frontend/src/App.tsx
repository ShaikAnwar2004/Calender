// src/App.tsx
import React, { useEffect, useState, type JSX } from 'react'
import WeekGrid from './components/WeekView/WeekGrid'
import { useCalendar } from './context/CalendarContext'
import { format } from 'date-fns'

export default function App(): JSX.Element {
  const { goToToday, weekStart } = useCalendar()

  // Local clock for header badge
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000) // update every 30s
    return () => clearInterval(t)
  }, [])

  // Scroll the visible calendar to the now-line (if present).
  // Falls back to scrolling the today column to center if now-line not found.
  function scrollToNow() {
    // Prefer the now line element
    const nowEl = document.querySelector('.now-line') as HTMLElement | null
    if (nowEl) {
      nowEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Otherwise find today's column and scroll roughly to middle of day
    const todayCol = document.querySelector('.day-column[style*="linear-gradient"], .day-column.today') as HTMLElement | null
    if (todayCol) {
      // center the column vertically in the viewport
      const rect = todayCol.getBoundingClientRect()
      window.scrollBy({ top: rect.top - window.innerHeight / 2 + rect.height / 2, behavior: 'smooth' })
    }
  }

  // Helper to handle "Today" button: move week and then scroll to now after slight delay
  async function handleGoToToday() {
    goToToday()
    // allow the UI / HMR to update and now-line to render
    setTimeout(() => {
      scrollToNow()
    }, 250)
  }

  return (
    <div className="app-root">
      <div className="app-header" style={{ marginBottom: 10 }}>
        <div>
          <div className="app-title">Week View — Calendar</div>
          <div className="app-sub">Drag to create events, click to edit</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right', marginRight: 6 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Local time</div>
            <div style={{ fontWeight: 700 }}>{format(now, 'hh:mm a')}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{format(now, 'EEEE, dd MMM')}</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" onClick={handleGoToToday} aria-label="Go to today">Today</button>
            <button className="btn primary" onClick={scrollToNow} aria-label="Scroll to now">Scroll to now</button>
          </div>
        </div>
      </div>

      <div className="calendar">
        <WeekGrid />
      </div>
    </div>
  )
}



