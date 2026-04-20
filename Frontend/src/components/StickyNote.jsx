function StickyNote({ note, onDelete }) {
  return (
    <div className="note" style={{ backgroundColor: note.color }}>
      <button
        className="delete-btn"
        onClick={() => onDelete(note.id)}
        aria-label="Delete note"
      >
        ×
      </button>

      <span className="category-badge">{note.category}</span>
      <h3>{note.title}</h3>

      <ul>
        {note.tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  )
}

export default StickyNote