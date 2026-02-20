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
    const { grade, addXp, recordPractice, useItem, purchasedItems } = useProgress()
    const { speak } = useAudio()
    const { gridStyle, pinyinMode, showEnglish } = useSettings()

    // Count owned hints
    const pinyinHints = purchasedItems.filter(id => id === 'hint_pinyin').length
    const outlineHints = purchasedItems.filter(id => id === 'hint_outline').length
    const strokeHints = purchasedItems.filter(id => id === 'hint_stroke').length

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
        if (useItem('hint_pinyin')) setShowHint(true)
    }, [useItem])

    const useOutlineHint = useCallback(() => {
        if (useItem('hint_outline')) setShowOutline(true)
    }, [useItem])

    const useStrokeHint = useCallback(() => {
        if (useItem('hint_stroke') && quizRef.current) {
            quizRef.current.reveal()
        }
    }, [useItem])

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
                    <span className="complete-emoji">✍️</span>
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
                <button className="back-btn" onClick={() => setView({ mode: 'select' })}>✕</button>
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
                <button className="write-audio" onClick={() => speak(word.hanzi)}>🔊</button>
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
                        disabled={pinyinHints === 0}
                        title="Show pinyin"
                    >
                        💡 拼音
                        {pinyinHints > 0 && <span className="hint-badge">{pinyinHints}</span>}
                    </button>
                )}
                {!showOutline && (
                    <button
                        className="hint-btn"
                        onClick={useOutlineHint}
                        disabled={outlineHints === 0}
                        title="Show outline"
                    >
                        🔍 轮廓
                        {outlineHints > 0 && <span className="hint-badge">{outlineHints}</span>}
                    </button>
                )}
                <button
                    className="hint-btn"
                    onClick={useStrokeHint}
                    disabled={strokeHints === 0}
                    title="Reveal character"
                >
                    ✏️ 笔画
                    {strokeHints > 0 && <span className="hint-badge">{strokeHints}</span>}
                </button>
            </div>
        </div>
    )
}
