import { useCallback, useEffect, useState } from 'react'
import type { VideoLessonConfig } from './videoLessonData'
import { useAudio } from '../../contexts/AudioContext'
import './IntroStage.css'

interface IntroStageProps {
    data: VideoLessonConfig
    onStart: () => void
}

export function IntroStage({ data, onStart }: IntroStageProps) {
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
                <div className="intro-stage__badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                </div>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                    {isSpeaking ? 'Playing…' : 'Listen again'}
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
                    <span className="intro-stage__video-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg></span>
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
