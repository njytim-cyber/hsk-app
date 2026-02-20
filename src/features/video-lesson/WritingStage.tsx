import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { VideoLessonConfig } from './videoLessonData'
import { CharacterCanvas } from '../../components/writing/CharacterCanvas'
import type { HanziWriterCallbacks } from '../../hooks/useHanziWriter'
import './WritingStage.css'

interface WritingStageProps {
    data: VideoLessonConfig
    onComplete: (accuracy: number) => void
}

interface CharControls {
    quiz: (cb?: HanziWriterCallbacks) => void
    reveal: () => void
    highlightStroke: (n: number) => void
    animateCharacter: () => Promise<void>
}

export function WritingStage({ data, onComplete }: WritingStageProps) {
    const [activeCharIndex, setActiveCharIndex] = useState(0)
    const [completedChars, setCompletedChars] = useState<boolean[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [totalStrokes, setTotalStrokes] = useState(0)
    const [strokeProgress, setStrokeProgress] = useState(0)
    const [currentStroke, setCurrentStroke] = useState(0)
    const [quizReady, setQuizReady] = useState(false)
    const [quizStarted, setQuizStarted] = useState(false)
    const controlsRef = useRef<CharControls | null>(null)

    const chars = data.writingTarget
    const allDone = completedChars.length === chars.length

    // Group chars into target words for display
    const targetWords = useMemo(() => {
        const words = data.words.filter(w => w.isTarget)
        return words.map(w => ({
            hanzi: w.hanzi,
            pinyin: w.pinyin,
            english: w.english,
        }))
    }, [data.words])

    // Reset controls + quiz state when character changes
    useEffect(() => {
        controlsRef.current = null
        setQuizReady(false)
        setQuizStarted(false)
        setStrokeProgress(0)
        setCurrentStroke(0)
    }, [activeCharIndex])

    // Called by CharacterCanvas when HanziWriter is loaded
    const handleQuizReady = useCallback((controls: CharControls) => {
        controlsRef.current = controls
        setQuizReady(true)
    }, [])

    // Auto-start quiz when controls are ready
    useEffect(() => {
        if (!quizReady || quizStarted || allDone) return
        const controls = controlsRef.current
        if (!controls) return

        const timer = setTimeout(async () => {
            // Show stroke-order preview first
            await controls.animateCharacter()
            // Then start the quiz
            setQuizStarted(true)
            controls.quiz({
                onCorrectStroke: (d) => {
                    try { navigator.vibrate?.(20) } catch { /* ok */ }
                    setTotalStrokes(d.totalStrokes)
                    setStrokeProgress(d.strokeNum + 1)
                    setCurrentStroke(d.strokeNum + 1)
                },
                onMistake: () => {
                    try { navigator.vibrate?.([15, 30, 15]) } catch { /* ok */ }
                    setMistakes(prev => prev + 1)
                },
                onComplete: () => {
                    try { navigator.vibrate?.([40, 40, 80]) } catch { /* ok */ }
                    setCompletedChars(prev => [...prev, true])
                    // Auto-advance to next character after brief pause
                    setTimeout(() => {
                        setActiveCharIndex(prev => {
                            if (prev < chars.length - 1) return prev + 1
                            return prev
                        })
                    }, 600)
                },
            })
        }, 400)
        return () => clearTimeout(timer)
    }, [quizReady, quizStarted, allDone, chars.length])

    // Auto-advance to completion when all done
    useEffect(() => {
        if (allDone) {
            const accuracy = totalStrokes > 0
                ? Math.round(((totalStrokes - mistakes) / totalStrokes) * 100)
                : 100
            const timer = setTimeout(() => onComplete(accuracy), 1200)
            return () => clearTimeout(timer)
        }
    }, [allDone, totalStrokes, mistakes, onComplete])

    const handleHint = () => {
        if (!controlsRef.current || !quizStarted) return
        controlsRef.current.highlightStroke(currentStroke)
    }

    const handleReveal = () => {
        if (!controlsRef.current) return
        controlsRef.current.reveal()
        setQuizStarted(false)
        setCompletedChars(prev => [...prev, true])
        setTimeout(() => {
            if (activeCharIndex < chars.length - 1) setActiveCharIndex(prev => prev + 1)
        }, 600)
    }

    return (
        <div className="writing-stage">
            {/* Target words with translations */}
            <div className="writing-stage__targets">
                {targetWords.map((w, i) => (
                    <div key={i} className="writing-stage__target-word">
                        <span className="writing-stage__target-hanzi">{w.hanzi}</span>
                        <span className="writing-stage__target-meta">{w.pinyin} · {w.english}</span>
                    </div>
                ))}
            </div>

            {/* Character pills — compact row */}
            <div className="writing-stage__char-pills">
                {chars.map((char, i) => (
                    <div
                        key={i}
                        className={[
                            'char-pill',
                            i === activeCharIndex && !allDone ? 'char-pill--active' : '',
                            completedChars[i] ? 'char-pill--done' : '',
                        ].join(' ')}
                    >
                        <span className="char-pill__char">{char}</span>
                        {completedChars[i] && <span className="char-pill__check">✓</span>}
                    </div>
                ))}
            </div>

            {!allDone && (
                <div className="writing-stage__canvas-area">
                    <CharacterCanvas
                        key={activeCharIndex}
                        character={chars[activeCharIndex]}
                        gridStyle="mizige"
                        showOutline={true}
                        showCharacter={false}
                        onQuizReady={handleQuizReady}
                        className="writing-stage__canvas"
                    />

                    {/* Stroke progress */}
                    <div className="writing-stage__stroke-bar">
                        <div className="writing-stage__stroke-fill" style={{ width: totalStrokes > 0 ? `${(strokeProgress / totalStrokes) * 100}%` : '0%' }} />
                    </div>

                    {/* Hint / Reveal */}
                    <div className="writing-stage__toolbar">
                        <button className="writing-tool-btn" onClick={handleHint} disabled={!quizStarted}>💡 Hint</button>
                        {mistakes > 0 && <span className="writing-stage__mistake-count">{mistakes} mistake{mistakes !== 1 ? 's' : ''}</span>}
                        <button className="writing-tool-btn" onClick={handleReveal} disabled={!quizStarted}>👁️ Show</button>
                    </div>
                </div>
            )}

            {allDone && (
                <div className="writing-stage__complete animate-fade-up">
                    <span className="writing-stage__stamp">正</span>
                </div>
            )}
        </div>
    )
}
