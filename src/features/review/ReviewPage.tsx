import { useState, useCallback } from 'react'
import { useProgress } from '../../contexts/ProgressContext'
import { useAudio } from '../../contexts/AudioContext'
import { hskLevels } from '../../data'
import { PinyinCharacter } from '../../components/display/PinyinCharacter'
import { EmptyState } from '../../components/common/EmptyState'
import { ProgressBar } from '../../components/common/ProgressBar'
import './ReviewPage.css'

export function ReviewPage() {
    const { getDue, grade, addXp, recordPractice, wordProgress } = useProgress()
    const { speak } = useAudio()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [face, setFace] = useState<'front' | 'back'>('front')
    const [sessionScore, setSessionScore] = useState({ reviewed: 0, known: 0 })
    const [completed, setCompleted] = useState(false)

    const dueWords = getDue()

    // Find the HSKWord data for a due word
    const findWord = useCallback((key: string) => {
        for (const level of hskLevels) {
            for (const lesson of level.lessons) {
                const word = lesson.words.find(w => w.hanzi === key)
                if (word) return word
            }
        }
        return null
    }, [])

    if (dueWords.length === 0 || completed) {
        if (completed && sessionScore.reviewed > 0) {
            const isPerfect = sessionScore.known === sessionScore.reviewed
            return (
                <div className="page-review">
                    <div className="review-complete animate-stamp-in">
                        <span className="complete-emoji">{isPerfect ? '🌟' : '🔄'}</span>
                        {isPerfect && <div className="success-stamp-overlay">正</div>}
                        <h2 className="complete-title">复习完成！</h2>
                        <p className="complete-subtitle">Review session complete</p>
                        <div className="complete-stats">
                            <div className="stat-item stat-known animate-stat-slide">
                                <span className="stat-value">{sessionScore.known}</span>
                                <span className="stat-label">Remembered</span>
                            </div>
                            <div className="stat-item stat-learning animate-stat-slide" style={{ animationDelay: '100ms' }}>
                                <span className="stat-value">{sessionScore.reviewed - sessionScore.known}</span>
                                <span className="stat-label">Needs work</span>
                            </div>
                        </div>
                        <div className="complete-xp animate-xp-float">+{sessionScore.known * 3} XP</div>
                        <button className="btn btn-primary btn-lg" onClick={() => {
                            setCompleted(false)
                            setCurrentIndex(0)
                            setSessionScore({ reviewed: 0, known: 0 })
                        }}>
                            Done
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="page-review animate-slide-up">
                <EmptyState
                    icon="✅"
                    title="全部完成！"
                    subtitle={Object.keys(wordProgress).length === 0
                        ? "Start learning words to build your review queue"
                        : "All caught up! No words due for review right now."
                    }
                />
            </div>
        )
    }

    const dueWord = dueWords[currentIndex >= dueWords.length ? dueWords.length - 1 : currentIndex]
    const wordData = findWord(dueWord.key)
    const progress = (currentIndex / dueWords.length) * 100

    const handleFlip = () => {
        if (face === 'front') {
            setFace('back')
            if (wordData) speak(wordData.hanzi)
        }
    }

    const handleGrade = (quality: number) => {
        grade(dueWord.key, quality)
        setSessionScore(s => ({
            reviewed: s.reviewed + 1,
            known: quality >= 3 ? s.known + 1 : s.known,
        }))

        if (currentIndex + 1 >= dueWords.length) {
            addXp(sessionScore.known * 3)
            recordPractice()
            setCompleted(true)
        } else {
            setCurrentIndex(i => i + 1)
            setFace('front')
        }
    }

    return (
        <div className="page-review">
            <div className="review-header">
                <span className="review-due-count">{dueWords.length} due</span>
                <ProgressBar value={progress} color="var(--hsk-jade)" />
                <span className="session-counter">{currentIndex + 1}/{dueWords.length}</span>
            </div>

            <div
                className={`review-card ${face === 'back' ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                <div className="review-card-front">
                    <PinyinCharacter
                        hanzi={dueWord.key}
                        pinyin=""
                        showPinyin={false}
                        size="lg"
                    />
                    <span className="card-hint">Tap to reveal</span>
                </div>
                <div className="review-card-back">
                    {wordData ? (
                        <PinyinCharacter
                            hanzi={wordData.hanzi}
                            pinyin={wordData.pinyin}
                            showPinyin={true}
                            size="lg"
                        />
                    ) : (
                        <span className="review-hanzi">{dueWord.key}</span>
                    )}
                    {wordData && (
                        <span className="review-english">{wordData.english}</span>
                    )}
                    <div className="review-meta">
                        Score: {dueWord.score}/5 · Reviews: {dueWord.reviewCount}
                    </div>
                </div>
            </div>

            {face === 'back' && (
                <div className="grade-buttons animate-slide-up">
                    <button className="grade-btn grade-again" onClick={() => handleGrade(1)}>
                        <span className="grade-emoji">🔄</span><span>Again</span>
                    </button>
                    <button className="grade-btn grade-hard" onClick={() => handleGrade(3)}>
                        <span className="grade-emoji">🤔</span><span>Hard</span>
                    </button>
                    <button className="grade-btn grade-good" onClick={() => handleGrade(4)}>
                        <span className="grade-emoji">👍</span><span>Good</span>
                    </button>
                    <button className="grade-btn grade-easy" onClick={() => handleGrade(5)}>
                        <span className="grade-emoji">⚡</span><span>Easy</span>
                    </button>
                </div>
            )}
        </div>
    )
}
