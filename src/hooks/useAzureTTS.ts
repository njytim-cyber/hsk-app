import { useRef, useState, useCallback } from 'react'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

/** Available Azure Chinese voices — ported from chinese-tingxie */
export const AZURE_VOICES = [
    {
        id: 'zh-CN-XiaoxiaoNeural',
        name: '晓晓 (Xiaoxiao)',
        gender: 'female' as const,
        description: '阳光、温柔、活泼，适合多种场景',
        tags: ['Popular', 'Warm'],
        avatarIndex: 31,
    },
    {
        id: 'zh-CN-YunjianNeural',
        name: '云健 (Yunjian)',
        gender: 'male' as const,
        description: '深沉、自然、引人入胜，很有感染力',
        tags: ['Deep', 'Narration', 'Popular'],
        avatarIndex: 26,
    },
    {
        id: 'zh-CN-XiaoyuMultilingualNeural',
        name: '晓雨 (Xiaoyu)',
        gender: 'female' as const,
        description: '自信、从容、亲切，多语言能力强',
        tags: ['Multilingual', 'Chat', 'Popular'],
        avatarIndex: 53,
    },
    {
        id: 'zh-CN-YunyeNeural',
        name: '云野 (Yunye)',
        gender: 'male' as const,
        description: '稳重、放松，适合故事和有声书',
        tags: ['Mature', 'Audiobook', 'Popular'],
        avatarIndex: 58,
    },
    {
        id: 'zh-CN-Xiaoshuang:DragonHDFlashLatestNeural',
        name: '晓双 (Xiaoshuang)',
        gender: 'female' as const,
        description: '可爱、俏皮，双语能力极佳 (HD Flash)',
        tags: ['Cute', 'Bilingual', 'Flash'],
        avatarIndex: 61,
    },
    {
        id: 'zh-CN-Yunxia:DragonHDFlashLatestNeural',
        name: '云希 (Yunxia)',
        gender: 'male' as const,
        description: '活泼、充满活力、充满动力 (HD Flash)',
        tags: ['Animated', 'Energetic', 'Flash'],
        avatarIndex: 48,
    },
] as const

export type AzureVoiceId = typeof AZURE_VOICES[number]['id']

interface UseAzureTTSOptions {
    subscriptionKey?: string
    region?: string
    voiceId?: AzureVoiceId
}

interface UseAzureTTSReturn {
    speak: (text: string) => Promise<void>
    stop: () => void
    isSpeaking: boolean
    isAvailable: boolean
}

/**
 * Speak using browser's built-in SpeechSynthesis API as fallback
 */
function speakWithBrowserTTS(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
            reject(new Error('SpeechSynthesis not available'))
            return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.85

        // Try to find a Chinese voice
        const voices = window.speechSynthesis.getVoices()
        const chineseVoice = voices.find(v => v.lang.startsWith('zh'))
        if (chineseVoice) utterance.voice = chineseVoice

        utterance.onend = () => resolve()
        utterance.onerror = (e) => reject(e)
        window.speechSynthesis.speak(utterance)
    })
}

export function useAzureTTS(options: UseAzureTTSOptions = {}): UseAzureTTSReturn {
    const { subscriptionKey, region = 'southeastasia', voiceId = 'zh-CN-XiaoxiaoNeural' } = options
    const synthesizerRef = useRef<sdk.SpeechSynthesizer | null>(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const isAvailable = !!subscriptionKey

    const getOrCreateSynthesizer = useCallback(() => {
        if (!subscriptionKey) return null

        if (!synthesizerRef.current) {
            const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region)
            speechConfig.speechSynthesisVoiceName = voiceId
            speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3

            const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()
            synthesizerRef.current = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
        }

        return synthesizerRef.current
    }, [subscriptionKey, region, voiceId])

    const speak = useCallback(async (text: string) => {
        if (isSpeaking) return

        setIsSpeaking(true)

        try {
            const synthesizer = getOrCreateSynthesizer()

            if (synthesizer) {
                // Azure TTS
                await new Promise<void>((resolve, reject) => {
                    synthesizer.speakTextAsync(
                        text,
                        (result) => {
                            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                                resolve()
                            } else {
                                reject(new Error('Speech synthesis failed'))
                            }
                        },
                        (error) => reject(error)
                    )
                })
            } else {
                // Browser fallback
                await speakWithBrowserTTS(text)
            }
        } catch {
            // If Azure fails, try browser fallback
            try {
                await speakWithBrowserTTS(text)
            } catch {
                // Silently fail — don't block the user's flow
            }
        } finally {
            setIsSpeaking(false)
        }
    }, [isSpeaking, getOrCreateSynthesizer])

    const stop = useCallback(() => {
        synthesizerRef.current?.close()
        synthesizerRef.current = null
        window.speechSynthesis?.cancel()
        setIsSpeaking(false)
    }, [])

    return { speak, stop, isSpeaking, isAvailable }
}
