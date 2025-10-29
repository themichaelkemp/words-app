import { useState } from 'react'
import Profile from './Profile'
import './Header.css'

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <header className="header">
        <h1 className="logo">
          <span className="logo-words">Words</span>{' '}
          <span className="logo-matter">Matter</span>
        </h1>
        <div className="header-actions">
          <a
            href="mailto:wordsmatterappfeedback@gmail.com?subject=Words Matter Feedback&body=Hi! I'd like to share some feedback about Words Matter:%0D%0A%0D%0A"
            className="icon-button feedback-button"
            title="Send Feedback"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
          </a>
          <button
            className="icon-button profile-button"
            onClick={() => setIsProfileOpen(true)}
            title="Profile"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

export default Header