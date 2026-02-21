import { useState, useRef, useCallback, useEffect } from 'react'
import type { VideoLessonConfig, SubtitleWord } from './videoLessonData'
import { useAudio } from '../../contexts/AudioContext'
import './PhoneticStage.css'

interface PhoneticStageProps {
    data: VideoLessonConfig
    onComplete: (score: number) => void
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'evaluated'

export function PhoneticStage({ data, onComplete }: PhoneticStageProps) {
    const { speak, isSpeaking } = useAudio()
    const [recordingState, setRecordingState] = useState<RecordingState>('idle')
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [wordResults, setWordResults] = useState<Record<number, boolean>>({})
    const [activeWord, setActiveWord] = useState<number | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const hasAutoPlayed = useRef(false)

    const meaningfulWords = data.words.filter(
        w => w.hanzi.trim() && !/^[，。！？、；：]$/.test(w.hanzi)
    )

    // Auto-play full sentence on mount
    useEffect(() => {
        if (hasAutoPlayed.current) return
        hasAutoPlayed.current = true
        const timer = setTimeout(async () => {
            try { await speak(data.sentence) } catch { /* ok */ }
        }, 500)
        return () => clearTimeout(timer)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const speakWord = useCallback(async (word: SubtitleWord, index: number) => {
        if (isSpeaking) return
        setActiveWord(index)
        try { await speak(word.hanzi) } catch { /* ok */ }
        finally { setActiveWord(null) }
    }, [speak, isSpeaking])

    const speakFullSentence = useCallback(async () => {
        if (isSpeaking) return
        try { await speak(meaningfulWords.map(w => w.hanzi).join('')) } catch { /* ok */ }
    }, [speak, isSpeaking, meaningfulWords])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                setAudioUrl(URL.createObjectURL(blob))
                setRecordingState('recorded')
                stream.getTracks().forEach(t => t.stop())
            }
            mediaRecorder.start()
            setRecordingState('recording')
        } catch { console.warn('Mic denied') }
    }

    const stopRecording = () => { mediaRecorderRef.current?.stop() }

    const playback = () => {
        if (!audioUrl) return
        new Audio(audioUrl).play()
    }

    const simulateEvaluation = () => {
        const results: Record<number, boolean> = {}
        meaningfulWords.forEach((_, i) => { results[i] = Math.random() > 0.2 })
        setWordResults(results)
        setRecordingState('evaluated')
    }

    const score = Object.values(wordResults).filter(Boolean).length
    const total = meaningfulWords.length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0

    return (
        <div className="phonetic-stage">
            <header className="stage-header">
                <h2 className="stage-title">Listening & Speaking</h2>
            </header>

            {/* Sentence translation for learners */}
            <p className="phonetic-stage__translation">{data.sentenceEn}</p>

            {/* Tap word tiles to hear them */}
            <div className="phonetic-stage__sentence-card">
                <div className="phonetic-stage__words">
                    {meaningfulWords.map((word, i) => {
                        const result = wordResults[i]
                        const isListening = activeWord === i
                        const resultClass = recordingState === 'evaluated'
                            ? result ? 'word-tile--correct' : 'word-tile--incorrect'
                            : ''
                        return (
                            <button
                                key={i}
                                className={`word-tile ${resultClass} ${isListening ? 'word-tile--listening' : ''}`}
                                onClick={() => speakWord(word, i)}
                                disabled={isSpeaking && activeWord !== i}
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <span className="word-tile__pinyin">{word.pinyin}</span>
                                <span className="word-tile__hanzi">{word.hanzi}</span>
                                {isListening && <span className="word-tile__speaker"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg></span>}
                                {recordingState === 'evaluated' && (
                                    <span className="word-tile__indicator">{result ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="phonetic-stage__controls phonetic-stage__controls--minimal">
                {recordingState === 'idle' && (
                    <div className="phonetic-stage__simplified-actions">
                        {/* Listen Button (Speaker) */}
                        <button
                            className={`icon-button icon-button--listen ${isSpeaking ? 'icon-button--speaking' : ''}`}
                            onClick={speakFullSentence}
                            disabled={isSpeaking}
                            aria-label="Listen to Sentence"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                        </button>

                        {/* Speak Button (Mic) */}
                        <button
                            className="icon-button icon-button--mic"
                            onClick={startRecording}
                            aria-label="Tap to Speak"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                        </button>
                    </div>
                )}

                {recordingState === 'recording' && (
                    <div className="recording-container">
                        <div className="recording-waves">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                        <button className="action-pill action-pill--danger" onClick={stopRecording}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" ry="2" /></svg>
                            Stop Recording
                        </button>
                    </div>
                )}

                {recordingState === 'recorded' && (
                    <div className="phonetic-stage__actions animate-fade-in">
                        <button className="action-pill action-pill--secondary" onClick={playback}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            Listen back
                        </button>
                        <button className="action-pill action-pill--primary" onClick={simulateEvaluation}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 12 5 5L22 4" /></svg>
                            Check Accuracy
                        </button>
                    </div>
                )}

                {recordingState === 'evaluated' && (
                    <div className="phonetic-stage__result animate-fade-up">
                        <div className="score-ring">
                            <svg viewBox="0 0 72 72">
                                <circle cx="36" cy="36" r="32" className="score-ring__bg" />
                                <circle cx="36" cy="36" r="32" className="score-ring__fill" style={{ strokeDasharray: `${pct * 2.01} 201` }} />
                            </svg>
                            <span className="score-ring__value">{pct}%</span>
                        </div>
                        <button className="continue-btn" onClick={() => onComplete(pct)}>
                            <span>Continue</span><span className="continue-btn__arrow">→</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
