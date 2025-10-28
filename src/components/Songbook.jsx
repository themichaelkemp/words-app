import { useState } from 'react'
import './Songbook.css'

function Songbook({ songs, onEdit, onDelete }) {
  const [viewMode, setViewMode] = useState('grid') // 'list' or 'grid'

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this song?')) {
      onDelete(id)
    }
  }

  const handleShare = (song) => {
    alert(`Sharing: ${song.title}`)
    // TODO: Implement actual share functionality
  }

  const handleEdit = (song) => {
    onEdit(song)
  }

  return (
    <div className="songbook-container">
      <div className="songbook-header">
        <h2>📖 Songbook</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            ☰ List
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
        </div>
      </div>

      <div className={`songs-${viewMode}`}>
        {songs.length === 0 ? (
          <div className="empty-state">
            <p>No saved songs yet. Start writing to create your first song!</p>
          </div>
        ) : (
          songs.map(song => (
            <div key={song.id} className="song-card">
              <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <div className="song-meta">
                  <span>{song.lines} lines</span>
                  <span>•</span>
                  <span>{song.syllables} syllables</span>
                </div>
                <div className="song-date">{song.date}</div>
              </div>
              <div className="song-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(song)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="action-btn share-btn"
                  onClick={() => handleShare(song)}
                  title="Share"
                >
                  📤
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(song.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Songbook
