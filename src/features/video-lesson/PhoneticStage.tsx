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
    const [showPinyin, setShowPinyin] = useState(true)
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
                                <span className="word-tile__pinyin" style={{ visibility: showPinyin ? 'visible' : 'hidden' }}>{word.pinyin}</span>
                                <span className="word-tile__hanzi">{word.hanzi}</span>
                                {isListening && <span className="word-tile__speaker">🔊</span>}
                                {recordingState === 'evaluated' && (
                                    <span className="word-tile__indicator">{result ? '✓' : '✗'}</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="phonetic-stage__controls">
                {recordingState === 'idle' && (
                    <>
                        <button className="listen-sentence-btn" onClick={speakFullSentence} disabled={isSpeaking}>
                            {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
                        </button>
                        <button className="listen-sentence-btn" onClick={() => setShowPinyin(p => !p)}>
                            {showPinyin ? '🙈 Hide Pinyin' : '👀 Show Pinyin'}
                        </button>
                        <button className="mic-btn mic-btn--start" onClick={startRecording}>
                            <span className="mic-btn__icon">🎙️</span>
                        </button>
                        <span className="phonetic-stage__hint">Tap words to hear, then record yourself</span>
                    </>
                )}

                {recordingState === 'recording' && (
                    <div className="recording-container">
                        <div className="recording-waves">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                        <button className="mic-btn mic-btn--recording" onClick={stopRecording}>
                            <span className="mic-btn__icon">⏹️</span>
                        </button>
                    </div>
                )}

                {recordingState === 'recorded' && (
                    <div className="phonetic-stage__actions animate-fade-in">
                        <button className="action-pill action-pill--secondary" onClick={playback}>▶️ Listen</button>
                        <button className="action-pill action-pill--primary" onClick={simulateEvaluation}>✨ Check</button>
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
