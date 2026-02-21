import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lessonUnits } from './lessonUnits'
import './LessonPicker.css'

interface UnitProgress {
    score: number
    stars: number
    completedAt: number
}

export function LessonPicker() {
    const navigate = useNavigate()
    const [progress] = useState<Record<string, UnitProgress>>(() => {
        try {
            return JSON.parse(localStorage.getItem('hsk4-progress') || '{}')
        } catch {
            return {}
        }
    })

    const completedCount = Object.keys(progress).length

    return (
        <div className="lesson-picker">
            <header className="lesson-picker__header">
                <h1 className="lesson-picker__title">HSK 4 Lessons</h1>
                <p className="lesson-picker__subtitle">
                    {completedCount > 0
                        ? `${completedCount}/10 complete · ${37 - completedCount * 3} phrases left`
                        : '10 units · 37 phrases · tap to start'}
                </p>
            </header>

            <div className="lesson-picker__grid">
                {lessonUnits.map((unit, i) => {
                    const unitProgress = progress[unit.lesson.id]
                    const isDone = Boolean(unitProgress)
                    return (
                        <button
                            key={unit.id}
                            className={`unit-card ${isDone ? 'unit-card--done' : ''}`}
                            onClick={() => navigate(`/video-lesson/${unit.id}`)}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {/* Typography Watermark */}
                            <span className="unit-card__watermark" aria-hidden="true">
                                {unit.title.charAt(0)}
                            </span>

                            {isDone && (
                                <div className="unit-card__stars">
                                    {[1, 2, 3].map(s => (
                                        <span key={s} className={s <= (unitProgress?.stars || 0) ? 'star-filled' : 'star-empty'}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg></span>
                                    ))}
                                </div>
                            )}
                            <div className="unit-card__content">
                                <span className="unit-card__title">{unit.title}</span>
                                <span className="unit-card__en">{unit.titleEn}</span>
                                <span className="unit-card__count">
                                    {unit.lesson.words.filter(w => w.isTarget).length} phrases
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
