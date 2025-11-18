// src/components/WeekView/WeekGrid.tsx
import React, { useMemo } from 'react'
import DayColumn from './DayColumn'
import { useCalendar } from '../../context/CalendarContext'
import { format, addDays } from 'date-fns'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function WeekGrid() {
  const { weekStart, prevWeek, nextWeek, goToToday, today } = useCalendar()

  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  }), [weekStart])

  const weekRangeText = `${format(weekStart, 'dd MMM')} — ${format(addDays(weekStart, 6), 'dd MMM yyyy')}`

  return (
    <div style={{ width: '100%' }}>
      {/* Top controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn ghost" onClick={prevWeek}>Prev</button>
          <button className="btn ghost" onClick={goToToday}>Today</button>
          <button className="btn ghost" onClick={nextWeek}>Next</button>
        </div>
        <div style={{ color: '#374151', fontWeight: 600 }}>{weekRangeText}</div>
        <div />
      </div>

      {/* Day header row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 10 }}>
        <div style={{ width: 72 }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, flex: 1 }}>
          {days.map(day => {
            const isToday = day.toDateString() === today.toDateString()
            return (
              <div key={day.toISOString()} className="day-header" style={isToday ? { boxShadow: 'inset 0 0 0 2px rgba(37,99,235,0.06)' } : {}}>
                <div className="day-header-name">{format(day, 'EEE')}</div>
                <div className="day-header-date">{format(day, 'dd MMM')}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid: hours column + day columns */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="hour-col">
          {HOURS.map(h => (
            <div key={h} className="hour-cell">{String(h).padStart(2, '0')}:00</div>
          ))}
        </div>

        <div className="days" role="grid">
          {days.map(day => <DayColumn key={day.toISOString()} day={day} />)}
        </div>
      </div>
    </div>
  )
}



