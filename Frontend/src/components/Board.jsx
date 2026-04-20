import StickyNote from './StickyNote'

function Board({ notes, onDelete }) {
  return (
    <div className="board">
      {notes.map((note) => (
        <StickyNote key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Board