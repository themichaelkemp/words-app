import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ currentView, onViewChange }) {
  const menuItems = [
    { id: 'write', label: 'Write', icon: '✏️' },
    { id: 'songbook', label: 'Songbook', icon: '📖' },
    { id: 'forms', label: 'Song Forms', icon: '📋' },
    { id: 'schemes', label: 'Rhyme Schemes', icon: '🎵' },
    { id: 'dictionary', label: 'Rhyme Dictionary', icon: '📚' }
  ]

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
