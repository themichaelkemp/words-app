import { useState, useEffect } from 'react'
import './Forms.css'

const songForms = [
  {
    id: 1,
    name: 'Verse-Chorus',
    structure: ['Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus'],
    description: 'Classic pop song structure'
  },
  {
    id: 2,
    name: 'AABA',
    structure: ['A Section', 'A Section', 'B Section (Bridge)', 'A Section'],
    description: 'Traditional jazz/standards form'
  },
  {
    id: 3,
    name: 'Verse-Chorus-Bridge',
    structure: ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    description: 'Extended pop structure'
  },
  {
    id: 4,
    name: '12-Bar Blues',
    structure: ['I (4 bars)', 'IV (2 bars)', 'I (2 bars)', 'V (1 bar)', 'IV (1 bar)', 'I (2 bars)'],
    description: 'Traditional blues progression'
  }
]

function Forms({ onWordClick, onSaveToSongbook, songs }) {
  const [selectedForm, setSelectedForm] = useState(null)
  const [formContent, setFormContent] = useState({})
  const [songTitle, setSongTitle] = useState('')
  const [savedForms, setSavedForms] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [showImport, setShowImport] = useState(false)

  // Load saved forms from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wordsMatterSongForms')
    if (saved) {
      setSavedForms(JSON.parse(saved))
    }
  }, [])

  const handleSelectForm = (form) => {
    setSelectedForm(form)
    setSongTitle('')
    // Initialize empty content for each section
    const content = {}
    form.structure.forEach((section, index) => {
      content[index] = ''
    })
    setFormContent(content)
  }

  const handleContentChange = (index, value) => {
    setFormContent({
      ...formContent,
      [index]: value
    })
  }

  const handleLoadSaved = (savedForm) => {
    setSelectedForm(savedForm.form)
    setSongTitle(savedForm.title)
    setFormContent(savedForm.content)
    setShowSaved(false)
  }

  const analyzeLyricStructure = (lyrics) => {
    // Split into paragraphs (sections separated by blank lines)
    const paragraphs = lyrics.split(/\n\s*\n/).filter(p => p.trim().length > 0)

    // Find repeated sections (likely choruses)
    const sectionCounts = {}
    const sectionFirstAppearance = {}

    paragraphs.forEach((para, index) => {
      const normalized = para.trim().toLowerCase().replace(/\s+/g, ' ')
      if (!sectionCounts[normalized]) {
        sectionCounts[normalized] = 0
        sectionFirstAppearance[normalized] = index
      }
      sectionCounts[normalized]++
    })

    // Label sections
    const labeledSections = []
    const usedLabels = { verse: 0, chorus: 0, bridge: 0 }
    let chorusText = null

    // Find the most repeated section (likely chorus)
    let maxRepeats = 0
    for (const [text, count] of Object.entries(sectionCounts)) {
      if (count > maxRepeats && count > 1) {
        maxRepeats = count
        chorusText = text
      }
    }

    paragraphs.forEach((para, index) => {
      const normalized = para.trim().toLowerCase().replace(/\s+/g, ' ')

      if (chorusText && normalized === chorusText) {
        // This is the chorus
        usedLabels.chorus++
        labeledSections.push({
          type: 'Chorus',
          text: para.trim(),
          index
        })
      } else if (index > paragraphs.length * 0.6 && sectionCounts[normalized] === 1) {
        // Unique section in last 40% of song = likely bridge
        usedLabels.bridge++
        labeledSections.push({
          type: 'Bridge',
          text: para.trim(),
          index
        })
      } else {
        // Unique section = verse
        usedLabels.verse++
        labeledSections.push({
          type: `Verse ${usedLabels.verse}`,
          text: para.trim(),
          index
        })
      }
    })

    return labeledSections
  }

  const handleImportFromSongbook = (song) => {
    if (!selectedForm) return

    // Analyze the song structure
    const detectedSections = analyzeLyricStructure(song.lyrics)

    // Create a mapping of detected sections
    const content = {}

    // Try to match detected sections to form structure
    selectedForm.structure.forEach((formSection, index) => {
      const formSectionLower = formSection.toLowerCase()

      // Try to find matching section
      let matchingSection = null

      if (formSectionLower.includes('chorus')) {
        matchingSection = detectedSections.find(s => s.type === 'Chorus')
      } else if (formSectionLower.includes('bridge')) {
        matchingSection = detectedSections.find(s => s.type === 'Bridge')
      } else if (formSectionLower.includes('verse')) {
        // Extract verse number from form section
        const verseMatch = formSection.match(/verse\s*(\d+)/i)
        const verseNum = verseMatch ? parseInt(verseMatch[1]) : 1
        matchingSection = detectedSections.find(s => s.type === `Verse ${verseNum}`)
      } else if (formSectionLower.includes('intro')) {
        matchingSection = detectedSections[0]
      } else if (formSectionLower.includes('outro')) {
        matchingSection = detectedSections[detectedSections.length - 1]
      }

      content[index] = matchingSection ? matchingSection.text : ''
    })

    setSongTitle(song.title)
    setFormContent(content)
    setShowImport(false)

    // Show analysis results
    const sectionSummary = detectedSections.map(s => s.type).join(', ')
    alert(`Detected structure: ${sectionSummary}\n\nMapped to ${selectedForm.name} form.`)
  }

  const handleSave = () => {
    if (!songTitle.trim()) {
      alert('Please enter a song title before saving!')
      return
    }

    // Check if content has been written
    const hasContent = Object.values(formContent).some(val => val.trim().length > 0)
    if (!hasContent) {
      alert('Please write some content before saving!')
      return
    }

    // Combine all sections into lyrics
    const lyrics = selectedForm.structure.map((section, index) => {
      const content = formContent[index] || ''
      return content.trim() ? `[${section}]\n${content}` : ''
    }).filter(s => s).join('\n\n')

    // Calculate stats
    const lines = lyrics.split('\n').filter(line => line.trim().length > 0)
    const words = lyrics.split(/\s+/).filter(w => w.trim().length > 0)

    // Simple syllable counter
    const countSyllables = (word) => {
      word = word.toLowerCase().trim().replace(/[^a-z]/g, '')
      if (word.length === 0) return 0
      if (word.length <= 3) return 1
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      word = word.replace(/^y/, '')
      const matches = word.match(/[aeiouy]{1,2}/g)
      return matches ? matches.length : 1
    }
    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

    const savedForm = {
      id: Date.now(),
      title: songTitle,
      form: selectedForm,
      content: formContent,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedSaved = [savedForm, ...savedForms]
    setSavedForms(updatedSaved)
    localStorage.setItem('wordsMatterSongForms', JSON.stringify(updatedSaved))

    // Also save to main Songbook
    if (onSaveToSongbook) {
      onSaveToSongbook({
        title: songTitle,
        lyrics: lyrics,
        lines: lines.length,
        syllables: totalSyllables
      })
    }

    alert('Song form saved to Songbook!')
  }

  const handleDelete = (id) => {
    if (confirm('Delete this saved form?')) {
      const updated = savedForms.filter(form => form.id !== id)
      setSavedForms(updated)
      localStorage.setItem('wordsMatterSongForms', JSON.stringify(updated))
    }
  }

  return (
    <div className="forms-container">
      <div className="forms-header">
        <h2>📋 Song Forms</h2>
        <div className="form-actions">
          {!selectedForm && (
            <button
              className="action-button load-btn"
              onClick={() => setShowSaved(!showSaved)}
            >
              📂 My Saved Forms ({savedForms.length})
            </button>
          )}
          {selectedForm && (
            <button className="action-button save-btn" onClick={handleSave}>
              💾 Save
            </button>
          )}
        </div>
      </div>

      {showSaved ? (
        <div className="saved-forms-view">
          <div className="saved-forms-header">
            <h3>My Saved Song Forms</h3>
            <button className="back-btn" onClick={() => setShowSaved(false)}>
              ← Back to Templates
            </button>
          </div>
          {savedForms.length > 0 ? (
            <div className="saved-forms-list">
              {savedForms.map(saved => (
                <div key={saved.id} className="saved-form-card">
                  <div className="saved-form-info">
                    <h4>{saved.title}</h4>
                    <p className="saved-form-meta">
                      {saved.form.name} • {saved.date}
                    </p>
                  </div>
                  <div className="saved-form-actions">
                    <button
                      className="action-button-small load-btn"
                      onClick={() => handleLoadSaved(saved)}
                    >
                      📝 Load
                    </button>
                    <button
                      className="action-button-small delete-btn"
                      onClick={() => handleDelete(saved.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-saved">
              <p>No saved forms yet. Create one using the templates!</p>
            </div>
          )}
        </div>
      ) : !selectedForm ? (
        <div className="forms-grid">
          {songForms.map(form => (
            <div key={form.id} className="form-card" onClick={() => handleSelectForm(form)}>
              <h3>{form.name}</h3>
              <p className="form-description">{form.description}</p>
              <div className="form-structure-preview">
                {form.structure.map((section, idx) => (
                  <span key={idx} className="structure-item">{section}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : showImport ? (
        <div className="import-view">
          <div className="import-header">
            <h3>Import from Songbook</h3>
            <button className="back-btn" onClick={() => setShowImport(false)}>
              ← Back
            </button>
          </div>
          <div className="import-instructions">
            <p>
              🎵 <strong>Smart Import:</strong> The app will analyze your song structure and automatically detect verses, choruses, and bridges!
            </p>
          </div>
          {songs && songs.length > 0 ? (
            <div className="import-list">
              {songs.map(song => {
                const detectedSections = analyzeLyricStructure(song.lyrics)
                const structurePreview = detectedSections.map(s => s.type).join(' → ')

                return (
                  <div key={song.id} className="import-song-card">
                    <div className="import-song-info">
                      <h4>{song.title}</h4>
                      <p className="import-song-meta">
                        {song.lines} lines • {song.syllables} syllables
                      </p>
                      <p className="detected-structure">
                        Detected: {structurePreview}
                      </p>
                    </div>
                    <button
                      className="action-button-small load-btn"
                      onClick={() => handleImportFromSongbook(song)}
                    >
                      📥 Import
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-saved">
              <p>No songs in Songbook yet. Write some songs first!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="form-editor">
          <div className="form-editor-header">
            <h3>{selectedForm.name}</h3>
            <div className="form-header-actions">
              <button className="action-button-small" onClick={() => setShowImport(true)}>
                📥 Import Song
              </button>
              <button className="back-btn" onClick={() => setSelectedForm(null)}>
                ← Back to Forms
              </button>
            </div>
          </div>
          <div className="title-input-section">
            <input
              type="text"
              className="song-title-input"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Song title..."
            />
          </div>
          <p className="editor-hint">💡 Tip: Double-click any word to find rhymes</p>
          <div className="form-sections">
            {selectedForm.structure.map((section, index) => (
              <div key={index} className="form-section">
                <label className="section-label">{section}</label>
                <textarea
                  className="section-textarea"
                  value={formContent[index] || ''}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  onDoubleClick={(e) => {
                    // Extract word from double-click and search dictionary
                    const textarea = e.target
                    const cursorPos = textarea.selectionStart
                    const text = textarea.value
                    let start = cursorPos
                    let end = cursorPos
                    while (start > 0 && /[a-zA-Z]/.test(text[start - 1])) start--
                    while (end < text.length && /[a-zA-Z]/.test(text[end])) end++
                    const word = text.substring(start, end)
                    if (word && word.trim() && onWordClick) {
                      onWordClick(word)
                    }
                  }}
                  placeholder={`Write your ${section.toLowerCase()} here...`}
                  rows="4"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Forms
