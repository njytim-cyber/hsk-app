/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { GridStyle } from '../components/writing/CharacterCanvas'
import { load, save } from '../utils/storage'

interface Settings {
    /** Grid paper style for writing practice */
    gridStyle: GridStyle
    /** Show pinyin: 'always' | 'hint' | 'never' */
    pinyinMode: 'always' | 'hint' | 'never'
    /** Show English translation */
    showEnglish: boolean
    /** Auto-play audio on new word */
    autoPlayAudio: boolean
    /** Selected voice ID */
    voiceId: string
}

interface SettingsContextValue extends Settings {
    update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const STORAGE_KEY = 'settings'
const defaults: Settings = {
    gridStyle: 'tianzige',
    pinyinMode: 'always',
    showEnglish: true,
    autoPlayAudio: false,
    voiceId: '',
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => load(STORAGE_KEY, defaults))

    useEffect(() => {
        save(STORAGE_KEY, settings)
    }, [settings])

    const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }, [])

    return (
        <SettingsContext.Provider value={{ ...settings, update }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const ctx = useContext(SettingsContext)
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
    return ctx
}
