import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [rhymes, setRhymes] = useState({
    perfect: [],
    near: [],
    slant: [],
    similar: []
  })
  const [isLoadingRhymes, setIsLoadingRhymes] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // TEMPORARILY DISABLED - Load saved data from localStorage on mount
  // useEffect(() => {
  //   const savedLyrics = localStorage.getItem('currentLyrics')
  //   const savedSongs = localStorage.getItem('songs')

  //   if (savedLyrics) {
  //     setLyrics(savedLyrics)
  //   }
  //   if (savedSongs) {
  //     try {
  //       setSongs(JSON.parse(savedSongs))
  //     } catch (e) {
  //       console.error('Error loading songs:', e)
  //     }
  //   }
  // }, [])

  // TEMPORARILY DISABLED - Auto-save lyrics as user types (with debounce)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (lyrics) {
  //       localStorage.setItem('currentLyrics', lyrics)
  //     }
  //   }, 1000)
  //   return () => clearTimeout(timer)
  // }, [lyrics])

  // Save songs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('songs', JSON.stringify(songs))
  }, [songs])

  // Improved syllable counter
  const countSyllables = (word) => {
    if (!word || word.length === 0) return 0

    word = word.toLowerCase().trim()

    // Remove non-alphabetic characters
    word = word.replace(/[^a-z]/g, '')

    if (word.length <= 3) return 1

    // Remove silent 'e' at the end
    word = word.replace(/e$/, '')

    // Count vowel groups
    const vowelGroups = word.match(/[aeiouy]+/g)
    let syllables = vowelGroups ? vowelGroups.length : 0

    // Handle special cases
    if (word.endsWith('le') && word.length > 2) {
      syllables++
    }

    // Words like "real" that have two vowels but one syllable
    if (word.match(/[aeiou]{2}/) && word.length <= 4) {
      syllables = Math.max(1, syllables - 1)
    }

    return syllables || 1
  }

  const getLinesWithSyllables = (text) => {
    const lines = text.split('\n')
    return lines.map(line => {
      const words = line.split(' ').filter(w => w)
      const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)
      return { text: line, syllables, words }
    })
  }

  // Save current lyrics as a new song
  const handleSaveLyrics = () => {
    if (!lyrics.trim()) {
      setSaveMessage('Please write some lyrics first!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    const title = prompt('Enter a title for your song:')
    if (!title) return

    const newSong = {
      id: Date.now(),
      title: title.trim(),
      date: new Date().toISOString().split('T')[0],
      lyrics: lyrics
    }

    setSongs([newSong, ...songs])
    setSaveMessage('Song saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)

    // Optionally clear the editor
    // setLyrics('')
  }

  // Fetch rhymes from Datamuse API
  const fetchRhymes = useCallback(async (word) => {
    if (!word || word.trim().length === 0) {
      setRhymes({ perfect: [], near: [], slant: [], similar: [] })
      return
    }

    setIsLoadingRhymes(true)

    try {
      // Datamuse API endpoints
      const perfectUrl = `https://api.datamuse.com/words?rel_rhy=${word}&max=20`
      const nearUrl = `https://api.datamuse.com/words?rel_nry=${word}&max=15`
      const soundsLikeUrl = `https://api.datamuse.com/words?sl=${word}&max=15`

      const [perfectRes, nearRes, soundsRes] = await Promise.all([
        fetch(perfectUrl),
        fetch(nearUrl),
        fetch(soundsLikeUrl)
      ])

      const perfect = await perfectRes.json()
      const near = await nearRes.json()
      const sounds = await soundsRes.json()

      // Filter out duplicates and the search word itself
      const filterWords = (arr) =>
        arr
          .filter(item => item.word.toLowerCase() !== word.toLowerCase())
          .map(item => item.word)
          .filter((word, index, self) => self.indexOf(word) === index)

      setRhymes({
        perfect: filterWords(perfect),
        near: filterWords(near),
        slant: filterWords(near).slice(0, 10),
        similar: filterWords(sounds)
      })
    } catch (error) {
      console.error('Error fetching rhymes:', error)
      setRhymes({
        perfect: ['Error loading rhymes. Please try again.'],
        near: [],
        slant: [],
        similar: []
      })
    } finally {
      setIsLoadingRhymes(false)
    }
  }, [])

  // Fetch rhymes when search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && currentScreen === 'dictionary') {
        fetchRhymes(searchQuery)
      }
    }, 500) // Debounce API calls
    return () => clearTimeout(timer)
  }, [searchQuery, currentScreen, fetchRhymes])

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
    const textareaRef = useRef(null)
    const simplifiedRef = useRef(null)
    const linesWithSyllables = getLinesWithSyllables(lyrics)

    // TEMPORARILY DISABLED - Keep textarea focused as user types
    // useEffect(() => {
    //   if (simplifiedRef.current && document.activeElement !== simplifiedRef.current) {
    //     // Only refocus if user was typing (not clicking elsewhere)
    //     const shouldFocus = lyrics.length > 0
    //     if (shouldFocus) {
    //       simplifiedRef.current.focus()
    //     }
    //   }
    // }, [lyrics])

    const handleEditorClick = (e) => {
      // Don't focus if clicking on a word (let word click work)
      if (!e.target.classList.contains('clickable')) {
        textareaRef.current?.focus()
      }
    }

    return (
      <div className="screen home-screen">
        <div className="screen-header">
          <h2>Write Your Lyrics</h2>
          <button
            className="btn-primary"
            onClick={handleSaveLyrics}
            aria-label="Save lyrics"
          >
            <span>{Icons.save}</span> Save
          </button>
        </div>

        {saveMessage && (
          <div className="save-message">
            {saveMessage}
          </div>
        )}

        {/* DEBUG TEST - Remove this after testing */}
        <div style={{ background: 'yellow', padding: '20px', margin: '20px 0' }}>
          <h3>TEST TEXTAREA (Pure HTML, NO React):</h3>
          <textarea
            id="pure-html-test"
            style={{ width: '100%', fontSize: '20px', padding: '10px' }}
            dir="ltr"
            placeholder="Type here to test..."
            onInput={(e) => {
              document.getElementById('pure-output').textContent = e.target.value
              document.getElementById('pure-codes').textContent = [...e.target.value].map(c => c.charCodeAt(0)).join(', ')
            }}
          />
          <p>Raw value: <span id="pure-output"></span></p>
          <p>Char codes: <span id="pure-codes"></span></p>
        </div>

        {/* COMPLETELY MINIMAL TEST */}
        <div style={{ background: 'cyan', padding: '20px', borderRadius: '10px' }}>
          <h3>BARE BONES textarea (NO attributes except value/onChange):</h3>
          <textarea
            value={lyrics}
            onChange={(e) => {
              console.log('⭐ MINIMAL BEFORE:', e.target.value)
              setLyrics(e.target.value)
            }}
          />
          <div>
            <p>Lyrics state: {lyrics}</p>
          </div>
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

        {isLoadingRhymes && (
          <div className="search-results">
            <p className="results-info">Loading rhymes...</p>
          </div>
        )}

        {searchQuery && !isLoadingRhymes && (
          <div className="search-results">
            <p className="results-info">
              Showing rhymes for: <strong>{searchQuery}</strong>
            </p>
          </div>
        )}

        {!searchQuery && !isLoadingRhymes && (
          <div className="search-results">
            <p className="results-info">
              Type a word above or click any word in your lyrics to find rhymes!
            </p>
          </div>
        )}

        <div className="rhyme-categories">
          {rhymes.perfect.length > 0 && (
            <div className="rhyme-category">
              <h3>Perfect Rhymes ({rhymes.perfect.length})</h3>
              <div className="word-list">
                {rhymes.perfect.map((word, idx) => (
                  <button
                    key={idx}
                    className="word-tag"
                    onClick={() => setSearchQuery(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rhymes.near.length > 0 && (
            <div className="rhyme-category">
              <h3>Near Rhymes ({rhymes.near.length})</h3>
              <div className="word-list">
                {rhymes.near.map((word, idx) => (
                  <button
                    key={idx}
                    className="word-tag"
                    onClick={() => setSearchQuery(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rhymes.slant.length > 0 && (
            <div className="rhyme-category">
              <h3>Slant Rhymes ({rhymes.slant.length})</h3>
              <div className="word-list">
                {rhymes.slant.map((word, idx) => (
                  <button
                    key={idx}
                    className="word-tag"
                    onClick={() => setSearchQuery(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rhymes.similar.length > 0 && (
            <div className="rhyme-category">
              <h3>Similar Sounds ({rhymes.similar.length})</h3>
              <div className="word-list">
                {rhymes.similar.map((word, idx) => (
                  <button
                    key={idx}
                    className="word-tag"
                    onClick={() => setSearchQuery(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery &&
            !isLoadingRhymes &&
            rhymes.perfect.length === 0 &&
            rhymes.near.length === 0 &&
            rhymes.slant.length === 0 &&
            rhymes.similar.length === 0 && (
              <div className="search-results">
                <p className="results-info">
                  No rhymes found for "<strong>{searchQuery}</strong>". Try a different word!
                </p>
              </div>
            )}
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
