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
        if (score >= 90) return { label: '优秀', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>, desc: 'Excellent!' }
        if (score >= 70) return { label: '良好', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, desc: 'Great job!' }
        if (score >= 50) return { label: '加油', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" /></svg>, desc: 'Keep going!' }
        return { label: '再试', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>, desc: 'Try again!' }
    }

    const grade = getGrade(overallScore)

    return (
        <div className="completion-stage">
            {/* Grade header — big and impactful */}
            <div className="completion-stage__hero animate-stamp">
                <span className="completion-stage__icon">{grade.icon}</span>
                <span className="completion-stage__grade">{grade.label}</span>
                <span className="completion-stage__grade-desc">{grade.desc}</span>
                <div className="completion-stage__stars">
                    {[1, 2, 3].map(s => (
                        <span key={s} className={`comp-star ${s <= stars ? 'comp-star--filled' : ''}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>
                        </span>
                    ))}
                </div>
            </div>

            {/* Animated overall score */}
            <div className="completion-stage__overall animate-fade-up">
                <div
                    className="overall-ring"
                    style={{
                        '--ring-color': overallScore >= 90 ? 'var(--hsk-gold)' : overallScore >= 60 ? 'var(--hsk-jade)' : 'var(--tang-red)'
                    } as React.CSSProperties}
                >
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

            {/* Score breakdown — elegant minimalist */}
            <div className="completion-stage__scores">
                <div className="score-item" style={{ animationDelay: '0.2s' }}>
                    <span className="score-item__label">Speak</span>
                    <span className="score-item__value">{scores.pronunciation}%</span>
                </div>
                <div className="score-divider" style={{ animationDelay: '0.3s' }} />
                <div className="score-item" style={{ animationDelay: '0.35s' }}>
                    <span className="score-item__label">Write</span>
                    <span className="score-item__value">{scores.writing}%</span>
                </div>
                <div className="score-divider" style={{ animationDelay: '0.4s' }} />
                <div className="score-item" style={{ animationDelay: '0.5s' }}>
                    <span className="score-item__label">Build</span>
                    <span className="score-item__value">{scrambleEfficiency}%</span>
                </div>
            </div>

            {/* SRS preview */}
            {overallScore >= 60 && (
                <div className="completion-stage__srs animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: 'text-bottom' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Next review: <strong>{overallScore >= 90 ? 'in 3 days' : 'tomorrow'}</strong>
                </div>
            )}

            {/* Actions - Single clear CTA based on performance */}
            <div className="completion-stage__actions animate-fade-up" style={{ animationDelay: '1s' }}>
                {overallScore >= 60 ? (
                    <>
                        {hasNextUnit && onNextUnit ? (
                            <button className="continue-btn" onClick={onNextUnit}>
                                <span>Next Unit →</span>
                            </button>
                        ) : (
                            <button className="continue-btn" onClick={onExit}>
                                <span>Finish Lesson</span>
                            </button>
                        )}
                        <button className="exit-link" onClick={onRestart}>
                            Review Again
                        </button>
                    </>
                ) : (
                    <>
                        <button className="continue-btn" onClick={onRestart}>
                            <span>Try Again</span>
                        </button>
                        <button className="exit-link" onClick={onExit}>
                            Exit to Lessons
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
