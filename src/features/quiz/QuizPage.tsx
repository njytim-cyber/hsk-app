import { useState, useCallback } from 'react'
import { hskLevels, getWordsForLevel } from '../../data'
import type { HSKWord } from '../../data/types'
import { useProgress } from '../../contexts/ProgressContext'
import { useAudio } from '../../contexts/AudioContext'
import { PinyinCharacter } from '../../components/display/PinyinCharacter'
import { ProgressBar } from '../../components/common/ProgressBar'
import './QuizPage.css'

type QuizView =
    | { mode: 'select' }
    | { mode: 'quiz'; words: HSKWord[]; index: number }

export function QuizPage() {
    const [view, setView] = useState<QuizView>({ mode: 'select' })
    const [input, setInput] = useState('')
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
    const [score, setScore] = useState({ correct: 0, wrong: 0 })
    const [completed, setCompleted] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)
    const { grade, addXp, recordPractice } = useProgress()
    const { speak } = useAudio()

    const startQuiz = useCallback((level: 1 | 2 | 3 | 4) => {
        const allWords = getWordsForLevel(level)
        // Shuffle and pick 10
        const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 10)
        if (shuffled.length === 0) return
        setView({ mode: 'quiz', words: shuffled, index: 0 })
        setInput('')
        setFeedback(null)
        setScore({ correct: 0, wrong: 0 })
        setCompleted(false)
        setShowAnswer(false)
        // Auto-play first word
        setTimeout(() => speak(shuffled[0].hanzi), 500)
    }, [speak])

    const checkAnswer = useCallback(() => {
        if (view.mode !== 'quiz') return
        const word = view.words[view.index]
        const isCorrect = input.trim() === word.hanzi

        setFeedback(isCorrect ? 'correct' : 'wrong')
        setShowAnswer(true)
        grade(word.hanzi, isCorrect ? 5 : 1)

        if (isCorrect) {
            setScore(s => ({ ...s, correct: s.correct + 1 }))
        } else {
            setScore(s => ({ ...s, wrong: s.wrong + 1 }))
        }
    }, [view, input, grade])

    const nextWord = useCallback(() => {
        if (view.mode !== 'quiz') return

        if (view.index + 1 >= view.words.length) {
            addXp(score.correct * 5)
            recordPractice()
            setCompleted(true)
            return
        }

        const nextIndex = view.index + 1
        setView({ ...view, index: nextIndex })
        setInput('')
        setFeedback(null)
        setShowAnswer(false)
        // Auto-play next word
        setTimeout(() => speak(view.words[nextIndex].hanzi), 300)
    }, [view, score, addXp, recordPractice, speak])

    if (view.mode === 'select') {
        return (
            <div className="page-quiz animate-slide-up">
                <h2 className="quiz-title">听写测验</h2>
                <p className="quiz-subtitle">Listen and type the character you hear</p>
                <div className="quiz-level-grid">
                    {hskLevels.map(level => (
                        <button
                            key={level.level}
                            className="quiz-level-btn"
                            disabled={level.totalWords === 0}
                            onClick={() => startQuiz(level.level)}
                        >
                            <span className="quiz-level-badge" style={{ background: level.color }}>{level.level}</span>
                            <span>{level.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (completed) {
        const accuracy = Math.round((score.correct / view.words.length) * 100)
        const isPerfect = accuracy === 100
        return (
            <div className="page-quiz">
                <div className="quiz-complete animate-stamp-in">
                    <span className="complete-emoji">
                        {isPerfect ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--hsk-gold)" strokeWidth="2"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>
                        ) : accuracy >= 80 ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--hsk-jade)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        ) : accuracy >= 50 ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--hsk-ink-light)" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                        ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--tang-red)" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        )}
                    </span>
                    {isPerfect && <div className="success-stamp-overlay">正</div>}
                    <h2 className="complete-title">{isPerfect ? '满分！' : accuracy >= 80 ? '太棒了！' : accuracy >= 50 ? '不错！' : '继续加油！'}</h2>
                    <div className="quiz-accuracy">{accuracy}%</div>
                    <div className="complete-stats">
                        <div className="stat-item stat-known animate-stat-slide">
                            <span className="stat-value">{score.correct}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat-item stat-learning animate-stat-slide" style={{ animationDelay: '100ms' }}>
                            <span className="stat-value">{score.wrong}</span>
                            <span className="stat-label">To review</span>
                        </div>
                    </div>
                    <div className="complete-xp animate-xp-float">+{score.correct * 5} XP</div>
                    <button className="btn btn-primary btn-lg" onClick={() => setView({ mode: 'select' })}>
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    const word = view.words[view.index]
    const progress = (view.index / view.words.length) * 100

    return (
        <div className="page-quiz">
            <header className="stage-header">
                <h2 className="stage-title">Knowledge Check</h2>
            </header>
            <div className="quiz-header">
                <button className="back-btn" onClick={() => setView({ mode: 'select' })}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg></button>
                <ProgressBar value={progress} color="var(--hsk-jade)" />
                <span className="session-counter">{view.index + 1}/{view.words.length}</span>
            </div>

            <div className="quiz-play-area">
                <button className="quiz-play-btn" onClick={() => speak(word.hanzi)}>
                    <span className="play-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg></span>
                    <span className="play-label">Tap to listen</span>
                </button>
            </div>

            {showAnswer && (
                <div className={`quiz-answer-reveal animate-slide-up ${feedback}`}>
                    <PinyinCharacter
                        hanzi={word.hanzi}
                        pinyin={word.pinyin}
                        showPinyin={true}
                        size="lg"
                    />
                    <span className="answer-english">{word.english}</span>
                    {feedback === 'correct' && <span className="answer-stamp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hsk-jade)" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg></span>}
                    {feedback === 'wrong' && <span className="answer-correction"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tang-red)" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></span>}
                </div>
            )}

            <div className="quiz-input-area">
                <input
                    className={`quiz-input ${feedback === 'correct' ? 'input-correct' : ''} ${feedback === 'wrong' ? 'input-wrong animate-shake' : ''}`}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type the character..."
                    lang="zh-CN"
                    autoFocus
                    disabled={showAnswer}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (showAnswer) nextWord()
                            else checkAnswer()
                        }
                    }}
                />
                {!showAnswer ? (
                    <button className="btn btn-primary" onClick={checkAnswer} disabled={!input.trim()}>
                        Check
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={nextWord}>
                        Next →
                    </button>
                )}
            </div>
        </div>
    )
}
