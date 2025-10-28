import { useState, useEffect } from 'react'
import './Schemes.css'

const rhymeSchemes = [
  {
    id: 1,
    name: 'ABAB',
    pattern: ['A', 'B', 'A', 'B'],
    description: 'Alternating rhyme scheme'
  },
  {
    id: 2,
    name: 'AABB',
    pattern: ['A', 'A', 'B', 'B'],
    description: 'Couplet rhyme scheme'
  },
  {
    id: 3,
    name: 'ABCB',
    pattern: ['A', 'B', 'C', 'B'],
    description: 'Simple four-line scheme'
  },
  {
    id: 4,
    name: 'AAAA',
    pattern: ['A', 'A', 'A', 'A'],
    description: 'Monorhyme'
  },
  {
    id: 5,
    name: 'ABBA',
    pattern: ['A', 'B', 'B', 'A'],
    description: 'Enclosed rhyme'
  },
  {
    id: 6,
    name: 'ABABCC',
    pattern: ['A', 'B', 'A', 'B', 'C', 'C'],
    description: 'Shakespearean sonnet ending'
  }
]

function Schemes({ onWordClick, onSaveToSongbook, songs }) {
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [schemeLines, setSchemeLines] = useState([])
  const [songTitle, setSongTitle] = useState('')
  const [savedSchemes, setSavedSchemes] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [showImport, setShowImport] = useState(false)

  // Load saved schemes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wordsMatterRhymeSchemes')
    if (saved) {
      setSavedSchemes(JSON.parse(saved))
    }
  }, [])

  const handleSelectScheme = (scheme) => {
    setSelectedScheme(scheme)
    setSongTitle('')
    // Initialize empty lines based on pattern
    setSchemeLines(scheme.pattern.map((letter, idx) => ({
      id: idx,
      letter,
      text: ''
    })))
  }

  const handleLineChange = (id, text) => {
    setSchemeLines(schemeLines.map(line =>
      line.id === id ? { ...line, text } : line
    ))
  }

  const handleLoadSaved = (savedScheme) => {
    setSelectedScheme(savedScheme.scheme)
    setSongTitle(savedScheme.title)
    setSchemeLines(savedScheme.lines)
    setShowSaved(false)
  }

  const getLastWord = (line) => {
    const words = line.trim().split(/\s+/)
    const lastWord = words[words.length - 1]
    // Remove punctuation
    return lastWord.replace(/[^a-zA-Z]/g, '').toLowerCase()
  }

  const getEndingSound = (word) => {
    // Get last 3 characters for rough rhyme matching
    return word.slice(-3).toLowerCase()
  }

  const analyzeRhymePattern = (lines, pattern) => {
    // Extract last words from each line
    const lastWords = lines.map(line => getLastWord(line))

    // Group words by rhyme letter
    const rhymeGroups = {}
    pattern.forEach((letter, index) => {
      if (!rhymeGroups[letter]) {
        rhymeGroups[letter] = []
      }
      if (lastWords[index]) {
        rhymeGroups[letter].push({
          word: lastWords[index],
          lineIndex: index
        })
      }
    })

    // Check if words in each group actually rhyme
    const analysis = []
    for (const [letter, group] of Object.entries(rhymeGroups)) {
      if (group.length > 1) {
        // Check if all words in this group have similar endings
        const endings = group.map(g => getEndingSound(g.word))
        const firstEnding = endings[0]
        const allRhyme = endings.every(e => e === firstEnding ||
          (e.length >= 2 && firstEnding.length >= 2 &&
           e.slice(-2) === firstEnding.slice(-2)))

        analysis.push({
          letter,
          words: group,
          rhyme: allRhyme ? 'match' : 'mismatch'
        })
      }
    }

    return { rhymeGroups, analysis }
  }

  const handleImportFromSongbook = (song) => {
    if (!selectedScheme) return

    // Split song lyrics into lines
    const lines = song.lyrics.split('\n').filter(line => line.trim().length > 0)

    // Limit lines to pattern length if there are more lines than pattern
    const limitedLines = lines.slice(0, selectedScheme.pattern.length)

    // Map lines to scheme pattern
    const newLines = schemeLines.map((line, index) => ({
      ...line,
      text: limitedLines[index] || ''
    }))

    // Analyze rhyme pattern
    const { rhymeGroups, analysis } = analyzeRhymePattern(limitedLines, selectedScheme.pattern)

    setSongTitle(song.title)
    setSchemeLines(newLines)
    setShowImport(false)

    // Show analysis results
    let resultMessage = `Rhyme Analysis:\n\n`

    for (const item of analysis) {
      const wordsList = item.words.map(w => w.word).join(', ')
      const status = item.rhyme === 'match' ? '✓ Rhymes' : '⚠️ Doesn\'t rhyme'
      resultMessage += `${item.letter}: ${wordsList} ${status}\n`
    }

    if (analysis.length === 0) {
      resultMessage = 'Not enough lines to analyze rhyme pattern.'
    }

    alert(resultMessage)
  }

  const handleSave = () => {
    if (!songTitle.trim()) {
      alert('Please enter a song title before saving!')
      return
    }

    // Check if content has been written
    const hasContent = schemeLines.some(line => line.text.trim().length > 0)
    if (!hasContent) {
      alert('Please write some content before saving!')
      return
    }

    // Combine all lines into lyrics
    const lyrics = schemeLines.map(line => line.text).filter(text => text.trim()).join('\n')

    // Calculate stats
    const linesCount = lyrics.split('\n').filter(line => line.trim().length > 0).length
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

    const savedScheme = {
      id: Date.now(),
      title: songTitle,
      scheme: selectedScheme,
      lines: schemeLines,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedSaved = [savedScheme, ...savedSchemes]
    setSavedSchemes(updatedSaved)
    localStorage.setItem('wordsMatterRhymeSchemes', JSON.stringify(updatedSaved))

    // Also save to main Songbook
    if (onSaveToSongbook) {
      onSaveToSongbook({
        title: songTitle,
        lyrics: lyrics,
        lines: linesCount,
        syllables: totalSyllables
      })
    }

    alert('Rhyme scheme saved to Songbook!')
  }

  const handleDelete = (id) => {
    if (confirm('Delete this saved scheme?')) {
      const updated = savedSchemes.filter(scheme => scheme.id !== id)
      setSavedSchemes(updated)
      localStorage.setItem('wordsMatterRhymeSchemes', JSON.stringify(updated))
    }
  }

  const handleAddStanza = () => {
    if (!selectedScheme) return
    const nextId = schemeLines.length
    const newLines = selectedScheme.pattern.map((letter, idx) => ({
      id: nextId + idx,
      letter,
      text: ''
    }))
    setSchemeLines([...schemeLines, ...newLines])
  }

  return (
    <div className="schemes-container">
      <div className="schemes-header">
        <h2>🎵 Rhyme Schemes</h2>
        <div className="scheme-actions">
          {!selectedScheme && (
            <button
              className="action-button load-btn"
              onClick={() => setShowSaved(!showSaved)}
            >
              📂 My Saved Schemes ({savedSchemes.length})
            </button>
          )}
          {selectedScheme && (
            <>
              <button className="action-button add-stanza-btn" onClick={handleAddStanza}>
                ➕ Add Stanza
              </button>
              <button className="action-button save-btn" onClick={handleSave}>
                💾 Save
              </button>
            </>
          )}
        </div>
      </div>

      {showSaved ? (
        <div className="saved-schemes-view">
          <div className="saved-schemes-header">
            <h3>My Saved Rhyme Schemes</h3>
            <button className="back-btn" onClick={() => setShowSaved(false)}>
              ← Back to Templates
            </button>
          </div>
          {savedSchemes.length > 0 ? (
            <div className="saved-schemes-list">
              {savedSchemes.map(saved => (
                <div key={saved.id} className="saved-scheme-card">
                  <div className="saved-scheme-info">
                    <h4>{saved.title}</h4>
                    <p className="saved-scheme-meta">
                      {saved.scheme.name} • {saved.date}
                    </p>
                  </div>
                  <div className="saved-scheme-actions">
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
              <p>No saved schemes yet. Create one using the templates!</p>
            </div>
          )}
        </div>
      ) : !selectedScheme ? (
        <div className="schemes-grid">
          {rhymeSchemes.map(scheme => (
            <div key={scheme.id} className="scheme-card" onClick={() => handleSelectScheme(scheme)}>
              <h3>{scheme.name}</h3>
              <p className="scheme-description">{scheme.description}</p>
              <div className="scheme-pattern">
                {scheme.pattern.map((letter, idx) => (
                  <span key={idx} className="pattern-letter">{letter}</span>
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
              🎯 <strong>Rhyme Analysis:</strong> The app will analyze your song's rhyme pattern and show which words should rhyme together!
            </p>
          </div>
          {songs && songs.length > 0 ? (
            <div className="import-list">
              {songs.map(song => {
                const lines = song.lyrics.split('\n').filter(line => line.trim().length > 0)
                const limitedLines = lines.slice(0, selectedScheme.pattern.length)
                const { analysis } = analyzeRhymePattern(limitedLines, selectedScheme.pattern)

                return (
                  <div key={song.id} className="import-song-card">
                    <div className="import-song-info">
                      <h4>{song.title}</h4>
                      <p className="import-song-meta">
                        {song.lines} lines • {song.syllables} syllables
                      </p>
                      {analysis.length > 0 && (
                        <div className="rhyme-preview">
                          {analysis.map((item, idx) => (
                            <div key={idx} className={`rhyme-group ${item.rhyme}`}>
                              <span className="rhyme-letter-preview">{item.letter}:</span>
                              <span className="rhyme-words-preview">
                                {item.words.map(w => w.word).join(', ')}
                              </span>
                              <span className={`rhyme-status ${item.rhyme}`}>
                                {item.rhyme === 'match' ? '✓' : '⚠️'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
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
        <div className="scheme-editor">
          <div className="scheme-editor-header">
            <div className="scheme-editor-title">
              <h3>{selectedScheme.name} - {selectedScheme.description}</h3>
            </div>
            <div className="form-header-actions">
              <button className="action-button-small" onClick={() => setShowImport(true)}>
                📥 Import Song
              </button>
              <button className="back-btn" onClick={() => setSelectedScheme(null)}>
                ← Back to Schemes
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
          <div className="scheme-lines">
            {schemeLines.map((line) => {
              // Find which words should rhyme with this line
              const rhymesWith = schemeLines
                .filter(l => l.letter === line.letter && l.id !== line.id)
                .map(l => getLastWord(l.text))
                .filter(w => w)

              const currentLastWord = getLastWord(line.text)

              // Check if current word rhymes with expected words
              let rhymeStatus = null
              if (currentLastWord && rhymesWith.length > 0) {
                const currentEnding = getEndingSound(currentLastWord)
                const expectedEnding = getEndingSound(rhymesWith[0])
                rhymeStatus = currentEnding === expectedEnding ||
                  (currentEnding.length >= 2 && expectedEnding.length >= 2 &&
                   currentEnding.slice(-2) === expectedEnding.slice(-2))
                  ? 'match' : 'mismatch'
              }

              return (
                <div key={line.id} className="scheme-line">
                  <span className={`rhyme-letter rhyme-${line.letter}`}>{line.letter}</span>
                  <div className="line-input-wrapper">
                    <input
                      type="text"
                      className={`line-input ${rhymeStatus ? `rhyme-${rhymeStatus}` : ''}`}
                      value={line.text}
                      onChange={(e) => handleLineChange(line.id, e.target.value)}
                      onDoubleClick={(e) => {
                        // Extract word from double-click and search dictionary
                        const input = e.target
                        const cursorPos = input.selectionStart
                        const text = input.value
                        let start = cursorPos
                        let end = cursorPos
                        while (start > 0 && /[a-zA-Z]/.test(text[start - 1])) start--
                        while (end < text.length && /[a-zA-Z]/.test(text[end])) end++
                        const word = text.substring(start, end)
                        if (word && word.trim() && onWordClick) {
                          onWordClick(word)
                        }
                      }}
                      placeholder={`Line ending with rhyme ${line.letter}...`}
                    />
                    {rhymesWith.length > 0 && (
                      <div className="rhyme-hint">
                        Should rhyme with: <strong>{rhymesWith.join(', ')}</strong>
                        {rhymeStatus && (
                          <span className={`rhyme-indicator ${rhymeStatus}`}>
                            {rhymeStatus === 'match' ? ' ✓' : ' ⚠️'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Schemes
