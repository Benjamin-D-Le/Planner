import { useState } from 'react'
import Board from '../components/Board'
import '../styles/board.css'

function PlannerPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'School Tasks',
      category: 'School',
      color: '#ffe88f',
      tasks: ['Finish planner UI', 'Review biology notes'],
    },
    {
      id: 2,
      title: 'Personal',
      category: 'Personal',
      color: '#ffd6e7',
      tasks: ['Buy groceries', 'Clean desk'],
    },
  ])

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('School')
  const [color, setColor] = useState('#ffe88f')
  const [taskInput, setTaskInput] = useState('')
  const [taskList, setTaskList] = useState([])

  function addTaskToDraft() {
    const trimmed = taskInput.trim()
    if (!trimmed) return
    setTaskList([...taskList, trimmed])
    setTaskInput('')
  }

  function removeDraftTask(indexToRemove) {
    setTaskList(taskList.filter((_, index) => index !== indexToRemove))
  }

  function createNote() {
    if (!title.trim() || taskList.length === 0) return

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      category,
      color,
      tasks: taskList,
    }

    setNotes([newNote, ...notes])
    setTitle('')
    setCategory('School')
    setColor('#ffe88f')
    setTaskInput('')
    setTaskList([])
  }

  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>My Planner Board</h1>
          <p>Pin cute sticky notes for everything you need to do.</p>
        </div>
      </header>

      <main className="main-layout">
        <section className="creator-panel">
          <h2>Create a Sticky Note</h2>

          <label>Title</label>
          <input
            type="text"
            placeholder="Ex. Homework"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>School</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Health</option>
          </select>

          <label>Sticky Note Color</label>
          <div className="color-picker">
            {['#ffe88f', '#ffd6e7', '#c9f2c7', '#cfe7ff', '#e3d5ff'].map((swatch) => (
              <button
                key={swatch}
                className={`color-dot ${color === swatch ? 'selected' : ''}`}
                style={{ backgroundColor: swatch }}
                onClick={() => setColor(swatch)}
                type="button"
              />
            ))}
          </div>

          <label>Add Tasks</label>
          <div className="task-input-row">
            <input
              type="text"
              placeholder="Type one task"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTaskToDraft()
                }
              }}
            />
            <button type="button" className="mini-btn" onClick={addTaskToDraft}>
              Add
            </button>
          </div>

          {taskList.length > 0 && (
            <div className="draft-task-list">
              {taskList.map((task, index) => (
                <div key={index} className="draft-task-item">
                  <span>{task}</span>
                  <button type="button" onClick={() => removeDraftTask(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="create-btn" onClick={createNote}>
            Pin Note
          </button>
        </section>

        <section className="board-wrapper">
          <Board notes={notes} onDelete={deleteNote} />
        </section>
      </main>
    </div>
  )
}

export default PlannerPage