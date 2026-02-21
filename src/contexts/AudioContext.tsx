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

    // Azure key can come from env or settings
    const subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY as string | undefined
    const region = (import.meta.env.VITE_AZURE_SPEECH_REGION as string) || 'southeastasia'

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
