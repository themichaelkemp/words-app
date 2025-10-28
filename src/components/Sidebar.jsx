import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ currentView, onViewChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { id: 'write', label: 'Write', icon: '✏️' },
    { id: 'songbook', label: 'Songbook', icon: '📖' },
    { id: 'forms', label: 'Song Forms', icon: '📋' },
    { id: 'schemes', label: 'Rhyme Schemes', icon: '🎵' },
    { id: 'dictionary', label: 'Rhyme Dictionary', icon: '📚' }
  ]

  const handleViewChange = (viewId) => {
    onViewChange(viewId)
    setMobileOpen(false) // Close mobile menu after selection
  }

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">
          {mobileOpen ? '✕' : '☰'}
        </span>
      </button>

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleViewChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
