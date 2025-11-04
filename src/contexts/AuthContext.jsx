import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || '',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      return userCredential
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      return userCredential
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Log out
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null)
      if (!currentUser) throw new Error('No user logged in')

      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        })
      }

      // Update Firestore user document
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...updates,
        updatedAt: new Date()
      }, { merge: true })

      // Refresh current user
      setCurrentUser({ ...auth.currentUser })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoading(false)

      // Load additional user data from Firestore if user exists
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            // Merge Firestore data with auth data
            setCurrentUser({
              ...user,
              firestoreData: userDoc.data()
            })
          }
        } catch (err) {
          console.error('Error loading user data:', err)
        }
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    isAuthenticated: !!currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
