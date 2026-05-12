import { create } from 'zustand'
import {
  collection, doc, getDocs,
  setDoc, deleteDoc, getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Firestore paths ───────────────────────────────────────────────────────────
const itemsCol   = (uid) => collection(db, 'users', uid, 'items')
const outfitsCol = (uid) => collection(db, 'users', uid, 'outfits')
const settingsDoc = (uid) => doc(db, 'users', uid, 'data', 'settings')

// ── Store ─────────────────────────────────────────────────────────────────────
const useWardrobeStore = create((set, get) => ({
  uid:         null,
  items:       [],
  outfits:     [],
  customPiles: [],
  isLoading:   false,

  // Called from AuthContext when user signs in
  async loadUserData(uid) {
    set({ uid, isLoading: true })
    try {
      const [itemsSnap, outfitsSnap, settingsSnap] = await Promise.all([
        getDocs(itemsCol(uid)),
        getDocs(outfitsCol(uid)),
        getDoc(settingsDoc(uid)),
      ])
      set({
        items:       itemsSnap.docs.map((d) => d.data()),
        outfits:     outfitsSnap.docs.map((d) => d.data()),
        customPiles: settingsSnap.exists() ? (settingsSnap.data().customPiles ?? []) : [],
        isLoading:   false,
      })
    } catch (err) {
      console.error('loadUserData:', err)
      set({ isLoading: false })
    }
  },

  // Called from AuthContext on sign-out
  clearUserData() {
    set({ uid: null, items: [], outfits: [], customPiles: [], isLoading: false })
  },

  // ── Items ────────────────────────────────────────────────────────────────
  addItem(item) {
    const { uid } = get()
    set((s) => ({ items: [item, ...s.items] }))
    if (uid) setDoc(doc(itemsCol(uid), item.id), item).catch(console.error)
  },

  removeItem(id) {
    const { uid } = get()
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      outfits: s.outfits.map((o) => ({
        ...o,
        slots: Object.fromEntries(
          Object.entries(o.slots).map(([k, v]) => [k, v === id ? null : v])
        ),
      })),
    }))
    if (uid) deleteDoc(doc(itemsCol(uid), id)).catch(console.error)
  },

  // ── Outfits ──────────────────────────────────────────────────────────────
  saveOutfit(outfit) {
    const { uid } = get()
    set((s) => ({ outfits: [outfit, ...s.outfits] }))
    if (uid) setDoc(doc(outfitsCol(uid), outfit.id), outfit).catch(console.error)
  },

  removeOutfit(id) {
    const { uid } = get()
    set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) }))
    if (uid) deleteDoc(doc(outfitsCol(uid), id)).catch(console.error)
  },

  // ── Custom piles ─────────────────────────────────────────────────────────
  addCustomPile(pile) {
    const { uid, customPiles } = get()
    const next = [...customPiles, pile]
    set({ customPiles: next })
    if (uid) setDoc(settingsDoc(uid), { customPiles: next }, { merge: true }).catch(console.error)
  },

  removeCustomPile(id) {
    const { uid, customPiles, items } = get()
    const toRemove  = items.filter((i) => i.category === id)
    const nextPiles = customPiles.filter((p) => p.id !== id)
    set((s) => ({
      customPiles: nextPiles,
      items:       s.items.filter((i) => i.category !== id),
      outfits:     s.outfits.map((o) => ({
        ...o,
        slots: Object.fromEntries(
          Object.entries(o.slots).map(([k, v]) => [
            k, toRemove.some((i) => i.id === v) ? null : v,
          ])
        ),
      })),
    }))
    if (uid) {
      toRemove.forEach((i) => deleteDoc(doc(itemsCol(uid), i.id)).catch(console.error))
      setDoc(settingsDoc(uid), { customPiles: nextPiles }, { merge: true }).catch(console.error)
    }
  },
}))

export default useWardrobeStore
