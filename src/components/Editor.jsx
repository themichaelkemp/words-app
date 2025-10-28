import { useState, useEffect } from 'react'
import './Editor.css'

// Simple syllable counter function
function countSyllables(word) {
  if (!word || word.length === 0) return 0

  word = word.toLowerCase().trim().replace(/[^a-z]/g, '')
  if (word.length === 0) return 0
  if (word.length <= 3) return 1

  // Remove silent e
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')

  // Count vowel groups
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function Editor({ onWordClick, onSave, editingSong, onCancelEdit, currentDraft, onDraftChange }) {
  const [title, setTitle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [saved, setSaved] = useState(false)

  // Load editing song or current draft if provided
  useEffect(() => {
    if (editingSong) {
      setTitle(editingSong.title || '')
      setLyrics(editingSong.lyrics || '')
    } else if (currentDraft) {
      setTitle(currentDraft.title || '')
      setLyrics(currentDraft.lyrics || '')
    }
  }, [editingSong, currentDraft])

  const handleChange = (e) => {
    const newValue = e.target.innerText || e.target.value
    setLyrics(newValue)
    setSaved(false)

    // Update draft in parent if not editing a song
    if (!editingSong && onDraftChange) {
      onDraftChange({ title, lyrics: newValue })
    }
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Update draft in parent if not editing a song
    if (!editingSong && onDraftChange) {
      onDraftChange({ title: newTitle, lyrics })
    }
  }

  const handleSave = () => {
    if (!lyrics.trim()) {
      alert('Please write some lyrics before saving!')
      return
    }

    const lines = lyrics.split('\n').filter(line => line.trim().length > 0)
    const words = lyrics.split(/\s+/).filter(w => w.trim().length > 0)
    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

    const songData = {
      title: title.trim() || 'Untitled',
      lyrics: lyrics,
      lines: lines.length,
      syllables: totalSyllables
    }

    onSave(songData)
    setSaved(true)

    // Clear form after save if not editing
    if (!editingSong) {
      setTitle('')
      setLyrics('')
    }

    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit()
      // Load current draft when canceling edit
      if (currentDraft) {
        setTitle(currentDraft.title || '')
        setLyrics(currentDraft.lyrics || '')
      } else {
        setTitle('')
        setLyrics('')
      }
    }
  }

  const handleWordClick = (word) => {
    console.log('Word clicked:', word)
    if (onWordClick) {
      onWordClick(word)
    }
  }

  const handleDoubleClick = (e) => {
    // Get the word at the cursor position when double-clicked
    const textarea = e.target
    const cursorPos = textarea.selectionStart
    const text = textarea.value

    // Find word boundaries
    let start = cursorPos
    let end = cursorPos

    // Move start back to beginning of word
    while (start > 0 && /[a-zA-Z]/.test(text[start - 1])) {
      start--
    }

    // Move end forward to end of word
    while (end < text.length && /[a-zA-Z]/.test(text[end])) {
      end++
    }

    const word = text.substring(start, end)
    if (word && word.trim()) {
      handleWordClick(word)
    }
  }

  // Split lyrics into lines and calculate syllables per line
  const lines = lyrics.split('\n')

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{editingSong ? 'Edit Song' : 'Write Your Lyrics'}</h2>
        <div className="header-actions">
          {editingSong && (
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button
            className={`save-button ${saved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : '💾 Save'}
          </button>
        </div>
      </div>
      <div className="editor-content">
        <div className="title-section">
          <input
            type="text"
            className="title-input"
            value={title}
            onChange={handleTitleChange}
            placeholder="Song title (optional)"
          />
        </div>
        <p className="editor-hint">💡 Tip: Double-click any word to find rhymes</p>
        <div className="editor-workspace">
          <div className="editor-input-wrapper">
            <textarea
              className="lyrics-textarea"
              value={lyrics}
              onChange={handleChange}
              onDoubleClick={handleDoubleClick}
              placeholder="Start writing your lyrics here..."
              spellCheck="true"
            />
            <div className="syllable-display-inline">
              {lines.map((line, lineIndex) => {
                const words = line.trim().split(/\s+/).filter(w => w.length > 0)
                const lineSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

                return (
                  <div key={lineIndex} className="syllable-line">
                    {lineSyllables > 0 ? lineSyllables : ''}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
