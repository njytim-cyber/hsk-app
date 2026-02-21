import { useState, useCallback, useRef } from 'react'
import { hskLevels, getWordsForLevel } from '../../data'
import type { HSKWord } from '../../data/types'
import type { HanziWriterCallbacks } from '../../hooks/useHanziWriter'
import { useProgress } from '../../contexts/ProgressContext'
import { useAudio } from '../../contexts/AudioContext'
import { useSettings } from '../../contexts/SettingsContext'
import { PinyinCharacter } from '../../components/display/PinyinCharacter'
import { CharacterCanvas } from '../../components/writing/CharacterCanvas'
import { ProgressBar } from '../../components/common/ProgressBar'
import './WritePage.css'

type WriteView =
    | { mode: 'select' }
    | { mode: 'practice'; words: HSKWord[]; index: number }

export function WritePage() {
    const [view, setView] = useState<WriteView>({ mode: 'select' })
    const [strokesDone, setStrokesDone] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [showOutline, setShowOutline] = useState(false)
    const quizRef = useRef<{ quiz: (cb?: HanziWriterCallbacks) => void; reveal: () => void } | null>(null)
    const { grade, addXp, recordPractice } = useProgress()
    const { speak } = useAudio()
    const { gridStyle, pinyinMode, showEnglish } = useSettings()

    const startPractice = useCallback((level: 1 | 2 | 3 | 4) => {
        const words = getWordsForLevel(level).slice(0, 10)
        if (words.length === 0) return
        setView({ mode: 'practice', words, index: 0 })
        setStrokesDone(0)
        setMistakes(0)
        setCompleted(false)
        setShowHint(false)
        setShowOutline(false)
    }, [])

    const handleQuizReady = useCallback((controls: { quiz: (cb?: HanziWriterCallbacks) => void; reveal: () => void; highlightStroke: (n: number) => void }) => {
        quizRef.current = controls
        controls.quiz({
            onCorrectStroke: () => setStrokesDone(s => s + 1),
            onMistake: () => setMistakes(m => m + 1),
            onComplete: () => {
                setView(prev => {
                    if (prev.mode !== 'practice') return prev
                    const word = prev.words[prev.index]
                    const quality = mistakes === 0 ? 5 : mistakes <= 2 ? 4 : mistakes <= 5 ? 3 : 2
                    grade(word.hanzi, quality)

                    if (prev.index + 1 >= prev.words.length) {
                        addXp(prev.words.length * 3)
                        recordPractice()
                        setCompleted(true)
                        return prev
                    }

                    setStrokesDone(0)
                    setMistakes(0)
                    setShowHint(false)
                    setShowOutline(false)
                    return { ...prev, index: prev.index + 1 }
                })
            },
        })
    }, [grade, addXp, recordPractice, mistakes])

    const usePinyinHint = useCallback(() => {
        setShowHint(true)
    }, [])

    const useOutlineHint = useCallback(() => {
        setShowOutline(true)
    }, [])

    const useStrokeHint = useCallback(() => {
        if (quizRef.current) {
            quizRef.current.reveal()
        }
    }, [])

    if (view.mode === 'select') {
        return (
            <div className="page-write animate-slide-up">
                <h2 className="write-title">写字练习</h2>
                <p className="write-subtitle">Practice writing Chinese characters</p>
                <div className="write-level-grid">
                    {hskLevels.map(level => (
                        <button
                            key={level.level}
                            className="write-level-btn"
                            disabled={level.totalWords === 0}
                            onClick={() => startPractice(level.level)}
                            style={{ '--level-color': level.color } as React.CSSProperties}
                        >
                            <span className="write-level-badge" style={{ background: level.color }}>
                                {level.level}
                            </span>
                            <span className="write-level-label">{level.label}</span>
                            {level.totalWords === 0 && <span className="write-coming-soon">Soon</span>}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (completed) {
        return (
            <div className="page-write">
                <div className="write-complete animate-stamp-in">
                    <span className="complete-emoji"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 12 5 5L22 4" /></svg></span>
                    {mistakes === 0 && <div className="success-stamp-overlay">正</div>}
                    <h2 className="complete-title">练习完成！</h2>
                    <p className="complete-subtitle">Writing practice complete!</p>
                    <div className="complete-xp animate-xp-float">+{view.words.length * 3} XP</div>
                    <button className="btn btn-primary btn-lg" onClick={() => setView({ mode: 'select' })}>
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    const word = view.words[view.index]
    const progress = (view.index / view.words.length) * 100
    const pinyinVisible = pinyinMode === 'always' || (pinyinMode === 'hint' && showHint)

    return (
        <div className="page-write">
            <div className="write-header">
                <button className="back-btn" onClick={() => setView({ mode: 'select' })}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg></button>
                <ProgressBar value={progress} color="var(--hsk-jade)" />
                <span className="session-counter">{view.index + 1}/{view.words.length}</span>
            </div>

            <div className="write-word-info">
                <PinyinCharacter
                    hanzi={word.hanzi}
                    pinyin={word.pinyin}
                    showPinyin={pinyinVisible}
                    size="md"
                />
                {showEnglish && <span className="write-english">{word.english}</span>}
                <button className="write-audio" onClick={() => speak(word.hanzi)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg></button>
            </div>

            <CharacterCanvas
                character={word.hanzi}
                gridStyle={gridStyle}
                showOutline={showOutline}
                onQuizReady={handleQuizReady}
            />

            <div className="write-stroke-info">
                <span className="stroke-count">Strokes: {strokesDone}</span>
                {mistakes > 0 && <span className="mistake-count animate-shake">Mistakes: {mistakes}</span>}
            </div>

            <div className="write-hints">
                {pinyinMode === 'hint' && !showHint && (
                    <button
                        className="hint-btn"
                        onClick={usePinyinHint}
                        title="Show pinyin"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'text-bottom' }}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>拼音
                    </button>
                )}
                {!showOutline && (
                    <button
                        className="hint-btn"
                        onClick={useOutlineHint}
                        title="Show outline"
                    >
                        🔍 轮廓
                    </button>
                )}
                <button
                    className="hint-btn"
                    onClick={useStrokeHint}
                    title="Reveal character"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'text-bottom' }}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>笔画
                </button>
            </div>
        </div>
    )
}
