import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import useWardrobeStore from '../store/wardrobeStore'

// Username → Firebase email conversion (synthetic email trick)
const toEmail = (username) => `${username.toLowerCase().trim()}@moja-omara.local`
const toUsername = (user) =>
  user?.displayName || user?.email?.split('@')[0] || 'Uporabnik'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [authReady, setReady] = useState(false)

  const loadUserData  = useWardrobeStore((s) => s.loadUserData)
  const clearUserData = useWardrobeStore((s) => s.clearUserData)

  // ── Auth state listener ───────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser)
        await loadUserData(fbUser.uid)
      } else {
        setUser(null)
        clearUserData()
      }
      setReady(true)
    })
    return unsub
  }, []) // eslint-disable-line

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (username, password) => {
    // Validate format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      throw new Error('Uporabniško ime: 3–20 znakov (črke, številke, _)')
    }
    const lower = username.toLowerCase()

    // Check uniqueness
    const nameRef  = doc(db, 'usernames', lower)
    const nameSnap = await getDoc(nameRef)
    if (nameSnap.exists()) throw new Error('To uporabniško ime je že zasedeno.')

    // Create Firebase Auth user
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, toEmail(lower), password)
    await updateProfile(fbUser, { displayName: username })

    // Persist username → uid mapping + init settings
    await Promise.all([
      setDoc(nameRef, { uid: fbUser.uid }),
      setDoc(doc(db, 'users', fbUser.uid, 'data', 'settings'), { customPiles: [] }),
    ])

    return fbUser
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = (username, password) =>
    signInWithEmailAndPassword(auth, toEmail(username), password)

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, authReady, register, login, logout, username: toUsername(user) }}>
      {children}
    </AuthContext.Provider>
  )
}
