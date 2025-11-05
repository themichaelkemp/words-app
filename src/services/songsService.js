import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Get all songs for a specific user
 * @param {string} userId - The user's UID
 * @returns {Promise<Array>} Array of song objects
 */
export const getUserSongs = async (userId) => {
  try {
    const songsRef = collection(db, 'songs')
    const q = query(
      songsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const songs = []

    querySnapshot.forEach((doc) => {
      songs.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to readable dates
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
      })
    })

    return songs
  } catch (error) {
    console.error('Error getting user songs:', error)
    throw error
  }
}

/**
 * Create a new song
 * @param {string} userId - The user's UID
 * @param {object} songData - Song data (title, lyrics, lines, syllables)
 * @returns {Promise<object>} The created song with ID
 */
export const createSong = async (userId, songData) => {
  try {
    const songsRef = collection(db, 'songs')

    const newSong = {
      ...songData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(songsRef, newSong)

    return {
      id: docRef.id,
      ...songData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error creating song:', error)
    throw error
  }
}

/**
 * Update an existing song
 * @param {string} songId - The song document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateSong = async (songId, updates) => {
  try {
    const songRef = doc(db, 'songs', songId)

    await updateDoc(songRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating song:', error)
    throw error
  }
}

/**
 * Delete a song
 * @param {string} songId - The song document ID
 * @returns {Promise<void>}
 */
export const deleteSong = async (songId) => {
  try {
    const songRef = doc(db, 'songs', songId)
    await deleteDoc(songRef)
  } catch (error) {
    console.error('Error deleting song:', error)
    throw error
  }
}

export default {
  getUserSongs,
  createSong,
  updateSong,
  deleteSong
}
