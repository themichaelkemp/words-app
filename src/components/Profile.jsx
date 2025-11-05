import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

function Profile({ isOpen, onClose }) {
  const { currentUser, updateUserProfile } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  })

  // Load profile from Firebase Auth user
  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        bio: currentUser.firestoreData?.bio || '',
        avatar: currentUser.photoURL || ''
      })
    }
  }, [currentUser, isOpen])

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = async () => {
    try {
      await updateUserProfile({
        displayName: profile.name,
        photoURL: profile.avatar,
        bio: profile.bio
      })
      alert('Profile saved!')
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>Your Profile</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-display">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                </div>
              )}
            </div>
            <input
              type="text"
              className="profile-input small"
              value={profile.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="Avatar URL (optional)"
            />
          </div>

          <div className="profile-field">
            <label>Name</label>
            <input
              type="text"
              className="profile-input"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              className="profile-input"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="profile-field">
            <label>Bio</label>
            <textarea
              className="profile-textarea"
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>

          <div className="profile-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
