import { useState, Suspense, lazy } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import './App.css'

// Lazy load heavy components for better performance
const Songbook = lazy(() => import('./components/Songbook'))
const Forms = lazy(() => import('./components/Forms'))
const Schemes = lazy(() => import('./components/Schemes'))
const Dictionary = lazy(() => import('./components/Dictionary'))

function App() {
  const [currentView, setCurrentView] = useState('write')
  const [searchWord, setSearchWord] = useState('')
  const [songs, setSongs] = useLocalStorage('wordsMatterSongs', [])
  const [editingSong, setEditingSong] = useState(null)
  const [currentDraft, setCurrentDraft] = useLocalStorage('wordsMatterCurrentDraft', {
    title: '',
    lyrics: ''
  })

  const handleWordClick = (word) => {
    // Clean up the word and navigate to dictionary
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
    console.log('App received word click:', word, '-> cleaned:', cleanWord)
    setSearchWord(cleanWord)
    setCurrentView('dictionary')
  }

  const handleDraftChange = (draft) => {
    setCurrentDraft(draft)
  }

  const handleSaveSong = (songData) => {
    if (editingSong) {
      // Update existing song
      setSongs(songs.map(song =>
        song.id === editingSong.id ? { ...songData, id: editingSong.id } : song
      ))
      setEditingSong(null)
    } else {
      // Create new song
      const newSong = {
        ...songData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      }
      setSongs([newSong, ...songs])
      // Clear the draft after saving
      setCurrentDraft({ title: '', lyrics: '' })
    }
  }

  const handleEditSong = (song) => {
    setEditingSong(song)
    setCurrentView('write')
  }

  const handleDeleteSong = (id) => {
    setSongs(songs.filter(song => song.id !== id))
  }

  const renderView = () => {
    switch (currentView) {
      case 'write':
        return (
          <Editor
            onWordClick={handleWordClick}
            onSave={handleSaveSong}
            editingSong={editingSong}
            onCancelEdit={() => setEditingSong(null)}
            currentDraft={editingSong ? null : currentDraft}
            onDraftChange={handleDraftChange}
          />
        )
      case 'songbook':
        return (
          <Songbook
            songs={songs}
            onEdit={handleEditSong}
            onDelete={handleDeleteSong}
          />
        )
      case 'forms':
        return <Forms onWordClick={handleWordClick} onSaveToSongbook={handleSaveSong} songs={songs} />
      case 'schemes':
        return <Schemes onWordClick={handleWordClick} onSaveToSongbook={handleSaveSong} songs={songs} />
      case 'dictionary':
        return <Dictionary searchWord={searchWord} />
      default:
        return <Editor onWordClick={handleWordClick} onSave={handleSaveSong} />
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="main-content">
          <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
            {renderView()}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
