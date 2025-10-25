import { useState } from 'react'
import './App.css'

// Import icons (using Unicode symbols for now)
const Icons = {
  home: '✏️',
  book: '📖',
  template: '📋',
  rhyme: '🎵',
  dictionary: '📚',
  settings: '⚙️',
  user: '👤',
  search: '🔍',
  plus: '+',
  edit: '✎',
  delete: '🗑️',
  share: '↗️',
  save: '💾',
  menu: '☰'
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [lyrics, setLyrics] = useState('')
  const [selectedWord, setSelectedWord] = useState(null)
  const [songs, setSongs] = useState([
    { id: 1, title: 'Summer Nights', date: '2025-10-20', lyrics: 'Under the summer sky...' },
    { id: 2, title: 'Heartbreak Avenue', date: '2025-10-18', lyrics: 'Walking down this lonely road...' },
    { id: 3, title: 'Rising Up', date: '2025-10-15', lyrics: 'I will rise above it all...' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Calculate syllable count (simplified version)
  const countSyllables = (word) => {
    word = word.toLowerCase().replace(/[^a-z]/g, '')
    if (word.length <= 3) return 1
    const vowels = word.match(/[aeiouy]+/g)
    return vowels ? vowels.length : 1
  }

  const getLinesWithSyllables = (text) => {
    const lines = text.split('\n')
    return lines.map(line => {
      const words = line.split(' ').filter(w => w)
      const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)
      return { text: line, syllables, words }
    })
  }

  // Navigation component
  const Navigation = () => {
    const handleNavClick = (screen) => {
      setCurrentScreen(screen)
      setMobileMenuOpen(false)
    }

    return (
      <nav className="sidebar">
        <button
          className={`nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
          onClick={() => handleNavClick('home')}
          aria-label="Home - Lyric Writing"
        >
          <span className="nav-icon">{Icons.home}</span>
          <span className="nav-label">Write</span>
        </button>
        <button
          className={`nav-btn ${currentScreen === 'songbook' ? 'active' : ''}`}
          onClick={() => handleNavClick('songbook')}
          aria-label="Songbook"
        >
          <span className="nav-icon">{Icons.book}</span>
          <span className="nav-label">Songbook</span>
        </button>
        <button
          className={`nav-btn ${currentScreen === 'forms' ? 'active' : ''}`}
          onClick={() => handleNavClick('forms')}
          aria-label="Song Forms"
        >
          <span className="nav-icon">{Icons.template}</span>
          <span className="nav-label">Forms</span>
        </button>
        <button
          className={`nav-btn ${currentScreen === 'rhyme-schemes' ? 'active' : ''}`}
          onClick={() => handleNavClick('rhyme-schemes')}
          aria-label="Rhyme Schemes"
        >
          <span className="nav-icon">{Icons.rhyme}</span>
          <span className="nav-label">Schemes</span>
        </button>
        <button
          className={`nav-btn ${currentScreen === 'dictionary' ? 'active' : ''}`}
          onClick={() => handleNavClick('dictionary')}
          aria-label="Rhyming Dictionary"
        >
          <span className="nav-icon">{Icons.dictionary}</span>
          <span className="nav-label">Dictionary</span>
        </button>
      </nav>
    )
  }

  // Top bar component
  const TopBar = () => (
    <header className="topbar">
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {Icons.menu}
      </button>
      <div className="logo">
        <h1>Words <span className="accent">Matter</span></h1>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="User profile">
          {Icons.user}
        </button>
        <button className="icon-btn" aria-label="Settings">
          {Icons.settings}
        </button>
      </div>
    </header>
  )

  // Home Screen - Lyric Writing Interface
  const HomeScreen = () => {
    const linesWithSyllables = getLinesWithSyllables(lyrics)

    return (
      <div className="screen home-screen">
        <div className="screen-header">
          <h2>Write Your Lyrics</h2>
          <button className="btn-primary" aria-label="Save lyrics">
            <span>{Icons.save}</span> Save
          </button>
        </div>

        <div className="lyric-editor">
          <div className="editor-display">
            {linesWithSyllables.map((line, idx) => (
              <div key={idx} className="lyric-line">
                <span className="line-number">{idx + 1}</span>
                <span className="line-text">
                  {line.words.length > 0 ? (
                    line.words.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="word clickable"
                        onClick={() => {
                          setSelectedWord(word)
                          setSearchQuery(word)
                          setCurrentScreen('dictionary')
                        }}
                      >
                        {word}{' '}
                      </span>
                    ))
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </span>
                <span className="syllable-count" title="Syllable count">
                  {line.syllables > 0 && `${line.syllables} syl`}
                </span>
              </div>
            ))}
          </div>

          <textarea
            className="editor-input"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Start writing your lyrics here...&#10;Each line will show syllable counts&#10;Click any word to find rhymes"
            aria-label="Lyric text editor"
          />
        </div>

        {selectedWord && (
          <div className="quick-info">
            Selected word: <strong>{selectedWord}</strong> -
            <button
              className="link-btn"
              onClick={() => setCurrentScreen('dictionary')}
            >
              Find rhymes
            </button>
          </div>
        )}
      </div>
    )
  }

  // Songbook Screen
  const SongbookScreen = () => (
    <div className="screen songbook-screen">
      <div className="screen-header">
        <h2>My Songbook</h2>
        <button className="btn-primary" aria-label="Create new song">
          <span>{Icons.plus}</span> New Song
        </button>
      </div>

      <div className="songs-grid">
        {songs.map(song => (
          <div key={song.id} className="song-card">
            <div className="card-header">
              <h3>{song.title}</h3>
              <span className="card-date">{song.date}</span>
            </div>
            <div className="card-body">
              <p className="song-preview">{song.lyrics}</p>
            </div>
            <div className="card-actions">
              <button className="icon-btn" aria-label="Edit song" title="Edit">
                {Icons.edit}
              </button>
              <button className="icon-btn" aria-label="Share song" title="Share">
                {Icons.share}
              </button>
              <button className="icon-btn danger" aria-label="Delete song" title="Delete">
                {Icons.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Song Forms Screen
  const SongFormsScreen = () => {
    const forms = [
      { name: 'Verse-Chorus-Bridge', structure: 'V-C-V-C-B-C', description: 'Classic pop song structure' },
      { name: 'AABA', structure: 'A-A-B-A', description: 'Traditional song form' },
      { name: '12-Bar Blues', structure: 'I-IV-I-V-IV-I', description: 'Blues progression' },
      { name: 'AAA', structure: 'A-A-A', description: 'Folk song form' }
    ]

    return (
      <div className="screen forms-screen">
        <div className="screen-header">
          <h2>Song Forms</h2>
          <button className="btn-primary" aria-label="Create custom form">
            <span>{Icons.plus}</span> Custom Form
          </button>
        </div>

        <div className="forms-list">
          {forms.map((form, idx) => (
            <div key={idx} className="form-card">
              <div className="form-header">
                <h3>{form.name}</h3>
                <span className="structure-tag">{form.structure}</span>
              </div>
              <p className="form-description">{form.description}</p>
              <div className="form-actions">
                <button className="btn-secondary">Use Template</button>
                <button className="btn-outline">Import from Songbook</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Rhyme Schemes Screen
  const RhymeSchemesScreen = () => {
    const schemes = [
      { name: 'Couplet', pattern: 'AA BB CC', example: 'Two rhyming lines in succession' },
      { name: 'Alternate', pattern: 'ABAB', example: 'Alternating rhyme pattern' },
      { name: 'Enclosed', pattern: 'ABBA', example: 'Inner rhymes enclosed by outer' },
      { name: 'Triplet', pattern: 'AAA', example: 'Three consecutive rhyming lines' }
    ]

    return (
      <div className="screen schemes-screen">
        <div className="screen-header">
          <h2>Rhyme Schemes</h2>
          <button className="btn-primary" aria-label="Create custom scheme">
            <span>{Icons.plus}</span> Custom Scheme
          </button>
        </div>

        <div className="schemes-grid">
          {schemes.map((scheme, idx) => (
            <div key={idx} className="scheme-card">
              <h3>{scheme.name}</h3>
              <div className="pattern-display">{scheme.pattern}</div>
              <p className="scheme-example">{scheme.example}</p>
              <button className="btn-secondary">Use Scheme</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Rhyming Dictionary Screen
  const DictionaryScreen = () => {
    const rhymeTypes = {
      perfect: ['day', 'way', 'say', 'play', 'stay', 'bay', 'ray', 'may'],
      near: ['fade', 'made', 'paid', 'braid', 'shade'],
      slant: ['deed', 'need', 'feed', 'lead', 'read'],
      similar: ['daily', 'crazy', 'hazy', 'lazy', 'maybe']
    }

    return (
      <div className="screen dictionary-screen">
        <div className="screen-header">
          <h2>Rhyming Dictionary</h2>
        </div>

        <div className="search-bar">
          <span className="search-icon">{Icons.search}</span>
          <input
            type="text"
            placeholder="Search for rhymes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search for rhymes"
          />
        </div>

        {searchQuery && (
          <div className="search-results">
            <p className="results-info">Showing rhymes for: <strong>{searchQuery}</strong></p>
          </div>
        )}

        <div className="rhyme-categories">
          <div className="rhyme-category">
            <h3>Perfect Rhymes</h3>
            <div className="word-list">
              {rhymeTypes.perfect.map((word, idx) => (
                <button key={idx} className="word-tag">{word}</button>
              ))}
            </div>
          </div>

          <div className="rhyme-category">
            <h3>Near Rhymes</h3>
            <div className="word-list">
              {rhymeTypes.near.map((word, idx) => (
                <button key={idx} className="word-tag">{word}</button>
              ))}
            </div>
          </div>

          <div className="rhyme-category">
            <h3>Slant Rhymes</h3>
            <div className="word-list">
              {rhymeTypes.slant.map((word, idx) => (
                <button key={idx} className="word-tag">{word}</button>
              ))}
            </div>
          </div>

          <div className="rhyme-category">
            <h3>Similar Sounds</h3>
            <div className="word-list">
              {rhymeTypes.similar.map((word, idx) => (
                <button key={idx} className="word-tag">{word}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />
      case 'songbook': return <SongbookScreen />
      case 'forms': return <SongFormsScreen />
      case 'rhyme-schemes': return <RhymeSchemesScreen />
      case 'dictionary': return <DictionaryScreen />
      default: return <HomeScreen />
    }
  }

  return (
    <div className="app">
      <TopBar />
      <div className="app-body">
        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        <div className={`sidebar-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Navigation />
        </div>
        <main className="main-content">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}

export default App
