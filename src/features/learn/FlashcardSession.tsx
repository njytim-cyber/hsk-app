import { useState, useCallback } from 'react'
import type { HSKLesson } from '../../data/types'
import { useProgress } from '../../contexts/ProgressContext'
import { useAudio } from '../../contexts/AudioContext'
import { PinyinCharacter } from '../../components/display/PinyinCharacter'
import { ProgressBar } from '../../components/common/ProgressBar'
import './FlashcardSession.css'

interface FlashcardSessionProps {
    lesson: HSKLesson
    onExit: () => void
}

type CardFace = 'front' | 'back'

export function FlashcardSession({ lesson, onExit }: FlashcardSessionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [face, setFace] = useState<CardFace>('front')
    const [completed, setCompleted] = useState(false)
    const [score, setScore] = useState({ known: 0, learning: 0 })
    const { grade, addXp, recordPractice } = useProgress()
    const { speak } = useAudio()

    const word = lesson.words[currentIndex]
    const progress = ((currentIndex) / lesson.words.length) * 100

    const handleFlip = useCallback(() => {
        if (face === 'front') {
            setFace('back')
            speak(word.hanzi)
        }
    }, [face, word, speak])

    const handleGrade = useCallback((quality: number) => {
        grade(word.hanzi, quality)

        if (quality >= 3) {
            setScore(s => ({ ...s, known: s.known + 1 }))
        } else {
            setScore(s => ({ ...s, learning: s.learning + 1 }))
        }

        // Next card
        if (currentIndex + 1 >= lesson.words.length) {
            addXp(lesson.words.length * 2)
            recordPractice()
            setCompleted(true)
        } else {
            setCurrentIndex(i => i + 1)
            setFace('front')
        }
    }, [word, currentIndex, lesson, grade, addXp, recordPractice])

    if (completed) {
        const allPerfect = score.learning === 0
        return (
            <div className="flashcard-session">
                <div className="session-complete animate-stamp-in">
                    <span className="complete-emoji">{allPerfect ? '🌟' : '🎉'}</span>
                    {allPerfect && <div className="success-stamp-overlay">正</div>}
                    <h2 className="complete-title">做得好！</h2>
                    <p className="complete-subtitle">Lesson complete!</p>
                    <div className="complete-stats">
                        <div className="stat-item stat-known animate-stat-slide">
                            <span className="stat-value">{score.known}</span>
                            <span className="stat-label">Known</span>
                        </div>
                        <div className="stat-item stat-learning animate-stat-slide" style={{ animationDelay: '100ms' }}>
                            <span className="stat-value">{score.learning}</span>
                            <span className="stat-label">Learning</span>
                        </div>
                    </div>
                    <div className="complete-xp animate-xp-float">+{lesson.words.length * 2} XP</div>
                    <button className="btn btn-primary btn-lg" onClick={onExit}>
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flashcard-session">
            <div className="session-header">
                <button className="back-btn" onClick={onExit}>✕</button>
                <ProgressBar value={progress} color="var(--hsk-jade)" />
                <span className="session-counter">{currentIndex + 1}/{lesson.words.length}</span>
            </div>

            <div
                className={`flashcard ${face === 'back' ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                <div className="flashcard-front">
                    <PinyinCharacter
                        hanzi={word.hanzi}
                        pinyin={word.pinyin}
                        showPinyin={false}
                        size="lg"
                    />
                    <span className="card-hint">Tap to reveal</span>
                </div>
                <div className="flashcard-back">
                    <PinyinCharacter
                        hanzi={word.hanzi}
                        pinyin={word.pinyin}
                        showPinyin={true}
                        size="lg"
                    />
                    <span className="card-english">{word.english}</span>
                    <button
                        className="card-audio-btn"
                        onClick={(e) => { e.stopPropagation(); speak(word.hanzi) }}
                    >
                        🔊
                    </button>
                </div>
            </div>

            {face === 'back' && (
                <div className="grade-buttons animate-slide-up">
                    <button className="grade-btn grade-again" onClick={() => handleGrade(1)}>
                        <span className="grade-emoji">🔄</span>
                        <span>Again</span>
                    </button>
                    <button className="grade-btn grade-hard" onClick={() => handleGrade(3)}>
                        <span className="grade-emoji">🤔</span>
                        <span>Hard</span>
                    </button>
                    <button className="grade-btn grade-good" onClick={() => handleGrade(4)}>
                        <span className="grade-emoji">👍</span>
                        <span>Good</span>
                    </button>
                    <button className="grade-btn grade-easy" onClick={() => handleGrade(5)}>
                        <span className="grade-emoji">⚡</span>
                        <span>Easy</span>
                    </button>
                </div>
            )}
        </div>
    )
}
