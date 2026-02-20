import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { WordProgress } from '../data/types'
import { createWordProgress, gradeWord, getDueWords, getMasteryPercent } from '../utils/srs'
import { load, save } from '../utils/storage'

interface ProgressState {
    /** SRS progress per word (keyed by hanzi) */
    wordProgress: Record<string, WordProgress>
    /** Total XP earned */
    xp: number
    /** Coins for the shop */
    coins: number
    /** IDs of purchased shop items */
    purchasedItems: string[]
    /** Current daily streak */
    streak: number
    /** Last practice date (YYYY-MM-DD) */
    lastPracticeDate: string
}

interface ProgressContextValue extends ProgressState {
    /** Grade a word after review/quiz */
    grade: (wordKey: string, quality: number) => void
    /** Add XP */
    addXp: (amount: number) => void
    /** Add coins */
    addCoins: (amount: number) => void
    /** Purchase a shop item (deducts coins, adds to purchasedItems) */
    purchase: (itemId: string, price: number) => boolean
    /** Use (consume) a purchased item — removes one instance */
    useItem: (itemId: string) => boolean
    /** Check if the user owns at least one of an item */
    hasItem: (itemId: string) => boolean
    /** Get words due for review */
    getDue: () => WordProgress[]
    /** Get mastery % for a list of word keys */
    getMastery: (keys: string[]) => number
    /** Record a practice session (updates streak) */
    recordPractice: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

const STORAGE_KEY = 'progress'
const today = () => new Date().toISOString().split('T')[0]

function getInitialState(): ProgressState {
    return load<ProgressState>(STORAGE_KEY, {
        wordProgress: {},
        xp: 0,
        coins: 0,
        purchasedItems: [],
        streak: 0,
        lastPracticeDate: '',
    })
}

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ProgressState>(getInitialState)

    // Persist on change
    useEffect(() => {
        save(STORAGE_KEY, state)
    }, [state])

    const grade = useCallback((wordKey: string, quality: number) => {
        setState(prev => {
            const existing = prev.wordProgress[wordKey] ?? createWordProgress(wordKey)
            const updated = gradeWord(existing, quality)
            return {
                ...prev,
                wordProgress: { ...prev.wordProgress, [wordKey]: updated },
            }
        })
    }, [])

    const addXp = useCallback((amount: number) => {
        // XP also earns coins (1 coin per 2 XP)
        const coinBonus = Math.floor(amount / 2)
        setState(prev => ({ ...prev, xp: prev.xp + amount, coins: prev.coins + coinBonus }))
    }, [])

    const addCoins = useCallback((amount: number) => {
        setState(prev => ({ ...prev, coins: prev.coins + amount }))
    }, [])

    const purchase = useCallback((itemId: string, price: number): boolean => {
        let success = false
        setState(prev => {
            if (prev.coins < price) return prev
            success = true
            return {
                ...prev,
                coins: prev.coins - price,
                purchasedItems: [...prev.purchasedItems, itemId],
            }
        })
        return success
    }, [])

    const useItem = useCallback((itemId: string): boolean => {
        let used = false
        setState(prev => {
            const idx = prev.purchasedItems.indexOf(itemId)
            if (idx === -1) return prev
            used = true
            const items = [...prev.purchasedItems]
            items.splice(idx, 1)
            return { ...prev, purchasedItems: items }
        })
        return used
    }, [])

    const hasItem = useCallback((itemId: string): boolean => {
        return state.purchasedItems.includes(itemId)
    }, [state.purchasedItems])

    const getDue = useCallback(() => {
        return getDueWords(state.wordProgress)
    }, [state.wordProgress])

    const getMastery = useCallback((keys: string[]) => {
        return getMasteryPercent(keys, state.wordProgress)
    }, [state.wordProgress])

    const recordPractice = useCallback(() => {
        setState(prev => {
            const t = today()
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            const newStreak = prev.lastPracticeDate === yesterday ? prev.streak + 1
                : prev.lastPracticeDate === t ? prev.streak
                    : 1
            return { ...prev, streak: newStreak, lastPracticeDate: t }
        })
    }, [])

    return (
        <ProgressContext.Provider value={{
            ...state,
            grade,
            addXp,
            addCoins,
            purchase,
            useItem,
            hasItem,
            getDue,
            getMastery,
            recordPractice,
        }}>
            {children}
        </ProgressContext.Provider>
    )
}

export function useProgress() {
    const ctx = useContext(ProgressContext)
    if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
    return ctx
}
