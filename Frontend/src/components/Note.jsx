function Note({
  note,
  isDragging,
  onMouseDown,
  onTouchStart,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  return (
    <div
      className={`note ${note.completed ? 'completed' : ''} ${
        isDragging ? 'dragging' : ''
      }`}
      style={{
        backgroundColor: note.color,
        left: `${note.x}px`,
        top: `${note.y}px`,
      }}
      onMouseDown={(event) => onMouseDown(event, note)}
      onTouchStart={(event) => onTouchStart(event, note)}
    >
      <div className="thumbtack" />

      <div className="note-content">
        <div className="note-top-row">
          {note.category?.trim() ? (
            <span className="note-category">{note.category}</span>
          ) : (
            <span className="note-category empty">No Category</span>
          )}

          {note.completed && <span className="note-status">Completed</span>}
        </div>

        <h3>{note.title}</h3>
        <p>{note.content}</p>
      </div>

      <div className="note-actions">
        <button type="button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button type="button" onClick={() => onToggleComplete(note.id)}>
          {note.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Note