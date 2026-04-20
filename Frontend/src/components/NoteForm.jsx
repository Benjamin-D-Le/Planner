const colorOptions = [
  { label: 'Classic Yellow', value: '#fff8a6' },
  { label: 'Peach', value: '#ffd6a5' },
  { label: 'Mint', value: '#caffbf' },
  { label: 'Blue', value: '#a0e7e5' },
  { label: 'Pink', value: '#ffb3c6' },
  { label: 'Lavender', value: '#d9c2ff' },
]

function NoteForm({ formData, editingId, onChange, onSubmit, onCancel }) {
  function handleColorSelect(color) {
    onChange({
      target: {
        name: 'color',
        value: color,
      },
    })
  }

  return (
    <form className="note-form" onSubmit={onSubmit}>
      <h2>{editingId !== null ? 'Edit Note' : 'Add New Note'}</h2>

      <label htmlFor="category">Category</label>
      <input
        id="category"
        name="category"
        type="text"
        value={formData.category}
        onChange={onChange}
        placeholder="School, Work, Personal..."
      />

      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={onChange}
        placeholder="Enter a title"
      />

      <label htmlFor="content">Details</label>
      <textarea
        id="content"
        name="content"
        value={formData.content}
        onChange={onChange}
        placeholder="Write your task or reminder"
        rows="5"
      />

      <label>Note Color</label>
      <div className="color-picker">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`color-bubble ${
              formData.color === color.value ? 'selected' : ''
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorSelect(color.value)}
            aria-label={color.label}
            title={color.label}
          />
        ))}
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingId !== null ? 'Save Changes' : 'Add Note'}
        </button>

        {editingId !== null && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default NoteForm