import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import Auth from './Auth'
import Profile from './Profile'
import './Header.css'

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { currentUser, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <header className="header">
        <h1 className="logo">
          <span className="logo-words">Words</span>{' '}
          <span className="logo-matter">Matter</span>
        </h1>
        <div className="header-actions">
          <button
            className="icon-button theme-button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <a
            href="mailto:wordsmatterappfeedback@gmail.com?subject=Words Matter Feedback&body=Hi! I'd like to share some feedback about Words Matter:%0D%0A%0D%0A"
            className="icon-button feedback-button"
            title="Send Feedback"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
          </a>

          {isAuthenticated ? (
            <div className="user-menu-container">
              <button
                className="icon-button profile-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={currentUser?.displayName || currentUser?.email}
              >
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="user-avatar" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{currentUser?.displayName || 'User'}</div>
                    <div className="user-menu-email">{currentUser?.email}</div>
                  </div>
                  <div className="user-menu-divider"></div>
                  <button onClick={() => { setIsProfileOpen(true); setShowUserMenu(false); }} className="user-menu-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    Profile
                  </button>
                  <button onClick={handleLogout} className="user-menu-item logout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-button"
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

export default Header