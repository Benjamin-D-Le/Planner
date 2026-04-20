import { useEffect, useRef, useState } from 'react'
import Note from '../components/Note'
import NoteForm from '../components/NoteForm'
import '../styles/board.css'
import '../styles/form.css'
import '../styles/note.css'

const starterNotes = [
  {
    id: 1,
    title: 'Finish planner UI',
    content: 'Build the bulletin board and note interactions.',
    category: 'Development',
    color: '#fff8a6',
    completed: false,
    x: 80,
    y: 90,
  },
  {
    id: 2,
    title: 'Study',
    content: 'Review class notes and organize assignments.',
    category: 'School',
    color: '#ffd6a5',
    completed: false,
    x: 340,
    y: 140,
  },
]

function getInitialNotes() {
  try {
    const saved = localStorage.getItem('planner-notes')
    if (!saved) return starterNotes

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return starterNotes

    return parsed
  } catch (error) {
    console.error('Failed to read saved notes:', error)
    localStorage.removeItem('planner-notes')
    return starterNotes
  }
}

function PlannerPage() {
  const [notes, setNotes] = useState(getInitialNotes)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    color: '#fff8a6',
  })

  const [editingId, setEditingId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)

  const dragOffset = useRef({ x: 0, y: 0 })
  const boardRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('planner-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    function handleMouseMove(event) {
      if (draggingId === null || !boardRef.current) return

      const boardRect = boardRef.current.getBoundingClientRect()
      const noteWidth = 240
      const noteHeight = 240

      let newX = event.clientX - boardRect.left - dragOffset.current.x
      let newY = event.clientY - boardRect.top - dragOffset.current.y

      const maxX = Math.max(0, boardRect.width - noteWidth)
      const maxY = Math.max(0, boardRect.height - noteHeight)

      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggingId ? { ...note, x: newX, y: newY } : note
        )
      )
    }

    function handleMouseUp() {
      setDraggingId(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingId])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function resetForm() {
    setFormData({
      title: '',
      content: '',
      category: '',
      color: '#fff8a6',
    })
    setEditingId(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) return

    if (editingId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: formData.title,
                content: formData.content,
                category: formData.category,
                color: formData.color,
              }
            : note
        )
      )
    } else {
      const newNote = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        color: formData.color,
        completed: false,
        x: 60 + (notes.length % 4) * 40,
        y: 80 + (notes.length % 5) * 40,
      }

      setNotes((prevNotes) => [...prevNotes, newNote])
    }

    resetForm()
  }

  function handleEdit(note) {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
    })
    setEditingId(note.id)
  }

  function handleDelete(id) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))

    if (editingId === id) {
      resetForm()
    }
  }

  function handleToggleComplete(id) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    )
  }

  function handleMouseDown(event, note) {
    if (
      event.target.closest('button') ||
      event.target.closest('input') ||
      event.target.closest('textarea') ||
      event.target.closest('select')
    ) {
      return
    }

    if (!boardRef.current) return

    const boardRect = boardRef.current.getBoundingClientRect()

    dragOffset.current = {
      x: event.clientX - boardRect.left - note.x,
      y: event.clientY - boardRect.top - note.y,
    }

    setDraggingId(note.id)

    setNotes((prevNotes) => {
      const selected = prevNotes.find((item) => item.id === note.id)
      const others = prevNotes.filter((item) => item.id !== note.id)
      return selected ? [...others, selected] : prevNotes
    })
  }

  const completedCount = notes.filter((note) => note.completed).length

  return (
    <div className="planner-page">
      <aside className="planner-sidebar">
        <div className="planner-header">
          <h1>My Planner Board</h1>
          <p>Pin tasks, drag them around, and keep everything in one place.</p>
        </div>

        <div className="planner-stats">
          <div className="stat-card">
            <span>Total Notes</span>
            <strong>{notes.length}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        <NoteForm
          formData={formData}
          editingId={editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </aside>

      <main className="board-area">
        <div className="board" ref={boardRef}>
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              isDragging={draggingId === note.id}
              onMouseDown={handleMouseDown}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default PlannerPage