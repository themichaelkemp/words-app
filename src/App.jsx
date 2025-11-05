import { useState, useEffect, Suspense, lazy } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './contexts/AuthContext'
import { getUserSongs, createSong, updateSong, deleteSong } from './services/songsService'
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
  const { currentUser } = useAuth()
  const [currentView, setCurrentView] = useState('write')
  const [searchWord, setSearchWord] = useState('')
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingSong, setEditingSong] = useState(null)
  const [currentDraft, setCurrentDraft] = useLocalStorage('wordsMatterCurrentDraft', {
    title: '',
    lyrics: ''
  })

  // Load songs from Firestore when user logs in
  useEffect(() => {
    const loadSongs = async () => {
      if (currentUser) {
        setLoading(true)
        try {
          const userSongs = await getUserSongs(currentUser.uid)
          setSongs(userSongs)
        } catch (error) {
          console.error('Error loading songs:', error)
        } finally {
          setLoading(false)
        }
      } else {
        // Clear songs when user logs out
        setSongs([])
      }
    }

    loadSongs()
  }, [currentUser])

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

  const handleSaveSong = async (songData) => {
    if (!currentUser) {
      alert('Please sign in to save songs!')
      return
    }

    try {
      if (editingSong) {
        // Update existing song in Firestore
        await updateSong(editingSong.id, songData)
        setSongs(songs.map(song =>
          song.id === editingSong.id ? { ...song, ...songData } : song
        ))
        setEditingSong(null)
      } else {
        // Create new song in Firestore
        const newSong = await createSong(currentUser.uid, songData)
        setSongs([newSong, ...songs])
        // Clear the draft after saving
        setCurrentDraft({ title: '', lyrics: '' })
      }
    } catch (error) {
      console.error('Error saving song:', error)
      alert('Failed to save song. Please try again.')
    }
  }

  const handleEditSong = (song) => {
    setEditingSong(song)
    setCurrentView('write')
  }

  const handleDeleteSong = async (id) => {
    if (!currentUser) {
      return
    }

    try {
      await deleteSong(id)
      setSongs(songs.filter(song => song.id !== id))
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Failed to delete song. Please try again.')
    }
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
