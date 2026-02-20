import { useEffect, useState } from 'react'
import type { VideoLessonConfig } from './videoLessonData'
import './CompletionStage.css'

interface CompletionStageProps {
    data: VideoLessonConfig
    scores: {
        pronunciation: number
        writing: number
        scrambleAttempts: number
    }
    onRestart: () => void
    onExit: () => void
    onNextUnit?: () => void
    hasNextUnit?: boolean
}

export function CompletionStage({ data, scores, onRestart, onExit, onNextUnit, hasNextUnit }: CompletionStageProps) {
    const [animatedScore, setAnimatedScore] = useState(0)

    const scrambleBlocks = data.scrambleAnswer.filter(b => !/^[，。！？、；：]$/.test(b)).length
    const scrambleEfficiency = Math.round(
        (scrambleBlocks / Math.max(scores.scrambleAttempts, scrambleBlocks)) * 100
    )

    const overallScore = Math.round(
        (scores.pronunciation + scores.writing + scrambleEfficiency) / 3
    )

    const xpEarned = Math.round(overallScore * 1.5)
    const stars = overallScore >= 90 ? 3 : overallScore >= 60 ? 2 : 1

    // Persist progress
    useEffect(() => {
        try {
            const key = 'hsk4-progress'
            const existing = JSON.parse(localStorage.getItem(key) || '{}')
            existing[data.id] = { score: overallScore, stars, completedAt: Date.now() }
            localStorage.setItem(key, JSON.stringify(existing))
        } catch { /* ok */ }
    }, [data.id, overallScore, stars])

    // Animate counter
    useEffect(() => {
        const duration = 1200
        const start = Date.now()
        const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setAnimatedScore(Math.round(eased * overallScore))
            if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [overallScore])

    const getGrade = (score: number) => {
        if (score >= 90) return { label: '优秀', emoji: '🏆', desc: 'Excellent!' }
        if (score >= 70) return { label: '良好', emoji: '⭐', desc: 'Great job!' }
        if (score >= 50) return { label: '加油', emoji: '💪', desc: 'Keep going!' }
        return { label: '再试', emoji: '📖', desc: 'Try again!' }
    }

    const grade = getGrade(overallScore)

    return (
        <div className="completion-stage">
            {/* Confetti particles */}
            <div className="completion-stage__particles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span
                        key={i}
                        className="particle"
                        style={{
                            '--x': `${Math.random() * 100}%`,
                            '--delay': `${Math.random() * 2}s`,
                            '--size': `${4 + Math.random() * 8}px`,
                            '--drift': `${-30 + Math.random() * 60}px`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Grade header — big and impactful */}
            <div className="completion-stage__hero animate-stamp">
                <span className="completion-stage__emoji">{grade.emoji}</span>
                <span className="completion-stage__grade">{grade.label}</span>
                <span className="completion-stage__grade-desc">{grade.desc}</span>
                <div className="completion-stage__stars">
                    {[1, 2, 3].map(s => (
                        <span key={s} className={`comp-star ${s <= stars ? 'comp-star--filled' : ''}`}>★</span>
                    ))}
                </div>
            </div>

            {/* Animated overall score */}
            <div className="completion-stage__overall animate-fade-up">
                <div className="overall-ring">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" className="overall-ring__bg" />
                        <circle
                            cx="50" cy="50" r="44"
                            className="overall-ring__fill"
                            style={{
                                strokeDasharray: `${overallScore * 2.76} 276`,
                            }}
                        />
                    </svg>
                    <span className="overall-ring__value">{animatedScore}%</span>
                </div>
                <div className="overall-xp animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    +{xpEarned} XP
                </div>
            </div>

            {/* Score breakdown — 3 cards */}
            <div className="completion-stage__scores">
                <div className="score-card" style={{ animationDelay: '0.2s' }}>
                    <span className="score-card__icon">🎤</span>
                    <span className="score-card__value">{scores.pronunciation}%</span>
                    <span className="score-card__label">Speak</span>
                </div>
                <div className="score-card" style={{ animationDelay: '0.35s' }}>
                    <span className="score-card__icon">✍️</span>
                    <span className="score-card__value">{scores.writing}%</span>
                    <span className="score-card__label">Write</span>
                </div>
                <div className="score-card" style={{ animationDelay: '0.5s' }}>
                    <span className="score-card__icon">🧩</span>
                    <span className="score-card__value">{scrambleEfficiency}%</span>
                    <span className="score-card__label">Build</span>
                </div>
            </div>

            {/* SRS preview */}
            <div className="completion-stage__srs animate-fade-in" style={{ animationDelay: '0.8s' }}>
                📅 Next review: <strong>{overallScore >= 70 ? 'in 3 days' : 'tomorrow'}</strong>
            </div>

            {/* Actions */}
            <div className="completion-stage__actions animate-fade-up" style={{ animationDelay: '1s' }}>
                {hasNextUnit && onNextUnit && (
                    <button className="continue-btn" onClick={onNextUnit}>
                        <span>Next Unit →</span>
                    </button>
                )}
                <button className={hasNextUnit ? 'exit-link' : 'continue-btn'} onClick={onRestart}>
                    <span>🔁 Review Again</span>
                </button>
                <button className="exit-link" onClick={onExit}>
                    ← All Lessons
                </button>
            </div>
        </div>
    )
}
