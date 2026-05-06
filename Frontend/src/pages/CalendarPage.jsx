import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/calendar.css'

const POSTITS_STORAGE_KEY = 'planner-postits'
const EVENTS_STORAGE_KEY = 'calendar-events'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const EVENT_COLORS = [
  '#fff3a3',
  '#ffd1dc',
  '#cde9ff',
  '#d9f8c4',
  '#e7d7ff',
  '#ffd2a6',
]

function CalendarPage() {
  const navigate = useNavigate()

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(POSTITS_STORAGE_KEY)
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
    return savedEvents ? JSON.parse(savedEvents) : []
  })

  const [currentDate, setCurrentDate] = useState(new Date())

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    category: '',
    color: EVENT_COLORS[1],
  })

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
  }, [events])

  useEffect(() => {
    function handlePostItsUpdated(event) {
      setNotes(event.detail)
    }

    function handleStorageChange(event) {
      if (event.key === POSTITS_STORAGE_KEY) {
        const updatedNotes = event.newValue ? JSON.parse(event.newValue) : []
        setNotes(updatedNotes)
      }

      if (event.key === EVENTS_STORAGE_KEY) {
        const updatedEvents = event.newValue ? JSON.parse(event.newValue) : []
        setEvents(updatedEvents)
      }
    }

    window.addEventListener('planner-postits-updated', handlePostItsUpdated)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(
        'planner-postits-updated',
        handlePostItsUpdated
      )
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const calendarDays = useMemo(() => {
    return buildCalendarDays(currentDate)
  }, [currentDate])

  const datedNotes = notes.filter((note) => note.dueDate)

  const monthLabel = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  function handleEventInputChange(event) {
    const { name, value } = event.target

    setEventForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleEventColorChange(color) {
    setEventForm((currentForm) => ({
      ...currentForm,
      color,
    }))
  }

  function addCalendarEvent(event) {
    event.preventDefault()

    if (!eventForm.title.trim() || !eventForm.date) return

    const newEvent = {
      id: crypto.randomUUID(),
      title: eventForm.title.trim(),
      date: eventForm.date,
      category: eventForm.category.trim() || 'Event',
      color: eventForm.color,
      createdAt: new Date().toISOString(),
    }

    setEvents((currentEvents) => [...currentEvents, newEvent])

    setEventForm({
      title: '',
      date: '',
      category: '',
      color: EVENT_COLORS[1],
    })
  }

  function deleteCalendarEvent(id) {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    )
  }

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  function goToPlanner() {
    navigate('/planner')
  }

  return (
    <section className="calendar-page" id="calendar-page">
      <button className="floating-page-button" onClick={goToPlanner}>
        ← Back to Board
      </button>

      <div className="calendar-header">
        <div>
          <p className="calendar-eyebrow">Calendar View</p>
          <h1>{monthLabel}</h1>
          <p>
            Post-its with due dates and calendar-only events appear here.
          </p>
        </div>
      </div>

      <div className="calendar-layout">
        <aside className="calendar-event-panel">
          <form className="calendar-event-form" onSubmit={addCalendarEvent}>
            <h2>Add Calendar Event</h2>

            <label htmlFor="eventTitle">Event Title</label>
            <input
              id="eventTitle"
              name="title"
              type="text"
              placeholder="Doctor appointment, exam, birthday..."
              value={eventForm.title}
              onChange={handleEventInputChange}
            />

            <label htmlFor="eventDate">Date</label>
            <input
              id="eventDate"
              name="date"
              type="date"
              value={eventForm.date}
              onChange={handleEventInputChange}
            />

            <label htmlFor="eventCategory">Category</label>
            <input
              id="eventCategory"
              name="category"
              type="text"
              placeholder="Optional"
              value={eventForm.category}
              onChange={handleEventInputChange}
            />

            <label>Event Color</label>
            <div className="event-color-picker">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`event-color-bubble ${
                    eventForm.color === color ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Choose ${color} event color`}
                  onClick={() => handleEventColorChange(color)}
                />
              ))}
            </div>

            <button className="add-event-button" type="submit">
              Add Event
            </button>
          </form>

          <div className="calendar-summary-card">
            <span>Post-its</span>
            <strong>{datedNotes.length}</strong>
          </div>

          <div className="calendar-summary-card">
            <span>Events</span>
            <strong>{events.length}</strong>
          </div>
        </aside>

        <div className="calendar-shell">
          <div className="calendar-toolbar">
            <div>
              <h2>{monthLabel}</h2>
              <p>
                {datedNotes.length} dated post-it(s), {events.length} event(s)
              </p>
            </div>

            <div className="calendar-controls">
              <button type="button" onClick={goToPreviousMonth}>
                ←
              </button>

              <button type="button" onClick={goToToday}>
                Today
              </button>

              <button type="button" onClick={goToNextMonth}>
                →
              </button>
            </div>
          </div>

          <div className="calendar-board">
            <div className="weekday-row">
              {WEEKDAYS.map((weekday) => (
                <div className="weekday" key={weekday}>
                  {weekday}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day) => {
                const dateKey = toDateKey(day.date)

                const notesForDay = datedNotes.filter(
                  (note) => note.dueDate === dateKey
                )

                const eventsForDay = events.filter(
                  (event) => event.date === dateKey
                )

                return (
                  <div
                    key={day.date.toISOString()}
                    className={`calendar-cell ${
                      day.isCurrentMonth ? '' : 'muted-day'
                    } ${isToday(day.date) ? 'today-cell' : ''}`}
                  >
                    <div className="calendar-date-number">
                      {day.date.getDate()}
                    </div>

                    <div className="calendar-note-list">
                      {notesForDay.map((note) => (
                        <div
                          key={note.id}
                          className={`calendar-mini-note ${
                            note.completed ? 'completed' : ''
                          }`}
                          style={{ backgroundColor: note.color }}
                        >
                          <strong>Post-it · {note.category || 'General'}</strong>
                          <span>{note.title}</span>
                        </div>
                      ))}

                      {eventsForDay.map((event) => (
                        <div
                          key={event.id}
                          className="calendar-mini-note calendar-event-note"
                          style={{ backgroundColor: event.color }}
                        >
                          <strong>Event · {event.category}</strong>

                          <span>{event.title}</span>

                          <button
                            type="button"
                            className="delete-calendar-event-button"
                            onClick={() => deleteCalendarEvent(event.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {datedNotes.length === 0 && events.length === 0 && (
            <div className="calendar-empty-state">
              <h2>No calendar items yet</h2>
              <p>
                Add a due date to a post-it or create a calendar-only event.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function buildCalendarDays(currentDate) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const startDay = firstDayOfMonth.getDay()

  const calendarStart = new Date(year, month, 1 - startDay)

  const days = []

  for (let i = 0; i < 42; i++) {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + i)

    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
    })
  }

  return days
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isToday(date) {
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export default CalendarPage