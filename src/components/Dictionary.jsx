import { useState, useEffect } from 'react'
import './Dictionary.css'

// Fetch rhymes from Datamuse API
const getRhymes = async (word) => {
  try {
    const cleanWord = word.toLowerCase().trim()

    // Fetch different types of rhymes in parallel
    const [perfectRes, nearRes, soundsLikeRes, relatedRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?rel_rhy=${cleanWord}&max=50&md=d`),
      fetch(`https://api.datamuse.com/words?rel_nry=${cleanWord}&max=50&md=d`),
      fetch(`https://api.datamuse.com/words?sl=${cleanWord}&max=30&md=d`),
      fetch(`https://api.datamuse.com/words?ml=${cleanWord}&max=30&md=d`)
    ])

    const [perfect, near, soundsLike, related] = await Promise.all([
      perfectRes.json(),
      nearRes.json(),
      soundsLikeRes.json(),
      relatedRes.json()
    ])

    // Helper function to extract word data with definitions
    const mapWordData = (words) => words.map(w => ({
      word: w.word,
      definitions: w.defs ? w.defs.map(def => {
        // Parse definition format: "partOfSpeech\tdefinition"
        const parts = def.split('\t')
        return {
          partOfSpeech: parts[0] || '',
          definition: parts[1] || def
        }
      }) : []
    }))

    return {
      perfect: mapWordData(perfect).filter(w => w.word !== cleanWord).slice(0, 50),
      near: mapWordData(near).filter(w => w.word !== cleanWord).slice(0, 50),
      slant: mapWordData(soundsLike).filter(w => w.word !== cleanWord).slice(0, 30),
      similar: mapWordData(related).filter(w => w.word !== cleanWord).slice(0, 30)
    }
  } catch (error) {
    console.error('Error fetching rhymes:', error)
    return {
      perfect: [],
      near: [],
      slant: [],
      similar: []
    }
  }
}

function Dictionary({ searchWord }) {
  const [search, setSearch] = useState(searchWord || '')
  const [activeTab, setActiveTab] = useState('perfect')
  const [rhymes, setRhymes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copiedWord, setCopiedWord] = useState(null)

  const handleCopyWord = (word) => {
    navigator.clipboard.writeText(word).then(() => {
      setCopiedWord(word)
      setTimeout(() => setCopiedWord(null), 1500)
    })
  }

  const handleSearch = async (word) => {
    const searchTerm = word || search
    if (searchTerm && searchTerm.trim()) {
      setLoading(true)
      const results = await getRhymes(searchTerm.trim())
      setRhymes(results)
      setActiveTab('perfect') // Reset to perfect rhymes tab
      setLoading(false)
    }
  }

  useEffect(() => {
    const performSearch = async () => {
      if (searchWord && searchWord.trim()) {
        setSearch(searchWord)
        setLoading(true)
        const results = await getRhymes(searchWord.trim())
        setRhymes(results)
        setActiveTab('perfect')
        setLoading(false)
      }
    }
    performSearch()
  }, [searchWord])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const tabs = [
    { id: 'perfect', label: 'Perfect Rhymes', emoji: '🎯' },
    { id: 'near', label: 'Near Rhymes', emoji: '🎪' },
    { id: 'slant', label: 'Slant Rhymes', emoji: '🎨' },
    { id: 'similar', label: 'Similar Words', emoji: '🔤' }
  ]

  return (
    <div className="dictionary-container">
      <div className="dictionary-header">
        <h2>📚 Rhyming Dictionary</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a word to find rhymes..."
        />
        <button className="search-button" onClick={() => handleSearch()}>
          🔍 Search
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Finding rhymes...</p>
        </div>
      )}

      {!loading && rhymes && (
        <div className="rhyme-results">
          <div className="rhyme-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-emoji">{tab.emoji}</span>
                {tab.label}
                <span className="tab-count">({rhymes[tab.id]?.length || 0})</span>
              </button>
            ))}
          </div>

          <div className="rhyme-list">
            {rhymes[activeTab]?.length > 0 ? (
              <div className="words-grid">
                {rhymes[activeTab].map((wordData, index) => (
                  <div key={index} className="word-item-container">
                    <div className="word-item-header">
                      <div className="word-item" onClick={() => handleCopyWord(wordData.word)}>
                        {wordData.word}
                      </div>
                      <button
                        className={`copy-button ${copiedWord === wordData.word ? 'copied' : ''}`}
                        onClick={() => handleCopyWord(wordData.word)}
                        title="Copy word"
                      >
                        {copiedWord === wordData.word ? '✓' : '📋'}
                      </button>
                    </div>
                    {wordData.definitions && wordData.definitions.length > 0 && (
                      <div className="word-definitions">
                        {wordData.definitions.slice(0, 2).map((def, idx) => (
                          <div key={idx} className="definition-item">
                            <span className="part-of-speech">{def.partOfSpeech}</span>
                            <span className="definition-text">{def.definition}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} found for "{search}"
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !rhymes && (
        <div className="dictionary-placeholder">
          <p>Enter a word above to find rhymes, near rhymes, and similar sounding words.</p>
          <p className="api-credit">Powered by <a href="https://www.datamuse.com/" target="_blank" rel="noopener noreferrer">Datamuse API</a></p>
        </div>
      )}
    </div>
  )
}

export default Dictionary
