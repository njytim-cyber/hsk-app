/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'
import { useAzureTTS, type AzureVoiceId } from '../hooks/useAzureTTS'
import { useSettings } from './SettingsContext'

interface AudioContextValue {
    speak: (text: string) => Promise<void>
    stop: () => void
    isSpeaking: boolean
    isAzureAvailable: boolean
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
    const { voiceId } = useSettings()

    // Speech config: prefer runtime injection over build-time env vars.
    // In production, inject via a server endpoint or window.__SPEECH_CONFIG__.
    // The VITE_ env var is kept ONLY as a local dev convenience.
    const speechConfig = (window as unknown as Record<string, unknown>).__SPEECH_CONFIG__ as
        { key?: string; region?: string } | undefined

    const subscriptionKey = speechConfig?.key
        ?? (import.meta.env.VITE_AZURE_SPEECH_KEY as string | undefined)
    const region = speechConfig?.region
        ?? ((import.meta.env.VITE_AZURE_SPEECH_REGION as string) || 'southeastasia')

    const { speak, stop, isSpeaking, isAvailable } = useAzureTTS({
        subscriptionKey,
        region,
        voiceId: (voiceId || 'zh-CN-XiaoxiaoNeural') as AzureVoiceId,
    })

    return (
        <AudioCtx.Provider value={{ speak, stop, isSpeaking, isAzureAvailable: isAvailable }}>
            {children}
        </AudioCtx.Provider>
    )
}

export function useAudio() {
    const ctx = useContext(AudioCtx)
    if (!ctx) throw new Error('useAudio must be used within AudioProvider')
    return ctx
}
