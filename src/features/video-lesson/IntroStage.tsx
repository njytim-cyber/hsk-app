import { useCallback, useEffect, useState } from 'react'
import type { VideoLessonConfig } from './videoLessonData'
import { useAudio } from '../../contexts/AudioContext'
import './IntroStage.css'

interface IntroStageProps {
    data: VideoLessonConfig
    unitEmoji: string
    onStart: () => void
}

export function IntroStage({ data, unitEmoji, onStart }: IntroStageProps) {
    const { speak, isSpeaking } = useAudio()
    const [hasPlayed, setHasPlayed] = useState(false)

    // Auto-play sentence on mount
    useEffect(() => {
        if (hasPlayed) return
        const timer = setTimeout(async () => {
            setHasPlayed(true)
            try { await speak(data.sentence) } catch { /* ok */ }
        }, 600)
        return () => clearTimeout(timer)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleListen = useCallback(async () => {
        if (isSpeaking) return
        try { await speak(data.sentence) } catch { /* ok */ }
    }, [speak, isSpeaking, data.sentence])

    const targetWords = data.words.filter(w => w.isTarget)

    return (
        <div className="intro-stage">
            <div className="intro-stage__hero">
                <span className="intro-stage__emoji">{unitEmoji}</span>
                <h2 className="intro-stage__title">{data.title}</h2>
                <p className="intro-stage__title-en">{data.titleEn}</p>
            </div>

            {/* The sentence */}
            <div className="intro-stage__sentence-card">
                <p className="intro-stage__sentence">{data.sentence}</p>
                <p className="intro-stage__sentence-en">{data.sentenceEn}</p>
                <button
                    className="intro-stage__listen-btn"
                    onClick={handleListen}
                    disabled={isSpeaking}
                >
                    {isSpeaking ? '🔊 Playing…' : '🔊 Listen again'}
                </button>
            </div>

            {/* Target vocabulary preview */}
            <div className="intro-stage__vocab">
                <span className="intro-stage__vocab-label">Key phrases</span>
                <div className="intro-stage__vocab-list">
                    {targetWords.map((w, i) => (
                        <div key={i} className="intro-vocab-chip">
                            <span className="intro-vocab-chip__hanzi">{w.hanzi}</span>
                            <span className="intro-vocab-chip__meta">{w.pinyin} · {w.english}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video description placeholder */}
            {data.videoDescription && (
                <div className="intro-stage__video-note">
                    <span className="intro-stage__video-icon">🎬</span>
                    <span className="intro-stage__video-desc">{data.videoDescription}</span>
                </div>
            )}

            <button className="intro-stage__start-btn" onClick={onStart}>
                Start Practice
                <span className="intro-stage__start-arrow">→</span>
            </button>
        </div>
    )
}
