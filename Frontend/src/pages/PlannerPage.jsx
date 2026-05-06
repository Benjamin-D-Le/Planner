import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/board.css'
import '../styles/form.css'
import '../styles/note.css'

const STORAGE_KEY = 'planner-postits'

const NOTE_COLORS = [
  '#fff3a3',
  '#ffd1dc',
  '#cde9ff',
  '#d9f8c4',
  '#e7d7ff',
  '#ffd2a6',
]

function PlannerPage() {
  const navigate = useNavigate()
  const boardRef = useRef(null)

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    details: '',
    dueDate: '',
    color: NOTE_COLORS[0],
  })

  const [draggingNote, setDraggingNote] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))

    window.dispatchEvent(
      new CustomEvent('planner-postits-updated', {
        detail: notes,
      })
    )
  }, [notes])

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleColorChange(color) {
    setFormData((currentData) => ({
      ...currentData,
      color,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim()) return

    const newNote = {
      id: crypto.randomUUID(),
      category: formData.category.trim() || 'General',
      title: formData.title.trim(),
      details: formData.details.trim(),
      dueDate: formData.dueDate || null,
      color: formData.color,
      completed: false,
      x: 40 + Math.random() * 120,
      y: 40 + Math.random() * 120,
      createdAt: new Date().toISOString(),
    }

    setNotes((currentNotes) => [...currentNotes, newNote])

    setFormData({
      category: '',
      title: '',
      details: '',
      dueDate: '',
      color: NOTE_COLORS[0],
    })
  }

  function clearForm() {
    setFormData({
      category: '',
      title: '',
      details: '',
      dueDate: '',
      color: NOTE_COLORS[0],
    })
  }

  function deleteNote(id) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id))
  }

  function toggleComplete(id) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    )
  }

  function handlePointerDown(event, note) {
    if (event.target.closest('button')) return

    const board = boardRef.current
    if (!board) return

    const boardRect = board.getBoundingClientRect()

    setDraggingNote({
      id: note.id,
      offsetX: event.clientX - boardRect.left - note.x,
      offsetY: event.clientY - boardRect.top - note.y,
    })

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!draggingNote) return

    const board = boardRef.current
    if (!board) return

    const boardRect = board.getBoundingClientRect()

    const newX = event.clientX - boardRect.left - draggingNote.offsetX
    const newY = event.clientY - boardRect.top - draggingNote.offsetY

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === draggingNote.id
          ? {
              ...note,
              x: Math.max(8, Math.min(newX, boardRect.width - 260)),
              y: Math.max(8, Math.min(newY, boardRect.height - 240)),
            }
          : note
      )
    )
  }

  function handlePointerUp() {
    setDraggingNote(null)
  }

  function goToCalendar() {
    navigate('/calendar')
  }

  const totalNotes = notes.length
  const completedNotes = notes.filter((note) => note.completed).length
  const calendarNotes = notes.filter((note) => note.dueDate).length

  return (
    <section className="planner-page" id="planner-page">

        <aside className="planner-sidebar">
          <div className="planner-header">
            <h1>Post-It Planner</h1>
            <p>
              Add tasks, reminders, and ideas. Give a post-it a due date to make
              it appear on the calendar.
            </p>
          </div>

          <button className="page-nav-button" onClick={goToCalendar}>
            Calendar →
          </button>

          <form className="note-form" onSubmit={handleSubmit}>
          <h2>Add New Note</h2>

          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="School, work, personal..."
            value={formData.category}
            onChange={handleInputChange}
          />

          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="What do you need to do?"
            value={formData.title}
            onChange={handleInputChange}
          />

          <label htmlFor="details">Details</label>
          <textarea
            id="details"
            name="details"
            placeholder="Optional notes..."
            value={formData.details}
            onChange={handleInputChange}
          />

          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
          />

          <label>Note Color</label>
          <div className="color-picker">
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-bubble ${
                  formData.color === color ? 'selected' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Choose ${color} note color`}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>

          <div className="form-actions">
            <button type="submit">Add Note</button>
            <button
              type="button"
              className="secondary-button"
              onClick={clearForm}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="planner-stats">
          <div className="stat-card">
            <span>Total Notes</span>
            <strong>{totalNotes}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedNotes}</strong>
          </div>
        </div>

        <div className="planner-stats">
          <div className="stat-card full-stat-card">
            <span>On Calendar</span>
            <strong>{calendarNotes}</strong>
          </div>
        </div>
      </aside>

      <main className="board-area">
        <div
          className="board"
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {notes.length === 0 ? (
            <div className="board-empty-state">
              <h2>No post-its yet</h2>
              <p>Add your first note using the form on the left.</p>
            </div>
          ) : (
            notes.map((note) => (
              <article
                key={note.id}
                className={`note ${note.completed ? 'completed' : ''} ${
                  draggingNote?.id === note.id ? 'dragging' : ''
                }`}
                style={{
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  backgroundColor: note.color,
                }}
                onPointerDown={(event) => handlePointerDown(event, note)}
              >
                <div className="thumbtack" />

                <div className="note-content">
                  <div className="note-top-row">
                    <span
                      className={`note-category ${
                        note.category ? '' : 'empty'
                      }`}
                    >
                      {note.category || 'General'}
                    </span>

                    {note.completed && (
                      <span className="note-status">Done</span>
                    )}
                  </div>

                  <h3>{note.title}</h3>

                  {note.details && <p>{note.details}</p>}

                  {note.dueDate && (
                    <span className="note-due-date">
                      Due: {formatDate(note.dueDate)}
                    </span>
                  )}
                </div>

                <div className="note-actions">
                  <button type="button" onClick={() => toggleComplete(note.id)}>
                    {note.completed ? 'Undo' : 'Complete'}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </section>
  )
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default PlannerPage